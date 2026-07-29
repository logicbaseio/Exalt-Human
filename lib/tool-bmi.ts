/**
 * Body mass index.
 *
 * BMI is a population screening tool. It does not measure body fat, and at
 * the individual level it can be badly wrong in either direction. Everything
 * exported here is built so the UI can say that plainly rather than hide it.
 *
 * Adult categories follow the WHO/CDC classification.
 *
 * The lower cut-point set follows NICE guideline NG246 (2025), which applies
 * thresholds of 23 (overweight) and 27.5 (obesity) to people from South
 * Asian, Chinese, other Asian, Middle Eastern, Black African and African-
 * Caribbean backgrounds, because cardiometabolic risk in these groups rises
 * at a lower BMI. Two honesty points carried through into the UI:
 *
 *  - The WHO expert consultation (Lancet, 2004) did NOT replace the
 *    international cut-offs. It kept 25 and 30 as the global standard and
 *    added "public health action points" at 23, 27.5, 32.5 and 37.5, leaving
 *    countries to choose. It also found the risk threshold varies between 22
 *    and 25 across different Asian populations, so a single number hides real
 *    spread.
 *  - NICE states it found no evidence for the class 2 and 3 boundaries in
 *    these groups; the 2.5 reduction is committee consensus, not data.
 */

import { round } from "./tool-math";

export type BmiCategory =
  | "Underweight"
  | "Healthy weight"
  | "Overweight"
  | "Obesity class I"
  | "Obesity class II"
  | "Obesity class III";

/** Which set of cut-points to apply. */
export type BmiStandard = "who" | "lower";

type Band = { label: BmiCategory; min: number; max: number };

/** WHO/CDC adult cut-points. */
const WHO_BANDS: Band[] = [
  { label: "Underweight", min: 0, max: 18.5 },
  { label: "Healthy weight", min: 18.5, max: 25 },
  { label: "Overweight", min: 25, max: 30 },
  { label: "Obesity class I", min: 30, max: 35 },
  { label: "Obesity class II", min: 35, max: 40 },
  { label: "Obesity class III", min: 40, max: 999 },
];

/**
 * Lower cut-points, per NICE NG246. The class 2 and 3 boundaries here are
 * committee consensus rather than evidence, which the UI states.
 */
const LOWER_BANDS: Band[] = [
  { label: "Underweight", min: 0, max: 18.5 },
  { label: "Healthy weight", min: 18.5, max: 23 },
  { label: "Overweight", min: 23, max: 27.5 },
  { label: "Obesity class I", min: 27.5, max: 32.5 },
  { label: "Obesity class II", min: 32.5, max: 37.5 },
  { label: "Obesity class III", min: 37.5, max: 999 },
];

export const bandsFor = (standard: BmiStandard) =>
  standard === "lower" ? LOWER_BANDS : WHO_BANDS;

/** Backgrounds NICE applies the lower thresholds to. */
export const LOWER_THRESHOLD_GROUPS =
  "South Asian, Chinese, other Asian, Middle Eastern, Black African or African-Caribbean";

/**
 * Where the best cohort evidence disagrees with the single guideline number.
 * Caleyachetty et al., Lancet Diabetes & Endocrinology, 2021: BMI equivalent
 * to a BMI of 30 in White populations for type 2 diabetes risk, from
 * 1,472,819 people in England.
 */
export const EVIDENCE_CUTOFFS: { group: string; bmi: number }[] = [
  { group: "South Asian", bmi: 23.9 },
  { group: "Arab", bmi: 26.6 },
  { group: "Chinese", bmi: 26.9 },
  { group: "Black", bmi: 28.1 },
];

export type BmiResult = {
  bmi: number;
  category: BmiCategory;
  standard: BmiStandard;
  /** Weight range (kg) that would place this height in the healthy band. */
  healthyRangeKg: { low: number; high: number };
  /** How far from the nearest healthy-band edge, in kg. 0 when inside. */
  kgFromHealthy: number;
  bands: Band[];
  note: string;
};

export function calculateBmi(opts: {
  weightKg: number;
  heightCm: number;
  standard?: BmiStandard;
}): BmiResult {
  const standard = opts.standard ?? "who";
  const bands = bandsFor(standard);
  const metres = opts.heightCm / 100;
  const bmi = round(opts.weightKg / (metres * metres), 1);

  const band = bands.find((b) => bmi >= b.min && bmi < b.max) ?? bands[bands.length - 1];
  const healthy = bands.find((b) => b.label === "Healthy weight")!;

  const low = round(healthy.min * metres * metres, 1);
  const high = round(healthy.max * metres * metres, 1);

  let kgFromHealthy = 0;
  if (opts.weightKg < low) kgFromHealthy = round(low - opts.weightKg, 1);
  else if (opts.weightKg > high) kgFromHealthy = round(opts.weightKg - high, 1);

  return {
    bmi,
    category: band.label,
    standard,
    healthyRangeKg: { low, high },
    kgFromHealthy,
    bands,
    note: NOTES[band.label],
  };
}

const NOTES: Record<BmiCategory, string> = {
  Underweight:
    "A BMI in this band can reflect a small frame, a high metabolism, illness, or undereating. Because the causes differ so much, this is a reason to speak to a clinician rather than to act alone.",
  "Healthy weight":
    "This BMI sits in the band associated with lower risk across populations. It says nothing about your body composition, fitness, or diet quality, all of which matter independently.",
  Overweight:
    "BMI in this band is associated with higher average risk across populations, but it cannot distinguish muscle from fat. Waist-to-height ratio will tell you considerably more about where you actually stand.",
  "Obesity class I":
    "This band is associated with increased risk of conditions including type 2 diabetes and cardiovascular disease. It describes a statistical average, not your individual health, and is best interpreted alongside waist measurement and blood markers.",
  "Obesity class II":
    "This band is associated with substantially increased risk across populations. It is worth discussing with a clinician who can look at the fuller picture, including waist circumference and metabolic markers.",
  "Obesity class III":
    "This band is associated with the highest average risk in the BMI classification. A clinician can assess the full picture and discuss options, which is a far more useful step than any number from a calculator.",
};

/**
 * Why the number can mislead for a given person. The UI surfaces the ones
 * that plausibly apply so the caveat is specific rather than boilerplate.
 */
export const BMI_CAVEATS = [
  {
    id: "muscle",
    label: "Muscular build",
    text: "BMI counts all mass the same. A well-muscled person can register as overweight or obese while carrying little fat. Strength athletes are the clearest example.",
  },
  {
    id: "older",
    label: "Older adults",
    text: "Muscle mass falls with age while fat can rise, so BMI can look unchanged while body composition has shifted considerably.",
  },
  {
    id: "ethnicity",
    label: "Ancestry",
    text: "Risk rises at a lower BMI in some populations, particularly South Asian, Chinese and other Asian groups. The alternative cut-points above reflect that.",
  },
  {
    id: "distribution",
    label: "Where fat sits",
    text: "BMI is blind to fat distribution. Fat around the organs carries more risk than fat on the hips and thighs, and only a waist measurement sees it.",
  },
  {
    id: "pregnancy",
    label: "Pregnancy",
    text: "BMI is not a meaningful measure during pregnancy or breastfeeding, and the categories above do not apply.",
  },
] as const;
