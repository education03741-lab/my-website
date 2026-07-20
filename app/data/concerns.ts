export interface RoutineStep {
  time: "AM" | "PM";
  steps: string[];
}

export interface Concern {
  id: number;
  title: string;
  slug: string;
  image: string;
  emoji: string;
  description: string;
  overview: string;
  causesIntro: string;
  causes: string[];
  treatmentsIntro: string;
  treatments: string[];
  avoidIntro: string;
  avoid: string[];
  routineIntro: string;
  routine: RoutineStep[];
  dermIntro: string;
  seeADermatologistIf: string[];
}

export const concerns: Concern[] = [
  {
    id: 1,
    title: "Acne",
    slug: "acne",
    image: "/images/concerns/acne.jpg",
    emoji: "✨",
    description:
      "Acne is one of the most common skin conditions caused by clogged pores, excess oil, bacteria, and inflammation.",
    overview:
      "Acne shows up when hair follicles become clogged with oil and dead skin cells, creating the perfect environment for bacteria to thrive. The result is anything from small blackheads and whiteheads to deeper, more painful cystic breakouts. It's easy to think of acne as just a teenage issue, but hormonal fluctuations, stress, and even the wrong skincare routine can trigger it well into adulthood. The good news is that with a consistent, well-matched routine, most acne is manageable at home — it just takes patience and the right ingredients working together rather than against each other.",
    causesIntro:
      "Acne rarely comes from a single cause — it's usually a combination of factors building up over time. Understanding what's driving your breakouts is the first step to actually treating them instead of just reacting to them.",
    causes: [
      "Excess oil production",
      "Clogged pores",
      "Hormonal changes",
      "Acne-causing bacteria",
    ],
    treatmentsIntro:
      "Effective acne treatment works on more than one front at once — clearing existing breakouts while preventing new ones from forming. These are the ingredients dermatologists reach for most often, and each tackles a different part of the problem.",
    treatments: [
      "Salicylic Acid",
      "Niacinamide",
      "Benzoyl Peroxide",
      "Retinoids",
    ],
    avoidIntro:
      "Just as important as what you add to your routine is what you leave out. A lot of acne-prone skin gets worse not from lack of effort, but from products and habits that quietly work against it.",
    avoid: [
      "Heavy, pore-clogging oils and butters (comedogenic ingredients)",
      "Harsh physical scrubs — they can worsen inflammation",
      "Alcohol-heavy toners that over-dry and trigger more oil production",
      "Picking or popping breakouts",
    ],
    routineIntro:
      "Consistency matters more than complexity here. A simple, repeatable routine morning and night — one that treats without over-stripping — tends to outperform an aggressive multi-step regimen that irritates the skin barrier.",
    routine: [
      {
        time: "AM",
        steps: [
          "Gentle cleanser",
          "Niacinamide serum",
          "Oil-free moisturizer",
          "Broad-spectrum SPF 30+",
        ],
      },
      {
        time: "PM",
        steps: [
          "Gentle cleanser (double cleanse if wearing makeup/SPF)",
          "Salicylic acid or benzoyl peroxide treatment (start 2–3x/week)",
          "Lightweight, non-comedogenic moisturizer",
        ],
      },
    ],
    dermIntro:
      "Most acne responds well to consistent at-home care, but some cases need more than the drugstore aisle can offer. Here's when it's worth booking a dermatologist appointment instead of pushing through alone.",
    seeADermatologistIf: [
      "Breakouts are cystic, painful, or leaving dark marks/scars",
      "Over-the-counter treatments show no improvement after 8–12 weeks",
      "Acne is sudden, severe, or appears alongside other symptoms",
    ],
  },

  {
    id: 2,
    title: "Dry Skin",
    slug: "dry-skin",
    image: "/images/concerns/dry-skin.jpg",
    emoji: "💧",
    description:
      "Dry skin lacks moisture and often feels tight, rough, or flaky.",
    overview:
      "Dry skin happens when the skin barrier can't hold onto enough moisture, leaving it feeling tight, rough, or visibly flaky — sometimes accompanied by fine lines that seem more pronounced than usual. It's often worse in winter or dry climates, but harsh products and hot showers can cause it year-round regardless of the weather outside. The key to fixing dry skin isn't just slathering on more moisturizer; it's rebuilding the barrier so skin can actually retain the hydration you're giving it.",
    causesIntro:
      "Dryness is usually the skin barrier signaling that it's lost more moisture than it can replace. A few everyday habits are common culprits, even ones that feel harmless.",
    causes: [
      "Cold weather",
      "Hot showers",
      "Harsh cleansers",
      "Low humidity",
    ],
    treatmentsIntro:
      "The goal with dry skin is twofold: pull moisture in, then seal it there so it doesn't evaporate straight back out. These ingredients are the ones that do that job best.",
    treatments: [
      "Hyaluronic Acid",
      "Ceramides",
      "Rich moisturizers",
      "Gentle cleanser",
    ],
    avoidIntro:
      "Dry skin is often made worse — not better — by products marketed as 'deep cleaning' or 'purifying.' If your skin already feels tight after washing, these are usually why.",
    avoid: [
      "Sulfate-based cleansers (SLS/SLES) that strip natural oils",
      "Hot water — use lukewarm instead",
      "Alcohol-based toners and astringents",
      "Fragrance, which can further irritate already-compromised skin",
    ],
    routineIntro:
      "Layering hydration correctly makes a bigger difference than any single product. Applying serum to slightly damp skin, then sealing with a richer cream, helps lock moisture in rather than letting it sit on the surface.",
    routine: [
      {
        time: "AM",
        steps: [
          "Cream or oil-based gentle cleanser",
          "Hyaluronic acid serum on damp skin",
          "Rich, ceramide-based moisturizer",
          "SPF 30+ moisturizer or sunscreen",
        ],
      },
      {
        time: "PM",
        steps: [
          "Gentle cleanser",
          "Hydrating serum (hyaluronic acid or glycerin)",
          "Heavier night cream or facial oil to lock in moisture",
        ],
      },
    ],
    dermIntro:
      "Most dryness improves within a few weeks of a gentler, barrier-focused routine. But persistent or worsening symptoms can point to something beyond ordinary dryness.",
    seeADermatologistIf: [
      "Skin cracks, bleeds, or becomes painful",
      "Dryness comes with intense itching, redness, or scaly patches",
      "Moisturizing consistently for several weeks brings no relief",
    ],
  },

  {
    id: 3,
    title: "Oily Skin",
    slug: "oily-skin",
    image: "/images/concerns/oily-skin.jpg",
    emoji: "🌿",
    description:
      "Oily skin produces excess sebum which can lead to enlarged pores and acne.",
    overview:
      "Oily skin comes from overactive sebaceous glands producing more oil than the skin actually needs, often leaving a persistent shine, enlarged-looking pores, and a tendency toward breakouts. It's largely genetic, but it can also be triggered — or made worse — by the very products people use to try to control it. Ironically, the instinct to strip oil away with harsh cleansers usually backfires, prompting skin to produce even more oil to compensate. Managing oily skin well means balancing it, not fighting it.",
    causesIntro:
      "Oil production is influenced by a mix of biology and daily habits, which is why two people can have very different experiences with what looks like the same skin type.",
    causes: [
      "Genetics",
      "Hormones",
      "Overwashing",
      "Climate",
    ],
    treatmentsIntro:
      "The most effective ingredients for oily skin work by regulating oil production and keeping pores clear — without over-drying skin into a rebound cycle of more oil.",
    treatments: [
      "Niacinamide",
      "Gel moisturizer",
      "Salicylic Acid",
      "Clay masks",
    ],
    avoidIntro:
      "It's tempting to over-cleanse or reach for the harshest product on the shelf when skin feels oily, but that approach almost always makes things worse in the long run.",
    avoid: [
      "Heavy oils and butters that sit on top of already-oily skin",
      "Over-washing or harsh astringents — stripping oil triggers skin to produce more",
      "Alcohol-based products that irritate and rebound-trigger oil production",
      "Skipping moisturizer — dehydrated skin can overcompensate with more oil",
    ],
    routineIntro:
      "A lightweight, consistent routine that hydrates without adding heaviness is what actually keeps oil production in check over time, rather than a routine built entirely around stripping and mattifying.",
    routine: [
      {
        time: "AM",
        steps: [
          "Gel or foam cleanser",
          "Niacinamide serum",
          "Lightweight gel moisturizer",
          "Oil-free, matte-finish SPF 30+",
        ],
      },
      {
        time: "PM",
        steps: [
          "Double cleanse if wearing sunscreen/makeup",
          "Salicylic acid treatment (2–3x/week)",
          "Gel moisturizer",
          "Clay mask 1x/week for extra oil control",
        ],
      },
    ],
    dermIntro:
      "Oily skin on its own usually isn't a medical concern, but paired with certain other signs, it's worth a professional opinion.",
    seeADermatologistIf: [
      "Excess oil is paired with persistent, painful breakouts",
      "Pores appear to be getting visibly larger or more inflamed over time",
      "Nothing over-the-counter is controlling shine or breakouts after consistent use",
    ],
  },

  {
    id: 4,
    title: "Sensitive Skin",
    slug: "sensitive-skin",
    image: "/images/concerns/sensitive-skin.jpg",
    emoji: "🩷",
    description:
      "Sensitive skin reacts easily to skincare products and environmental factors.",
    overview:
      "Sensitive skin reacts more readily than average to products, weather, and even fabric — often with redness, stinging, or itching that can appear within minutes of applying something new. This heightened reactivity usually comes down to a compromised skin barrier, which lets irritants penetrate more easily than they would on resilient skin. The fix isn't more products, it's fewer, gentler ones — giving the barrier space to repair itself before layering anything active back on.",
    causesIntro:
      "Sensitivity is rarely random. It's almost always tied to something weakening the skin's natural protective barrier, which then leaves it exposed to everyday triggers.",
    causes: [
      "Weak skin barrier",
      "Fragrance",
      "Weather",
      "Allergies",
    ],
    treatmentsIntro:
      "For sensitive skin, 'treatment' means calming and rebuilding rather than treating aggressively. These ingredients support the barrier without adding fuel to the reaction.",
    treatments: [
      "Fragrance-free products",
      "Ceramides",
      "Gentle cleanser",
      "Barrier repair cream",
    ],
    avoidIntro:
      "Sensitive skin often reacts to ingredients that are marketed as gentle or natural but are actually common triggers in disguise.",
    avoid: [
      "Fragrance and essential oils, even 'natural' ones",
      "Sulfates and harsh surfactants",
      "Physical exfoliants (scrubs) — opt for gentle chemical exfoliation if needed",
      "Introducing multiple new products at once — patch test and add one at a time",
    ],
    routineIntro:
      "Less is genuinely more here. A short, repeatable routine with barrier-focused products gives sensitive skin the best chance to stay calm day to day.",
    routine: [
      {
        time: "AM",
        steps: [
          "Fragrance-free gentle cleanser (or water rinse only)",
          "Soothing, barrier-repair serum",
          "Ceramide moisturizer",
          "Mineral (zinc oxide/titanium dioxide) SPF 30+",
        ],
      },
      {
        time: "PM",
        steps: [
          "Fragrance-free gentle cleanser",
          "Barrier repair cream or ointment",
        ],
      },
    ],
    dermIntro:
      "Sensitivity that doesn't settle with a simplified routine can sometimes signal an underlying condition that benefits from professional diagnosis.",
    seeADermatologistIf: [
      "Redness, burning, or itching is frequent or long-lasting",
      "Reactions happen even with fragrance-free, 'sensitive skin' labeled products",
      "You notice swelling, hives, or signs of an allergic reaction",
    ],
  },

  {
    id: 5,
    title: "Pigmentation",
    slug: "pigmentation",
    image: "/images/concerns/pigmentation.jpg",
    emoji: "☀️",
    description:
      "Pigmentation causes uneven skin tone and dark patches.",
    overview:
      "Pigmentation refers to patches of skin that appear darker than the surrounding area, caused by an overproduction of melanin. It's most commonly triggered by sun exposure, but can also follow acne breakouts, hormonal shifts, or any inflammation the skin has experienced. Because pigmentation forms below the surface, it tends to respond slowly to treatment — often taking several months of consistency before real change is visible, which is why sunscreen and patience matter just as much as the active ingredients themselves.",
    causesIntro:
      "Pigmentation is the skin's response to a trigger, not a random occurrence — identifying what set it off helps determine which treatment approach will actually work.",
    causes: [
      "Sun exposure",
      "Acne scars",
      "Hormones",
      "Inflammation",
    ],
    treatmentsIntro:
      "Brightening pigmentation is a slow, steady process built on ingredients that both fade existing dark spots and prevent new ones from forming.",
    treatments: [
      "Vitamin C",
      "Niacinamide",
      "Retinol",
      "Daily Sunscreen",
    ],
    avoidIntro:
      "Progress on pigmentation can be undone quickly by a few common mistakes — most of them centered around sun protection and impatience.",
    avoid: [
      "Skipping sunscreen — this is the single biggest driver of worsening pigmentation",
      "Harsh scrubs on already-inflamed or pigmented areas",
      "Unregulated high-strength lightening products bought without guidance",
      "Picking at acne, which can leave lasting dark marks",
    ],
    routineIntro:
      "Morning sun protection and evening actives work together here — one prevents new pigmentation, the other fades what's already there.",
    routine: [
      {
        time: "AM",
        steps: [
          "Gentle cleanser",
          "Vitamin C serum",
          "Moisturizer",
          "Broad-spectrum SPF 30–50, reapplied through the day",
        ],
      },
      {
        time: "PM",
        steps: [
          "Gentle cleanser",
          "Niacinamide or retinol treatment (alternate nights if new to retinol)",
          "Moisturizer",
        ],
      },
    ],
    dermIntro:
      "Most pigmentation can be managed at home with time, but certain changes are worth having a professional look at directly.",
    seeADermatologistIf: [
      "A dark patch changes shape, color, or size suddenly",
      "Pigmentation is widespread or not responding to consistent SPF + treatment use",
      "You want to explore in-office options (peels, lasers) for faster results",
    ],
  },

  {
    id: 6,
    title: "Anti-Aging",
    slug: "anti-aging",
    image: "/images/concerns/anti-aging.jpg",
    emoji: "⭐",
    description:
      "Fine lines and wrinkles develop naturally as collagen production decreases with age.",
    overview:
      "Fine lines and wrinkles are a natural part of aging, driven by a gradual decline in collagen and elastin production that leaves skin less firm and less able to bounce back. While aging itself can't be stopped, how quickly it shows up on the skin is heavily influenced by daily habits — sun exposure alone is responsible for the majority of visible premature aging. A consistent routine built around protection and gentle stimulation of cell turnover can meaningfully slow how these changes show up over time.",
    causesIntro:
      "Aging skin is shaped by two forces at once: the biological clock, which no product can pause, and environmental and lifestyle factors, which are much more within your control.",
    causes: [
      "Aging",
      "UV exposure",
      "Smoking",
      "Poor skincare habits",
    ],
    treatmentsIntro:
      "The most well-studied anti-aging ingredients work by either protecting existing collagen or encouraging skin to produce more of it — daily sunscreen does more heavy lifting here than any serum.",
    treatments: [
      "Retinol",
      "Vitamin C",
      "Peptides",
      "Daily SPF",
    ],
    avoidIntro:
      "A few habits quietly undo the benefits of even the best anti-aging routine, often without people realizing it.",
    avoid: [
      "Skipping daily SPF — UV exposure is the leading cause of premature aging",
      "Over-exfoliating, which weakens the skin barrier and accelerates aging signs",
      "Introducing retinol at high strength too quickly — start low and slow",
      "Extreme or crash diets, and smoking, both of which break down collagen",
    ],
    routineIntro:
      "Anti-aging routines work best as a long game — daily antioxidant and SPF protection in the morning, paired with a gradual, well-tolerated retinol routine at night.",
    routine: [
      {
        time: "AM",
        steps: [
          "Gentle cleanser",
          "Vitamin C serum (antioxidant protection)",
          "Peptide moisturizer",
          "Broad-spectrum SPF 30+, non-negotiable",
        ],
      },
      {
        time: "PM",
        steps: [
          "Cleanser",
          "Retinol (2–3x/week to start, building up tolerance)",
          "Rich moisturizer to offset retinol dryness",
        ],
      },
    ],
    dermIntro:
      "At-home routines can meaningfully slow visible aging, but a dermatologist can offer options that go further when you're ready for them.",
    seeADermatologistIf: [
      "You want a personalized retinoid strength or prescription-grade option",
      "Fine lines are accompanied by significant volume loss or skin laxity",
      "You're considering in-office treatments (peels, microneedling, injectables)",
    ],
  },
];