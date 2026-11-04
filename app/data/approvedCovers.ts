/**
 * Approved, locally hosted editorial covers for Glow Skin.
 *
 * Keep these mappings separate from Sanity: they replace the artwork displayed
 * on the website without changing the source articles or CMS assets.
 */
const concernCovers: Readonly<Record<string, string>> = {
  acne: "/images/covers/acne.webp",
  "dry-skin": "/images/covers/dry-skin.webp",
  "oily-skin": "/images/covers/oily-skin.webp",
  "sensitive-skin": "/images/covers/sensitive-skin.webp",
  pigmentation: "/images/covers/pigmentation.webp",
  "anti-aging": "/images/covers/anti-aging.webp",
};

const ingredientCovers: Readonly<Record<string, string>> = {
  "hyaluronic-acid": "/images/covers/hyaluronic-acid.webp",
  niacinamide: "/images/covers/niacinamide.webp",
  retinol: "/images/covers/retinol.webp",
};

const articleCovers: Readonly<Record<string, string>> = {
  "understanding-skin-barrier": "/images/covers/understanding-skin-barrier.webp",
};

export const getConcernCover = (slug?: string | null): string | undefined =>
  slug ? concernCovers[slug] : undefined;

export const getIngredientCover = (slug?: string | null): string | undefined =>
  slug ? ingredientCovers[slug] : undefined;

export const getArticleCover = (slug?: string | null): string | undefined =>
  slug ? articleCovers[slug] : undefined;
