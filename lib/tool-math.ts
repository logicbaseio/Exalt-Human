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
 * Reference values are the published centiles from Dodds et al. 2014
 * (PLoS ONE, twelve British studies, n=49,964), a British general-population
 * sample. See the table below for exactly which figures are published and
 * which are interpolated.
 * ------------------------------------------------------------------ */

/**
 * `median` values are the published 50th centiles from Dodds et al. 2014
 * (Table 2), 49,964 participants across twelve British studies.
 *
 * `sd` is derived from that paper's published 10th and 90th centiles as
 * (P90 - P10) / 2.563, the normal-distribution relationship. Those centiles
 * are given at ages 20, 50 and 80; the intermediate values here are linearly
 * interpolated between them, which is the one approximation in this table.
 *
 * Note the curve is not monotonic: grip rises from age 20 to a peak around
 * 30, holds through midlife, then declines. An earlier version of this table
 * was estimated rather than taken from the paper and was wrong in both
 * directions, reading 7 kg too high at age 20 and about 5 kg too low from 30
 * onward.
 */
type GripNorm = { age: number; median: number; sd: number };

const GRIP_NORMS: Record<Sex, GripNorm[]> = {
  male: [
    { age: 20, median: 40, sd: 8.58 },
    { age: 30, median: 51, sd: 8.97 },
    { age: 40, median: 50, sd: 9.36 },
    { age: 50, median: 48, sd: 9.75 },
    { age: 60, median: 45, sd: 8.97 },
    { age: 70, median: 39, sd: 8.19 },
    { age: 80, median: 32, sd: 7.41 },
  ],
  female: [
    { age: 20, median: 28, sd: 5.85 },
    { age: 30, median: 31, sd: 5.98 },
    { age: 40, median: 31, sd: 6.11 },
    { age: 50, median: 29, sd: 6.24 },
    { age: 60, median: 27, sd: 5.85 },
    { age: 70, median: 24, sd: 5.46 },
    { age: 80, median: 19, sd: 5.07 },
  ],
};

/** Age at which grip peaks, per Dodds et al. Used for the strength-age read. */
const GRIP_PEAK_AGE = 30;

/**
 * Clinical low-strength cut-points for probable sarcopenia.
 * Source: EWGSOP2 (Cruz-Jentoft et al., Age and Ageing, 2019).
 */
export const SARCOPENIA_CUTOFF: Record<Sex, number> = { male: 27, female: 16 };

/**
 * Linear interpolation between the published decade anchors, so a 44-year-old
 * is not read against the same figure as a 40-year-old. The source presents
 * smooth centile curves, so interpolating is closer to it than stepping.
 */
function gripNormFor(sex: Sex, age: number): { median: number; sd: number } {
  const table = GRIP_NORMS[sex];
  if (age <= table[0].age) return { median: table[0].median, sd: table[0].sd };
  const last = table[table.length - 1];
  if (age >= last.age) return { median: last.median, sd: last.sd };

  for (let i = 0; i < table.length - 1; i += 1) {
    const a = table[i];
    const b = table[i + 1];
    if (age >= a.age && age <= b.age) {
      const t = (age - a.age) / (b.age - a.age);
      return {
        median: a.median + t * (b.median - a.median),
        sd: a.sd + t * (b.sd - a.sd),
      };
    }
  }
  return { median: last.median, sd: last.sd };
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
  const z = (gripKg - norm.median) / norm.sd;
  const percentile = zToPercentile(z);

  // "Strength age": the oldest age at which this grip is still the median.
  // Only the declining half of the curve is searched, from the peak onward:
  // grip rises from 20 to 30, so the rising half would match a second, much
  // younger age and make the figure meaningless.
  const table = GRIP_NORMS[sex].filter((r) => r.age >= GRIP_PEAK_AGE);
  let strengthAge: number | null = null;
  for (const row of table) {
    if (gripKg >= row.median) {
      strengthAge = row.age;
      break;
    }
  }
  // Stronger than the peak median, or weaker than the oldest band.
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
    ageMean: round(norm.median, 1),
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
 * VO2max reference values from the Fitness Registry and the Importance of
 * Exercise National Database (FRIEND), maximal treadmill cardiopulmonary
 * exercise testing, adults aged 20-79 without cardiovascular disease.
 *
 * The published 25th, 50th and 75th percentiles are stored directly and a
 * result is placed by interpolating between them, rather than by assuming a
 * normal distribution. VO2max is mildly right-skewed, so a symmetric model
 * cannot reproduce both quartiles: fitting one throws the other out by
 * several percentile points. Interpolating the real anchors reproduces the
 * published values exactly.
 *
 * This replaced an earlier estimated table that sat 3 to 5 ml/kg/min below
 * FRIEND and so flattered every user's percentile.
 *
 * Caveat carried into the UI: FRIEND is a US population referred for
 * exercise testing, so it is not a perfect general-population sample.
 */
type Vo2Norm = { minAge: number; p25: number; p50: number; p75: number };

const VO2_NORMS: Record<Sex, Vo2Norm[]> = {
  male: [
    { minAge: 20, p25: 40.1, p50: 48.0, p75: 55.2 },
    { minAge: 30, p25: 35.9, p50: 42.4, p75: 49.2 },
    { minAge: 40, p25: 31.9, p50: 37.8, p75: 45.0 },
    { minAge: 50, p25: 27.1, p50: 32.6, p75: 39.7 },
    { minAge: 60, p25: 23.7, p50: 28.2, p75: 34.5 },
    { minAge: 70, p25: 20.4, p50: 24.4, p75: 30.4 },
  ],
  female: [
    { minAge: 20, p25: 30.5, p50: 37.6, p75: 44.7 },
    { minAge: 30, p25: 25.3, p50: 30.2, p75: 36.1 },
    { minAge: 40, p25: 22.1, p50: 26.7, p75: 32.4 },
    { minAge: 50, p25: 19.9, p50: 23.4, p75: 27.6 },
    { minAge: 60, p25: 17.2, p50: 20.0, p75: 23.8 },
    { minAge: 70, p25: 15.6, p50: 18.3, p75: 20.8 },
  ],
};

export function vo2Percentile(vo2: number, age: number, sex: Sex) {
  const table = VO2_NORMS[sex];
  let norm = table[0];
  for (const row of table) if (age >= row.minAge) norm = row;

  // Piecewise-linear through the published quartiles, with the outer segments'
  // slopes extended beyond them and the result held inside 1 to 99.
  const lowerSlope = 25 / (norm.p50 - norm.p25);
  const upperSlope = 25 / (norm.p75 - norm.p50);
  let percentile: number;
  if (vo2 <= norm.p25) {
    percentile = 25 - (norm.p25 - vo2) * lowerSlope;
  } else if (vo2 <= norm.p50) {
    percentile = 25 + (vo2 - norm.p25) * lowerSlope;
  } else if (vo2 <= norm.p75) {
    percentile = 50 + (vo2 - norm.p50) * upperSlope;
  } else {
    percentile = 75 + (vo2 - norm.p75) * upperSlope;
  }
  percentile = clamp(percentile, 1, 99);

  return {
    percentile: round(percentile),
    /** The published 50th percentile for this age band. */
    ageMean: norm.p50,
    quartiles: { p25: norm.p25, p75: norm.p75 },
    band:
      vo2 >= norm.p75
        ? "Above the 75th percentile"
        : vo2 >= norm.p50
          ? "Between the median and the 75th"
          : vo2 >= norm.p25
            ? "Between the 25th and the median"
            : "Below the 25th percentile",
  };
}

/* ------------------------------------------------------------------ *
 * 3. Waist-to-height ratio
 *
 * Boundaries follow NICE guidance (UK): keeping waist to less than half of
 * height is the practical rule; 0.5-0.59 signals increased central adiposity
 * and ≥0.6 further increased risk.
 * ------------------------------------------------------------------ */

/**
 * WHO waist circumference cut-offs, which unlike the ratio ARE sex-specific.
 * Men 94 cm increased / 102 cm substantially increased; women 80 / 88.
 * Derived mainly from studies in predominantly European populations, so they
 * transfer imperfectly to other groups.
 */
export const WAIST_THRESHOLDS: Record<Sex, { increased: number; high: number }> = {
  male: { increased: 94, high: 102 },
  female: { increased: 80, high: 88 },
};

export type WhtrResult = {
  ratio: number;
  category: "Low" | "Healthy" | "Increased" | "Further increased";
  note: string;
  halfHeightCm: number;
  /** Where the raw waist measurement sits against the WHO cut-offs for this sex. */
  waistStatus: "Below the increased-risk cut-off" | "At or above increased risk" | "At or above substantially increased risk";
  thresholds: { increased: number; high: number };
};

/**
 * The ratio boundaries are deliberately the same for men and women. A
 * meta-analysis across fourteen countries put the boundary at 0.50 for both
 * sexes, and not needing sex-specific cut-offs is the main advantage this
 * measure has over waist circumference alone. Sex is used here only for the
 * WHO waist-circumference comparison, where it genuinely matters.
 */
export function waistToHeight(
  waistCm: number,
  heightCm: number,
  sex: Sex = "male",
): WhtrResult {
  const ratio = round(waistCm / heightCm, 3);
  const halfHeightCm = round(heightCm / 2, 1);
  const thresholds = WAIST_THRESHOLDS[sex];
  const waistStatus =
    waistCm >= thresholds.high
      ? "At or above substantially increased risk"
      : waistCm >= thresholds.increased
        ? "At or above increased risk"
        : "Below the increased-risk cut-off";

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

  return { ratio, category, note, halfHeightCm, waistStatus, thresholds };
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

/**
 * Pregnancy and breastfeeding need different handling, and conflating them
 * would state something false.
 *
 * Pregnancy: intentional weight loss is not recommended, and the prediction
 * equations here are not validated in pregnancy, so the tools refuse.
 *
 * Breastfeeding: UK guidance is explicit that gradual weight loss does not
 * affect the quantity or quality of breast milk, so refusing would be both
 * over-cautious and misleading. Instead the energy requirement rises and the
 * pace is held to gradual.
 */
export type PerinatalStatus = "none" | "pregnant" | "breastfeeding";

/**
 * Additional daily energy while breastfeeding. Guidance gives 330-400 kcal
 * for a well-nourished mother; we use the top of that range, because while
 * nursing the safer error is eating a little too much rather than too little.
 */
export const LACTATION_KCAL = 400;

export const PERINATAL_BLOCK_MESSAGE =
  "This calculator will not set targets during pregnancy. Intentional weight loss is not advised in pregnancy, energy needs change as it progresses, and the equation behind this tool is not validated in pregnant women. Your midwife or maternity team can give you advice that accounts for your stage and your history, which no calculator can do.";

export type EnergyWarning = { id: string; severity: "info" | "caution"; text: string };

export type EnergyResult = {
  /** Set when the tool refuses to return a target at all. */
  blocked: "under-18" | "underweight-deficit" | "pregnant" | null;
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
  perinatal?: PerinatalStatus;
}): EnergyResult {
  const warnings: EnergyWarning[] = [];
  const perinatal = opts.perinatal ?? "none";
  const metres = opts.heightCm / 100;
  const bmi = round(opts.weightKg / (metres * metres), 1);

  const bmr = bmrMifflinStJeor(opts);
  const factor = ACTIVITY_LEVELS.find((a) => a.id === opts.activity)?.factor ?? 1.375;
  const lactation = perinatal === "breastfeeding" ? LACTATION_KCAL : 0;
  const tdee = round(bmr * factor + lactation);

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

  if (perinatal === "pregnant") {
    return { ...empty, blocked: "pregnant", blockedMessage: PERINATAL_BLOCK_MESSAGE };
  }

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

  if (perinatal === "breastfeeding") {
    warnings.push({
      id: "breastfeeding",
      severity: "caution",
      text: `Your daily figure includes an extra ${LACTATION_KCAL} kcal for breastfeeding, the upper end of the 330 to 400 kcal guidance gives for a well-nourished mother. UK guidance is clear that losing weight gradually does not affect the quantity or quality of your milk, so a modest deficit is not a problem, but a large one is a bad idea while nursing. Keep it slow, and raise it with your health visitor or GP if you are unsure.`,
    });
  }

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
