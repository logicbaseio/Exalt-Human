/**
 * Weight-goal meal planner.
 *
 * Two design decisions matter here.
 *
 * 1. Projection is simulated week by week, recomputing resting metabolism at
 *    each new bodyweight, rather than dividing a total by 7700 kcal/kg. The
 *    flat rule ignores the fact that a lighter body burns less, so it always
 *    overpromises. Real loss is usually slower still, because of metabolic
 *    adaptation and imperfect adherence; the UI says so.
 *
 * 2. Guard rails are part of the calculation, not a disclaimer bolted on
 *    afterwards. The planner refuses to return a plan when the inputs are
 *    outside the range a general-purpose tool should serve.
 */

import { bmrMifflinStJeor, ACTIVITY_LEVELS, round, clamp, type Sex, type ActivityId } from "./tool-math";
import { calculateBmi } from "./tool-bmi";

/** Energy density of body tissue lost or gained, kcal per kg. */
const KCAL_PER_KG = 7700;

/**
 * Minimum daily intake this tool will plan for.
 *
 * Worth being precise about, because almost every consumer tool gets this
 * wrong: 1200 and 1500 are NOT validated physiological safety thresholds.
 * They are the bottom of the prescribed intake ranges in the 2013
 * AHA/ACC/TOS guideline (1200-1500 kcal/d for women, 1500-1800 for men),
 * which that guideline also says should be adjusted for bodyweight. We use
 * them as a conservative operating floor and say what they actually are.
 */
export const CALORIE_FLOOR: Record<Sex, number> = { male: 1500, female: 1200 };

/** Maximum rate of loss the planner will schedule. */
export const MAX_LOSS_KG_PER_WEEK = 1.0;
/**
 * And never faster than this share of bodyweight per week. The absolute cap
 * alone scales badly: 1 kg/week is a reasonable 0.7% for a 140 kg person but
 * an aggressive 1.8% for someone of 55 kg.
 */
export const MAX_LOSS_FRACTION_PER_WEEK = 0.01;
/**
 * Hard ceiling on the deficit as a share of maintenance. The 2013
 * AHA/ACC/TOS guideline offers a 30% deficit as one of its three accepted
 * methods, so 30% is the outer edge of guideline-supported practice.
 */
export const MAX_DEFICIT_FRACTION = 0.3;
/** Muscle gain is slow; a surplus faster than this is mostly fat. */
export const MAX_GAIN_KG_PER_WEEK = 0.25;

export type PlanBlocker =
  | "under-18"
  | "goal-underweight"
  | "already-underweight"
  | "no-change";

export type PlanWarning = {
  id: string;
  severity: "info" | "caution";
  text: string;
};

export type PlanMilestone = { week: number; weightKg: number };

export type MealSlot = {
  name: string;
  share: number;
  kcal: number;
  proteinG: number;
  build: string;
};

export type PlanResult = {
  blocked: PlanBlocker | null;
  blockedMessage?: string;
  direction: "lose" | "gain";
  tdeeNow: number;
  targetKcal: number;
  /** True when the target was raised to the floor rather than the requested rate. */
  clampedToFloor: boolean;
  effectiveRateKgPerWeek: number;
  requestedRateKgPerWeek: number;
  weeksToGoal: number | null;
  milestones: PlanMilestone[];
  proteinG: number;
  fatG: number;
  carbG: number;
  proteinBasis: "current bodyweight" | "healthy-range reference weight";
  meals: MealSlot[];
  warnings: PlanWarning[];
  startBmi: number;
  goalBmi: number;
};

const MEAL_TEMPLATE: { name: string; share: number; build: string }[] = [
  {
    name: "Breakfast",
    share: 0.25,
    build:
      "A protein anchor (eggs, Greek yoghurt, or a shake), a whole-grain or fruit carbohydrate, and something green.",
  },
  {
    name: "Lunch",
    share: 0.3,
    build:
      "Half the plate vegetables, a palm-sized protein, a fist of whole-grain carbohydrate, and a thumb of healthy fat.",
  },
  {
    name: "Dinner",
    share: 0.3,
    build:
      "The same plate structure as lunch. Keeping the shape identical is what makes this repeatable on a weeknight.",
  },
  {
    name: "Snack",
    share: 0.15,
    build:
      "Protein-led rather than carbohydrate-led: dairy, fruit with nuts, or leftover protein from the night before.",
  },
];

export function buildPlan(opts: {
  sex: Sex;
  age: number;
  heightCm: number;
  currentKg: number;
  goalKg: number;
  activity: ActivityId;
  /** Desired kg per week. Positive number; direction is inferred. */
  rateKgPerWeek: number;
}): PlanResult {
  const { sex, age, heightCm, currentKg, goalKg, activity } = opts;
  const warnings: PlanWarning[] = [];

  const startBmiResult = calculateBmi({ weightKg: currentKg, heightCm });
  const goalBmiResult = calculateBmi({ weightKg: goalKg, heightCm });
  const direction: "lose" | "gain" = goalKg <= currentKg ? "lose" : "gain";

  const base = {
    direction,
    startBmi: startBmiResult.bmi,
    goalBmi: goalBmiResult.bmi,
    tdeeNow: 0,
    targetKcal: 0,
    clampedToFloor: false,
    effectiveRateKgPerWeek: 0,
    requestedRateKgPerWeek: opts.rateKgPerWeek,
    weeksToGoal: null,
    milestones: [],
    proteinG: 0,
    fatG: 0,
    carbG: 0,
    proteinBasis: "current bodyweight" as const,
    meals: [],
    warnings,
  };

  /* ---- Blocking conditions: refuse rather than plan ---- */

  if (age < 18) {
    return {
      ...base,
      blocked: "under-18",
      blockedMessage:
        "This planner is built for adults. Energy and nutrient needs during growth are different, and a weight target for someone under 18 should be set with a doctor or a registered dietitian rather than a calculator.",
    };
  }

  // Checked before the goal gate: for someone already underweight who wants
  // to lose, "you are already below the healthy range" is the more useful
  // message than a comment about their target.
  if (direction === "lose" && startBmiResult.bmi < 18.5) {
    return {
      ...base,
      blocked: "already-underweight",
      blockedMessage: `Your current BMI is ${startBmiResult.bmi}, already below the healthy range of 18.5, so this tool will not plan further weight loss. A healthy weight for your height is roughly ${startBmiResult.healthyRangeKg.low} to ${startBmiResult.healthyRangeKg.high} kg. A doctor or registered dietitian is the right place to take this.`,
    };
  }

  if (goalBmiResult.bmi < 18.5) {
    return {
      ...base,
      blocked: "goal-underweight",
      blockedMessage: `A goal of ${round(goalKg, 1)} kg at your height would put your BMI at ${goalBmiResult.bmi}, below the healthy range of 18.5. This tool will not plan toward that target. A healthy weight for your height is roughly ${goalBmiResult.healthyRangeKg.low} to ${goalBmiResult.healthyRangeKg.high} kg. If you are working toward a weight below that, please speak with a doctor or a registered dietitian.`,
    };
  }

  if (Math.abs(goalKg - currentKg) < 0.5) {
    return {
      ...base,
      blocked: "no-change",
      blockedMessage:
        "Your goal weight is effectively your current weight. Set a different target, or use the energy and macros tool to work out what maintaining takes.",
    };
  }

  /* ---- Rate: cap to something the evidence supports ---- */

  const maxLoss = Math.min(MAX_LOSS_KG_PER_WEEK, currentKg * MAX_LOSS_FRACTION_PER_WEEK);
  const cap = direction === "lose" ? maxLoss : MAX_GAIN_KG_PER_WEEK;
  const requested = Math.abs(opts.rateKgPerWeek);
  const effectiveRate = clamp(requested, 0.1, cap);

  if (requested > cap + 0.001) {
    warnings.push({
      id: "rate-capped",
      severity: "caution",
      text:
        direction === "lose"
          ? `You asked for ${round(requested, 2)} kg a week. This plan uses ${round(effectiveRate, 2)} kg, the fastest rate general guidance supports for you (up to about 1 kg a week, and no more than 1% of bodyweight). Faster loss costs more muscle and is harder to hold.`
          : `You asked for ${round(requested, 2)} kg a week. This plan uses ${round(effectiveRate, 2)} kg, because muscle is built slowly. A larger surplus mostly adds fat.`,
    });
  }

  /* ---- Daily target ---- */

  const activityFactor =
    ACTIVITY_LEVELS.find((a) => a.id === activity)?.factor ?? 1.375;
  const tdeeNow = round(
    bmrMifflinStJeor({ weightKg: currentKg, heightCm, age, sex }) * activityFactor,
  );

  const dailyDelta = (effectiveRate * KCAL_PER_KG) / 7;
  let targetKcal = round(direction === "lose" ? tdeeNow - dailyDelta : tdeeNow + dailyDelta);

  // Cap the deficit as a share of maintenance, so the plan stays inside
  // guideline-supported territory for smaller bodies too.
  if (direction === "lose") {
    const minByFraction = round(tdeeNow * (1 - MAX_DEFICIT_FRACTION));
    if (targetKcal < minByFraction) {
      targetKcal = minByFraction;
      warnings.push({
        id: "deficit-capped",
        severity: "caution",
        text: `That pace would need a deficit of more than ${Math.round(MAX_DEFICIT_FRACTION * 100)}% below your maintenance intake. The plan has been held at ${Math.round(MAX_DEFICIT_FRACTION * 100)}%, the outer edge of what guidelines support, so loss will be a little slower than requested.`,
      });
    }
  }

  let clampedToFloor = false;
  const floor = CALORIE_FLOOR[sex];
  if (direction === "lose" && targetKcal < floor) {
    targetKcal = floor;
    clampedToFloor = true;
    warnings.push({
      id: "floor",
      severity: "caution",
      text: `Reaching that rate would put your intake below ${floor} kcal a day, so the plan has been raised to ${floor}. To be precise about what that number is: ${floor} is the bottom of the intake range major guidelines prescribe for weight loss, not a proven physiological safety limit. Planning below it is where medical supervision belongs. Your loss will simply be slower.`,
    });
  }

  /* ---- Week-by-week simulation ---- */

  const milestones: PlanMilestone[] = [{ week: 0, weightKg: round(currentKg, 1) }];
  let weight = currentKg;
  let weeksToGoal: number | null = null;

  for (let week = 1; week <= 260; week += 1) {
    const tdee = bmrMifflinStJeor({ weightKg: weight, heightCm, age, sex }) * activityFactor;
    const deltaPerDay = targetKcal - tdee;
    const weeklyChange = (deltaPerDay * 7) / KCAL_PER_KG;

    // Stalled: intake now matches burn, the goal is unreachable at this intake.
    if (Math.abs(weeklyChange) < 0.005) break;

    weight += weeklyChange;

    if (week % 4 === 0) milestones.push({ week, weightKg: round(weight, 1) });

    const reached = direction === "lose" ? weight <= goalKg : weight >= goalKg;
    if (reached) {
      weeksToGoal = week;
      if (week % 4 !== 0) milestones.push({ week, weightKg: round(goalKg, 1) });
      break;
    }
  }

  if (weeksToGoal === null) {
    warnings.push({
      id: "unreachable",
      severity: "caution",
      text: "At this intake your weight settles before it reaches your goal, because a lighter body burns less. Reaching the target would need either more activity or a longer, more gradual approach.",
    });
  }

  /* ---- Macronutrients ---- */

  // For higher BMIs, basing protein on current bodyweight overshoots. Using a
  // reference weight from the healthy range is the conventional adjustment.
  const useReference = startBmiResult.bmi >= 30;
  const referenceWeight = useReference
    ? (startBmiResult.healthyRangeKg.low + startBmiResult.healthyRangeKg.high) / 2
    : currentKg;

  // 1.6-2.4 g/kg during a deficit (Hector & Phillips, 2018), positioned by
  // how much training the person is actually doing.
  const trainingHard = activity === "high" || activity === "athlete";
  const proteinPerKg =
    direction === "lose" ? (trainingHard ? 2.2 : activity === "sedentary" ? 1.6 : 1.9) : 1.8;
  const proteinG = round(referenceWeight * proteinPerKg);
  const fatG = round(Math.max(referenceWeight * 0.7, (targetKcal * 0.2) / 9));
  const carbG = round(Math.max((targetKcal - proteinG * 4 - fatG * 9) / 4, 0));

  if (carbG < 50) {
    warnings.push({
      id: "low-carb",
      severity: "info",
      text: "At this calorie target, protein and fat take up most of the budget, leaving carbohydrate low. That is workable but harder to train on. Raising the target slightly usually makes the plan easier to stick to.",
    });
  }

  if (direction === "lose" && startBmiResult.bmi < 20) {
    warnings.push({
      id: "near-lower-edge",
      severity: "caution",
      text: "You are already near the lower edge of the healthy BMI range. Losing further will take you close to underweight, which carries its own risks.",
    });
  }

  if (age >= 65 && direction === "lose") {
    warnings.push({
      id: "older-adult",
      severity: "caution",
      text: "Past 65, losing weight carries a real risk of losing muscle and bone alongside fat, and low muscle mass is itself a hazard. If you take this on, pair it with resistance training and keep protein at the higher end. Weight that is falling without you intending it is a different matter entirely and should be raised with a doctor rather than planned for.",
    });
  }

  warnings.push({
    id: "projection",
    severity: "info",
    text: "This projection already accounts for your metabolism falling as you get lighter, which is why the curve flattens rather than running in a straight line. Treat the timeline as a best case: it cannot account for the ordinary gap between a plan and a week.",
  });

  if (direction === "lose") {
    warnings.push({
      id: "appetite",
      severity: "info",
      text: "Worth knowing before you start, because it is the opposite of the popular story. For every kilogram you lose, your energy expenditure falls by roughly 20 to 30 kcal a day, but your appetite rises by around 100 kcal a day. Appetite is the far larger force. When people stall, the cause is almost always unmeasured intake creeping back up, not a metabolism that has broken. The useful response is to measure more carefully, not to cut further.",
    });
  }

  const meals: MealSlot[] = MEAL_TEMPLATE.map((slot) => ({
    name: slot.name,
    share: slot.share,
    kcal: round(targetKcal * slot.share),
    proteinG: round(proteinG * slot.share),
    build: slot.build,
  }));

  return {
    ...base,
    blocked: null,
    tdeeNow,
    targetKcal,
    clampedToFloor,
    effectiveRateKgPerWeek: round(effectiveRate, 2),
    weeksToGoal,
    milestones,
    proteinG,
    fatG,
    carbG,
    proteinBasis: useReference ? "healthy-range reference weight" : "current bodyweight",
    meals,
    warnings,
  };
}

/** Formats a week count as a readable duration. */
export function formatDuration(weeks: number): string {
  if (weeks < 8) return `${weeks} week${weeks === 1 ? "" : "s"}`;
  const months = Math.round(weeks / 4.345);
  if (months < 18) return `about ${months} month${months === 1 ? "" : "s"}`;
  return `about ${(months / 12).toFixed(1)} years`;
}
