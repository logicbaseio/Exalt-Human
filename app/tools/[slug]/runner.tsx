"use client";

import {
  GripStrengthTool,
  Vo2MaxTool,
  LifestyleAgeTool,
} from "../calc-longevity";
import { WaistHeightTool, EnergyMacrosTool, ProteinTool } from "../calc-body";
import { SleepTool } from "../calc-sleep";

/** Maps a tool slug to its interactive component. */
export function ToolRunner({ slug }: { slug: string }) {
  switch (slug) {
    case "grip-strength-percentile":
      return <GripStrengthTool />;
    case "vo2-max-estimator":
      return <Vo2MaxTool />;
    case "waist-to-height-ratio":
      return <WaistHeightTool />;
    case "energy-and-macros":
      return <EnergyMacrosTool />;
    case "protein-needs":
      return <ProteinTool />;
    case "sleep-calculator":
      return <SleepTool />;
    case "lifestyle-age":
      return <LifestyleAgeTool />;
    default:
      return null;
  }
}
