export interface Review {
  name: string;
  rating: number;
  comment: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  brand: string;
  image: string;
  price: string;
  buyLink: string;
  rating: number;
  reviewCount: number;
  description: string;
  featuresIntro: string;
  features: string[];
  howToUseIntro: string;
  howToUse: string[];
  relatedArticleSlugs: string[];
  reviews: Review[];
}

export const products: Product[] = [
  {
    id: 1,
    title: "Hydra-Glow Hyaluronic Acid Serum",
    slug: "hydra-glow-serum",
    brand: "GlowSkin Essentials",
    image: "/images/products/hydra-glow-serum.png",
    price: "24.99",
    buyLink: "#",
    rating: 4.6,
    reviewCount: 128,
    description:
      "A lightweight, fast-absorbing serum that delivers intense hydration using multiple molecular weights of hyaluronic acid, leaving skin plump and dewy without any greasy residue.",
    featuresIntro: "Why you'll love it:",
    features: [
      "Multi-weight hyaluronic acid for deep and surface-level hydration",
      "Fragrance-free and suitable for sensitive skin",
      "Lightweight, non-greasy texture that layers well under makeup",
      "Helps plump fine lines caused by dehydration",
    ],
    howToUseIntro: "How to use:",
    howToUse: [
      "Apply 2-3 drops to damp skin after cleansing",
      "Gently pat into skin, avoiding rubbing",
      "Follow with moisturizer to lock in hydration",
      "Use morning and night for best results",
    ],
    relatedArticleSlugs: ["understanding-skin-barrier", "layering-actives-guide"],
    reviews: [
      {
        name: "Amina R.",
        rating: 5,
        comment: "My skin has never looked this plump. A little goes a long way.",
      },
      {
        name: "Jordan T.",
        rating: 4,
        comment: "Great texture and absorbs fast, though I still need a heavier moisturizer in winter.",
      },
    ],
  },
  {
    id: 2,
    title: "Brightening Vitamin C Serum",
    slug: "vitamin-c-brightening-serum",
    brand: "GlowSkin Essentials",
    image: "/images/products/vitamin-c-brightening-serum.png",
    price: "28.99",
    buyLink: "#",
    rating: 4.4,
    reviewCount: 96,
    description:
      "A stabilized 15% vitamin C serum formulated to brighten dull skin tone, fade the look of dark spots, and provide antioxidant protection against daily environmental stress.",
    featuresIntro: "Why you'll love it:",
    features: [
      "Stabilized formula that stays potent and doesn't oxidize quickly",
      "Helps visibly brighten uneven skin tone over time",
      "Antioxidant protection against pollution and UV-related damage",
      "Pairs well with sunscreen for enhanced morning protection",
    ],
    howToUseIntro: "How to use:",
    howToUse: [
      "Apply 3-4 drops to clean, dry skin each morning",
      "Wait 1-2 minutes before applying moisturizer",
      "Always follow with SPF during the day",
      "Store in a cool, dark place to preserve potency",
    ],
    relatedArticleSlugs: ["vitamin-c-vs-niacinamide", "how-to-choose-the-right-sunscreen"],
    reviews: [
      {
        name: "Priya M.",
        rating: 5,
        comment: "Noticed brighter skin within two weeks. Doesn't pill under makeup either.",
      },
      {
        name: "Dan K.",
        rating: 4,
        comment: "Works well but has a slight tingle the first few uses — settled down after that.",
      },
    ],
  },
  {
    id: 3,
    title: "Daily Gentle Cleanser",
    slug: "daily-gentle-cleanser",
    brand: "GlowSkin Essentials",
    image: "/images/products/daily-gentle-cleanser.png",
    price: "16.99",
    buyLink: "#",
    rating: 4.7,
    reviewCount: 214,
    description:
      "A sulfate-free, pH-balanced cleanser that removes dirt, oil, and makeup without stripping the skin barrier — gentle enough for daily use on all skin types, including sensitive skin.",
    featuresIntro: "Why you'll love it:",
    features: [
      "Sulfate-free formula that won't strip natural oils",
      "pH-balanced to support a healthy skin barrier",
      "Suitable for morning and evening use",
      "Fragrance-free and dermatologist-tested for sensitive skin",
    ],
    howToUseIntro: "How to use:",
    howToUse: [
      "Wet face with lukewarm water",
      "Massage a small amount onto skin for 30-60 seconds",
      "Rinse thoroughly and pat dry",
      "Follow with the rest of your routine",
    ],
    relatedArticleSlugs: ["understanding-skin-barrier", "beginners-skincare-routine"],
    reviews: [
      {
        name: "Sofia L.",
        rating: 5,
        comment: "Finally a cleanser that doesn't leave my face feeling tight afterward.",
      },
      {
        name: "Marcus B.",
        rating: 5,
        comment: "Gentle but actually removes sunscreen properly. My go-to now.",
      },
    ],
  },
  {
    id: 4,
    title: "Niacinamide Pore Refining Toner",
    slug: "niacinamide-toner",
    brand: "GlowSkin Essentials",
    image: "/images/products/niacinamide-toner.png",
    price: "19.99",
    buyLink: "#",
    rating: 4.5,
    reviewCount: 172,
    description:
      "A 5% niacinamide toner that helps regulate oil production, minimize the look of enlarged pores, and calm redness — a lightweight step that layers easily with the rest of your routine.",
    featuresIntro: "Why you'll love it:",
    features: [
      "5% niacinamide to help balance oil production",
      "Helps minimize the appearance of enlarged pores over time",
      "Calming formula suitable for daily use",
      "Alcohol-free, won't dry out or irritate skin",
    ],
    howToUseIntro: "How to use:",
    howToUse: [
      "Apply to a cotton pad or pat directly into skin after cleansing",
      "Use morning and night before serums and moisturizer",
      "Allow to fully absorb before next step",
      "Safe to use alongside most other actives",
    ],
    relatedArticleSlugs: ["vitamin-c-vs-niacinamide", "top-7-ingredients-for-acne-prone-skin"],
    reviews: [
      {
        name: "Elena V.",
        rating: 5,
        comment: "My pores look noticeably smaller after about a month of daily use.",
      },
      {
        name: "Tariq H.",
        rating: 4,
        comment: "Great lightweight toner, layers perfectly under my other products.",
      },
    ],
  },
];