/**
 * Lifestyle age estimate.
 *
 * IMPORTANT — what this is and is not.
 *
 * This is NOT a biological age clock. Real biological age estimates are
 * measured (DNA methylation clocks, blood-panel composites); they cannot be
 * derived from a questionnaire. What this tool does is apply the findings of
 * a large prospective cohort study to a person's answers and report the
 * life-expectancy difference that study observed between groups.
 *
 * Anchor study: Li Y, Pan A, Wang DD, et al. "Impact of Healthy Lifestyle
 * Factors on Life Expectancies in the US Population." Circulation, 2018.
 * Nurses' Health Study (n=78,865) and Health Professionals Follow-up Study
 * (n=44,354). Five low-risk factors: never smoking, BMI 18.5-24.9,
 * >=30 min/day moderate-to-vigorous activity, moderate alcohol intake, and a
 * high-quality diet.
 *
 * Observed life expectancy at age 50, zero vs five low-risk factors:
 *   Women: 29.0 -> 43.1 years (+14.1)
 *   Men:   25.5 -> 37.6 years (+12.2)
 */

import type { Sex } from "./tool-math";
import { round } from "./tool-math";

export type LifestyleFactorId =
  | "nonsmoker"
  | "healthyWeight"
  | "activity"
  | "alcohol"
  | "diet";

export const LIFESTYLE_FACTORS: {
  id: LifestyleFactorId;
  label: string;
  question: string;
  detail: string;
}[] = [
  {
    id: "nonsmoker",
    label: "Never smoked",
    question: "Have you never smoked cigarettes?",
    detail: "The study's low-risk group is never-smokers. Former smokers gain much of the benefit back over time.",
  },
  {
    id: "healthyWeight",
    label: "BMI 18.5-24.9",
    question: "Is your BMI between 18.5 and 24.9?",
    detail: "BMI is a crude measure at the individual level. Waist-to-height ratio often tells you more.",
  },
  {
    id: "activity",
    label: "30+ min activity daily",
    question: "Do you average 30 minutes or more of moderate-to-vigorous activity a day?",
    detail: "Brisk walking counts. This is roughly 150-210 minutes a week.",
  },
  {
    id: "alcohol",
    label: "Alcohol: none or moderate",
    question: "Do you drink no alcohol, or only within moderate limits?",
    detail: "The study's low-risk band was 5-15 g/day for women and 5-30 g/day for men, and not drinking also counts here. Note that current WHO guidance is that no level of alcohol is risk-free, so this is not a reason to start.",
  },
  {
    id: "diet",
    label: "High-quality diet",
    question: "Would your diet rank in the top 40% for quality?",
    detail: "Measured in the study as the top 40% of the Alternate Healthy Eating Index: plants, whole grains, healthy fats, little ultra-processed food.",
  },
];

/**
 * Life expectancy at 50 with zero and with five low-risk factors (Li 2018).
 * These two endpoints are the only per-count figures the paper reports in
 * text; values for 1 to 4 factors appear only in a figure. Anything between
 * these anchors here is a straight-line interpolation, and the UI says so.
 */
const LE_AT_50: Record<Sex, { zero: number; five: number }> = {
  female: { zero: 29.0, five: 43.1 },
  male: { zero: 25.5, five: 37.6 },
};

export type LifestyleResult = {
  factorCount: number;
  /** Years of additional life expectancy at 50 vs someone with zero factors. */
  yearsVsZero: number;
  /**
   * The headline figure: years of life expectancy still available from the
   * factors not yet adopted. Derived only from the two reported endpoints,
   * so it needs no invented "typical person" baseline.
   */
  yearsStillAvailable: number;
  /** Projected life expectancy at 50 for this factor count (interpolated). */
  lifeExpectancyAt50: number;
  /** True when the count is 0 or 5, where the figure is reported directly. */
  isReportedDirectly: boolean;
  band: string;
  missing: LifestyleFactorId[];
};

export function lifestyleAge(opts: {
  age: number;
  sex: Sex;
  factors: Record<LifestyleFactorId, boolean>;
}): LifestyleResult {
  const table = LE_AT_50[opts.sex];
  const perFactor = (table.five - table.zero) / 5;

  const factorCount = LIFESTYLE_FACTORS.filter((f) => opts.factors[f.id]).length;
  const missing = LIFESTYLE_FACTORS.filter((f) => !opts.factors[f.id]).map((f) => f.id);

  const yearsVsZero = round(perFactor * factorCount, 1);

  return {
    factorCount,
    yearsVsZero,
    yearsStillAvailable: round(perFactor * missing.length, 1),
    lifeExpectancyAt50: round(table.zero + yearsVsZero, 1),
    isReportedDirectly: factorCount === 0 || factorCount === 5,
    band:
      factorCount >= 5
        ? "All five low-risk factors"
        : factorCount >= 4
          ? "Four of five"
          : factorCount >= 3
            ? "Three of five"
            : factorCount >= 1
              ? `${factorCount} of five`
              : "None of the five yet",
    missing,
  };
}

/**
 * The equal-weighting caveat, surfaced prominently in the UI.
 *
 * Li et al. do report per-factor effects separately (their Figure 2), and the
 * factors are not equal - smoking is much the largest single contributor.
 * Those per-factor values are only in a figure, not in extractable text, so
 * this tool splits the total evenly and must say that it is doing so.
 */
export const EQUAL_WEIGHTING_CAVEAT =
  "This tool splits the study's total benefit evenly across the five factors. The real effects are not equal: never smoking is by far the largest single contributor, and the study reports each factor separately. Read the per-factor figures as a rough guide to where years sit, not as a measurement.";

/** Alcohol needs its own note, because guidance has moved. */
export const ALCOHOL_CAVEAT =
  "One factor deserves a flag. The study counted moderate drinking as low-risk, and this tool follows the study so the arithmetic stays faithful to it. Current WHO guidance is that no level of alcohol consumption is risk-free, so ticking this box is not an endorsement of drinking moderately over not drinking at all.";

/** The cohort caveat. */
export const COHORT_CAVEAT =
  "The figures come from two large US cohorts of nurses and other health professionals, and are anchored at age 50. They describe averages in those populations rather than a prediction for you, and they transfer imperfectly to other countries and occupations.";

/** Human-readable next step for each factor a person does not yet have. */
export const FACTOR_ACTIONS: Record<LifestyleFactorId, string> = {
  nonsmoker:
    "Stopping smoking is the single largest lever in this list, and risk falls steadily in the years after quitting.",
  healthyWeight:
    "Waist-to-height ratio is a more useful target than the scale. Aim to keep waist under half your height.",
  activity:
    "Thirty minutes of brisk walking a day reaches this threshold. It does not require a gym.",
  alcohol:
    "Reducing intake toward the moderate band, or to none, moves you into the low-risk group.",
  diet:
    "Diet quality here is mostly about pattern: more plants, whole grains and healthy fats, less ultra-processed food.",
};
