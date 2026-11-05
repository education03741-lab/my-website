/**
 * Public article-topic collections. Keep these slugs stable: archive URLs
 * use /blog/topic/[slug] and article documents store the same slug values.
 * These topic collections are distinct from evergreen ingredient/concern guides.
 */
export type ArticleTopic = {
  slug: string;
  label: string;
  group: "concern" | "ingredient";
  description: string;
  guideHref: string;
};

export const articleTopics: ArticleTopic[] = [
  { slug: "acne", label: "Acne", group: "concern", description: "Evidence-aware articles about blemishes, breakouts, ingredients and gentle routines.", guideHref: "/skin-concerns/acne" },
  { slug: "dry-skin", label: "Dry Skin", group: "concern", description: "Moisture-barrier basics, hydration and practical care for dry skin.", guideHref: "/skin-concerns/dry-skin" },
  { slug: "oily-skin", label: "Oily Skin", group: "concern", description: "Understand facial oiliness, pore congestion and suitable skincare routines.", guideHref: "/skin-concerns/oily-skin" },
  { slug: "sensitive-skin", label: "Sensitive Skin", group: "concern", description: "Gentle skincare, irritation avoidance and skin-barrier support.", guideHref: "/skin-concerns/sensitive-skin" },
  { slug: "pigmentation", label: "Pigmentation", group: "concern", description: "Uneven tone, post-breakout marks and practical sun-protection guidance.", guideHref: "/skin-concerns/pigmentation" },
  { slug: "anti-aging", label: "Anti-Aging", group: "concern", description: "Learn about skin changes over time, photoprotection and ingredient evidence.", guideHref: "/skin-concerns/anti-aging" },
  { slug: "niacinamide", label: "Niacinamide", group: "ingredient", description: "Niacinamide benefits, formulation choices and ingredient comparisons.", guideHref: "/ingredients/niacinamide" },
  { slug: "vitamin-c", label: "Vitamin C", group: "ingredient", description: "Vitamin C serums, skin-tone questions and skincare comparisons.", guideHref: "/ingredients/vitamin-c" },
  { slug: "hyaluronic-acid", label: "Hyaluronic Acid", group: "ingredient", description: "Hydration, humectants and skincare routines using hyaluronic acid.", guideHref: "/ingredients/hyaluronic-acid" },
  { slug: "retinol", label: "Retinol", group: "ingredient", description: "Retinol basics, irritation precautions and effective routine layering.", guideHref: "/ingredients/retinol" },
];

export const getArticleTopic = (slug: string): ArticleTopic | undefined =>
  articleTopics.find((topic) => topic.slug === slug);

/**
 * Small explicit bridge for existing published articles whose Sanity documents
 * predate the new topics[] field. New articles should use topics[] in Sanity.
 * Do not infer an ingredient topic from full text alone.
 */
const existingArticleTopics: Record<string, string[]> = {
  "top-7-ingredients-for-acne-prone-skin": ["acne"],
  "why-your-acne-won-t-go-away-despite-using-skincare-and-what-to-do-instead": ["acne"],
  "acne-scars-natural-home-remedies-that-actually-work": ["acne", "pigmentation"],
  "what-is-oily-skin-causes-signs-and-how-to-care-for-it": ["oily-skin"],
  "oily-acne-prone-skin-routine-guide": ["oily-skin", "acne"],
  "vitamin-c-vs-niacinamide": ["vitamin-c", "niacinamide"],
  "niacinamide-vs-salicylic-acid-for-oily-skin": ["niacinamide", "oily-skin", "acne"],
  "layering-actives-guide": ["retinol", "sensitive-skin"],
  "understanding-skin-barrier": ["sensitive-skin", "dry-skin"],
  "skin-barrier-repair-101-signs-of-damage-what-actually-works-and-how-long-it-takes-to-heal": ["sensitive-skin", "dry-skin"],
  "what-is-the-skin-barrier-a-beginner-s-guide-to-your-skin-s-protective-shield": ["sensitive-skin", "dry-skin"],
  "dark-spots-and-hyperpigmentation-what-actually-fades-them-and-what-s-a-waste-of-money": ["pigmentation", "vitamin-c"],
};

// The existing primary "Acne Care" category also implies the Acne topic.
// Other primary categories are too broad to infer a specific ingredient.
export const getImplicitTopicSlugs = (category?: string | null): string[] =>
  category === "Acne Care" ? ["acne"] : [];

export function getLegacyTopicSlugs(articleSlug: string): string[] {
  return existingArticleTopics[articleSlug] ?? [];
}

export function getLegacySlugsForTopic(topicSlug: string): string[] {
  return Object.entries(existingArticleTopics)
    .filter(([, topics]) => topics.includes(topicSlug))
    .map(([articleSlug]) => articleSlug);
}

export function articleBelongsToTopic(
  topicSlug: string,
  articleSlug: string,
  assignedTopics?: string[] | null
): boolean {
  return Boolean(assignedTopics?.includes(topicSlug) || getLegacyTopicSlugs(articleSlug).includes(topicSlug));
}
