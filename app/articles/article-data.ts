export type ArticleParagraph = {
  text: string;
  citations?: number[];
};

export type ArticleEvidence = {
  strength: "Established" | "Emerging" | "Context";
  text: string;
};

export type ArticleSection = {
  id: string;
  title: string;
  paragraphs: ArticleParagraph[];
  evidence?: ArticleEvidence;
};

export type ArticleReference = {
  title: string;
  source: string;
  year: string;
  href: string;
};

export type ResearchArticle = {
  slug: string;
  system: string;
  title: string;
  deck: string;
  time: string;
  published: string;
  reviewed: string;
  byline: string;
  image: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  sections: ArticleSection[];
  takeaways: string[];
  references: ArticleReference[];
};

export const researchArticles: ResearchArticle[] = [
  {
    slug: "sleep-is-the-foundation",
    system: "Sleep · Recovery",
    title: "Sleep is the foundation. Everything else is downstream.",
    deck:
      "Sleep is active biology: a repeating process that helps coordinate memory, emotion, immune signaling, metabolism, and recovery.",
    time: "12 min read",
    published: "July 2026",
    reviewed: "July 2026",
    byline: "Exalt Human Research Desk",
    image: "/article-sleep.jpg",
    width: 1122,
    height: 1402,
    alt: "A calm sleeping profile with a softly illuminated brain",
    caption:
      "Sleep is organized into recurring non-REM and REM phases. Consumer devices estimate these stages; clinical sleep studies measure them directly.",
    sections: [
      {
        id: "active-biology",
        title: "Sleep is active biology",
        paragraphs: [
          {
            text:
              "Sleep is not the absence of activity. Across the night, the brain and body move through coordinated states with distinct patterns of neural activity, muscle tone, breathing, and cardiovascular regulation.",
            citations: [1],
          },
          {
            text:
              "That organization matters because sleep sits upstream of many capacities people try to optimize during the day: attention, learning, emotional flexibility, training adaptation, appetite regulation, and the ability to recover from stress.",
          },
        ],
      },
      {
        id: "architecture",
        title: "The architecture of a night",
        paragraphs: [
          {
            text:
              "A typical night alternates between non-REM and REM sleep. Non-REM includes lighter stages and deep slow-wave sleep; REM is a distinct state in which brain activity becomes more wake-like while most skeletal muscles are temporarily inhibited.",
            citations: [1],
          },
          {
            text:
              "The proportion of each state changes across the night and across the lifespan. One isolated wearable score cannot capture the full quality or clinical meaning of that architecture.",
          },
        ],
      },
      {
        id: "timing-pressure",
        title: "Timing and sleep pressure work together",
        paragraphs: [
          {
            text:
              "Two interacting processes help explain when sleep becomes likely: a homeostatic pressure that builds with time awake, and a circadian system that organizes sleep and wake around roughly 24-hour timing.",
            citations: [2, 3],
          },
          {
            text:
              "Light, schedule, travel, shift work, caffeine, and individual biology can change how those processes align. This is why sufficient time in bed can still produce poor sleep when timing is repeatedly out of phase.",
          },
        ],
        evidence: {
          strength: "Established",
          text:
            "The two-process model is a durable framework for sleep regulation. It is useful for understanding patterns, but it is not a personal diagnostic tool and does not predict an individual night with precision.",
        },
      },
      {
        id: "practical",
        title: "Practical interpretation",
        paragraphs: [
          {
            text:
              "The fundamentals are unglamorous and powerful: protect enough sleep opportunity, keep wake time reasonably consistent, use morning light to anchor the day, reduce disruptive evening light, and make the sleep environment dark, quiet, and comfortable.",
          },
          {
            text:
              "Tracking can help reveal schedule patterns, but chasing perfect stage percentages often creates more noise than insight. The useful question is whether a measurement changes a sensible decision.",
          },
        ],
      },
      {
        id: "clinical-attention",
        title: "When sleep needs clinical attention",
        paragraphs: [
          {
            text:
              "Persistent insomnia, loud snoring with breathing pauses, gasping during sleep, severe daytime sleepiness, or sleepiness that creates driving or workplace risk deserve professional assessment. Sleep apnea and other disorders cannot be ruled out by motivation, supplements, or a consumer wearable.",
            citations: [4],
          },
        ],
      },
    ],
    takeaways: [
      "Sleep is a regulated physiological process, not passive downtime.",
      "Sleep pressure and circadian timing interact; duration is only part of the picture.",
      "Consistent timing, adequate opportunity, light exposure, and environment are practical first levers.",
      "Persistent or safety-relevant symptoms require clinical evaluation.",
    ],
    references: [
      {
        title: "How Sleep Works: Sleep Phases and Stages",
        source: "National Heart, Lung, and Blood Institute",
        year: "2022",
        href: "https://www.nhlbi.nih.gov/health/sleep/stages-of-sleep",
      },
      {
        title: "How Sleep Works: Your Sleep/Wake Cycle",
        source: "National Heart, Lung, and Blood Institute",
        year: "2022",
        href: "https://www.nhlbi.nih.gov/health/sleep/sleep-wake-cycle",
      },
      {
        title: "The two-process model of sleep regulation: a reappraisal",
        source: "Journal of Sleep Research",
        year: "2016",
        href: "https://pubmed.ncbi.nlm.nih.gov/26762182/",
      },
      {
        title: "Sleep Apnea: Symptoms",
        source: "National Heart, Lung, and Blood Institute",
        year: "2025",
        href: "https://www.nhlbi.nih.gov/health/sleep-apnea/symptoms",
      },
    ],
  },
  {
    slug: "your-nervous-system-is-always-listening",
    system: "Nervous System · Psychology",
    title: "Your nervous system is always listening.",
    deck:
      "Before conscious explanation arrives, neural systems are already sampling sensation, context, memory, pain, and internal state.",
    time: "10 min read",
    published: "July 2026",
    reviewed: "July 2026",
    byline: "Exalt Human Research Desk",
    image: "/article-nervous-system.jpg",
    width: 1402,
    height: 1122,
    alt: "A human profile revealing the nervous system and spinal pathways",
    caption:
      "The central and peripheral nervous systems continuously exchange information between the brain, spinal cord, organs, muscles, and environment.",
    sections: [
      {
        id: "detects-first",
        title: "The body detects before the mind explains",
        paragraphs: [
          {
            text:
              "The nervous system receives and integrates information before experience becomes a deliberate story. Sensory input, body state, memory, attention, and context all shape what reaches awareness and how it is interpreted.",
            citations: [1],
          },
          {
            text:
              "That does not mean every reaction is hidden trauma or that the body is always correct. It means perception is an active biological construction, not a neutral recording of the world.",
          },
        ],
      },
      {
        id: "practical-map",
        title: "A practical map of the system",
        paragraphs: [
          {
            text:
              "The central nervous system includes the brain and spinal cord. The peripheral nervous system carries information between that central network and the rest of the body. Within it, autonomic pathways help regulate functions such as heart rate, digestion, breathing, temperature, and blood pressure.",
            citations: [1],
          },
          {
            text:
              "Sympathetic and parasympathetic activity are not simple on-and-off switches. Both participate in flexible regulation, and healthy function depends on matching state to demand.",
          },
        ],
      },
      {
        id: "stress-response",
        title: "Stress is a response, not a moral failure",
        paragraphs: [
          {
            text:
              "Acute stress mobilizes attention, circulation, energy, and action. That can be adaptive. Difficulty arises when demands are intense, repeated, uncontrollable, or not followed by sufficient recovery.",
            citations: [2],
          },
          {
            text:
              "A stress response is not evidence of weakness. It is a coordinated attempt to meet perceived demand, influenced by sleep, pain, illness, relationships, work, environment, and previous learning.",
          },
        ],
        evidence: {
          strength: "Context",
          text:
            "Popular language often reduces stress physiology to “fight or flight.” The real system is more varied. A useful explanation should clarify function without turning a complex state into a personality label.",
        },
      },
      {
        id: "regulation",
        title: "Regulation means flexibility",
        paragraphs: [
          {
            text:
              "Regulation is not permanent calm. It is the capacity to increase activation when action is needed, sustain it appropriately, and return toward recovery when the demand changes.",
          },
          {
            text:
              "Slow, comfortable breathing can influence cardiorespiratory and autonomic dynamics, and structured breathing practices may reduce stress or anxiety for some people. Effects vary, and breathing should not be framed as a cure-all.",
            citations: [3, 4],
          },
        ],
        evidence: {
          strength: "Emerging",
          text:
            "Breathing research supports plausible physiological effects and some psychological benefit, but protocols, populations, and outcomes vary. It is best treated as one accessible regulation tool, not a substitute for clinical care.",
        },
      },
      {
        id: "limits-care",
        title: "Limits, myths, and clinical care",
        paragraphs: [
          {
            text:
              "Claims that one technique “resets” the vagus nerve or permanently switches the body into safety usually outrun the evidence. Persistent anxiety, trauma symptoms, fainting, weakness, numbness, severe headache, or sudden neurological change require appropriate professional evaluation.",
          },
        ],
      },
    ],
    takeaways: [
      "The nervous system integrates body state, sensation, memory, and context.",
      "Stress responses are adaptive processes, not character judgments.",
      "Regulation is flexible state change—not continuous calm.",
      "Breathing and movement may help, but universal “nervous system reset” claims are not supported.",
    ],
    references: [
      {
        title: "Pain and the Nervous System",
        source: "National Institute of Neurological Disorders and Stroke",
        year: "2025",
        href: "https://www.ninds.nih.gov/health-information/disorders/pain",
      },
      {
        title: "Physiology, Stress Reaction",
        source: "NCBI Bookshelf",
        year: "2024",
        href: "https://www.ncbi.nlm.nih.gov/books/NBK541120/",
      },
      {
        title: "The physiological effects of slow breathing in the healthy human",
        source: "Breathe",
        year: "2017",
        href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5709795/",
      },
      {
        title: "Breathing Practices for Stress and Anxiety Reduction",
        source: "Brain Sciences",
        year: "2023",
        href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10741869/",
      },
    ],
  },
  {
    slug: "metabolism-is-more-than-calories",
    system: "Metabolism · Body",
    title: "Metabolism is more than calories.",
    deck:
      "Metabolism is the continuous chemistry of staying alive: producing energy, building tissue, storing fuel, signaling demand, and maintaining internal stability.",
    time: "9 min read",
    published: "July 2026",
    reviewed: "July 2026",
    byline: "Exalt Human Research Desk",
    image: "/article-metabolism.jpg",
    width: 1536,
    height: 1024,
    alt: "A detailed visualization of mitochondria within a human cell",
    caption:
      "Mitochondria participate in energy conversion, but metabolism is distributed across cells, organs, hormones, enzymes, and behavior.",
    sections: [
      {
        id: "staying-alive",
        title: "Metabolism is the work of staying alive",
        paragraphs: [
          {
            text:
              "Metabolism describes the linked chemical reactions that provide energy and material for movement, repair, temperature control, signaling, growth, and the maintenance of living tissue.",
            citations: [1],
          },
          {
            text:
              "Reducing metabolism to “fast” or “slow” misses most of the system. Body size, age, tissue composition, genetics, hormones, illness, medication, diet, movement, sleep, and environment can all influence metabolic demand and regulation.",
          },
        ],
      },
      {
        id: "cellular-energy",
        title: "How cells produce and use energy",
        paragraphs: [
          {
            text:
              "Cells capture energy from nutrients and transfer much of it through adenosine triphosphate, or ATP. ATP supports muscle contraction, ion transport, nerve signaling, and biosynthesis.",
            citations: [1, 2],
          },
          {
            text:
              "Glucose, fatty acids, and amino acids enter overlapping pathways. Which fuel contributes more changes with food availability, activity intensity, training status, hormones, and health.",
          },
        ],
        evidence: {
          strength: "Established",
          text:
            "ATP-centered cellular energy pathways are foundational biochemistry. Simplified diagrams are useful for orientation, but the real network is regulated, compartmentalized, and responsive to tissue-specific demand.",
        },
      },
      {
        id: "flexibility",
        title: "Metabolic flexibility is context-dependent",
        paragraphs: [
          {
            text:
              "A healthy system can shift fuel use across feeding, fasting, rest, and activity. Normal rises and falls in glucose, insulin, fat oxidation, or appetite do not automatically indicate dysfunction.",
          },
          {
            text:
              "Metabolic health is better understood through patterns, symptoms, history, validated measurements, and clinical context than through one wearable estimate or a single dramatic biomarker.",
          },
        ],
      },
      {
        id: "measurements",
        title: "What measurements can—and cannot—tell you",
        paragraphs: [
          {
            text:
              "Blood glucose and A1C can support screening or diagnosis when interpreted correctly. A1C reflects an approximate multi-month glucose average, but pregnancy, anemia, hemoglobin variants, and other factors can affect its reliability.",
            citations: [3, 4],
          },
          {
            text:
              "Weight, waist measures, lipids, blood pressure, glucose, and fitness each describe different parts of risk. None is a complete verdict on a person’s health or worth.",
          },
        ],
        evidence: {
          strength: "Context",
          text:
            "Laboratory results are ranges interpreted alongside history and risk—not consumer optimization scores. Diagnosis should rely on validated testing and qualified clinical interpretation.",
        },
      },
      {
        id: "foundations",
        title: "Practical foundations",
        paragraphs: [
          {
            text:
              "Regular movement, resistance training, dietary quality, adequate sleep, and sustainable routines support metabolic health across many contexts. The useful plan is the one that fits the person, condition, medication profile, and available resources.",
            citations: [3, 5],
          },
          {
            text:
              "Symptoms, strong family history, pregnancy, medication effects, or abnormal results are reasons to seek individualized guidance rather than self-diagnose from a dashboard.",
          },
        ],
      },
    ],
    takeaways: [
      "Metabolism includes every energy-producing and tissue-building reaction in the body.",
      "Fuel use changes normally across food, fasting, rest, and activity.",
      "Single measurements need history and context; no metric captures the whole system.",
      "Movement, muscle-strengthening, sleep, and dietary quality are durable foundations.",
    ],
    references: [
      {
        title: "Physiology, Metabolism",
        source: "NCBI Bookshelf",
        year: "2022",
        href: "https://www.ncbi.nlm.nih.gov/books/NBK546690/",
      },
      {
        title: "Physiology, Adenosine Triphosphate",
        source: "NCBI Bookshelf",
        year: "2023",
        href: "https://www.ncbi.nlm.nih.gov/books/NBK553175/",
      },
      {
        title: "Insulin Resistance & Prediabetes",
        source: "National Institute of Diabetes and Digestive and Kidney Diseases",
        year: "2026",
        href: "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance",
      },
      {
        title: "Diabetes Tests & Diagnosis",
        source: "National Institute of Diabetes and Digestive and Kidney Diseases",
        year: "2026",
        href: "https://www.niddk.nih.gov/health-information/diabetes/overview/tests-diagnosis",
      },
      {
        title: "Physical Activity Guidelines for Americans, 2nd edition",
        source: "U.S. Department of Health and Human Services",
        year: "2018",
        href: "https://health.gov/paguidelines/second-edition/pdf/Physical_Activity_Guidelines_2nd_edition.pdf",
      },
    ],
  },
];

export function getResearchArticle(slug: string) {
  return researchArticles.find((article) => article.slug === slug);
}
