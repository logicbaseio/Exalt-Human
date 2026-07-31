/**
 * Regression suite for the tool calculations.
 *
 * These are health calculations that members of the public act on, so every
 * published constant is pinned to its source value here and every safety
 * guard rail is proven across the input space rather than spot-checked.
 *
 * Run with:  npm run test:tools
 *
 * Previous versions of this suite lived in a scratch directory and were lost
 * when it was cleared. It belongs in the repository.
 */

import {
  gripPercentile,
  vo2Percentile,
  vo2FromWalk,
  vo2FromHeartRate,
  vo2FromCooper,
  waistToHeight,
  WAIST_THRESHOLDS,
  bmrMifflinStJeor,
  energyAndMacros,
  ENERGY_FLOOR,
  LACTATION_KCAL,
  proteinNeeds,
  bedtimesForWake,
  sleepDebt,
  inToCm,
  lbToKg,
  SARCOPENIA_CUTOFF,
} from "../lib/tool-math";
import { calculateBmi, bandsFor } from "../lib/tool-bmi";
import {
  buildPlan,
  CALORIE_FLOOR,
  MAX_DEFICIT_FRACTION,
  MAX_LOSS_KG_PER_WEEK_LACTATING,
} from "../lib/tool-plan";
import { lifestyleAge } from "../lib/tool-lifestyle";
import { TOOLS } from "../lib/tools";

let passed = 0;
const failures: string[] = [];

function check(name: string, condition: boolean, detail = "") {
  if (condition) {
    passed += 1;
  } else {
    failures.push(`${name}${detail ? `  -> ${detail}` : ""}`);
  }
}

const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

/* ================================================================== *
 * BMI: worked examples published by CDC and NHS
 * ================================================================== */

check(
  "CDC worked example 68in/200lb = 30.4",
  near(calculateBmi({ weightKg: lbToKg(200), heightCm: inToCm(68) }).bmi, 30.4, 0.05),
);
check(
  "NHS worked example 70kg/1.70m = 24.2",
  near(calculateBmi({ weightKg: 70, heightCm: 170 }).bmi, 24.2, 0.05),
);
check(
  "reference screenshot 5ft11/180.77lb = 25.2 Overweight",
  near(calculateBmi({ weightKg: lbToKg(180.77), heightCm: inToCm(71) }).bmi, 25.2, 0.06) &&
    calculateBmi({ weightKg: lbToKg(180.77), heightCm: inToCm(71) }).category === "Overweight",
);

// Bands are [min, max): 25.0 is Overweight, not the top of Healthy.
const atBmi = (bmi: number, standard?: "who" | "lower") =>
  calculateBmi({ weightKg: bmi * 1.75 * 1.75, heightCm: 175, standard }).category;
check("bmi 18.5 -> Healthy", atBmi(18.5) === "Healthy weight");
check("bmi 24.9 -> Healthy", atBmi(24.9) === "Healthy weight");
check("bmi 25.0 -> Overweight", atBmi(25) === "Overweight");

/*
 * The category is derived from the BMI as displayed, to one decimal place,
 * not from the raw quotient. That is deliberate: a true 24.96 displays as
 * 25.0, and showing "25.0 - Healthy weight" would read as a bug to anyone
 * looking at it. The number on screen and the label must always agree.
 */
{
  let consistent = true;
  let detail = "";
  for (let w = 40; w <= 200; w += 0.37) {
    const r = calculateBmi({ weightKg: w, heightCm: 175 });
    const fromDisplayed = calculateBmi({ weightKg: r.bmi * 1.75 * 1.75, heightCm: 175 }).category;
    if (fromDisplayed !== r.category) {
      consistent = false;
      detail = `${w}kg shows ${r.bmi} as ${r.category}`;
    }
  }
  check("displayed BMI and category always agree", consistent, detail);
}
check("bmi 30.0 -> class I", atBmi(30) === "Obesity class I");
check("bmi 40.0 -> class III", atBmi(40) === "Obesity class III");
// NICE NG246 lower thresholds
check("lower: 22.9 -> Healthy", atBmi(22.9, "lower") === "Healthy weight");
check("lower: 23.0 -> Overweight", atBmi(23, "lower") === "Overweight");
check("lower: 27.5 -> class I", atBmi(27.5, "lower") === "Obesity class I");
check("lower band set has 6 bands", bandsFor("lower").length === 6);

// Healthy-range back-calculation must itself land inside the healthy band.
for (const h of [140, 160, 180, 200, 210]) {
  const r = calculateBmi({ weightKg: 70, heightCm: h });
  const lo = calculateBmi({ weightKg: r.healthyRangeKg.low, heightCm: h }).bmi;
  const hi = calculateBmi({ weightKg: r.healthyRangeKg.high, heightCm: h }).bmi;
  check(`healthy range endpoints valid at ${h}cm`, lo >= 18.4 && hi <= 25.05, `${lo}/${hi}`);
}

/* ================================================================== *
 * Grip: Dodds et al. 2014 published centiles
 * ================================================================== */

const DODDS_MEDIAN = {
  male: [[20, 40], [30, 51], [40, 50], [50, 48], [60, 45], [70, 39], [80, 32]],
  female: [[20, 28], [30, 31], [40, 31], [50, 29], [60, 27], [70, 24], [80, 19]],
} as const;

for (const sex of ["male", "female"] as const) {
  for (const [age, median] of DODDS_MEDIAN[sex]) {
    const r = gripPercentile(median, age, sex);
    check(`grip ${sex} ${age}: median -> 50th`, near(r.percentile, 50, 0.6), String(r.percentile));
    check(`grip ${sex} ${age}: ageMean is published median`, r.ageMean === median);
  }
}

// Published 10th/90th centiles at the three ages where they are given.
const DODDS_TAILS = {
  male: [[20, 30, 52], [50, 35, 60], [80, 23, 42]],
  female: [[20, 21, 36], [50, 21, 37], [80, 13, 26]],
} as const;
for (const sex of ["male", "female"] as const) {
  for (const [age, p10, p90] of DODDS_TAILS[sex]) {
    check(`grip ${sex} ${age}: P10 -> ~10th`, near(gripPercentile(p10, age, sex).percentile, 10, 2));
    check(`grip ${sex} ${age}: P90 -> ~90th`, near(gripPercentile(p90, age, sex).percentile, 90, 2));
  }
}

/*
 * Independent validation. Dodds separately reports weak-grip prevalence at
 * age 80 of 23% (men) and 27% (women), where weak is 2.5 SD below the
 * sex-specific peak mean (51.9/9.9 men, 31.4/6.1 women). The reconstructed
 * distribution was not fitted to these figures, so agreement is meaningful.
 */
check(
  "grip age-80 male weak prevalence ~23%",
  near(gripPercentile(51.9 - 2.5 * 9.9, 80, "male").percentile, 23, 4),
  String(gripPercentile(51.9 - 2.5 * 9.9, 80, "male").percentile),
);
check(
  "grip age-80 female weak prevalence ~27%",
  near(gripPercentile(31.4 - 2.5 * 6.1, 80, "female").percentile, 27, 4),
  String(gripPercentile(31.4 - 2.5 * 6.1, 80, "female").percentile),
);

check("grip interpolates between decades", gripPercentile(45, 44, "male").ageMean !== gripPercentile(45, 40, "male").ageMean);
check("grip strengthAge reads declining limb", gripPercentile(51, 30, "male").strengthAge === 30);
check("grip no impossible 100th", gripPercentile(120, 45, "male").percentileLabel === "Top 5%");
check("grip no impossible 0th", gripPercentile(1, 80, "female").percentileLabel === "Bottom 5%");
check("EWGSOP2 cut-points 27/16", SARCOPENIA_CUTOFF.male === 27 && SARCOPENIA_CUTOFF.female === 16);

/* ================================================================== *
 * VO2 max: FRIEND reference standards and the published equations
 * ================================================================== */

const FRIEND = {
  male: [[25, 40.1, 48.0, 55.2], [35, 35.9, 42.4, 49.2], [45, 31.9, 37.8, 45.0], [55, 27.1, 32.6, 39.7], [65, 23.7, 28.2, 34.5], [75, 20.4, 24.4, 30.4]],
  female: [[25, 30.5, 37.6, 44.7], [35, 25.3, 30.2, 36.1], [45, 22.1, 26.7, 32.4], [55, 19.9, 23.4, 27.6], [65, 17.2, 20.0, 23.8], [75, 15.6, 18.3, 20.8]],
} as const;

for (const sex of ["male", "female"] as const) {
  for (const [age, p25, p50, p75] of FRIEND[sex]) {
    check(`vo2 ${sex} ${age}: P25 exact`, near(vo2Percentile(p25, age, sex).percentile, 25, 0.6));
    check(`vo2 ${sex} ${age}: median exact`, near(vo2Percentile(p50, age, sex).percentile, 50, 0.6));
    check(`vo2 ${sex} ${age}: P75 exact`, near(vo2Percentile(p75, age, sex).percentile, 75, 0.6));
  }
}
// Equations, hand-computed from the source papers.
check(
  "Rockport equation",
  near(vo2FromWalk({ weightKg: 78, age: 40, sex: "male", minutes: 14.5, heartRate: 130 }),
    132.853 - 0.0769 * (78 * 2.2046226218) - 0.3877 * 40 + 6.315 - 3.2649 * 14.5 - 0.1565 * 130, 0.11),
);
check("Uth equation", near(vo2FromHeartRate({ age: 40, restingHr: 58 }), 15.3 * ((208 - 0.7 * 40) / 58), 0.06));
check("Cooper equation", near(vo2FromCooper(2400), (2400 - 504.9) / 44.73, 0.06));

/* ================================================================== *
 * Waist: ratio is sex-neutral, WHO circumference cut-offs are not
 * ================================================================== */

check("WHO men 94/102", WAIST_THRESHOLDS.male.increased === 94 && WAIST_THRESHOLDS.male.high === 102);
check("WHO women 80/88", WAIST_THRESHOLDS.female.increased === 80 && WAIST_THRESHOLDS.female.high === 88);
{
  const m = waistToHeight(91.44, 180.5, "male");
  const w = waistToHeight(91.44, 180.5, "female");
  check("ratio identical across sex", m.ratio === w.ratio && m.category === w.category);
  check("half-height target identical across sex", m.halfHeightCm === w.halfHeightCm);
  check("waist status differs by sex", m.waistStatus.startsWith("Below") && w.waistStatus.includes("substantially"));
}
check("ratio 0.5 -> Increased", waistToHeight(80, 160, "female").category === "Increased");
check("ratio 0.6 -> Further increased", waistToHeight(96, 160, "male").category === "Further increased");
check("ratio <0.4 -> Low", waistToHeight(63, 160, "male").category === "Low");

/* ================================================================== *
 * Energy and macros: gates, floor, and macro reconciliation
 * ================================================================== */

const eBase = { weightKg: 70, heightCm: 170, age: 35, sex: "female" as const, activity: "light" as const };
check("energy under-18 blocked", energyAndMacros({ ...eBase, age: 15, goal: "lose" }).blocked === "under-18");
check("energy underweight deficit blocked", energyAndMacros({ ...eBase, weightKg: 45, goal: "lose" }).blocked === "underweight-deficit");
check("energy underweight maintain allowed", energyAndMacros({ ...eBase, weightKg: 45, goal: "maintain" }).blocked === null);
check("energy pregnant blocked", energyAndMacros({ ...eBase, goal: "maintain", perinatal: "pregnant" }).blocked === "pregnant");
check(
  "energy breastfeeding adds lactation energy",
  energyAndMacros({ ...eBase, goal: "maintain", perinatal: "breastfeeding" }).tdee -
    energyAndMacros({ ...eBase, goal: "maintain" }).tdee === LACTATION_KCAL,
);
check("Mifflin-St Jeor male", bmrMifflinStJeor({ weightKg: 80, heightCm: 180, age: 30, sex: "male" }) === Math.round(10 * 80 + 6.25 * 180 - 5 * 30 + 5));

{
  let worstGap = 0;
  let floorOk = true;
  let fatOk = true;
  for (const w of [45, 60, 80, 100, 130, 170])
    for (const h of [145, 160, 175, 190, 205])
      for (const a of [18, 30, 50, 70, 90])
        for (const sex of ["male", "female"] as const)
          for (const act of ["sedentary", "light", "moderate", "high", "athlete"] as const)
            for (const goal of ["lose", "maintain", "gain"] as const) {
              const r = energyAndMacros({ weightKg: w, heightCm: h, age: a, sex, activity: act, goal });
              if (r.blocked) continue;
              worstGap = Math.max(worstGap, Math.abs(r.proteinG * 4 + r.fatG * 9 + r.carbG * 4 - r.target));
              if (goal === "lose" && r.target < ENERGY_FLOOR[sex]) floorOk = false;
              if (r.fatG * 9 < r.target * 0.195) fatOk = false;
            }
  check(`energy macro split reconciles (worst ${worstGap} kcal)`, worstGap <= 6, String(worstGap));
  check("energy floor holds across the space", floorOk);
  check("energy fat >= 20% of calories across the space", fatOk);
}

/* ================================================================== *
 * Meal planner: gates and guard rails across the input space
 * ================================================================== */

const pBase = { sex: "female" as const, age: 35, heightCm: 165, currentKg: 80, goalKg: 70, activity: "light" as const, rateKgPerWeek: 0.5 };
check("plan pregnant blocked", buildPlan({ ...pBase, perinatal: "pregnant" }).blocked === "pregnant");
check("plan pregnancy outranks under-18", buildPlan({ ...pBase, age: 15, perinatal: "pregnant" }).blocked === "pregnant");
check("plan under-18 blocked", buildPlan({ ...pBase, age: 17 }).blocked === "under-18");
check("plan already-underweight reachable", buildPlan({ ...pBase, currentKg: 45, goalKg: 43 }).blocked === "already-underweight");
check("plan goal-underweight reachable", buildPlan({ ...pBase, goalKg: 45 }).blocked === "goal-underweight");
check("plan no-change blocked", buildPlan({ ...pBase, goalKg: 80 }).blocked === "no-change");

{
  let plans = 0;
  let violations = 0;
  let detail = "";
  let olderTotal = 0;
  let olderWarned = 0;
  let bfTotal = 0;
  let bfCapOk = true;
  for (const sex of ["male", "female"] as const)
    for (const age of [18, 30, 50, 65, 85])
      for (const h of [140, 160, 180, 200])
        for (const cw of [45, 60, 80, 110, 150, 200])
          for (const d of [-45, -20, -8, 8])
            for (const act of ["sedentary", "light", "moderate", "high", "athlete"] as const)
              for (const rate of [0.1, 0.25, 0.5, 0.75, 1])
                for (const perinatal of ["none", "breastfeeding"] as const) {
                  const p = buildPlan({ sex, age, heightCm: h, currentKg: cw, goalKg: cw + d, activity: act, rateKgPerWeek: rate, perinatal });
                  if (p.blocked) continue;
                  plans += 1;
                  if (p.direction !== "lose") {
                    if (p.effectiveRateKgPerWeek > 0.251) { violations += 1; detail = "gain rate"; }
                    continue;
                  }
                  if (p.targetKcal < CALORIE_FLOOR[sex] - 0.5) { violations += 1; detail = `floor ${sex} ${cw}kg ${p.targetKcal}`; }
                  if (p.targetKcal < Math.round(p.tdeeNow * (1 - MAX_DEFICIT_FRACTION)) - 1) { violations += 1; detail = `deficit ${cw}kg`; }
                  if (p.effectiveRateKgPerWeek > Math.min(1, cw * 0.01) + 0.001) { violations += 1; detail = `rate ${cw}kg`; }
                  if (!p.warnings.some((w) => w.id === "appetite")) { violations += 1; detail = "missing appetite note"; }
                  if (age >= 65) { olderTotal += 1; if (p.warnings.some((w) => w.id === "older-adult")) olderWarned += 1; }
                  if (perinatal === "breastfeeding") {
                    bfTotal += 1;
                    if (p.effectiveRateKgPerWeek > MAX_LOSS_KG_PER_WEEK_LACTATING + 0.001) bfCapOk = false;
                    if (!p.warnings.some((w) => w.id === "breastfeeding")) bfCapOk = false;
                  }
                }
  check(`plan guard rails hold across ${plans} plans`, violations === 0, detail);
  check(`plan 65+ always warned (${olderWarned}/${olderTotal})`, olderTotal > 0 && olderWarned === olderTotal);
  check(`plan breastfeeding pace capped (${bfTotal} plans)`, bfTotal > 0 && bfCapOk);
}

// Loss must decelerate: a lighter body burns less.
{
  const p = buildPlan({ sex: "male", age: 40, heightCm: 180, currentKg: 100, goalKg: 80, activity: "light", rateKgPerWeek: 0.75 });
  const ms = p.milestones;
  check("plan projection decelerates", Math.abs(ms[ms.length - 1].weightKg - ms[ms.length - 2].weightKg) <= Math.abs(ms[1].weightKg - ms[0].weightKg) + 0.001);
}

/* ================================================================== *
 * Protein, sleep, lifestyle
 * ================================================================== */

check("protein uses reference weight above BMI 30", proteinNeeds(160, "fatloss", 170).usedReference);
check("protein uses current weight at normal BMI", proteinNeeds(70, "muscle", 178).usedReference === false);
check(
  "protein agrees with energy tool basis",
  proteinNeeds(110, "fatloss", 170).usedReference &&
    energyAndMacros({ weightKg: 110, heightCm: 170, age: 40, sex: "male", activity: "light", goal: "lose" }).proteinBasis === "healthy-range reference weight",
);

check("sleep empty time returns nothing", bedtimesForWake("").length === 0);
check("sleep garbage time returns nothing", bedtimesForWake("99:99").length === 0);
check("sleep valid time returns four options", bedtimesForWake("06:30").length === 4);
check("sleep midnight wrap 00:30 5cyc", bedtimesForWake("00:30").find((b) => b.cycles === 5)?.time === "16:45");
check("sleep 04:00 5cyc", bedtimesForWake("04:00").find((b) => b.cycles === 5)?.time === "20:15");
check("sleep debt not negative", sleepDebt(9, 9, 7.5).debt === 0);

{
  const all5 = lifestyleAge({ age: 50, sex: "male", factors: { nonsmoker: true, healthyWeight: true, activity: true, alcohol: true, diet: true } });
  const none = lifestyleAge({ age: 50, sex: "male", factors: { nonsmoker: false, healthyWeight: false, activity: false, alcohol: false, diet: false } });
  check("lifestyle male 5 factors LE 37.6", near(all5.lifeExpectancyAt50, 37.6, 0.05));
  check("lifestyle male 0 factors LE 25.5", near(none.lifeExpectancyAt50, 25.5, 0.05));
  check("lifestyle female 5 factors LE 43.1", near(lifestyleAge({ age: 50, sex: "female", factors: { nonsmoker: true, healthyWeight: true, activity: true, alcohol: true, diet: true } }).lifeExpectancyAt50, 43.1, 0.05));
  check("lifestyle endpoints flagged as reported", all5.isReportedDirectly && none.isReportedDirectly);
  check("lifestyle intermediate flagged interpolated", lifestyleAge({ age: 50, sex: "male", factors: { nonsmoker: true, healthyWeight: false, activity: false, alcohol: false, diet: false } }).isReportedDirectly === false);
  check("lifestyle no fabricated age field", !("lifestyleAge" in all5) && !("yearsVsTypical" in all5));
}

/* ================================================================== *
 * Registry integrity
 * ================================================================== */

check("nine tools registered", TOOLS.length === 9);
check("every tool has a thumbnail", TOOLS.every((t) => t.thumb.startsWith("/tools/")));
check("every tool has an explainer", TOOLS.every((t) => t.explainer.whatYouGet.length >= 3 && t.explainer.howToUse.length >= 2));
check("every tool has at least two references", TOOLS.every((t) => t.references.length >= 2));
check("every reference has a URL", TOOLS.every((t) => t.references.every((r) => r.href.startsWith("https://"))));
check("no em dashes in registry copy", !JSON.stringify(TOOLS).includes("—"));
for (const slug of ["vo2-max-estimator", "protein-needs", "meal-planner", "energy-and-macros", "bmi-calculator", "waist-to-height-ratio", "sleep-calculator"]) {
  check(`safety notice present: ${slug}`, (TOOLS.find((t) => t.slug === slug)?.safetyNotice?.body?.length ?? 0) > 80);
}
check("vo2 lists cardiac contraindications", (TOOLS.find((t) => t.slug === "vo2-max-estimator")?.safetyNotice?.doNotProceedIf?.length ?? 0) >= 6);

/* ================================================================== */

console.log(`${passed} passed, ${failures.length} failed`);
for (const f of failures) console.log(`  FAIL  ${f}`);
process.exit(failures.length ? 1 : 0);
