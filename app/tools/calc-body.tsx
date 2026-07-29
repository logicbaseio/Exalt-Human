"use client";

import { useMemo, useState } from "react";
import {
  waistToHeight,
  energyAndMacros,
  proteinNeeds,
  PROTEIN_GOALS,
  ACTIVITY_LEVELS,
  GOALS,
  inToCm,
  lbToKg,
  round,
  type Sex,
  type ActivityId,
  type GoalId,
  type ProteinGoal,
} from "@/lib/tool-math";
import {
  Field,
  NumberInput,
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
 * Waist-to-height ratio
 * ================================================================== */

export function WaistHeightTool() {
  const [units, setUnits] = useState<UnitSystem>("metric");
  const [waist, setWaist] = useState("");
  const [height, setHeight] = useState("");

  const waistRaw = num(waist);
  const heightRaw = num(height);
  const waistCm = waistRaw === null ? null : units === "metric" ? waistRaw : inToCm(waistRaw);
  const heightCm = heightRaw === null ? null : units === "metric" ? heightRaw : inToCm(heightRaw);
  const ready =
    waistCm !== null && heightCm !== null && waistCm > 20 && heightCm > 100;

  const result = useMemo(
    () => (ready ? waistToHeight(waistCm!, heightCm!) : null),
    [ready, waistCm, heightCm],
  );

  const targetWaist =
    heightCm !== null
      ? units === "metric"
        ? `${round(heightCm / 2, 1)} cm`
        : `${round(heightCm / 2 / 2.54, 1)} in`
      : "";

  return (
    <div className="tool-layout">
      <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
        <Field label="Units">
          <Segmented options={UNITS} value={units} onChange={setUnits} ariaLabel="Units" />
        </Field>
        <Field label="Height" suffix={units === "metric" ? "cm" : "in"}>
          <NumberInput
            value={height}
            onChange={setHeight}
            step={0.5}
            placeholder={units === "metric" ? "178" : "70"}
          />
        </Field>
        <Field
          label="Waist circumference"
          suffix={units === "metric" ? "cm" : "in"}
          hint="Measure at the midpoint between your lowest rib and the top of your hip bone, after breathing out normally. Do not pull the tape tight."
        >
          <NumberInput
            value={waist}
            onChange={setWaist}
            step={0.5}
            placeholder={units === "metric" ? "86" : "34"}
          />
        </Field>
      </form>

      <ResultPanel
        ready={!!result}
        emptyMessage="Enter your height and waist measurement to see your ratio."
      >
        {result ? (
          <>
            <ResultHero
              value={result.ratio.toFixed(2)}
              band={result.category}
              caption={result.note}
            />
            <ResultStats
              stats={[
                { label: "Your ratio", value: result.ratio.toFixed(2) },
                {
                  label: "Healthy boundary",
                  value: "Below 0.50",
                  note: `For your height that means a waist under ${targetWaist}.`,
                },
                {
                  label: "Category",
                  value: result.category,
                },
              ]}
            />
            <ToolNote strength="Established">
              Waist-to-height ratio tracks central body fat better than BMI,
              because it accounts for where fat sits rather than weight alone.
              It still describes one dimension of health, and it does not
              distinguish muscle from fat elsewhere on the body.
            </ToolNote>
          </>
        ) : null}
      </ResultPanel>
    </div>
  );
}

/* ================================================================== *
 * Energy expenditure and macros
 * ================================================================== */

export function EnergyMacrosTool() {
  const [units, setUnits] = useState<UnitSystem>("metric");
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState<ActivityId>("moderate");
  const [goal, setGoal] = useState<GoalId>("maintain");

  const ageN = num(age);
  const weightRaw = num(weight);
  const heightRaw = num(height);
  const weightKg = weightRaw === null ? null : units === "metric" ? weightRaw : lbToKg(weightRaw);
  const heightCm = heightRaw === null ? null : units === "metric" ? heightRaw : inToCm(heightRaw);

  const ready =
    ageN !== null &&
    ageN >= 15 &&
    ageN <= 100 &&
    weightKg !== null &&
    weightKg > 25 &&
    heightCm !== null &&
    heightCm > 100;

  const result = useMemo(
    () =>
      ready
        ? energyAndMacros({
            weightKg: weightKg!,
            heightCm: heightCm!,
            age: ageN!,
            sex,
            activity,
            goal,
          })
        : null,
    [ready, weightKg, heightCm, ageN, sex, activity, goal],
  );

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
          <NumberInput value={age} onChange={setAge} min={15} max={100} placeholder="35" />
        </Field>
        <Field label="Bodyweight" suffix={units === "metric" ? "kg" : "lb"}>
          <NumberInput
            value={weight}
            onChange={setWeight}
            step={0.5}
            placeholder={units === "metric" ? "78" : "172"}
          />
        </Field>
        <Field label="Height" suffix={units === "metric" ? "cm" : "in"}>
          <NumberInput
            value={height}
            onChange={setHeight}
            step={0.5}
            placeholder={units === "metric" ? "178" : "70"}
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
        <Field label="Goal">
          <Segmented
            options={GOALS.map((g) => ({ id: g.id, label: g.label, detail: g.detail }))}
            value={goal}
            onChange={setGoal}
            ariaLabel="Goal"
          />
        </Field>
      </form>

      <ResultPanel
        ready={!!result}
        emptyMessage="Fill in your details to estimate what your body burns."
      >
        {result?.blocked ? (
          <div className="tool-blocked">
            <span>This tool will not calculate that</span>
            <p>{result.blockedMessage}</p>
          </div>
        ) : result ? (
          <>
            <ResultHero
              value={result.target.toLocaleString()}
              unit=" kcal/day"
              band={GOALS.find((g) => g.id === goal)?.label}
              caption={`Your maintenance is about ${result.tdee.toLocaleString()} kcal a day. This target reflects your selected goal.`}
            />
            <ResultStats
              stats={[
                {
                  label: "Resting metabolism",
                  value: `${result.bmr.toLocaleString()} kcal`,
                  note: "What you burn at complete rest (Mifflin-St Jeor).",
                },
                {
                  label: "Daily burn",
                  value: `${result.tdee.toLocaleString()} kcal`,
                  note: "Resting metabolism × your activity factor.",
                },
                {
                  label: "Target",
                  value: `${result.target.toLocaleString()} kcal`,
                },
              ]}
            />

            <div className="tool-macros">
              <p className="tool-field-label">Suggested split</p>
              <div>
                <span><b>{result.proteinG} g</b>Protein</span>
                <span><b>{result.fatG} g</b>Fat</span>
                <span><b>{result.carbG} g</b>Carbohydrate</span>
              </div>
            </div>

            <ToolNote strength="Context">
              Every prediction equation here describes a population average.
              Individual resting metabolism can vary by several hundred calories
              a day from the estimate. Use this as a starting point, then adjust
              based on what your weight actually does over two to three weeks.
            </ToolNote>

            {result.proteinBasis === "healthy-range reference weight" ? (
              <ToolNote strength="Context">
                Your protein and fat targets are set from a reference weight in
                the healthy range for your height rather than your current
                weight. Applying grams per kilogram to total bodyweight
                overshoots at higher BMIs, so this is the conventional
                adjustment.
              </ToolNote>
            ) : null}

            {result.warnings.map((warning) => (
              <ToolNote
                key={warning.id}
                strength={warning.severity === "caution" ? "Caution" : "Context"}
              >
                {warning.text}
              </ToolNote>
            ))}
          </>
        ) : null}
      </ResultPanel>
    </div>
  );
}

/* ================================================================== *
 * Protein needs
 * ================================================================== */

export function ProteinTool() {
  const [units, setUnits] = useState<UnitSystem>("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [goal, setGoal] = useState<ProteinGoal>("active");

  const weightRaw = num(weight);
  const heightRaw = num(height);
  const weightKg = weightRaw === null ? null : units === "metric" ? weightRaw : lbToKg(weightRaw);
  const heightCm =
    heightRaw === null ? undefined : units === "metric" ? heightRaw : inToCm(heightRaw);
  const ready = weightKg !== null && weightKg > 25 && weightKg < 300;

  const result = useMemo(
    () => (ready ? proteinNeeds(weightKg!, goal, heightCm) : null),
    [ready, weightKg, goal, heightCm],
  );
  const row = PROTEIN_GOALS.find((g) => g.id === goal)!;

  return (
    <div className="tool-layout">
      <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
        <Field label="Units">
          <Segmented options={UNITS} value={units} onChange={setUnits} ariaLabel="Units" />
        </Field>
        <Field label="Bodyweight" suffix={units === "metric" ? "kg" : "lb"}>
          <NumberInput
            value={weight}
            onChange={setWeight}
            step={0.5}
            placeholder={units === "metric" ? "78" : "172"}
          />
        </Field>
        <Field
          label="Height (optional)"
          suffix={units === "metric" ? "cm" : "in"}
          hint="Worth adding. Above a BMI of 30, targets set per kilogram of total bodyweight overshoot, and height lets the tool use a reference weight instead."
        >
          <NumberInput
            value={height}
            onChange={setHeight}
            step={0.5}
            placeholder={units === "metric" ? "178" : "70"}
          />
        </Field>
        <Field label="Your situation">
          <Segmented
            options={PROTEIN_GOALS.map((g) => ({ id: g.id, label: g.label, detail: g.detail }))}
            value={goal}
            onChange={setGoal}
            ariaLabel="Your situation"
          />
        </Field>
      </form>

      <ResultPanel
        ready={!!result}
        emptyMessage="Enter your bodyweight to see your daily protein range."
      >
        {result ? (
          <>
            <ResultHero
              value={`${result.low}-${result.high}`}
              unit=" g/day"
              band={row.label}
              caption={
                result.usedReference
                  ? `That is ${row.low} to ${row.high} grams per kilogram, applied to a reference weight of ${result.basisWeight} kg rather than your current weight, because your BMI is ${result.bmi}.`
                  : `That is ${row.low} to ${row.high} grams per kilogram of bodyweight.`
              }
            />
            <ResultStats
              stats={[
                {
                  label: "Per meal across four",
                  value: `${result.perMeal} g`,
                  note: "Spreading intake through the day supports muscle protein synthesis.",
                },
                {
                  label: "The official RDA",
                  value: `${result.rda} g`,
                  note: "0.8 g/kg: the amount set to prevent deficiency, not to optimise.",
                },
                {
                  label: "Your range",
                  value: `${result.low}-${result.high} g`,
                },
              ]}
            />
            <ToolNote strength="Established">
              For people doing resistance training, benefits to muscle mass and
              strength plateau at roughly 1.6 g/kg per day in meta-analysis, with
              individual variation above that. The RDA of 0.8 g/kg is a floor
              designed to prevent deficiency, not a target for building muscle.
            </ToolNote>

            {result.usedReference ? (
              <ToolNote strength="Context">
                Because your BMI is {result.bmi}, this target is set from a
                reference weight in the healthy range for your height rather
                than your current weight. Applying grams per kilogram to total
                bodyweight overshoots at higher BMIs. The energy and meal
                planner tools use the same adjustment, so all three agree.
              </ToolNote>
            ) : result.bmi === null ? (
              <ToolNote strength="Context">
                Add your height for a better target. Above a BMI of 30, setting
                protein per kilogram of total bodyweight overshoots, and the
                conventional adjustment is to use a reference weight from the
                healthy range instead.
              </ToolNote>
            ) : null}
          </>
        ) : null}
      </ResultPanel>
    </div>
  );
}
