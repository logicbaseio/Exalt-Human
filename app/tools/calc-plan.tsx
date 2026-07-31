"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  inToCm,
  lbToKg,
  round,
  type Sex,
  type ActivityId,
  type PerinatalStatus,
} from "@/lib/tool-math";
import { ACTIVITY_LEVELS } from "@/lib/tool-math";
import { PERINATAL_OPTIONS } from "./calc-body";
import {
  calculateBmi,
  BMI_CAVEATS,
  LOWER_THRESHOLD_GROUPS,
  EVIDENCE_CUTOFFS,
  type BmiStandard,
} from "@/lib/tool-bmi";
import { buildPlan, formatDuration } from "@/lib/tool-plan";
import {
  Field,
  NumberInput,
  PairedInput,
  BandChart,
  Segmented,
  ResultHero,
  ResultStats,
  ResultPanel,
  ToolNote,
  num,
} from "./ui";

const SEXES = [
  { id: "male" as Sex, label: "Male" },
  { id: "female" as Sex, label: "Female" },
];

const UNITS = [
  { id: "metric" as const, label: "Metric", detail: "cm / kg" },
  { id: "imperial" as const, label: "Imperial", detail: "in / lb" },
];

type UnitSystem = "metric" | "imperial";

/* ================================================================== *
 * BMI
 * ================================================================== */

/** Renders a band's numeric bounds the way the categories are conventionally written. */
function bandRange(min: number, max: number): string {
  if (min <= 0) return `Below ${max.toFixed(1)}`;
  if (max >= 999) return `${min.toFixed(1)} or greater`;
  // Bands are [min, max), so the printed upper bound is the last value inside.
  return `${min.toFixed(1)} to ${(max - 0.1).toFixed(1)}`;
}

export function BmiTool() {
  const [units, setUnits] = useState<UnitSystem>("metric");
  const [weight, setWeight] = useState("");
  const [heightCmRaw, setHeightCmRaw] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [standard, setStandard] = useState<BmiStandard>("who");

  const weightRaw = num(weight);
  const weightKg = weightRaw === null ? null : units === "metric" ? weightRaw : lbToKg(weightRaw);

  const ft = num(feet);
  const inch = num(inches);
  const heightCm =
    units === "metric"
      ? num(heightCmRaw)
      : ft === null && inch === null
        ? null
        : inToCm((ft ?? 0) * 12 + (inch ?? 0));

  const ready = weightKg !== null && heightCm !== null && weightKg > 20 && heightCm > 100;

  const result = useMemo(
    () => (ready ? calculateBmi({ weightKg: weightKg!, heightCm: heightCm!, standard }) : null),
    [ready, weightKg, heightCm, standard],
  );

  const fmt = (kg: number) =>
    units === "metric" ? `${kg} kg` : `${round(kg * 2.2046226218, 1)} lb`;

  return (
    <div className="tool-layout">
      <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
        <Field label="Units">
          <Segmented options={UNITS} value={units} onChange={setUnits} ariaLabel="Units" />
        </Field>
        <Field label="Height" suffix={units === "metric" ? "cm" : "ft / in"}>
          {units === "metric" ? (
            <NumberInput
              value={heightCmRaw}
              onChange={setHeightCmRaw}
              step={0.5}
              placeholder="178"
            />
          ) : (
            <PairedInput
              first={{ value: feet, onChange: setFeet, unit: "feet", placeholder: "5", max: 8 }}
              second={{ value: inches, onChange: setInches, unit: "inches", placeholder: "11", max: 11.5 }}
            />
          )}
        </Field>
        <Field label="Weight" suffix={units === "metric" ? "kg" : "lb"}>
          <NumberInput
            value={weight}
            onChange={setWeight}
            step={0.5}
            placeholder={units === "metric" ? "78" : "172"}
          />
        </Field>
        <Field
          label="Cut-points"
          hint={`NICE applies lower thresholds to people from ${LOWER_THRESHOLD_GROUPS} backgrounds, because cardiometabolic risk in these groups rises at a lower BMI.`}
        >
          <Segmented
            options={[
              { id: "who" as BmiStandard, label: "Standard (WHO)", detail: "Healthy 18.5 to 24.9" },
              { id: "lower" as BmiStandard, label: "Lower thresholds", detail: "Healthy 18.5 to 22.9" },
            ]}
            value={standard}
            onChange={setStandard}
            ariaLabel="Cut-points"
          />
        </Field>
      </form>

      <ResultPanel
        ready={!!result}
        emptyMessage="Enter your height and weight to calculate your BMI."
      >
        {result ? (
          <>
            <ResultHero
              value={result.bmi.toFixed(1)}
              band={result.category}
              caption={result.note}
            />

            <BandChart
              rows={result.bands.map((band) => ({
                label: band.label,
                range: bandRange(band.min, band.max),
              }))}
              activeIndex={result.bands.findIndex((b) => b.label === result.category)}
              caption={
                result.standard === "lower"
                  ? "Lower thresholds, per NICE guideline NG246."
                  : "Standard WHO and CDC adult categories."
              }
            />

            <ResultStats
              stats={[
                {
                  label: "Healthy range for your height",
                  value: `${fmt(result.healthyRangeKg.low)} - ${fmt(result.healthyRangeKg.high)}`,
                },
                {
                  label:
                    result.kgFromHealthy === 0
                      ? "Inside the healthy band"
                      : "Distance from that band",
                  value:
                    result.kgFromHealthy === 0 ? "Yes" : fmt(result.kgFromHealthy),
                },
                {
                  label: "Cut-points used",
                  value: result.standard === "lower" ? "Lower (NICE)" : "WHO standard",
                },
              ]}
            />

            {result.standard === "lower" ? (
              <ToolNote strength="Context">
                These lower thresholds come from NICE guideline NG246, which
                applies them to people from {LOWER_THRESHOLD_GROUPS}{" "}
                backgrounds. Two caveats worth knowing: the WHO kept 25 and 30
                as the international standard and offered 23 and 27.5 only as
                additional action points, and NICE states it found no evidence
                for the class 2 and 3 boundaries in these groups, so those are
                committee consensus rather than data. The best English cohort
                evidence also puts the diabetes-equivalent threshold at{" "}
                {EVIDENCE_CUTOFFS.map((c) => `${c.bmi} for ${c.group}`).join(", ")}{" "}
                people, which does not match a single number for everyone.
              </ToolNote>
            ) : null}

            <div className="tool-actions">
              <p className="tool-field-label">When this number misleads</p>
              <ul>
                {BMI_CAVEATS.slice(0, 4).map((caveat) => (
                  <li key={caveat.id}>
                    <b>{caveat.label}</b>
                    <span>{caveat.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <ToolNote strength="Context">
              BMI was designed to describe populations, not to diagnose
              individuals. It cannot see the difference between muscle and fat,
              and it cannot see where fat sits. For an individual, waist-to-height
              ratio is usually the more informative single number.
            </ToolNote>

            <p className="tool-cross-link">
              <Link href="/tools/waist-to-height-ratio">
                Measure your waist-to-height ratio instead ↗
              </Link>
            </p>
          </>
        ) : null}
      </ResultPanel>
    </div>
  );
}

/* ================================================================== *
 * Meal planner
 * ================================================================== */

const RATES = [
  { id: "0.25", label: "Gradual", detail: "0.25 kg a week" },
  { id: "0.5", label: "Steady", detail: "0.5 kg a week" },
  { id: "0.75", label: "Brisk", detail: "0.75 kg a week" },
  { id: "1", label: "Fastest advised", detail: "1 kg a week" },
];

export function MealPlannerTool() {
  const [units, setUnits] = useState<UnitSystem>("metric");
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [current, setCurrent] = useState("");
  const [goal, setGoal] = useState("");
  const [activity, setActivity] = useState<ActivityId>("light");
  const [rate, setRate] = useState("0.5");
  const [perinatal, setPerinatal] = useState<PerinatalStatus>("none");

  const toKg = (v: number | null) =>
    v === null ? null : units === "metric" ? v : lbToKg(v);

  const ageN = num(age);
  const heightRaw = num(height);
  const heightCm = heightRaw === null ? null : units === "metric" ? heightRaw : inToCm(heightRaw);
  const currentKg = toKg(num(current));
  const goalKg = toKg(num(goal));

  const ready =
    ageN !== null &&
    ageN > 0 &&
    heightCm !== null &&
    heightCm > 100 &&
    currentKg !== null &&
    currentKg > 25 &&
    goalKg !== null &&
    goalKg > 25;

  const plan = useMemo(
    () =>
      ready
        ? buildPlan({
            sex,
            age: ageN!,
            heightCm: heightCm!,
            currentKg: currentKg!,
            goalKg: goalKg!,
            activity,
            rateKgPerWeek: Number(rate),
            perinatal,
          })
        : null,
    [ready, sex, ageN, heightCm, currentKg, goalKg, activity, rate, perinatal],
  );

  const fmtW = (kg: number) =>
    units === "metric" ? `${round(kg, 1)} kg` : `${round(kg * 2.2046226218, 1)} lb`;

  return (
    <div className="tool-layout">
      <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
        <Field label="Units">
          <Segmented options={UNITS} value={units} onChange={setUnits} ariaLabel="Units" />
        </Field>
        <Field label="Sex">
          <Segmented options={SEXES} value={sex} onChange={setSex} ariaLabel="Sex" />
        </Field>
        <Field label="Age" suffix="years">
          <NumberInput value={age} onChange={setAge} min={1} max={100} placeholder="35" />
        </Field>
        <Field label="Height" suffix={units === "metric" ? "cm" : "in"}>
          <NumberInput
            value={height}
            onChange={setHeight}
            step={0.5}
            placeholder={units === "metric" ? "178" : "70"}
          />
        </Field>
        <Field label="Current weight" suffix={units === "metric" ? "kg" : "lb"}>
          <NumberInput
            value={current}
            onChange={setCurrent}
            step={0.5}
            placeholder={units === "metric" ? "88" : "194"}
          />
        </Field>
        <Field label="Goal weight" suffix={units === "metric" ? "kg" : "lb"}>
          <NumberInput
            value={goal}
            onChange={setGoal}
            step={0.5}
            placeholder={units === "metric" ? "78" : "172"}
          />
        </Field>
        <Field label="Activity level">
          <Segmented
            options={ACTIVITY_LEVELS.map((a) => ({ id: a.id, label: a.label, detail: a.detail }))}
            value={activity}
            onChange={setActivity}
            ariaLabel="Activity level"
          />
        </Field>
        <Field label="Pace" hint="Slower loss preserves more muscle and is easier to hold onto.">
          <Segmented options={RATES} value={rate} onChange={setRate} ariaLabel="Pace" />
        </Field>
        <Field
          label="Pregnant or breastfeeding?"
          hint="This changes the answer materially, so the tool asks rather than assumes."
        >
          <Segmented
            options={PERINATAL_OPTIONS}
            value={perinatal}
            onChange={setPerinatal}
            ariaLabel="Pregnant or breastfeeding"
          />
        </Field>
      </form>

      <ResultPanel
        ready={!!plan}
        emptyMessage="Fill in your details and a goal weight to build a plan."
      >
        {plan?.blocked ? (
          <div className="tool-blocked">
            <span>This tool will not plan that</span>
            <p>{plan.blockedMessage}</p>
          </div>
        ) : plan ? (
          <>
            <ResultHero
              value={plan.targetKcal.toLocaleString()}
              unit=" kcal/day"
              band={plan.direction === "lose" ? "To lose weight" : "To gain weight"}
              caption={
                plan.weeksToGoal
                  ? `At this intake you would reach ${fmtW(goalKg!)} in ${formatDuration(plan.weeksToGoal)}, losing about ${plan.effectiveRateKgPerWeek} kg a week at the start.`
                  : "At this intake your weight settles before reaching the goal. See the note below."
              }
            />

            <ResultStats
              stats={[
                {
                  label: "You currently burn",
                  value: `${plan.tdeeNow.toLocaleString()} kcal`,
                  note: "Resting metabolism x your activity level.",
                },
                {
                  label: plan.direction === "lose" ? "Daily deficit" : "Daily surplus",
                  value: `${Math.abs(plan.tdeeNow - plan.targetKcal).toLocaleString()} kcal`,
                },
                {
                  label: "BMI now to goal",
                  value: `${plan.startBmi} → ${plan.goalBmi}`,
                },
              ]}
            />

            <div className="tool-macros">
              <p className="tool-field-label">Daily targets</p>
              <div>
                <span><b>{plan.proteinG} g</b>Protein</span>
                <span><b>{plan.fatG} g</b>Fat</span>
                <span><b>{plan.carbG} g</b>Carbohydrate</span>
              </div>
            </div>

            <div className="tool-meals">
              <p className="tool-field-label">How to spread it across the day</p>
              <ul>
                {plan.meals.map((meal) => (
                  <li key={meal.name}>
                    <div>
                      <b>{meal.name}</b>
                      <i>
                        {meal.kcal.toLocaleString()} kcal · {meal.proteinG} g protein
                      </i>
                    </div>
                    <p>{meal.build}</p>
                  </li>
                ))}
              </ul>
            </div>

            {plan.milestones.length > 1 ? (
              <div className="tool-milestones">
                <p className="tool-field-label">Projected path</p>
                <ul>
                  {plan.milestones.map((m) => (
                    <li key={m.week}>
                      <span>{m.week === 0 ? "Now" : `Week ${m.week}`}</span>
                      <b>{fmtW(m.weightKg)}</b>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {plan.warnings.map((warning) => (
              <ToolNote
                key={warning.id}
                strength={warning.severity === "caution" ? "Caution" : "Context"}
              >
                {warning.text}
              </ToolNote>
            ))}

            <p className="tool-cross-link">
              Protein is the macronutrient that protects muscle while you lose fat.{" "}
              <Link href="/tools/protein-needs">See the evidence on protein targets ↗</Link>
            </p>
          </>
        ) : null}
      </ResultPanel>
    </div>
  );
}
