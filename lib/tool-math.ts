/**
 * Pure calculation functions for the Exalt Human tools.
 *
 * Every formula here is drawn from published, citable literature. Where a
 * value is approximate or pooled, the comment says so. Nothing in this file
 * invents a constant: if a number cannot be sourced, it does not belong here.
 */

export type Sex = "male" | "female";

/* ------------------------------------------------------------------ *
 * Shared statistics
 * ------------------------------------------------------------------ */

/** Abramowitz & Stegun 7.1.26 error-function approximation. */
function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
      t *
      Math.exp(-ax * ax);
  return sign * y;
}

/** Percentile (0-100) of a z-score under the normal distribution. */
export function zToPercentile(z: number): number {
  return clamp(50 * (1 + erf(z / Math.SQRT2)), 0.1, 99.9);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function round(value: number, decimals = 0): number {
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}

/* ------------------------------------------------------------------ *
 * Unit helpers
 * ------------------------------------------------------------------ */

export const LB_PER_KG = 2.2046226218;
export const CM_PER_IN = 2.54;

export const kgToLb = (kg: number) => kg * LB_PER_KG;
export const lbToKg = (lb: number) => lb / LB_PER_KG;
export const cmToIn = (cm: number) => cm / CM_PER_IN;
export const inToCm = (inches: number) => inches * CM_PER_IN;

/* ------------------------------------------------------------------ *
 * 1. Grip strength percentile
 *
 * Normative means/SDs approximated from pooled published norms, principally
 * Dodds et al. 2014 (PLoS ONE, twelve British studies, n=49,964) and NHANES
 * 2011-2014 hand-grip normative data. Values are rounded reference points,
 * not exact study centiles: the tool reports an approximate percentile band.
 * ------------------------------------------------------------------ */

type GripNorm = { minAge: number; mean: number; sd: number };

const GRIP_NORMS: Record<Sex, GripNorm[]> = {
  male: [
    { minAge: 20, mean: 47.0, sd: 9.5 },
    { minAge: 25, mean: 48.5, sd: 9.5 },
    { minAge: 30, mean: 49.0, sd: 9.5 },
    { minAge: 35, mean: 48.5, sd: 9.5 },
    { minAge: 40, mean: 47.5, sd: 9.0 },
    { minAge: 45, mean: 46.0, sd: 9.0 },
    { minAge: 50, mean: 44.0, sd: 9.0 },
    { minAge: 55, mean: 42.0, sd: 8.5 },
    { minAge: 60, mean: 39.5, sd: 8.5 },
    { minAge: 65, mean: 37.0, sd: 8.0 },
    { minAge: 70, mean: 34.0, sd: 8.0 },
    { minAge: 75, mean: 31.0, sd: 7.5 },
    { minAge: 80, mean: 27.0, sd: 7.5 },
  ],
  female: [
    { minAge: 20, mean: 28.5, sd: 6.0 },
    { minAge: 25, mean: 29.5, sd: 6.0 },
    { minAge: 30, mean: 30.0, sd: 6.0 },
    { minAge: 35, mean: 29.5, sd: 6.0 },
    { minAge: 40, mean: 29.0, sd: 5.5 },
    { minAge: 45, mean: 28.0, sd: 5.5 },
    { minAge: 50, mean: 27.0, sd: 5.5 },
    { minAge: 55, mean: 25.5, sd: 5.5 },
    { minAge: 60, mean: 24.0, sd: 5.0 },
    { minAge: 65, mean: 22.5, sd: 5.0 },
    { minAge: 70, mean: 21.0, sd: 5.0 },
    { minAge: 75, mean: 19.0, sd: 4.5 },
    { minAge: 80, mean: 16.5, sd: 4.5 },
  ],
};

/**
 * Clinical low-strength cut-points for probable sarcopenia.
 * Source: EWGSOP2 (Cruz-Jentoft et al., Age and Ageing, 2019).
 */
export const SARCOPENIA_CUTOFF: Record<Sex, number> = { male: 27, female: 16 };

function gripNormFor(sex: Sex, age: number): GripNorm {
  const table = GRIP_NORMS[sex];
  let norm = table[0];
  for (const row of table) if (age >= row.minAge) norm = row;
  return norm;
}

export type GripResult = {
  percentile: number;
  /**
   * How to render the percentile. The norm table is a set of rounded
   * reference points, so a bare number like "84th" implies precision it does
   * not have; the UI shows this string instead.
   */
  percentileLabel: string;
  z: number;
  ageMean: number;
  /** Age at which this grip would sit at the population median. */
  strengthAge: number | null;
  belowClinicalCutoff: boolean;
  band: string;
};

export function gripPercentile(
  gripKg: number,
  age: number,
  sex: Sex,
): GripResult {
  const norm = gripNormFor(sex, age);
  const z = (gripKg - norm.mean) / norm.sd;
  const percentile = zToPercentile(z);

  // "Strength age": the youngest age band whose median this grip still meets.
  const table = GRIP_NORMS[sex];
  let strengthAge: number | null = null;
  for (const row of table) {
    if (gripKg >= row.mean) {
      strengthAge = row.minAge;
      break;
    }
  }
  if (strengthAge === null) strengthAge = 85;

  // Rounded to the nearest 5 and given open-ended top and bottom labels: the
  // underlying norms cannot support finer resolution than this.
  const rounded = Math.round(percentile / 5) * 5;
  const percentileLabel =
    percentile >= 97 ? "Top 5%" : percentile <= 3 ? "Bottom 5%" : `~${rounded}th`;

  return {
    percentile: round(percentile),
    percentileLabel,
    z: round(z, 2),
    ageMean: norm.mean,
    strengthAge,
    belowClinicalCutoff: gripKg < SARCOPENIA_CUTOFF[sex],
    band:
      percentile >= 80
        ? "Well above average"
        : percentile >= 60
          ? "Above average"
          : percentile >= 40
            ? "About average"
            : percentile >= 20
              ? "Below average"
              : "Well below average",
  };
}

/* ------------------------------------------------------------------ *
 * 2. VO2 max estimation
 * ------------------------------------------------------------------ */

/**
 * Rockport one-mile walk test.
 * Kline et al., Med Sci Sports Exerc, 1987.
 */
export function vo2FromWalk(opts: {
  weightKg: number;
  age: number;
  sex: Sex;
  minutes: number;
  heartRate: number;
}): number {
  const weightLb = kgToLb(opts.weightKg);
  const vo2 =
    132.853 -
    0.0769 * weightLb -
    0.3877 * opts.age +
    6.315 * (opts.sex === "male" ? 1 : 0) -
    3.2649 * opts.minutes -
    0.1565 * opts.heartRate;
  return clamp(round(vo2, 1), 5, 90);
}

/**
 * Resting/maximum heart-rate ratio method.
 * Uth et al., Eur J Appl Physiol, 2004: VO2max ≈ 15.3 × (HRmax / HRrest).
 * HRmax estimated by Tanaka et al., JACC, 2001: 208 − 0.7 × age.
 */
export function vo2FromHeartRate(opts: {
  age: number;
  restingHr: number;
  maxHr?: number;
}): number {
  const maxHr = opts.maxHr && opts.maxHr > 0 ? opts.maxHr : 208 - 0.7 * opts.age;
  return clamp(round(15.3 * (maxHr / opts.restingHr), 1), 5, 90);
}

/**
 * Cooper 12-minute run test. Cooper, JAMA, 1968.
 */
export function vo2FromCooper(meters: number): number {
  return clamp(round((meters - 504.9) / 44.73, 1), 5, 90);
}

export const estimatedMaxHr = (age: number) => round(208 - 0.7 * age);

/**
 * Approximate VO2max reference means by age and sex, pooled from published
 * cardiorespiratory-fitness normative data (e.g. FRIEND registry percentiles).
 * Used only to place a result in context, not as a clinical standard.
 */
const VO2_NORMS: Record<Sex, { minAge: number; mean: number; sd: number }[]> = {
  male: [
    { minAge: 20, mean: 45.0, sd: 8.5 },
    { minAge: 30, mean: 42.5, sd: 8.5 },
    { minAge: 40, mean: 39.0, sd: 8.0 },
    { minAge: 50, mean: 35.5, sd: 7.5 },
    { minAge: 60, mean: 31.5, sd: 7.0 },
    { minAge: 70, mean: 27.5, sd: 6.5 },
  ],
  female: [
    { minAge: 20, mean: 38.0, sd: 7.5 },
    { minAge: 30, mean: 35.5, sd: 7.0 },
    { minAge: 40, mean: 32.5, sd: 7.0 },
    { minAge: 50, mean: 29.5, sd: 6.5 },
    { minAge: 60, mean: 26.0, sd: 6.0 },
    { minAge: 70, mean: 22.5, sd: 5.5 },
  ],
};

export function vo2Percentile(vo2: number, age: number, sex: Sex) {
  const table = VO2_NORMS[sex];
  let norm = table[0];
  for (const row of table) if (age >= row.minAge) norm = row;
  const z = (vo2 - norm.mean) / norm.sd;
  return {
    percentile: round(zToPercentile(z)),
    ageMean: norm.mean,
    band:
      vo2 >= norm.mean + norm.sd
        ? "High"
        : vo2 >= norm.mean - 0.5 * norm.sd
          ? "Above average to average"
          : vo2 >= norm.mean - norm.sd
            ? "Below average"
            : "Low",
  };
}

/* ------------------------------------------------------------------ *
 * 3. Waist-to-height ratio
 *
 * Boundaries follow NICE guidance (UK): keeping waist to less than half of
 * height is the practical rule; 0.5-0.59 signals increased central adiposity
 * and ≥0.6 further increased risk.
 * ------------------------------------------------------------------ */

export type WhtrResult = {
  ratio: number;
  category: "Low" | "Healthy" | "Increased" | "Further increased";
  note: string;
  halfHeightCm: number;
};

export function waistToHeight(waistCm: number, heightCm: number): WhtrResult {
  const ratio = round(waistCm / heightCm, 3);
  const halfHeightCm = round(heightCm / 2, 1);

  let category: WhtrResult["category"] = "Healthy";
  let note =
    "Your waist is less than half your height, the boundary most guidance treats as healthy for central fat.";

  if (ratio < 0.4) {
    category = "Low";
    note =
      "This ratio is below the usual healthy band. On its own that is not a diagnosis, but unintentionally low weight is worth discussing with a clinician.";
  } else if (ratio >= 0.6) {
    category = "Further increased";
    note =
      "This ratio sits in the band associated with further increased health risk from central fat. It is a signal to act on, not a verdict.";
  } else if (ratio >= 0.5) {
    category = "Increased";
    note =
      "This ratio sits in the band associated with increased health risk from central fat. Waist is a better guide here than weight alone.";
  }

  return { ratio, category, note, halfHeightCm };
}

/* ------------------------------------------------------------------ *
 * 4. Energy expenditure and macronutrients
 * ------------------------------------------------------------------ */

/** Mifflin-St Jeor. Mifflin et al., Am J Clin Nutr, 1990. */
export function bmrMifflinStJeor(opts: {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: Sex;
}): number {
  const base = 10 * opts.weightKg + 6.25 * opts.heightCm - 5 * opts.age;
  return round(base + (opts.sex === "male" ? 5 : -161));
}

export const ACTIVITY_LEVELS = [
  { id: "sedentary", label: "Sedentary", detail: "Desk work, little exercise", factor: 1.2 },
  { id: "light", label: "Light", detail: "Light exercise 1-3 days a week", factor: 1.375 },
  { id: "moderate", label: "Moderate", detail: "Moderate exercise 3-5 days a week", factor: 1.55 },
  { id: "high", label: "High", detail: "Hard exercise 6-7 days a week", factor: 1.725 },
  { id: "athlete", label: "Very high", detail: "Physical job or twice-daily training", factor: 1.9 },
] as const;

export type ActivityId = (typeof ACTIVITY_LEVELS)[number]["id"];
export type GoalId = "lose" | "maintain" | "gain";

export const GOALS: { id: GoalId; label: string; detail: string; adjust: number }[] = [
  { id: "lose", label: "Lose fat", detail: "Roughly a 20% deficit", adjust: -0.2 },
  { id: "maintain", label: "Maintain", detail: "Hold current weight", adjust: 0 },
  { id: "gain", label: "Build muscle", detail: "Roughly a 10% surplus", adjust: 0.1 },
];

/**
 * Minimum daily intake this tool will plan for. These are the bottom of the
 * intake ranges prescribed in the 2013 AHA/ACC/TOS guideline, not proven
 * physiological safety limits. Kept identical to the meal planner so the two
 * tools cannot contradict each other.
 */
export const ENERGY_FLOOR: Record<Sex, number> = { male: 1500, female: 1200 };

export type EnergyWarning = { id: string; severity: "info" | "caution"; text: string };

export type EnergyResult = {
  /** Set when the tool refuses to return a target at all. */
  blocked: "under-18" | "underweight-deficit" | null;
  blockedMessage?: string;
  bmr: number;
  tdee: number;
  target: number;
  proteinG: number;
  fatG: number;
  carbG: number;
  bmi: number;
  clampedToFloor: boolean;
  proteinBasis: "current bodyweight" | "healthy-range reference weight";
  warnings: EnergyWarning[];
};

export function energyAndMacros(opts: {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: Sex;
  activity: ActivityId;
  goal: GoalId;
}): EnergyResult {
  const warnings: EnergyWarning[] = [];
  const metres = opts.heightCm / 100;
  const bmi = round(opts.weightKg / (metres * metres), 1);

  const bmr = bmrMifflinStJeor(opts);
  const factor = ACTIVITY_LEVELS.find((a) => a.id === opts.activity)?.factor ?? 1.375;
  const tdee = round(bmr * factor);

  const empty = {
    bmr,
    tdee,
    target: 0,
    proteinG: 0,
    fatG: 0,
    carbG: 0,
    bmi,
    clampedToFloor: false,
    proteinBasis: "current bodyweight" as const,
    warnings,
  };

  // Prediction equations for resting metabolism are validated in adults.
  if (opts.age < 18) {
    return {
      ...empty,
      blocked: "under-18",
      blockedMessage:
        "This calculator is built for adults. The equation behind it is validated in adults, and energy needs during growth are different. For someone under 18, targets should be set with a doctor or a registered dietitian rather than a calculator.",
    };
  }

  if (opts.goal === "lose" && bmi < 18.5) {
    return {
      ...empty,
      blocked: "underweight-deficit",
      blockedMessage: `Your BMI is ${bmi}, below the healthy range of 18.5, so this tool will not calculate a fat-loss target. If you want to understand your maintenance needs, switch the goal to Maintain. If your weight has been falling without you intending it, that is worth raising with a doctor.`,
    };
  }

  const adjust = GOALS.find((g) => g.id === opts.goal)?.adjust ?? 0;
  let target = round(tdee * (1 + adjust));

  let clampedToFloor = false;
  const floor = ENERGY_FLOOR[opts.sex];
  if (opts.goal === "lose" && target < floor) {
    target = floor;
    clampedToFloor = true;
    warnings.push({
      id: "floor",
      severity: "caution",
      text: `A 20% deficit would put you below ${floor} kcal a day, so the target has been raised to ${floor}. That figure is the bottom of the intake range major guidelines prescribe for weight loss, not a proven safety limit. Planning below it is where medical supervision belongs.`,
    });
  }

  // Above BMI 30, g/kg on total bodyweight overshoots. Use a reference weight
  // from the healthy range, matching the meal planner so the two agree.
  const useReference = bmi >= 30;
  const referenceWeight = useReference
    ? ((18.5 + 25) / 2) * metres * metres
    : opts.weightKg;

  const proteinPerKg = opts.goal === "lose" ? 2.0 : opts.goal === "gain" ? 1.8 : 1.6;
  let proteinG = round(referenceWeight * proteinPerKg);
  let fatG = round(Math.max(referenceWeight * 0.8, (target * 0.25) / 9));

  // Protein and fat alone can exceed a low target. Scale both back so the
  // split always reconciles with the number shown, keeping fat at the 20%
  // of energy that the AMDR treats as a cardiometabolic floor.
  const nonCarb = proteinG * 4 + fatG * 9;
  if (nonCarb > target) {
    const fatFloorG = round((target * 0.2) / 9);
    const proteinBudget = Math.max(target - fatFloorG * 9, 0);
    proteinG = round(proteinBudget / 4);
    fatG = fatFloorG;
    warnings.push({
      id: "tight-budget",
      severity: "info",
      text: "At this calorie target there is not room for the full protein and fat allowance plus carbohydrate. Protein has been fitted to the remaining budget after keeping fat at 20% of calories. In practice this is a sign the target is low for your body size.",
    });
  }

  const carbG = round(Math.max((target - proteinG * 4 - fatG * 9) / 4, 0));

  if (opts.age >= 65) {
    warnings.push({
      id: "older-adult",
      severity: "info",
      text: "Past 65, protecting muscle matters more than the calorie number. If you are aiming to lose weight, pair it with resistance training and keep protein at the higher end, and raise unintentional weight loss with a clinician.",
    });
  }

  return {
    ...empty,
    blocked: null,
    target,
    proteinG,
    fatG,
    carbG,
    clampedToFloor,
    proteinBasis: useReference ? "healthy-range reference weight" : "current bodyweight",
    warnings,
  };
}

/* ------------------------------------------------------------------ *
 * 5. Protein requirement
 *
 * Ranges reflect the RDA (0.8 g/kg) as a floor to prevent deficiency, and
 * the higher intakes supported for training and for preserving lean mass in
 * a deficit (Morton et al. 2018 meta-analysis; ISSN position stand;
 * Bauer et al. 2013 PROT-AGE for older adults).
 * ------------------------------------------------------------------ */

export type ProteinGoal =
  | "sedentary"
  | "active"
  | "muscle"
  | "fatloss"
  | "older";

export const PROTEIN_GOALS: {
  id: ProteinGoal;
  label: string;
  detail: string;
  low: number;
  high: number;
}[] = [
  { id: "sedentary", label: "Minimum", detail: "The RDA: enough to prevent deficiency", low: 0.8, high: 1.0 },
  { id: "active", label: "Generally active", detail: "Recreational training, general health", low: 1.2, high: 1.6 },
  { id: "muscle", label: "Building muscle", detail: "Resistance training with growth as the goal", low: 1.6, high: 2.2 },
  { id: "fatloss", label: "Losing fat", detail: "In a deficit, protecting lean mass", low: 1.8, high: 2.4 },
  { id: "older", label: "Older adult", detail: "Aged 65+, countering muscle loss", low: 1.2, high: 1.5 },
];

/**
 * Height is optional, but supplying it matters at higher bodyweights: above
 * BMI 30, applying g/kg to total bodyweight overshoots badly, and the
 * conventional adjustment is to use a reference weight from the healthy
 * range. The energy and meal-planner tools already do this, so without it
 * this tool would contradict them for the same person.
 */
export function proteinNeeds(
  weightKg: number,
  goal: ProteinGoal,
  heightCm?: number,
) {
  const row = PROTEIN_GOALS.find((g) => g.id === goal) ?? PROTEIN_GOALS[1];

  let basisWeight = weightKg;
  let usedReference = false;
  let bmi: number | null = null;
  if (heightCm && heightCm > 100) {
    const metres = heightCm / 100;
    bmi = round(weightKg / (metres * metres), 1);
    if (bmi >= 30) {
      basisWeight = ((18.5 + 25) / 2) * metres * metres;
      usedReference = true;
    }
  }

  const low = round(basisWeight * row.low);
  const high = round(basisWeight * row.high);
  return {
    low,
    high,
    perKgLow: row.low,
    perKgHigh: row.high,
    perMeal: round(((low + high) / 2) / 4),
    rda: round(basisWeight * 0.8),
    bmi,
    usedReference,
    basisWeight: round(basisWeight, 1),
  };
}

/* ------------------------------------------------------------------ *
 * 6. Sleep timing and sleep debt
 *
 * Cycle length ~90 min is a widely used planning average, not a fixed
 * biological constant. Adult sufficiency of 7+ hours follows the joint
 * AASM & Sleep Research Society consensus (Watson et al., SLEEP, 2015).
 * ------------------------------------------------------------------ */

export const SLEEP_CYCLE_MIN = 90;
export const SLEEP_LATENCY_MIN = 15;

export type BedtimeOption = {
  time: string;
  cycles: number;
  hours: number;
  recommended: boolean;
};

export function bedtimesForWake(wakeTime: string): BedtimeOption[] {
  const parts = (wakeTime ?? "").split(":");
  const h = Number(parts[0]);
  const m = Number(parts[1]);
  // A cleared <input type="time"> yields "", which previously produced
  // "NaN:NaN" bedtimes on screen.
  if (
    parts.length < 2 ||
    !Number.isFinite(h) ||
    !Number.isFinite(m) ||
    h < 0 ||
    h > 23 ||
    m < 0 ||
    m > 59
  ) {
    return [];
  }
  const wakeMinutes = h * 60 + m;

  return [6, 5, 4, 3].map((cycles) => {
    const total = cycles * SLEEP_CYCLE_MIN + SLEEP_LATENCY_MIN;
    let bed = (wakeMinutes - total) % (24 * 60);
    if (bed < 0) bed += 24 * 60;
    const hours = round((cycles * SLEEP_CYCLE_MIN) / 60, 1);
    return {
      time: `${String(Math.floor(bed / 60)).padStart(2, "0")}:${String(bed % 60).padStart(2, "0")}`,
      cycles,
      hours,
      recommended: hours >= 7,
    };
  });
}

export type SleepDebtResult = {
  weeklyActual: number;
  weeklyTarget: number;
  debt: number;
  perNightShortfall: number;
  status: "on track" | "mild" | "significant";
};

export function sleepDebt(
  weeknightHours: number,
  weekendHours: number,
  target = 7.5,
): SleepDebtResult {
  const weeklyActual = round(weeknightHours * 5 + weekendHours * 2, 1);
  const weeklyTarget = round(target * 7, 1);
  const debt = round(Math.max(weeklyTarget - weeklyActual, 0), 1);
  const perNightShortfall = round(debt / 7, 1);

  return {
    weeklyActual,
    weeklyTarget,
    debt,
    perNightShortfall,
    status: debt <= 1 ? "on track" : debt <= 5 ? "mild" : "significant",
  };
}
