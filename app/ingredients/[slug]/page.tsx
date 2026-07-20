import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { cache } from "react";
import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ComingSoon from "../../components/ComingSoon";
import { ingredients as staticIngredients, Ingredient } from "../../data/ingredients";
import { client } from "../../../sanity/lib/client";
import { INGREDIENT_BY_SLUG_QUERY } from "../../../sanity/lib/queries";
import { urlFor } from "../../../sanity/lib/image";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// cache() dedupes this so generateMetadata() and the page component
// share one Sanity fetch instead of two per page load
const getIngredient = cache(async (slug: string): Promise<Ingredient | undefined> => {
  let ingredient: Ingredient | undefined = staticIngredients.find((item) => item.slug === slug);

  if (!ingredient) {
    const sanityIngredient = await client.fetch(INGREDIENT_BY_SLUG_QUERY, { slug });

    if (sanityIngredient) {
      ingredient = {
        id: 9999,
        name: sanityIngredient.name,
        slug: sanityIngredient.slug?.current,
        image: sanityIngredient.image
          ? urlFor(sanityIngredient.image).width(1200).height(700).url()
          : "",
        description: sanityIngredient.description ?? "",
        benefits: sanityIngredient.benefits ?? [],
        howItWorks: sanityIngredient.howItWorks ?? "",
        keyBenefits: sanityIngredient.keyBenefits ?? [],
        bestFor: sanityIngredient.bestFor ?? [],
        howToUse: sanityIngredient.howToUse ?? "",
        pairsWith: sanityIngredient.pairsWith ?? [],
        avoidWith: sanityIngredient.avoidWith ?? [],
        proTip: sanityIngredient.proTip ?? "",
        faqs: sanityIngredient.faqs ?? [],
      };
    }
  }

  return ingredient;
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const ingredient = await getIngredient(slug);

  if (!ingredient) {
    return {
      title: "Ingredient Coming Soon",
      robots: { index: false, follow: true },
    };
  }

  const title = `${ingredient.name}: Benefits, How to Use & More`;
  const description =
    ingredient.description?.slice(0, 155) ||
    `Learn about ${ingredient.name} — benefits, how it works, and how to use it.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ingredient.image ? [{ url: ingredient.image, width: 1200, height: 700 }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ingredient.image ? [ingredient.image] : [],
    },
    alternates: { canonical: `/ingredients/${ingredient.slug}` },
  };
}

export default async function IngredientPage({ params }: PageProps) {
  const { slug } = await params;

  const ingredient = await getIngredient(slug);

  if (!ingredient) {
    return (
      <>
        <Navbar />
        <ComingSoon
          backHref="/ingredients"
          backLabel="Back to Ingredients"
          itemLabel="ingredient guide"
        />
        <Footer />
      </>
    );
  }

  const relatedIngredients = staticIngredients
    .filter((item) => item.id !== ingredient.id)
    .slice(0, 3);

  return (
    <>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: ingredient.name,
            image: ingredient.image ? [ingredient.image] : undefined,
            description: ingredient.description,
          }),
        }}
      />

      {ingredient.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: ingredient.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            }),
          }}
        />
      )}

      <main className="mx-auto max-w-4xl px-6 py-20">
        <Link
          href="/ingredients"
          className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Ingredients
        </Link>

        <div className="mt-10">
          {ingredient.image && (
            <div className="relative h-96 w-full overflow-hidden rounded-3xl">
              <Image
                src={ingredient.image}
                alt={ingredient.name}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          <h1 className="mt-8 font-heading text-5xl font-bold text-charcoal dark:text-white">
            {ingredient.name}
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            {ingredient.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {ingredient.bestFor.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary-light/40 px-4 py-1.5 text-sm font-medium text-primary-dark dark:bg-primary-dark/30 dark:text-primary-light"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-3xl font-bold text-charcoal dark:text-white">
            How It Works
          </h2>
          <p className="mt-4 leading-8 text-gray-600 dark:text-gray-300">
            {ingredient.howItWorks}
          </p>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-bold text-charcoal dark:text-white">
            Key Benefits
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {ingredient.keyBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl bg-primary-light/20 p-5 dark:bg-primary-dark/20"
              >
                <div className="flex items-center gap-2 font-semibold text-primary-dark dark:text-primary-light">
                  <CheckCircle2 size={18} />
                  {benefit.title}
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {benefit.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-bold text-charcoal dark:text-white">
            How to Use
          </h2>
          <p className="mt-4 leading-8 text-gray-600 dark:text-gray-300">
            {ingredient.howToUse}
          </p>
        </section>

        <section className="mt-16 grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="text-xl font-bold text-charcoal dark:text-white">
              Pairs Well With
            </h3>
            <ul className="mt-4 space-y-2">
              {ingredient.pairsWith.map((item) => (
                <li key={item} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-charcoal dark:text-white">
              Use With Caution
            </h3>
            <ul className="mt-4 space-y-2">
              {ingredient.avoidWith.map((item) => (
                <li key={item} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-16 flex gap-4 rounded-3xl bg-primary/10 p-6 dark:bg-primary/15">
          <Sparkles className="mt-1 flex-shrink-0 text-primary" size={22} />
          <div>
            <h3 className="font-bold text-charcoal dark:text-white">Pro Tip</h3>
            <p className="mt-1 leading-7 text-gray-600 dark:text-gray-300">
              {ingredient.proTip}
            </p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-bold text-charcoal dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="mt-6 space-y-4">
            {ingredient.faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl border border-primary-light p-5 dark:border-primary-dark/40"
              >
                <h4 className="font-semibold text-charcoal dark:text-white">
                  {faq.question}
                </h4>
                <p className="mt-2 leading-7 text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24">
          <h2 className="mb-8 text-3xl font-bold text-charcoal dark:text-white">
            Related Ingredients
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {relatedIngredients.map((item) => (
              <Link
                key={item.id}
                href={`/ingredients/${item.slug}`}
                className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:shadow-2xl dark:bg-charcoal"
              >
                <div className="relative h-52 w-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-charcoal dark:text-white">
                    {item.name}
                  </h3>
                  <p className="mt-3 text-gray-600 dark:text-gray-300">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
