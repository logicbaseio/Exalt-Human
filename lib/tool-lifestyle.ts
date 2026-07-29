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
import { round, clamp } from "./tool-math";

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
    label: "Moderate alcohol",
    question: "Is your alcohol intake moderate or none?",
    detail: "The study defined moderate as 5-15 g/day for women and 5-30 g/day for men. Lower is not penalised here.",
  },
  {
    id: "diet",
    label: "High-quality diet",
    question: "Would your diet rank in the top 40% for quality?",
    detail: "Measured in the study as the top 40% of the Alternate Healthy Eating Index: plants, whole grains, healthy fats, little ultra-processed food.",
  },
];

/** Life expectancy at 50 with zero and with five low-risk factors (Li 2018). */
const LE_AT_50: Record<Sex, { zero: number; five: number }> = {
  female: { zero: 29.0, five: 43.1 },
  male: { zero: 25.5, five: 37.6 },
};

/** Typical count of low-risk factors in the source cohorts, used as the reference point. */
const REFERENCE_FACTOR_COUNT = 2;

export type LifestyleResult = {
  factorCount: number;
  /** Years of additional life expectancy at 50 vs someone with zero factors. */
  yearsVsZero: number;
  /** Years vs a typical person (the reference count). Can be negative. */
  yearsVsTypical: number;
  /** Chronological age shifted by the difference from typical. */
  lifestyleAge: number;
  /** Projected life expectancy at 50 for this factor count. */
  lifeExpectancyAt50: number;
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

  const active = LIFESTYLE_FACTORS.filter((f) => opts.factors[f.id]);
  const factorCount = active.length;
  const missing = LIFESTYLE_FACTORS.filter((f) => !opts.factors[f.id]).map(
    (f) => f.id,
  );

  const yearsVsZero = round(perFactor * factorCount, 1);
  const yearsVsTypical = round(perFactor * (factorCount - REFERENCE_FACTOR_COUNT), 1);
  const lifeExpectancyAt50 = round(table.zero + yearsVsZero, 1);

  return {
    factorCount,
    yearsVsZero,
    yearsVsTypical,
    // More low-risk factors than typical reads as a younger lifestyle age.
    lifestyleAge: round(clamp(opts.age - yearsVsTypical, 1, 120), 1),
    lifeExpectancyAt50,
    band:
      factorCount >= 5
        ? "All five low-risk factors"
        : factorCount >= 4
          ? "Strong"
          : factorCount >= 3
            ? "Better than typical"
            : factorCount >= 2
              ? "Around typical"
              : "Room to gain the most",
    missing,
  };
}

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
