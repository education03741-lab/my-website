export const ARTICLES_QUERY = `*[_type == "article"] | order(publishedAt desc){
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  publishedAt
}`

export const ARTICLE_BY_SLUG_QUERY = `*[_type == "article" && !(_id in path("drafts.**")) && slug.current == $slug][0]{
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  body,
  category,
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