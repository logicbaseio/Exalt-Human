"use client";

import { useId } from "react";

/* ------------------------------------------------------------------ *
 * Shared form primitives for the tools. Deliberately plain: the styling
 * lives in globals.css alongside the rest of the site.
 * ------------------------------------------------------------------ */

export function Field({
  label,
  hint,
  suffix,
  children,
}: {
  label: string;
  hint?: string;
  suffix?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="tool-field">
      <span className="tool-field-label">
        {label}
        {suffix ? <i>{suffix}</i> : null}
      </span>
      {children}
      {hint ? <span className="tool-field-hint">{hint}</span> : null}
    </label>
  );
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder,
}: {
  value: string;
  onChange: (next: string) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}) {
  return (
    <input
      className="tool-input"
      type="number"
      inputMode="decimal"
      value={value}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

/**
 * Two inputs that read as one measurement, for heights in feet and inches.
 * Entering 5 ft 11 in is how most people who use imperial actually know their
 * height, so asking for 71 inches is a needless conversion for them to do.
 */
export function PairedInput({
  first,
  second,
}: {
  first: { value: string; onChange: (next: string) => void; unit: string; placeholder?: string; max?: number };
  second: { value: string; onChange: (next: string) => void; unit: string; placeholder?: string; max?: number };
}) {
  return (
    <span className="tool-paired">
      {[first, second].map((part, index) => (
        <span key={part.unit}>
          <input
            className="tool-input"
            type="number"
            inputMode="decimal"
            value={part.value}
            min={0}
            max={part.max}
            step={index === 0 ? 1 : 0.5}
            placeholder={part.placeholder}
            aria-label={part.unit}
            onChange={(event) => part.onChange(event.target.value)}
          />
          <i>{part.unit}</i>
        </span>
      ))}
    </span>
  );
}

/**
 * The BMI band table, with a marker that slides to the band the reader lands
 * in. The marker is one absolutely positioned element moved by row index
 * rather than an icon re-rendered inside the active row, so crossing a
 * boundary animates instead of jumping.
 */
export function BandChart({
  rows,
  activeIndex,
  caption,
}: {
  rows: { label: string; range: string }[];
  activeIndex: number;
  caption?: string;
}) {
  return (
    <div className="band-chart">
      <div className="band-chart-head">
        <span>Category</span>
        <span>BMI range</span>
      </div>
      <div className="band-chart-rows">
        {/*
          The row index is written into the transform here rather than passed
          to the stylesheet as a custom property. Transitioning a transform
          that resolves through an unregistered custom property is not
          reliable across engines, and an inline value sidesteps the question
          entirely: each render emits a distinct transform, which is exactly
          what the transition needs.
        */}
        <span
          className="band-chart-marker"
          aria-hidden="true"
          style={{
            transform: `translateY(calc(${Math.max(activeIndex, 0)} * var(--band-row-h)))`,
          }}
        />
        {rows.map((row, index) => (
          <div
            key={row.label}
            className={index === activeIndex ? "is-active" : undefined}
            aria-current={index === activeIndex ? "true" : undefined}
          >
            <span>{row.label}</span>
            <span>{row.range}</span>
          </div>
        ))}
      </div>
      {caption ? <p className="band-chart-caption">{caption}</p> : null}
    </div>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { id: T; label: string; detail?: string }[];
  value: T;
  onChange: (next: T) => void;
  ariaLabel: string;
}) {
  return (
    <div className="tool-segmented" role="radiogroup" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={value === option.id}
          className={value === option.id ? "is-active" : undefined}
          onClick={() => onChange(option.id)}
        >
          <b>{option.label}</b>
          {option.detail ? <span>{option.detail}</span> : null}
        </button>
      ))}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  detail,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  detail?: string;
}) {
  const id = useId();
  return (
    <div className={`tool-toggle${checked ? " is-on" : ""}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <label htmlFor={id}>
        <b>{label}</b>
        {detail ? <span>{detail}</span> : null}
      </label>
    </div>
  );
}

/** The headline number of a result. */
export function ResultHero({
  value,
  unit,
  caption,
  band,
}: {
  value: string | number;
  unit?: string;
  caption: string;
  band?: string;
}) {
  return (
    <div className="tool-result-hero">
      {band ? <span className="tool-band">{band}</span> : null}
      <p className="tool-result-value">
        {value}
        {unit ? <i>{unit}</i> : null}
      </p>
      <p className="tool-result-caption">{caption}</p>
    </div>
  );
}

/** A row of supporting figures under the hero. */
export function ResultStats({
  stats,
}: {
  stats: { label: string; value: string; note?: string }[];
}) {
  return (
    <dl className="tool-stats">
      {stats.map((stat) => (
        <div key={stat.label}>
          <dt>{stat.label}</dt>
          <dd>{stat.value}</dd>
          {stat.note ? <p>{stat.note}</p> : null}
        </div>
      ))}
    </dl>
  );
}

/** Horizontal percentile track. */
export function PercentileBar({
  percentile,
  lowLabel = "Lower",
  highLabel = "Higher",
}: {
  percentile: number;
  lowLabel?: string;
  highLabel?: string;
}) {
  return (
    <div className="tool-percentile">
      <div className="tool-percentile-track">
        <span
          className="tool-percentile-marker"
          style={{ left: `${Math.min(Math.max(percentile, 1), 99)}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="tool-percentile-scale">
        <span>{lowLabel}</span>
        <span>50th</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}

/** An evidence-note callout, matching the article component. */
export function ToolNote({
  strength = "Context",
  children,
}: {
  strength?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="tool-note">
      <span>Evidence note · {strength}</span>
      <p>{children}</p>
    </aside>
  );
}

/** Wrapper that hides results until the form is valid. */
export function ResultPanel({
  ready,
  emptyMessage,
  children,
}: {
  ready: boolean;
  emptyMessage: string;
  children: React.ReactNode;
}) {
  if (!ready) {
    return (
      <div className="tool-result tool-result-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }
  return <div className="tool-result">{children}</div>;
}

/** Parse a form string into a number, returning null when unusable. */
export function num(value: string): number | null {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
