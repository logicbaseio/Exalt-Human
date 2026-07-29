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

export type Tool = {
  slug: string;
  name: string;
  /** Short label used on the hub card. */
  category: string;
  headline: string;
  deck: string;
  /** Used for search/meta descriptions. */
  description: string;
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
