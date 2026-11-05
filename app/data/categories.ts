export interface Category {
  slug: string;
  label: string;
  intro: string;
}

export const categories: Category[] = [
  {
    slug: "beginner-guide",
    label: "Beginner Guide",
    intro:
      "New to skincare? Start here. These guides break down the basics — cleansing, moisturizing, sun protection, and how to build a routine that actually sticks — without the overwhelm of a hundred products.",
  },
  {
    slug: "acne-care",
    label: "Acne Care",
    intro:
      "From clogged pores to cystic breakouts, acne is one of the most common (and frustrating) skin concerns. These articles cover the ingredients, routines, and habits that actually help clear and prevent breakouts.",
  },
  {
    slug: "sun-protection",
    label: "Sun Protection",
    intro:
      "Sunscreen is the single most important step in any skincare routine. Here's everything on choosing the right SPF, reapplying correctly, and separating sun-care facts from common myths.",
  },
  {
    slug: "routine-building",
    label: "Routine Building",
    intro: "Build a manageable morning or evening skincare routine, understand product order and introduce ingredients carefully.",
  },
  {
    slug: "ingredient-guide",
    label: "Ingredient Guide",
    intro: "Explore research-informed ingredient explainers, comparisons and practical usage guidance.",
  },
  {
    slug: "skin-science",
    label: "Skin Science",
    intro: "Understand the skin barrier, how skincare ingredients work and the evidence behind common claims.",
  },
];