import Image from "next/image";
import Link from "next/link";
import { cache } from "react";
import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ComingSoon from "../../components/ComingSoon";
import BuyButton from "../../components/BuyButton";
import { products as staticProducts, Product } from "../../data/products";
import { posts } from "../../data/posts";
import { client } from "../../../sanity/lib/client";
import { PRODUCT_BY_SLUG_QUERY } from "../../../sanity/lib/queries";
import { urlFor } from "../../../sanity/lib/image";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// cache() dedupes this so generateMetadata() and the page component
// share one Sanity fetch instead of two per page load
const getProduct = cache(async (slug: string): Promise<Product | undefined> => {
  let product: Product | undefined = staticProducts.find((p) => p.slug === slug);

  if (!product) {
    const sanityProduct = await client.fetch(PRODUCT_BY_SLUG_QUERY, { slug });

    if (sanityProduct) {
      product = {
        id: 9999,
        title: sanityProduct.title,
        slug: sanityProduct.slug?.current,
        brand: sanityProduct.brand ?? "",
        image: sanityProduct.image
          ? urlFor(sanityProduct.image).width(800).height(600).url()
          : "",
        price: sanityProduct.price ?? "",
        buyLink: sanityProduct.buyLink ?? "",
        rating: sanityProduct.rating ?? 0,
        reviewCount: sanityProduct.reviewCount ?? 0,
        description: sanityProduct.description ?? "",
        featuresIntro: sanityProduct.featuresIntro ?? "",
        features: sanityProduct.features ?? [],
        howToUseIntro: sanityProduct.howToUseIntro ?? "",
        howToUse: sanityProduct.howToUse ?? [],
        relatedArticleSlugs: sanityProduct.relatedArticleSlugs ?? [],
        reviews: sanityProduct.reviews ?? [],
      };
    }
  }

  return product;
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Coming Soon",
      robots: { index: false, follow: true },
    };
  }

  const title = `${product.title}${product.brand ? " by " + product.brand : ""}`;
  const description =
    product.description?.slice(0, 155) ||
    `Shop ${product.title} — reviews, ingredients, and how to use it.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.image ? [{ url: product.image, width: 800, height: 600 }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.image ? [product.image] : [],
    },
    alternates: {
      canonical: `/products/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    return (
      <>
        <Navbar />
        <ComingSoon
          backHref="/products"
          backLabel="Back to Products"
          itemLabel="product"
        />
        <Footer />
      </>
    );
  }

  const relatedArticles = posts.filter((post) =>
    product.relatedArticleSlugs.includes(post.slug)
  );

  return (
    <>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
            image: product.image ? [product.image] : undefined,
            description: product.description,
            offers: product.price
              ? {
                  "@type": "Offer",
                  price: product.price,
                  priceCurrency: "USD",
                  url: product.buyLink || undefined,
                  availability: "https://schema.org/InStock",
                }
              : undefined,
            aggregateRating:
              product.rating && product.reviewCount
                ? {
                    "@type": "AggregateRating",
                    ratingValue: product.rating,
                    reviewCount: product.reviewCount,
                  }
                : undefined,
          }),
        }}
      />

      <main className="max-w-4xl mx-auto px-6 py-20">
        <Link
          href="/products"
          className="text-pink-600 font-semibold hover:underline"
        >
          ← Back to Products
        </Link>

        <div className="mt-8 grid md:grid-cols-2 gap-10">
          <div className="relative h-96 w-full overflow-hidden rounded-3xl">
            {product.image && (
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
                priority
              />
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-pink-600">{product.brand}</p>

            <h1 className="mt-2 text-4xl font-extrabold text-gray-900 leading-tight">
              {product.title}
            </h1>

            <div className="mt-3 flex items-center gap-3">
              <span className="text-yellow-500 font-semibold">
                Rating: {product.rating}
              </span>
              <span className="text-gray-500 text-sm">
                ({product.reviewCount} reviews)
              </span>
            </div>

            <p className="mt-4 text-2xl font-bold text-gray-900">
              {product.price}
            </p>

            <p className="mt-4 text-gray-600">{product.description}</p>

            <BuyButton buyLink={product.buyLink} productTitle={product.title} />
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          <p className="text-gray-600 mb-6">{product.featuresIntro}</p>
          <ul className="grid sm:grid-cols-2 gap-3">
            {product.features.map((feature) => (
              <li
                key={feature}
                className="rounded-2xl bg-pink-50 px-5 py-3 text-gray-800"
              >
                {feature}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-4">How to Use</h2>
          <p className="text-gray-600 mb-6">{product.howToUseIntro}</p>
          <ol className="space-y-2 list-decimal list-inside text-gray-700">
            {product.howToUse.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>

        {product.reviews.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>
            <div className="space-y-4">
              {product.reviews.map((review, i) => (
                <div key={i} className="rounded-2xl bg-white shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">
                      {review.name}
                    </span>
                    <span className="text-yellow-500 font-semibold">
                      Rating: {review.rating}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {relatedArticles.length > 0 && (
          <section className="mt-24">
            <h2 className="text-3xl font-bold mb-8">Mentioned In</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-56 w-full">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-sm text-pink-600 font-semibold uppercase">
                      {article.category}
                    </span>
                    <h3 className="mt-3 text-2xl font-bold">{article.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
