"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  gripPercentile,
  vo2FromWalk,
  vo2FromHeartRate,
  vo2FromCooper,
  vo2Percentile,
  estimatedMaxHr,
  lbToKg,
  SARCOPENIA_CUTOFF,
  type Sex,
} from "@/lib/tool-math";
import {
  lifestyleAge,
  LIFESTYLE_FACTORS,
  FACTOR_ACTIONS,
  type LifestyleFactorId,
} from "@/lib/tool-lifestyle";
import {
  Field,
  NumberInput,
  Segmented,
  Toggle,
  ResultHero,
  ResultStats,
  PercentileBar,
  ResultPanel,
  ToolNote,
  num,
} from "./ui";

const SEXES = [
  { id: "male" as Sex, label: "Male" },
  { id: "female" as Sex, label: "Female" },
];

/* ================================================================== *
 * Grip strength percentile
 * ================================================================== */

export function GripStrengthTool() {
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState("");
  const [grip, setGrip] = useState("");
  const [unit, setUnit] = useState<"kg" | "lb">("kg");

  const ageN = num(age);
  const gripRaw = num(grip);
  const gripKg = gripRaw === null ? null : unit === "kg" ? gripRaw : lbToKg(gripRaw);
  const ready = ageN !== null && ageN >= 18 && ageN <= 100 && gripKg !== null && gripKg > 0;

  const result = useMemo(
    () => (ready ? gripPercentile(gripKg!, ageN!, sex) : null),
    [ready, gripKg, ageN, sex],
  );

  return (
    <div className="tool-layout">
      <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
        <Field label="Sex">
          <Segmented options={SEXES} value={sex} onChange={setSex} ariaLabel="Sex" />
        </Field>
        <Field label="Age" suffix="years">
          <NumberInput value={age} onChange={setAge} min={18} max={100} placeholder="45" />
        </Field>
        <Field label="Measurement unit">
          <Segmented
            options={[
              { id: "kg" as const, label: "Kilograms" },
              { id: "lb" as const, label: "Pounds" },
            ]}
            value={unit}
            onChange={setUnit}
            ariaLabel="Measurement unit"
          />
        </Field>
        <Field
          label="Best grip reading"
          suffix={unit}
          hint="Use your stronger hand. Squeeze the dynamometer as hard as you can, arm at your side, and take the best of three attempts."
        >
          <NumberInput
            value={grip}
            onChange={setGrip}
            min={1}
            max={unit === "kg" ? 120 : 260}
            step={0.5}
            placeholder={unit === "kg" ? "42" : "92"}
          />
        </Field>
      </form>

      <ResultPanel
        ready={!!result}
        emptyMessage="Enter your age and a grip reading to see where you sit against published norms."
      >
        {result ? (
          <>
            <ResultHero
              value={`${result.percentile}`}
              unit="th percentile"
              band={result.band}
              caption={`The average for your age and sex is about ${result.ageMean} kg.`}
            />
            <PercentileBar percentile={result.percentile} lowLabel="Weaker" highLabel="Stronger" />
            <ResultStats
              stats={[
                {
                  label: "Your reading",
                  value: `${Math.round(gripKg! * 10) / 10} kg`,
                  note: unit === "lb" ? `${grip} lb converted` : undefined,
                },
                {
                  label: "Age-group average",
                  value: `${result.ageMean} kg`,
                },
                {
                  label: "Strength age",
                  value: `${result.strengthAge}+`,
                  note: "The age group whose average your grip matches.",
                },
              ]}
            />

            {result.belowClinicalCutoff ? (
              <ToolNote strength="Established">
                This reading falls below the EWGSOP2 clinical cut-point for low
                strength ({SARCOPENIA_CUTOFF[sex]} kg for {sex === "male" ? "men" : "women"}),
                which is used as a criterion for probable sarcopenia. That does
                not diagnose anything on its own, but it is worth raising with a
                clinician, particularly alongside unintended weight loss or falls.
              </ToolNote>
            ) : (
              <ToolNote strength="Context">
                Grip predicts risk at the population level; it does not cause it.
                The useful response to a low reading is building whole-body
                strength, not training your hand in isolation.
              </ToolNote>
            )}
          </>
        ) : null}
      </ResultPanel>
    </div>
  );
}

/* ================================================================== *
 * VO2 max estimator
 * ================================================================== */

type Vo2Method = "walk" | "resting" | "cooper";

export function Vo2MaxTool() {
  const [method, setMethod] = useState<Vo2Method>("resting");
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [walkMinutes, setWalkMinutes] = useState("");
  const [walkHr, setWalkHr] = useState("");
  const [restingHr, setRestingHr] = useState("");
  const [cooperMeters, setCooperMeters] = useState("");

  const ageN = num(age);
  const vo2 = useMemo(() => {
    if (ageN === null || ageN < 15 || ageN > 100) return null;
    if (method === "resting") {
      const rhr = num(restingHr);
      if (rhr === null || rhr < 30 || rhr > 120) return null;
      return vo2FromHeartRate({ age: ageN, restingHr: rhr });
    }
    if (method === "cooper") {
      const m = num(cooperMeters);
      if (m === null || m < 400 || m > 5000) return null;
      return vo2FromCooper(m);
    }
    const w = num(weight);
    const mins = num(walkMinutes);
    const hr = num(walkHr);
    if (w === null || mins === null || hr === null) return null;
    if (mins < 5 || mins > 40 || hr < 60 || hr > 220) return null;
    return vo2FromWalk({ weightKg: w, age: ageN, sex, minutes: mins, heartRate: hr });
  }, [method, ageN, sex, weight, walkMinutes, walkHr, restingHr, cooperMeters]);

  const context = useMemo(
    () => (vo2 !== null && ageN !== null ? vo2Percentile(vo2, ageN, sex) : null),
    [vo2, ageN, sex],
  );

  return (
    <div className="tool-layout">
      <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
        <Field label="Method">
          <Segmented
            options={[
              { id: "resting" as Vo2Method, label: "Resting heart rate", detail: "Fastest, no test needed" },
              { id: "walk" as Vo2Method, label: "One-mile walk", detail: "Rockport test" },
              { id: "cooper" as Vo2Method, label: "12-minute run", detail: "Cooper test" },
            ]}
            value={method}
            onChange={setMethod}
            ariaLabel="Estimation method"
          />
        </Field>

        <Field label="Sex">
          <Segmented options={SEXES} value={sex} onChange={setSex} ariaLabel="Sex" />
        </Field>
        <Field label="Age" suffix="years">
          <NumberInput value={age} onChange={setAge} min={15} max={100} placeholder="40" />
        </Field>

        {method === "resting" ? (
          <Field
            label="Resting heart rate"
            suffix="bpm"
            hint="Measure first thing in the morning, before getting out of bed, or take the lowest overnight value from a wearable."
          >
            <NumberInput value={restingHr} onChange={setRestingHr} min={30} max={120} placeholder="58" />
          </Field>
        ) : null}

        {method === "walk" ? (
          <>
            <Field label="Bodyweight" suffix="kg">
              <NumberInput value={weight} onChange={setWeight} min={30} max={250} placeholder="78" />
            </Field>
            <Field
              label="Time for one mile"
              suffix="minutes"
              hint="Walk one mile (1.61 km) as fast as you can without running, on flat ground."
            >
              <NumberInput value={walkMinutes} onChange={setWalkMinutes} min={5} max={40} step={0.1} placeholder="14.5" />
            </Field>
            <Field
              label="Heart rate at the finish"
              suffix="bpm"
              hint="Take it immediately as you stop."
            >
              <NumberInput value={walkHr} onChange={setWalkHr} min={60} max={220} placeholder="130" />
            </Field>
          </>
        ) : null}

        {method === "cooper" ? (
          <Field
            label="Distance in 12 minutes"
            suffix="metres"
            hint="Run as far as you can in exactly twelve minutes, ideally on a track."
          >
            <NumberInput value={cooperMeters} onChange={setCooperMeters} min={400} max={5000} step={10} placeholder="2400" />
          </Field>
        ) : null}
      </form>

      <ResultPanel
        ready={vo2 !== null && !!context}
        emptyMessage="Choose a method and fill in the fields to estimate your VO2 max."
      >
        {vo2 !== null && context ? (
          <>
            <ResultHero
              value={vo2}
              unit="ml/kg/min"
              band={context.band}
              caption={`Roughly the ${context.percentile}th percentile for your age and sex.`}
            />
            <PercentileBar percentile={context.percentile} lowLabel="Lower fitness" highLabel="Higher fitness" />
            <ResultStats
              stats={[
                { label: "Age-group average", value: `${context.ageMean} ml/kg/min` },
                {
                  label: "Estimated max heart rate",
                  value: `${estimatedMaxHr(ageN!)} bpm`,
                  note: "Tanaka formula: 208 − 0.7 × age.",
                },
                {
                  label: "Method",
                  value:
                    method === "resting" ? "HR ratio" : method === "walk" ? "Rockport walk" : "Cooper run",
                },
              ]}
            />
            <ToolNote strength="Context">
              Field estimates differ from laboratory testing, sometimes by
              several ml/kg/min. The trend in your own repeated results is more
              informative than the absolute number.
            </ToolNote>
          </>
        ) : null}
      </ResultPanel>
    </div>
  );
}

/* ================================================================== *
 * Lifestyle age
 * ================================================================== */

export function LifestyleAgeTool() {
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState("");
  const [factors, setFactors] = useState<Record<LifestyleFactorId, boolean>>({
    nonsmoker: false,
    healthyWeight: false,
    activity: false,
    alcohol: false,
    diet: false,
  });

  const ageN = num(age);
  const ready = ageN !== null && ageN >= 18 && ageN <= 100;
  const result = useMemo(
    () => (ready ? lifestyleAge({ age: ageN!, sex, factors }) : null),
    [ready, ageN, sex, factors],
  );

  const set = (id: LifestyleFactorId) => (next: boolean) =>
    setFactors((prev) => ({ ...prev, [id]: next }));

  return (
    <div className="tool-layout">
      <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
        <Field label="Sex">
          <Segmented options={SEXES} value={sex} onChange={setSex} ariaLabel="Sex" />
        </Field>
        <Field label="Age" suffix="years">
          <NumberInput value={age} onChange={setAge} min={18} max={100} placeholder="42" />
        </Field>

        <div className="tool-factor-list">
          <p className="tool-field-label">The five low-risk factors</p>
          {LIFESTYLE_FACTORS.map((factor) => (
            <Toggle
              key={factor.id}
              checked={factors[factor.id]}
              onChange={set(factor.id)}
              label={factor.question}
              detail={factor.detail}
            />
          ))}
        </div>
      </form>

      <ResultPanel
        ready={!!result}
        emptyMessage="Enter your age, then mark the factors that apply to you."
      >
        {result ? (
          <>
            <ResultHero
              value={result.lifestyleAge}
              unit=" years"
              band={result.band}
              caption={
                result.yearsVsTypical === 0
                  ? "Your habits sit around the cohort's typical pattern, so your lifestyle age matches your actual age."
                  : result.yearsVsTypical > 0
                    ? `Your habits track ${Math.abs(result.yearsVsTypical)} years better than a typical pattern.`
                    : `Your habits track ${Math.abs(result.yearsVsTypical)} years worse than a typical pattern.`
              }
            />
            <ResultStats
              stats={[
                { label: "Actual age", value: `${ageN} years` },
                {
                  label: "Low-risk factors",
                  value: `${result.factorCount} of 5`,
                },
                {
                  label: "Life expectancy at 50",
                  value: `${result.lifeExpectancyAt50} more years`,
                  note: "As observed for this factor count in the source cohort.",
                },
              ]}
            />

            {result.missing.length ? (
              <div className="tool-actions">
                <p className="tool-field-label">Where the remaining years are</p>
                <ul>
                  {result.missing.map((id) => (
                    <li key={id}>
                      <b>{LIFESTYLE_FACTORS.find((f) => f.id === id)?.label}</b>
                      <span>{FACTOR_ACTIONS[id]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <ToolNote strength="Context">
              This is not a biological age measurement. It applies group-level
              findings from a large cohort study to your answers. Cohort results
              describe averages across tens of thousands of people and cannot
              predict what happens to any one person. For a measured estimate of
              biological ageing you need laboratory testing, such as an
              epigenetic clock.
            </ToolNote>

            <p className="tool-cross-link">
              Curious what strength has to do with this?{" "}
              <Link href="/articles/grip-strength-predicts-lifespan">
                Read the grip strength research ↗
              </Link>
            </p>
          </>
        ) : null}
      </ResultPanel>
    </div>
  );
}
