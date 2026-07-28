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
  {
    slug: "ultra-processed-food-overrides-fullness",
    system: "Human Hijack · Nutrition",
    title: "Ultra-processed food is built to outrun your fullness.",
    deck:
      "In a controlled trial, people ate about 500 calories more per day on an ultra-processed diet — even though it was matched, gram for gram, for sugar, fat, salt, and fiber.",
    time: "8 min read",
    published: "July 2026",
    reviewed: "July 2026",
    byline: "Exalt Human Research Desk",
    image: "/human-system-hero-front.png",
    width: 1672,
    height: 941,
    alt: "A front-facing anatomical rendering of the human body",
    caption:
      "Ultra-processed foods are industrial formulations (NOVA Group 4). This story is about how their physical form, not only their nutrients, shapes how much we eat.",
    sections: [
      {
        id: "the-test",
        title: "A rare test of the food itself",
        paragraphs: [
          {
            text:
              "The usual argument about modern food blames one ingredient at a time: too much sugar, too much fat, too much salt. A 2019 trial at the NIH Clinical Center tried to isolate something different — the processing itself.",
            citations: [1],
          },
          {
            text:
              "Twenty weight-stable adults lived on a metabolic ward and ate an ultra-processed diet for two weeks and an unprocessed diet for two weeks, in random order. Both diets offered the same number of calories and were matched for energy density, sugar, fat, sodium, and fiber. People could eat as much or as little as they wanted.",
            citations: [1],
          },
        ],
      },
      {
        id: "the-finding",
        title: "About 500 extra calories a day",
        paragraphs: [
          {
            text:
              "On the ultra-processed diet, people ate roughly 508 calories more per day. Over two weeks they gained about 0.9 kg; on the unprocessed diet they lost about the same amount.",
            citations: [1],
          },
          {
            text:
              "Because the two diets were matched on paper, the gap was not explained by more sugar or fat in the numbers. Something about the processed form of the food drove the overeating.",
            citations: [1],
          },
        ],
        evidence: {
          strength: "Emerging",
          text:
            "This was a rigorous randomized, controlled feeding trial, which supports a genuine causal effect on how much people eat. But it was small (20 people) and short (two weeks per diet) in a tightly controlled setting, so the exact size of the effect in everyday life is not settled.",
        },
      },
      {
        id: "mechanism",
        title: "The likely mechanism: you eat it faster",
        paragraphs: [
          {
            text:
              "One clue stood out: people ate the ultra-processed food faster. When calories arrive quickly, they can outpace the gut-and-brain signals that register fullness, so you have already eaten more before your body says stop.",
            citations: [1, 2],
          },
          {
            text:
              "Across food types, the rate of calorie intake climbs steeply — from roughly 36 calories a minute for unprocessed foods to about 54 for processed and 69 for ultra-processed ones. Soft, energy-dense, quick-to-chew food is simply consumed faster. Eating rate is one plausible driver, not the whole story.",
            citations: [2],
          },
        ],
      },
      {
        id: "why-it-matters",
        title: "Why this scales to a population problem",
        paragraphs: [
          {
            text:
              "Ultra-processed foods now make up a large share of calories in many countries. At population scale, higher intake is associated with a wide range of worse health outcomes, from cardiovascular and metabolic disease to mental health.",
            citations: [3],
          },
          {
            text:
              "That population evidence is observational: it shows a consistent association across millions of people, not proof that ultra-processed food directly causes each outcome. The controlled trial is what lets us talk about cause for the specific question of overeating.",
            citations: [3, 1],
          },
        ],
      },
      {
        id: "what-you-can-do",
        title: "A practical lever, not a purity test",
        paragraphs: [
          {
            text:
              "You do not need a perfect diet to use this. The lever is form and friction: favor foods that take longer to eat, hold more water and fiber, and do not dissolve into fast calories. Whole fruit over juice, oats over a cereal bar, a cooked meal over a snack that vanishes in a minute.",
            citations: [1, 2],
          },
          {
            text:
              "Treat ultra-processed items as easy to over-consume by design, and make them slightly less convenient rather than banning them. This is a behavioral suggestion, not medical advice.",
          },
        ],
      },
      {
        id: "limits",
        title: "What this does not prove",
        paragraphs: [
          {
            text:
              "The trial was small and short, and a metabolic ward is not real life. It shows a real, causal effect on how much people eat, but the precise magnitude in free-living conditions is uncertain.",
            citations: [1],
          },
          {
            text:
              "\"Ultra-processed\" as defined by the NOVA system is a useful working category, but scientists still debate how precisely it can be applied. Use it as a practical guide, not a rigid law.",
            citations: [4],
          },
        ],
      },
    ],
    takeaways: [
      "In a controlled trial, an ultra-processed diet led people to eat about 500 more calories a day than a nutrient-matched unprocessed diet.",
      "The diets were matched for sugar, fat, salt, and fiber, so the food's form, not just its nutrients, drove the overeating.",
      "A likely mechanism is eating rate: ultra-processed food is consumed faster than fullness signals can keep up with.",
      "Practical lever: favor foods that take longer to eat and resist calories that arrive too fast. Perfection is not required.",
      "Population links to poor health are real but largely observational; keep causal claims to what trials actually show.",
    ],
    references: [
      {
        title:
          "Ultra-Processed Diets Cause Excess Calorie Intake and Weight Gain: An Inpatient Randomized Controlled Trial of Ad Libitum Food Intake",
        source: "Cell Metabolism (Hall et al.)",
        year: "2019",
        href: "https://pubmed.ncbi.nlm.nih.gov/31105044/",
      },
      {
        title:
          "Ultra-Processing or Oral Processing? A Role for Energy Density and Eating Rate in Moderating Energy Intake from Processed Foods",
        source: "Current Developments in Nutrition (Forde et al.)",
        year: "2020",
        href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7042610/",
      },
      {
        title:
          "Ultra-processed food exposure and adverse health outcomes: umbrella review of epidemiological meta-analyses",
        source: "The BMJ (Lane et al.)",
        year: "2024",
        href: "https://doi.org/10.1136/bmj-2023-077310",
      },
      {
        title: "Ultra-processed foods: what they are and how to identify them",
        source: "Public Health Nutrition (Monteiro et al.)",
        year: "2019",
        href: "https://www.cambridge.org/core/journals/public-health-nutrition/article/ultraprocessed-foods-what-they-are-and-how-to-identify-them/E6D744D714B1FF09D5BCA3E74D53A185",
      },
    ],
  },
  {
    slug: "vo2-max-trainable-longevity-metric",
    system: "Human Upgrade · Fitness",
    title: "VO₂ max may be the most trainable number in longevity.",
    deck:
      "In 122,000 adults, higher cardiorespiratory fitness tracked with dramatically lower death rates — with no ceiling of benefit. And unlike your genes, fitness is something you can train.",
    time: "9 min read",
    published: "July 2026",
    reviewed: "July 2026",
    byline: "Exalt Human Research Desk",
    image: "/human-atlas.jpg",
    width: 864,
    height: 1821,
    alt: "A full-body anatomical atlas showing the cardiovascular and muscular systems",
    caption:
      "VO₂ max is the standard measure of aerobic capacity: how much oxygen your body can take up and use during hard exercise.",
    sections: [
      {
        id: "what-it-is",
        title: "One number for the size of your engine",
        paragraphs: [
          {
            text:
              "VO₂ max is the maximum amount of oxygen your body can take up and use during intense exercise. It reflects how well your heart, lungs, blood, and muscles work together to deliver and burn oxygen — in effect, the size of your aerobic engine.",
            citations: [4],
          },
        ],
      },
      {
        id: "the-signal",
        title: "The 122,000-person picture",
        paragraphs: [
          {
            text:
              "In a study of 122,007 adults who completed treadmill tests, higher fitness tracked with lower death rates over a median of more than eight years. The benefit kept rising with fitness, with no upper limit observed in the data.",
            citations: [1],
          },
          {
            text:
              "The least-fit group had roughly five times the mortality risk of the fittest. Even among already-fit people, the most elite still did better than the merely high. And low fitness carried a risk on par with or greater than smoking, diabetes, and coronary artery disease in that population.",
            citations: [1],
          },
        ],
        evidence: {
          strength: "Established",
          text:
            "Cardiorespiratory fitness is one of the strongest and most consistent predictors of mortality we have, and the American Heart Association argues it should be measured like a clinical vital sign. Note the key caveat: this evidence is observational. It shows that fitter people die less, not yet that raising your fitness is what saves you.",
        },
      },
      {
        id: "vital-sign",
        title: "Fitness as a vital sign",
        paragraphs: [
          {
            text:
              "The signal is strong enough that the American Heart Association has argued cardiorespiratory fitness should be assessed routinely, like blood pressure or cholesterol, because it independently predicts cardiovascular and all-cause mortality.",
            citations: [2],
          },
        ],
      },
      {
        id: "trainable",
        title: "The good news: unlike your genes, it moves",
        paragraphs: [
          {
            text:
              "Genetics set part of your VO₂ max, but training clearly moves it. Pooling many studies, high-intensity interval training raised VO₂ max by a meaningful margin on average, with longer intervals of roughly three to five minutes producing the largest gains.",
            citations: [3],
          },
          {
            text:
              "A practical structure that fits the evidence: build a large, easy aerobic base with longer sessions at a comfortable, conversational effort, and add a smaller dose of hard intervals to push the ceiling. (The popular \"Zone 2\" label refers to that easy base; the strongest trial evidence for raising VO₂ max specifically comes from the interval work.)",
            citations: [3],
          },
        ],
      },
      {
        id: "apply",
        title: "How to apply it",
        paragraphs: [
          {
            text:
              "Keep most of your weekly cardio easy enough to hold a conversation, to build the aerobic base, and reserve a smaller amount for hard intervals, such as repeated three-to-five-minute efforts. Consistency over months matters more than any single heroic session.",
            citations: [3],
          },
          {
            text:
              "Responses vary between individuals, and your starting point shapes how fast you improve. The direction of travel is what counts.",
            citations: [3],
          },
        ],
      },
      {
        id: "limits",
        title: "What the evidence does and does not say",
        paragraphs: [
          {
            text:
              "The large mortality study is observational. Fitter people die less, but the data cannot prove that becoming fitter is what extends life, and poor underlying health can itself lower fitness. The case for training rests on combining that association with trials showing fitness is trainable.",
            citations: [1, 3],
          },
          {
            text:
              "New or intense exercise carries its own risks. Anyone with heart disease, symptoms, or significant risk factors, or who is new to hard training, should get medical clearance first. This is general information, not medical advice.",
          },
        ],
      },
    ],
    takeaways: [
      "Higher cardiorespiratory fitness tracks with far lower mortality — up to roughly a fivefold difference between least- and most-fit — with no observed ceiling of benefit.",
      "The American Heart Association argues fitness is strong enough to treat as a clinical vital sign.",
      "Unlike genetics, VO₂ max is trainable: an easy aerobic base plus regular high-intensity intervals reliably raises it.",
      "The mortality data are observational (association, not proof of cause); trainability is what the trials demonstrate.",
      "Build consistency over months, and get medical clearance before intense training if you have risk factors.",
    ],
    references: [
      {
        title:
          "Association of Cardiorespiratory Fitness With Long-term Mortality Among Adults Undergoing Exercise Treadmill Testing",
        source: "JAMA Network Open (Mandsager et al.)",
        year: "2018",
        href: "https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2707428",
      },
      {
        title:
          "Importance of Assessing Cardiorespiratory Fitness in Clinical Practice: A Case for Fitness as a Clinical Vital Sign",
        source: "Circulation, American Heart Association (Ross et al.)",
        year: "2016",
        href: "https://pubmed.ncbi.nlm.nih.gov/27881567/",
      },
      {
        title:
          "VO2max Trainability and High Intensity Interval Training in Humans: A Meta-Analysis",
        source: "PLOS ONE (Bacon et al.)",
        year: "2013",
        href: "https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0073182",
      },
      {
        title: "Cardiopulmonary Fitness (StatPearls)",
        source: "NIH National Library of Medicine, NCBI Bookshelf",
        year: "2023",
        href: "https://www.ncbi.nlm.nih.gov/books/NBK560729/",
      },
    ],
  },
  {
    slug: "ai-learned-to-read-proteins",
    system: "Human Future · AI & Health",
    title: "AI learned to read the shape of proteins.",
    deck:
      "AlphaFold predicted the 3D structure of nearly every known protein — a problem biologists chased for fifty years. What it still cannot do matters just as much as what it can.",
    time: "10 min read",
    published: "July 2026",
    reviewed: "July 2026",
    byline: "Exalt Human Research Desk",
    image: "/optimization-worlds.png",
    width: 1254,
    height: 1254,
    alt: "An abstract network visualization representing computational biology and protein structure",
    caption:
      "Proteins fold into precise 3D shapes that determine what they do. AlphaFold predicts those shapes from sequence — but a prediction is a model, not an experiment.",
    sections: [
      {
        id: "the-problem",
        title: "Why a protein's shape is everything",
        paragraphs: [
          {
            text:
              "Proteins do almost all the work in your cells, and what a protein does is governed by how its chain folds into a precise 3D shape. Predicting that shape from the sequence of building blocks alone was an open problem for roughly fifty years.",
            citations: [1],
          },
        ],
      },
      {
        id: "breakthrough",
        title: "Near-experimental accuracy",
        paragraphs: [
          {
            text:
              "In a 2020 blind assessment known as CASP14, DeepMind's AlphaFold predicted protein structures with an accuracy competitive with laboratory experiments for most targets — a median backbone error under one ångström, versus about 2.8 for the next-best method.",
            citations: [1],
          },
          {
            text:
              "It then predicted structures for essentially every catalogued protein and released them in an open database, growing from about 360,000 structures at launch in 2021 to more than 214 million by 2023 — coverage of nearly all known proteins.",
            citations: [2, 3],
          },
        ],
        evidence: {
          strength: "Established",
          text:
            "The accuracy was measured in an independent, blind competition and the tool has since been adopted across biology, which is why this is treated as a genuine breakthrough rather than a claim from a single lab.",
        },
      },
      {
        id: "why-it-matters",
        title: "A new starting point for medicine",
        paragraphs: [
          {
            text:
              "Structures that once took months or years of painstaking lab work can now begin as a computational prediction in seconds. That compresses the first step of research across basic biology, disease understanding, and drug discovery.",
            citations: [2],
          },
          {
            text:
              "The achievement was recognized with a share of the 2024 Nobel Prize in Chemistry, awarded for protein structure prediction and computational protein design.",
            citations: [5],
          },
        ],
      },
      {
        id: "limits",
        title: "A prediction is not an experiment",
        paragraphs: [
          {
            text:
              "Every AlphaFold model comes with confidence scores, and low-confidence regions should not be treated as truth. The tool usually predicts a single static shape, without the water, ions, or drug molecules that often decide how a protein actually behaves.",
            citations: [4],
          },
          {
            text:
              "For drug design specifically, that matters: in one benchmark, docking against raw AlphaFold models performed clearly worse than against experimental structures. The models also struggle with flexible, disordered regions — a large share of human proteins — and a predicted shape does not tell you a protein's function, its partners, or how a mutation will change it. Structure is not the same as function.",
            citations: [4],
          },
        ],
        evidence: {
          strength: "Context",
          text:
            "AlphaFold transformed the starting point of structural biology, but predicted models still require experimental validation, especially before they can be trusted for drug binding.",
        },
      },
      {
        id: "future",
        title: "Where this is heading",
        paragraphs: [
          {
            text:
              "Newer systems aim to predict how proteins interact with drugs and with each other, and to represent more than one shape at a time. Paired with laboratory validation, structure prediction is becoming a standard first step in biology rather than a final answer.",
            citations: [2],
          },
          {
            text:
              "You will not use AlphaFold directly. But it is quietly accelerating the science behind future diagnostics and medicines — while reminding us that even the most impressive AI predictions still have to be proven in the real world.",
          },
        ],
      },
    ],
    takeaways: [
      "AlphaFold solved a roughly fifty-year problem: predicting a protein's 3D structure from its sequence, with near-experimental accuracy in a blind test.",
      "It released open structures for nearly all known proteins — more than 214 million by 2023 — and shared the 2024 Nobel Prize in Chemistry.",
      "This gives biology and drug discovery a powerful new starting point, turning months of lab work into a fast hypothesis.",
      "But predictions are models, not experiments: single static shapes, no drug molecules, weaker on flexible regions, and structure does not equal function.",
      "The honest frame is a transformative accelerator that still depends on experimental validation.",
    ],
    references: [
      {
        title: "Highly accurate protein structure prediction with AlphaFold",
        source: "Nature (Jumper et al.)",
        year: "2021",
        href: "https://www.nature.com/articles/s41586-021-03819-2",
      },
      {
        title:
          "AlphaFold Protein Structure Database: massively expanding the structural coverage of protein-sequence space with high-accuracy models",
        source: "Nucleic Acids Research (Varadi et al.)",
        year: "2022",
        href: "https://academic.oup.com/nar/article/50/D1/D439/6430488",
      },
      {
        title:
          "AlphaFold Protein Structure Database in 2024: providing structure coverage for over 214 million protein sequences",
        source: "Nucleic Acids Research (Varadi et al.)",
        year: "2024",
        href: "https://academic.oup.com/nar/article/52/D1/D368/7337620",
      },
      {
        title: "How good are AlphaFold models for docking-based virtual screening?",
        source: "iScience, Cell Press (Scardino et al.)",
        year: "2022",
        href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9852548/",
      },
      {
        title: "AlphaFold wins Nobel Prize in Chemistry 2024",
        source: "EMBL",
        year: "2024",
        href: "https://www.embl.org/news/science-technology/alphafold-wins-nobel-prize-chemistry-2024/",
      },
    ],
  },
  {
    slug: "grip-strength-predicts-lifespan",
    system: "Human Upgrade · Fitness",
    title: "Your handshake is a health test you can pass.",
    deck:
      "In large studies, a cheap squeeze of a hand dynamometer tracks who lives longer. The number is not magic in the hand; it is a window on total-body strength.",
    time: "8 min read",
    published: "July 2026",
    reviewed: "July 2026",
    byline: "Exalt Human Research Desk",
    image: "/article-grip-strength.jpg",
    width: 1024,
    height: 1536,
    alt: "A translucent anatomical scan of a clenched hand and forearm, muscles and tendons glowing",
    caption:
      "A firm grip is measured at the hand, but it draws on muscle, tendon, and nerve throughout the forearm and body. That is why the number reflects far more than the hand alone.",
    sections: [
      {
        id: "the-number",
        title: "One cheap number, a surprising signal",
        paragraphs: [
          {
            text:
              "A hand dynamometer is a small device you squeeze as hard as you can. It costs little, takes seconds, and needs no lab. Yet across large populations, the number it produces tracks something profound: how likely a person is to die in the years ahead.",
            citations: [1],
          },
          {
            text:
              "That sounds like a stretch. It is not. In one of the biggest studies ever done on the question, weaker grip was linked to a higher chance of death from any cause, and from heart disease in particular. The key is understanding what the number actually represents.",
            citations: [1],
          },
        ],
      },
      {
        id: "pure-study",
        title: "What the largest study found",
        paragraphs: [
          {
            text:
              "The anchor evidence comes from the Prospective Urban Rural Epidemiology (PURE) study, published in The Lancet in 2015. Researchers measured grip strength in roughly 139,700 adults across 17 countries and followed them for a median of about four years.",
            citations: [1],
          },
          {
            text:
              "After accounting for age, education, and other factors, each 5 kilogram drop in grip strength was associated with a 16 percent higher risk of death from any cause and a 17 percent higher risk of death from cardiovascular disease. Striking detail: in this cohort, grip strength predicted death better than systolic blood pressure did.",
            citations: [1],
          },
          {
            text:
              "This is not a one-off. A later meta-analysis pooling dozens of cohorts and millions of participants found the same direction of effect, with weaker grip linked to higher all-cause mortality and cardiovascular disease. More recent analyses in United States adults point the same way.",
            citations: [2, 4],
          },
        ],
        evidence: {
          strength: "Established",
          text:
            "The association between low grip strength and higher mortality is consistent across many large observational studies. But these are observational: grip strength predicts risk, it does not prove that a weak hand causes death. No trial has shown that squeezing a gripper extends life.",
        },
      },
      {
        id: "why-proxy",
        title: "Why the hand is a window on the whole body",
        paragraphs: [
          {
            text:
              "Grip strength is not important because of the hand. It is important because the hand borrows from the same biology as the rest of you. A firm grip usually signals decent overall muscle mass, an intact nervous system driving those muscles, and a body that has weathered less decline.",
            citations: [3],
          },
          {
            text:
              "Clinically, low grip strength is a core marker of sarcopenia, the age-related loss of muscle strength and mass. The 2019 European consensus (EWGSOP2) treats muscle strength, measured largely by grip, as the primary sign of the condition, precisely because it is simple, reproducible, and tracks poor outcomes.",
            citations: [3],
          },
          {
            text:
              "Think of grip as a resilience gauge. Muscle is not just for lifting; it is a metabolic organ, a reserve the body draws on during illness, injury, and recovery. When that reserve shrinks, the whole system becomes more fragile, and the grip number quietly reflects it.",
            citations: [3],
          },
        ],
      },
      {
        id: "marker-not-lever",
        title: "A marker, not a magic lever",
        paragraphs: [
          {
            text:
              "Here is the trap to avoid: treating grip as the thing to fix. Training only your grip with hand grippers will make your grip stronger, but there is no evidence that isolated grip work changes your lifespan. You would be polishing the gauge, not refueling the tank.",
          },
          {
            text:
              "The number is useful because it summarizes total-body strength. So the honest goal is to build that underlying strength. When overall strength rises, grip tends to follow, and you are improving the thing the marker was pointing at all along.",
            citations: [3],
          },
        ],
        evidence: {
          strength: "Context",
          text:
            "Grip strength is best read as a low-cost proxy for whole-body strength and muscle health. It is a signpost, not the destination. The intervention with real evidence behind it is building strength across the body, not training the hand in isolation.",
        },
      },
      {
        id: "what-to-train",
        title: "What to actually train",
        paragraphs: [
          {
            text:
              "The lever with the strongest evidence is resistance training. Public health guidance recommends muscle-strengthening activity on at least two days per week, working all major muscle groups: legs, hips, back, chest, abdomen, shoulders, and arms.",
            citations: [5],
          },
          {
            text:
              "In practice that means compound movements: squats, hinges, presses, rows, and carries. Carries and pulling movements naturally load the grip, so a strong grip often emerges as a byproduct of training the whole body hard, rather than as a standalone project.",
            citations: [5],
          },
          {
            text:
              "You do not need a gym full of machines. Bodyweight work, resistance bands, dumbbells, or loaded carries all count. Progress gradually, aim for roughly one to three sets of 8 to 12 repetitions to start, and prioritize consistency over intensity in the early weeks.",
            citations: [5],
          },
        ],
      },
      {
        id: "limits",
        title: "Limits and when to seek care",
        paragraphs: [
          {
            text:
              "A grip test is a screen, not a diagnosis. A single low reading can reflect a recent injury, arthritis, pain, poor technique, or simply a bad day. Trends over months matter more than any one measurement.",
          },
          {
            text:
              "If your grip is declining without explanation, or you notice unintended weight loss, muscle wasting, frequent falls, or growing weakness, talk to a clinician. These can be signs of sarcopenia or other conditions that deserve a proper assessment rather than a home gadget.",
            citations: [3],
          },
          {
            text:
              "The optimistic takeaway is that strength is trainable at almost any age. Grip strength predicts risk, and the underlying strength it reflects is one of the most modifiable things in human health. You cannot change your age, but you can change how strong you are.",
            citations: [1, 3],
          },
        ],
      },
    ],
    takeaways: [
      "Weaker grip strength is consistently linked to higher all-cause and cardiovascular mortality across large populations.",
      "The evidence is observational: grip predicts risk, it does not prove a weak hand causes death.",
      "Grip matters because it reflects total-body strength, muscle mass, and biological resilience, not because of the hand itself.",
      "Do not train grip in isolation; build overall strength with resistance training on at least two days per week.",
      "Persistent, unexplained weakness or muscle loss deserves a clinical assessment, not just a home gadget.",
    ],
    references: [
      {
        title:
          "Prognostic value of grip strength: findings from the Prospective Urban Rural Epidemiology (PURE) study",
        source: "The Lancet",
        year: "2015",
        href: "https://pubmed.ncbi.nlm.nih.gov/25982160/",
      },
      {
        title:
          "Association of Grip Strength With Risk of All-Cause Mortality, Cardiovascular Diseases, and Cancer in Community-Dwelling Populations: A Meta-analysis of Prospective Cohort Studies",
        source: "Journal of the American Medical Directors Association",
        year: "2017",
        href: "https://pubmed.ncbi.nlm.nih.gov/28549705/",
      },
      {
        title:
          "Sarcopenia: revised European consensus on definition and diagnosis (EWGSOP2)",
        source: "Age and Ageing",
        year: "2019",
        href: "https://academic.oup.com/ageing/article/48/1/16/5126243",
      },
      {
        title:
          "Comparison of grip strength measurements for predicting all-cause mortality among adults aged 20+ years from the NHANES 2011-2014",
        source: "Scientific Reports (Nature)",
        year: "2024",
        href: "https://www.nature.com/articles/s41598-024-80487-y",
      },
      {
        title: "Physical Activity Guidelines for Adults",
        source: "Centers for Disease Control and Prevention",
        year: "2023",
        href: "https://www.cdc.gov/physical-activity-basics/guidelines/index.html",
      },
    ],
  },
];

export function getResearchArticle(slug: string) {
  return researchArticles.find((article) => article.slug === slug);
}
