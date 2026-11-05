// The blog index and homepage must only link to complete, published articles.
export const ARTICLES_QUERY = `*[
  _type == "article" &&
  !(_id in path("drafts.**")) &&
  defined(title) &&
  defined(slug.current) &&
  count(body) > 0
] | order(publishedAt desc){
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  publishedAt,
  category
}`

// Category landing pages list complete, published CMS articles only.
// Legacy static cards are appended separately when a slug is not in Sanity.
export const ARTICLES_BY_CATEGORY_QUERY = `*[
  _type == "article" &&
  !(_id in path("drafts.**")) &&
  category == $category &&
  defined(title) &&
  defined(slug.current) &&
  count(body) > 0
] | order(publishedAt desc){
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  publishedAt
}`

// Contextual links use only complete, published articles in the same topic cluster.
// Topic collections: a published article can belong to multiple concerns or
// ingredients. Explicit legacy slugs keep older articles discoverable without
// mutating existing Sanity documents.
export const ARTICLES_BY_TOPIC_QUERY = `*[
  _type == "article" &&
  !(_id in path("drafts.**")) &&
  defined(title) &&
  defined(slug.current) &&
  count(body) > 0 &&
  ($topic in topics || slug.current in $legacySlugs)
] | order(publishedAt desc){
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  publishedAt,
  category,
  topics
}`

export const RELATED_ARTICLES_QUERY = `*[
  _type == "article" &&
  !(_id in path("drafts.**")) &&
  defined(title) &&
  defined(slug.current) &&
  count(body) > 0 &&
  category == $category &&
  slug.current != $slug
] | order(publishedAt desc)[0...3]{
  _id,
  title,
  slug
}`

export const ARTICLE_BY_SLUG_QUERY = `*[_type == "article" && !(_id in path("drafts.**")) && slug.current == $slug][0]{
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  body,
  category,
  topics,
  publishedAt,
  _updatedAt,
  seoTitle,
  seoDescription,
  directAnswer,
  faqs[]{question, answer},
  authorName,
  authorBio,
  reviewerName,
  sources[]{title, url}
}`

export const CONCERNS_QUERY = `*[_type == "concern"]{
  _id,
  title,
  slug,
  image,
  emoji,
  description,
  overview,
  causesIntro,
  causes,
  treatmentsIntro,
  treatments,
  avoidIntro,
  avoid,
  routineIntro,
  routine,
  dermIntro,
  seeADermatologistIf
}`

export const CONCERN_BY_SLUG_QUERY = `*[_type == "concern" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  image,
  emoji,
  description,
  overview,
  causesIntro,
  causes,
  treatmentsIntro,
  treatments,
  avoidIntro,
  avoid,
  routineIntro,
  routine,
  dermIntro,
  seeADermatologistIf
}`
export const PRODUCTS_QUERY = `*[_type == "product"]{
  _id,
  title,
  slug,
  brand,
  image,
  price,
  buyLink,
  rating,
  reviewCount,
  description,
  featuresIntro,
  features,
  howToUseIntro,
  howToUse,
  relatedArticleSlugs,
  reviews
}`

export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  brand,
  image,
  price,
  buyLink,
  rating,
  reviewCount,
  description,
  featuresIntro,
  features,
  howToUseIntro,
  howToUse,
  relatedArticleSlugs,
  reviews
}`
export const INGREDIENTS_QUERY = `*[_type == "ingredient"]{
  _id,
  name,
  slug,
  image,
  description,
  introduction,
  howItWorks,
  benefits,
  bestFor,
  howToUse,
  pairsWith,
  avoidWith,
  proTip,
  faqs[]{
    question,
    answer
  }
}`;

export const INGREDIENT_BY_SLUG_QUERY = `*[_type == "ingredient" && slug.current == $slug][0]{
  _id,
  name,
  slug,
  image,
  description,
  introduction,
  howItWorks,
  benefits,
  bestFor,
  howToUse,
  pairsWith,
  avoidWith,
  proTip,
  faqs[]{
    question,
    answer
  }
}`;