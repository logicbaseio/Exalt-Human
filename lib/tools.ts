/**
 * Registry for the Exalt Human tools.
 *
 * Each entry drives the /tools hub, the tool page shell, its metadata, and
 * the cross-link back to the research article it belongs with.
 */

export type ToolReference = {
  title: string;
  source: string;
  year: string;
  href: string;
};

/**
 * The plain-English briefing shown at the top of a tool page, so a visitor
 * knows what they are about to get before they start typing.
 */
export type ToolExplainer = {
  /** Two sentences: what this tool does for you. */
  whatItIs: string;
  /** Concrete outputs the user receives. */
  whatYouGet: string[];
  /** Short imperative steps. */
  howToUse: string[];
  /** Equipment or measurements needed. Empty when nothing is required. */
  whatYouNeed: string[];
  timeNeeded: string;
};

export type Tool = {
  slug: string;
  name: string;
  /** Short label used on the hub card. */
  category: string;
  headline: string;
  deck: string;
  /** Used for search/meta descriptions. */
  description: string;
  /** Square card thumbnail in /public/tools. */
  thumb: string;
  /** Alt text for the thumbnail. */
  thumbAlt: string;
  explainer: ToolExplainer;
  /** Slug of the research article this tool sits alongside, if any. */
  relatedArticle?: string;
  relatedArticleTitle?: string;
  /** What the tool cannot tell you. Rendered on every tool page. */
  limitation: string;
  references: ToolReference[];
};

export const TOOLS: Tool[] = [
  {
    slug: "grip-strength-percentile",
    thumb: "/tools/grip-strength-percentile.jpg",
    thumbAlt: "A translucent anatomical scan of a clenched fist, muscles and tendons glowing",
    explainer: {
      whatItIs:
        "This tool takes a single hand dynamometer reading and places it against published grip norms for people of your age and sex. It returns your percentile, flags whether you fall below the clinical low-strength cut-point, and shows the age at which your reading would be typical.",
      whatYouGet: [
            "Your percentile against age and sex norms",
            "A plain band, from well below to well above average",
            "The age at which your grip would be the population median",
            "A flag if you sit below the EWGSOP2 low-strength cut-point",
          ],
      howToUse: [
            "Squeeze a hand dynamometer at full effort with your elbow bent at 90 degrees.",
            "Take three readings on your dominant hand and keep the best one.",
            "Enter that reading in kilograms, along with your age and sex.",
            "Read the percentile alongside the cut-point flag, and repeat every few months to track the trend.",
          ],
      whatYouNeed: [
            "A hand dynamometer",
            "Your age and sex",
          ],
      timeNeeded: "2 minutes, once you have a dynamometer to hand",
    },
    name: "Grip strength percentile",
    category: "Longevity signal",
    headline: "Where does your grip sit?",
    deck: "Enter a hand dynamometer reading and see how it compares with published norms for your age and sex.",
    description:
      "Compare your grip strength against normative data by age and sex, and see the clinical low-strength cut-point.",
    relatedArticle: "grip-strength-predicts-lifespan",
    relatedArticleTitle: "Your handshake is a health test you can pass.",
    limitation:
      "Percentiles are approximate and drawn from pooled population norms, mostly in European and US adults. A single reading can be affected by injury, arthritis, pain, technique, or a bad day. This is a screen, not a diagnosis.",
    references: [
      {
        title: "Grip Strength across the Life Course: Normative Data from Twelve British Studies",
        source: "PLoS ONE",
        year: "2014",
        href: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0113637",
      },
      {
        title: "Sarcopenia: revised European consensus on definition and diagnosis (EWGSOP2)",
        source: "Age and Ageing",
        year: "2019",
        href: "https://academic.oup.com/ageing/article/48/1/16/5126243",
      },
      {
        title: "Prognostic value of grip strength: findings from the PURE study",
        source: "The Lancet",
        year: "2015",
        href: "https://pubmed.ncbi.nlm.nih.gov/25982160/",
      },
    ],
  },
  {
    slug: "vo2-max-estimator",
    thumb: "/tools/vo2-max-estimator.jpg",
    thumbAlt: "A translucent anatomical scan of lungs and heart, airways glowing",
    explainer: {
      whatItIs:
        "This tool estimates your VO2 max from one of three field methods: a one-mile walk, your resting heart rate, or a twelve-minute run. It converts your inputs using a published equation and places the result against cardiorespiratory fitness norms for your age and sex.",
      whatYouGet: [
            "An estimated VO2 max in ml/kg/min",
            "Your percentile against age and sex norms",
            "A fitness band from low to high",
            "Your age-predicted maximum heart rate, used by the heart-rate method",
          ],
      howToUse: [
            "Pick the method you can do properly: the walk test, the resting heart-rate ratio, or the Cooper twelve-minute run.",
            "For the walk, cover a flat measured mile as briskly as you can, then record your finish time and your heart rate immediately on stopping.",
            "For the heart-rate method, take your resting pulse on waking, before you get out of bed.",
            "Enter your figures with your age, sex and weight, then re-test with the same method so the trend stays comparable.",
          ],
      whatYouNeed: [
            "Your age, sex and weight",
            "Walk test: a flat measured mile, a stopwatch, and a heart-rate reading taken on finishing",
            "Heart-rate method: your resting heart rate",
            "Cooper test: the distance covered in twelve minutes, in metres",
          ],
      timeNeeded: "Under a minute to calculate, 12 to 20 minutes if you are doing the walk or run test",
    },
    name: "VO2 max estimator",
    category: "Longevity signal",
    headline: "Estimate your VO2 max without a lab.",
    deck: "Three validated field methods: a one-mile walk, a resting heart-rate ratio, or a twelve-minute run.",
    description:
      "Estimate VO2 max from a walk test, resting heart rate, or the Cooper 12-minute run, and see it in context.",
    relatedArticle: "vo2-max-trainable-longevity-metric",
    relatedArticleTitle: "VO₂ max may be the most trainable number in longevity.",
    limitation:
      "Field estimates carry meaningful error against laboratory testing, often several ml/kg/min. Treat the number as a starting point and track the trend in your own results rather than the absolute value.",
    references: [
      {
        title: "Estimation of VO2max from a one-mile track walk",
        source: "Medicine & Science in Sports & Exercise (Kline et al.)",
        year: "1987",
        href: "https://pubmed.ncbi.nlm.nih.gov/3657481/",
      },
      {
        title: "Estimation of VO2max from the ratio between HRmax and HRrest",
        source: "European Journal of Applied Physiology (Uth et al.)",
        year: "2004",
        href: "https://pubmed.ncbi.nlm.nih.gov/14624296/",
      },
      {
        title: "Age-predicted maximal heart rate revisited",
        source: "Journal of the American College of Cardiology (Tanaka et al.)",
        year: "2001",
        href: "https://pubmed.ncbi.nlm.nih.gov/11153730/",
      },
    ],
  },
  {
    slug: "waist-to-height-ratio",
    thumb: "/tools/waist-to-height-ratio.jpg",
    thumbAlt: "A translucent anatomical scan of a torso with a luminous band at the waist",
    explainer: {
      whatItIs:
        "This tool divides your waist measurement by your height and tells you which risk band that ratio falls into. It also shows half your height, which is the practical waist target most guidance uses.",
      whatYouGet: [
            "Your waist-to-height ratio",
            "Your band: low, healthy, increased, or further increased",
            "Half your height, as a waist target in centimetres",
            "A short note on what that band does and does not mean",
          ],
      howToUse: [
            "Measure your waist at the midpoint between your lowest rib and the top of your hip bone.",
            "Breathe out normally and keep the tape snug without compressing the skin.",
            "Enter your waist and height in the same units.",
            "Compare the ratio against the half-your-height figure shown.",
          ],
      whatYouNeed: [
            "A tape measure",
            "Your height",
          ],
      timeNeeded: "About 2 minutes",
    },
    name: "Waist-to-height ratio",
    category: "Body composition",
    headline: "The measure that beats BMI.",
    deck: "Keep your waist to less than half your height. One tape measure, one ratio, better evidence than weight alone.",
    description:
      "Calculate your waist-to-height ratio, a better guide to central body fat than BMI.",
    limitation:
      "This ratio describes central fat, not total health. It does not distinguish muscle from fat elsewhere, and it is not a diagnosis. Measurement technique matters: measure at the midpoint between your lowest rib and the top of your hip bone.",
    references: [
      {
        title: "Obesity: identification, assessment and management (NG246)",
        source: "National Institute for Health and Care Excellence",
        year: "2025",
        href: "https://www.nice.org.uk/guidance/ng246",
      },
      {
        title: "Waist-to-height ratio as an indicator of early health risk",
        source: "BMJ Open",
        year: "2016",
        href: "https://bmjopen.bmj.com/content/6/3/e010159",
      },
    ],
  },
  {
    slug: "energy-and-macros",
    thumb: "/tools/energy-and-macros.jpg",
    thumbAlt: "A glowing cluster of mitochondria inside a cell",
    explainer: {
      whatItIs:
        "This tool estimates what you burn at rest using the Mifflin-St Jeor equation, scales it by your activity level to a daily total, then adjusts that figure for your goal. It splits the result into daily protein, fat and carbohydrate targets, with protein set higher in a deficit to protect lean mass.",
      whatYouGet: [
            "Your resting metabolic rate in calories",
            "Your total daily energy expenditure at your activity level",
            "A daily calorie target adjusted for your goal",
            "Protein, fat and carbohydrate targets in grams",
          ],
      howToUse: [
            "Enter your weight, height, age and sex.",
            "Pick the activity level that matches a typical week rather than your best week.",
            "Choose your goal: lose fat, maintain, or build muscle.",
            "Hold the target for two to three weeks, then adjust it based on what your weight actually does.",
          ],
      whatYouNeed: [
            "Your current weight",
            "Your height",
            "Your age and sex",
            "An honest read of your weekly activity",
          ],
      timeNeeded: "About a minute",
    },
    name: "Energy and macros",
    category: "Nutrition",
    headline: "What your body actually burns.",
    deck: "Mifflin-St Jeor for resting metabolism, an activity factor for daily burn, and a macronutrient split for your goal.",
    description:
      "Calculate BMR, total daily energy expenditure, and a protein, fat and carbohydrate split for your goal.",
    relatedArticle: "metabolism-is-more-than-calories",
    relatedArticleTitle: "Metabolism is more than calories.",
    limitation:
      "Every equation here predicts a population average. Individual metabolic rate can differ by several hundred calories a day. Use the number as a starting point, then adjust based on what actually happens over two to three weeks.",
    references: [
      {
        title: "A new predictive equation for resting energy expenditure in healthy individuals",
        source: "American Journal of Clinical Nutrition (Mifflin et al.)",
        year: "1990",
        href: "https://pubmed.ncbi.nlm.nih.gov/2305711/",
      },
      {
        title: "A systematic review, meta-analysis and meta-regression of protein supplementation",
        source: "British Journal of Sports Medicine (Morton et al.)",
        year: "2018",
        href: "https://pubmed.ncbi.nlm.nih.gov/28698222/",
      },
    ],
  },
  {
    slug: "protein-needs",
    thumb: "/tools/protein-needs.jpg",
    thumbAlt: "A close-up bundle of glowing skeletal muscle fibres",
    explainer: {
      whatItIs:
        "This tool turns your bodyweight into a daily protein range in grams, using the intake band supported for your situation. It shows the RDA next to it, so the gap between preventing deficiency and supporting muscle is visible rather than assumed.",
      whatYouGet: [
            "A daily protein range in grams",
            "The grams per kilogram of bodyweight behind that range",
            "A per-meal target across four meals",
            "The RDA figure for the same bodyweight, for comparison",
          ],
      howToUse: [
            "Enter your bodyweight.",
            "Choose the band that describes you: minimum, generally active, building muscle, losing fat, or older adult.",
            "Aim for the daily range and spread it across roughly four meals.",
          ],
      whatYouNeed: [
            "Your current bodyweight",
          ],
      timeNeeded: "Under a minute",
    },
    name: "Protein needs",
    category: "Nutrition",
    headline: "How much protein do you actually need?",
    deck: "The official minimum exists to prevent deficiency. The amount that supports muscle is considerably higher.",
    description:
      "Calculate your daily protein target in grams, by bodyweight and goal, with the evidence behind each range.",
    limitation:
      "These ranges apply to generally healthy adults. If you have reduced kidney function or another condition affecting protein handling, your target should be set with a clinician rather than a calculator.",
    references: [
      {
        title: "A systematic review, meta-analysis and meta-regression of protein supplementation",
        source: "British Journal of Sports Medicine (Morton et al.)",
        year: "2018",
        href: "https://pubmed.ncbi.nlm.nih.gov/28698222/",
      },
      {
        title: "ISSN Position Stand: protein and exercise",
        source: "Journal of the International Society of Sports Nutrition",
        year: "2017",
        href: "https://pubmed.ncbi.nlm.nih.gov/28642676/",
      },
      {
        title: "Evidence-based recommendations for optimal dietary protein intake in older people (PROT-AGE)",
        source: "JAMDA (Bauer et al.)",
        year: "2013",
        href: "https://pubmed.ncbi.nlm.nih.gov/23867520/",
      },
    ],
  },
  {
    slug: "sleep-calculator",
    thumb: "/tools/sleep-calculator.jpg",
    thumbAlt: "A translucent head in profile with the brain glowing softly at rest",
    explainer: {
      whatItIs:
        "This tool works backwards from the time you need to wake up in 90-minute cycles, allowing 15 minutes to fall asleep, and gives you four candidate bedtimes. A second part compares your weeknight and weekend hours against a weekly target and shows the shortfall you are carrying.",
      whatYouGet: [
            "Four bedtimes, from three to six sleep cycles",
            "Hours of sleep for each option, with the ones meeting seven hours marked",
            "Your weekly sleep total against a weekly target",
            "Your accumulated debt and the nightly shortfall behind it",
          ],
      howToUse: [
            "Enter the time you need to be awake.",
            "Choose a bedtime that gives you seven hours or more.",
            "Enter your typical weeknight and weekend hours to see the weekly debt.",
            "Move your bedtime earlier rather than trying to repay the debt at the weekend.",
          ],
      whatYouNeed: [],
      timeNeeded: "Under a minute",
    },
    name: "Sleep calculator",
    category: "Sleep",
    headline: "When should you actually go to bed?",
    deck: "Work backwards from your wake time in sleep cycles, then see the debt your week is quietly accumulating.",
    description:
      "Find your ideal bedtime based on sleep cycles and wake time, and calculate your weekly sleep debt.",
    relatedArticle: "sleep-is-the-foundation",
    relatedArticleTitle: "Sleep is the foundation. Everything else is downstream.",
    limitation:
      "The 90-minute cycle is a planning average, not a fixed constant: real cycles vary between people and across the night. Sleep opportunity is only part of sleep quality, and no calculator can rule out a sleep disorder.",
    references: [
      {
        title: "Recommended Amount of Sleep for a Healthy Adult: joint consensus statement",
        source: "SLEEP (AASM & Sleep Research Society)",
        year: "2015",
        href: "https://pubmed.ncbi.nlm.nih.gov/26039963/",
      },
      {
        title: "How Sleep Works: Sleep Phases and Stages",
        source: "National Heart, Lung, and Blood Institute",
        year: "2022",
        href: "https://www.nhlbi.nih.gov/health/sleep/stages-of-sleep",
      },
    ],
  },
  {
    slug: "lifestyle-age",
    thumb: "/tools/lifestyle-age.jpg",
    thumbAlt: "A full standing human figure, translucent and glowing from within",
    explainer: {
      whatItIs:
        "This tool asks five yes-or-no questions about smoking, weight, activity, alcohol and diet, then reports the life-expectancy difference a large cohort study observed between people with and without those habits. It is not a measurement of your biology; it applies published population findings to your answers.",
      whatYouGet: [
            "How many of the five low-risk factors you currently hold",
            "Years of life expectancy gained compared with someone holding none",
            "A lifestyle age set against your chronological age",
            "A specific next step for each factor you are missing",
          ],
      howToUse: [
            "Enter your age and sex.",
            "Answer the five questions honestly; a generous answer only distorts your own result.",
            "Read the list of missing factors and the suggested next step for each.",
          ],
      whatYouNeed: [],
      timeNeeded: "About 2 minutes",
    },
    name: "Lifestyle age",
    category: "Longevity signal",
    headline: "What five habits are worth, in years.",
    deck: "Not a biological age clock. This applies the findings of a large cohort study to your answers and reports what it observed.",
    description:
      "See how five low-risk lifestyle factors shift life expectancy, based on a large prospective cohort study.",
    limitation:
      "This is not a measurement of your biology. Real biological age requires laboratory measurement such as an epigenetic clock. This tool reports differences observed between groups in a cohort study, which describe populations and cannot predict any individual.",
    references: [
      {
        title: "Impact of Healthy Lifestyle Factors on Life Expectancies in the US Population",
        source: "Circulation (Li et al.)",
        year: "2018",
        href: "https://pubmed.ncbi.nlm.nih.gov/29712712/",
      },
      {
        title: "Healthy lifestyle and life expectancy free of cancer, cardiovascular disease, and type 2 diabetes",
        source: "The BMJ (Li et al.)",
        year: "2020",
        href: "https://www.bmj.com/content/368/bmj.l6669",
      },
    ],
  },
  {
    slug: "bmi-calculator",
    thumb: "/tools/bmi-calculator.jpg",
    thumbAlt: "A translucent standing human body seen from the front, glowing from within",
    explainer: {
      whatItIs:
        "This tool divides your weight by the square of your height and places the result in a standard BMI category. It also applies the lower cut-points used for people of South Asian, Chinese and other Asian family background, and states plainly what BMI cannot see.",
      whatYouGet: [
        "Your BMI to one decimal place",
        "Your category against the cut-points that apply to you",
        "The adjusted cut-points for South Asian and other Asian populations",
        "The weight range that would sit in the healthy band at your height",
      ],
      howToUse: [
        "Enter your weight and height in metric or imperial units.",
        "Set your ethnic background so the correct cut-points are applied.",
        "Read the category together with the stated limitations.",
        "Measure your waist as well, since waist-to-height ratio captures the central fat BMI misses.",
      ],
      whatYouNeed: [
        "Accurate scales",
        "Your height",
      ],
      timeNeeded: "Under a minute",
    },
    name: "BMI calculator",
    category: "Body composition",
    headline: "The number everyone quotes, in context.",
    deck:
      "Calculate your BMI, see the healthy weight range for your height, and read plainly where the number misleads.",
    description:
      "Calculate your body mass index against WHO and lower NICE cut-points, with the healthy weight range for your height and an honest account of what BMI cannot tell you.",
    limitation:
      "BMI was built to describe populations, not to diagnose individuals. It cannot tell muscle from fat, it cannot see where fat sits, and because the formula squares height it systematically over-reads in tall people and under-reads in short people. Treat it as a screening number and nothing more.",
    references: [
      {
        title:
          "About Body Mass Index (BMI)",
        source: "Centers for Disease Control and Prevention",
        year: "2025",
        href: "https://www.cdc.gov/bmi/about/index.html",
      },
      {
        title:
          "Obesity and overweight",
        source: "World Health Organization",
        year: "2025",
        href: "https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight",
      },
      {
        title:
          "Overweight and obesity management (NG246): identifying and assessing overweight, obesity and central adiposity",
        source: "National Institute for Health and Care Excellence",
        year: "2025",
        href: "https://www.nice.org.uk/guidance/ng246/chapter/Identifying-and-assessing-overweight-obesity-and-central-adiposity",
      },
      {
        title:
          "Appropriate body-mass index for Asian populations and its implications for policy and intervention strategies",
        source: "WHO Expert Consultation, The Lancet",
        year: "2004",
        href: "https://pubmed.ncbi.nlm.nih.gov/14726171/",
      },
      {
        title:
          "Ethnicity-specific BMI cutoffs for obesity based on type 2 diabetes risk in England: a population-based cohort study",
        source: "The Lancet Diabetes & Endocrinology (Caleyachetty et al.)",
        year: "2021",
        href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8208895/",
      },
    ],
  },
  {
    slug: "meal-planner",
    thumb: "/tools/meal-planner.jpg",
    thumbAlt: "A plate of food seen from above, each portion glowing with warm light",
    explainer: {
      whatItIs:
        "This tool takes your current weight, a goal weight and a timeline, and works out the daily calorie target that rate of change requires. It returns a macronutrient split and a meal structure that spreads those calories and that protein across your day.",
      whatYouGet: [
        "A daily calorie target for your chosen rate of change",
        "Protein, fat and carbohydrate targets in grams",
        "A meal-by-meal breakdown of calories and protein",
        "The weekly rate of change implied, with a flag if it is too aggressive to hold",
      ],
      howToUse: [
        "Enter your current weight, height, age, sex and activity level.",
        "Set your goal weight and the number of weeks you want to take.",
        "Choose how many meals you eat in a typical day.",
        "Check the rate flag, and extend the timeline if the plan asks for more than roughly 1% of bodyweight a week.",
      ],
      whatYouNeed: [
        "Your current weight and height",
        "Your age and sex",
        "A goal weight and a timeline in weeks",
      ],
      timeNeeded: "About 3 minutes",
    },
    name: "Meal planner",
    category: "Nutrition",
    headline: "A goal weight, turned into a plan.",
    deck:
      "Set a target weight and a pace. Get a daily calorie and macronutrient target, a meal structure, and a timeline that does not flatter you.",
    description:
      "Turn a goal weight into a daily calorie target, macronutrient split, meal structure and realistic timeline, with evidence-based safety limits built in.",
    relatedArticle: "metabolism-is-more-than-calories",
    relatedArticleTitle: "Metabolism is more than calories.",
    limitation:
      "This planner works from prediction equations and population averages, and individual metabolism varies by several hundred calories a day. The timeline accounts for your metabolism falling as you get lighter, but not for imperfect adherence, so read it as a best case. It is not a substitute for a registered dietitian, and it will refuse to plan toward a target below a healthy weight.",
    references: [
      {
        title: "Steps for Losing Weight",
        source: "Centers for Disease Control and Prevention",
        year: "2025",
        href: "https://www.cdc.gov/healthy-weight-growth/losing-weight/index.html",
      },
      {
        title:
          "2013 AHA/ACC/TOS Guideline for the Management of Overweight and Obesity in Adults",
        source: "Journal of the American College of Cardiology",
        year: "2014",
        href: "https://pubmed.ncbi.nlm.nih.gov/24239920/",
      },
      {
        title:
          "Quantification of the effect of energy imbalance on bodyweight",
        source: "The Lancet (Hall et al.)",
        year: "2011",
        href: "https://pubmed.ncbi.nlm.nih.gov/21872751/",
      },
      {
        title:
          "Maintenance of Lost Weight and Long-Term Management of Obesity",
        source: "Medical Clinics of North America (Hall & Kahan)",
        year: "2018",
        href: "https://pubmed.ncbi.nlm.nih.gov/29156185/",
      },
      {
        title:
          "Protein Recommendations for Weight Loss in Elite Athletes: A Focus on Body Composition and Performance",
        source: "International Journal of Sport Nutrition and Exercise Metabolism (Hector & Phillips)",
        year: "2018",
        href: "https://pubmed.ncbi.nlm.nih.gov/29182451/",
      },
      {
        title:
          "Higher compared with lower dietary protein during an energy deficit combined with intense exercise promotes greater lean mass gain and fat mass loss: a randomized trial",
        source: "American Journal of Clinical Nutrition (Longland et al.)",
        year: "2016",
        href: "https://pubmed.ncbi.nlm.nih.gov/26817506/",
      },
    ],
  },
];

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}

export const TOOL_CATEGORIES = [
  "Longevity signal",
  "Body composition",
  "Nutrition",
  "Sleep",
] as const;
