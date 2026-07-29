"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { bedtimesForWake, sleepDebt, SLEEP_CYCLE_MIN } from "@/lib/tool-math";
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

type Mode = "bedtime" | "debt";

function formatClock(value: string) {
  const [h, m] = value.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function SleepTool() {
  const [mode, setMode] = useState<Mode>("bedtime");

  // Bedtime planner
  const [wake, setWake] = useState("06:30");

  // Sleep debt
  const [weeknight, setWeeknight] = useState("");
  const [weekend, setWeekend] = useState("");
  const [target, setTarget] = useState("7.5");

  const bedtimes = useMemo(() => bedtimesForWake(wake), [wake]);

  const weeknightN = num(weeknight);
  const weekendN = num(weekend);
  const targetN = num(target) ?? 7.5;
  const debtReady =
    weeknightN !== null &&
    weekendN !== null &&
    weeknightN >= 0 &&
    weeknightN <= 14 &&
    weekendN >= 0 &&
    weekendN <= 14;

  const debt = useMemo(
    () => (debtReady ? sleepDebt(weeknightN!, weekendN!, targetN) : null),
    [debtReady, weeknightN, weekendN, targetN],
  );

  return (
    <div className="tool-layout">
      <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
        <Field label="What do you want to work out?">
          <Segmented
            options={[
              { id: "bedtime" as Mode, label: "Ideal bedtime", detail: "Work back from your wake time" },
              { id: "debt" as Mode, label: "Sleep debt", detail: "What your week is costing you" },
            ]}
            value={mode}
            onChange={setMode}
            ariaLabel="Mode"
          />
        </Field>

        {mode === "bedtime" ? (
          <Field
            label="When do you need to wake up?"
            hint={`Each option is a whole number of ${SLEEP_CYCLE_MIN}-minute cycles, plus 15 minutes to fall asleep.`}
          >
            <input
              className="tool-input"
              type="time"
              value={wake}
              onChange={(event) => setWake(event.target.value)}
            />
          </Field>
        ) : (
          <>
            <Field label="Weeknight sleep" suffix="hours" hint="Your typical Monday to Friday night.">
              <NumberInput value={weeknight} onChange={setWeeknight} min={0} max={14} step={0.25} placeholder="6.5" />
            </Field>
            <Field label="Weekend sleep" suffix="hours" hint="Your typical Saturday and Sunday night.">
              <NumberInput value={weekend} onChange={setWeekend} min={0} max={14} step={0.25} placeholder="8.5" />
            </Field>
            <Field label="Your target" suffix="hours" hint="Adult consensus guidance is 7 or more hours a night.">
              <NumberInput value={target} onChange={setTarget} min={6} max={10} step={0.25} placeholder="7.5" />
            </Field>
          </>
        )}
      </form>

      {mode === "bedtime" ? (
        <ResultPanel ready={bedtimes.length > 0} emptyMessage="Choose a wake time.">
          <div className="tool-bedtimes">
            <p className="tool-field-label">To wake at {formatClock(wake)}, fall asleep by</p>
            <ul>
              {bedtimes.map((option) => (
                <li key={option.cycles} className={option.recommended ? "is-recommended" : undefined}>
                  <b>{formatClock(option.time)}</b>
                  <span>
                    {option.cycles} cycles · {option.hours} hours
                  </span>
                  {option.recommended ? <i>Meets adult guidance</i> : <i>Below 7 hours</i>}
                </li>
              ))}
            </ul>
          </div>
          <ToolNote strength="Context">
            The 90-minute cycle is a planning average, not a fixed constant.
            Real cycles vary between people and lengthen across the night, so
            treat these as sensible targets rather than precise timings. Going
            to bed at a consistent time matters more than hitting an exact
            minute.
          </ToolNote>
        </ResultPanel>
      ) : (
        <ResultPanel
          ready={!!debt}
          emptyMessage="Enter your typical weeknight and weekend sleep to see your weekly debt."
        >
          {debt ? (
            <>
              <ResultHero
                value={debt.debt}
                unit=" hours"
                band={
                  debt.status === "on track"
                    ? "On track"
                    : debt.status === "mild"
                      ? "Mild debt"
                      : "Significant debt"
                }
                caption={
                  debt.debt === 0
                    ? "Your week meets the target you set."
                    : `You are short by about ${debt.perNightShortfall} hours every night, which accumulates across the week.`
                }
              />
              <ResultStats
                stats={[
                  { label: "Actual weekly sleep", value: `${debt.weeklyActual} hours` },
                  { label: "Target weekly sleep", value: `${debt.weeklyTarget} hours` },
                  {
                    label: "Nightly shortfall",
                    value: `${debt.perNightShortfall} hours`,
                  },
                ]}
              />
              <ToolNote strength="Established">
                Adult consensus guidance is 7 or more hours a night on a regular
                basis. Weekend catch-up sleep recovers some but not all of the
                deficit, and a large weekday-to-weekend swing in timing is its
                own disruption to circadian rhythm.
              </ToolNote>
              <p className="tool-cross-link">
                <Link href="/articles/sleep-is-the-foundation">
                  Read why sleep sits upstream of everything else ↗
                </Link>
              </p>
            </>
          ) : null}
        </ResultPanel>
      )}
    </div>
  );
}
