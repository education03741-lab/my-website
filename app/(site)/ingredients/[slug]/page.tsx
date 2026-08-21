import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { cache } from "react";
import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ComingSoon from "@/app/components/ComingSoon";

import type { Ingredient } from "@/app/data/ingredients";

import { client } from "@/sanity/lib/client";
import {
  INGREDIENT_BY_SLUG_QUERY,
  INGREDIENTS_QUERY,
} from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

type SanityIngredient = {
  _id: string;
  name: string;
  slug?: {
    current?: string;
  };
  image?: unknown;
  description?: string;
  introduction?: unknown[];
  howItWorks?: unknown[];
  benefits?: unknown[];
  bestFor?: unknown[];
  howToUse?: unknown[];
  pairsWith?: unknown[];
  avoidWith?: unknown[];
  proTip?: unknown[];
  faqs?: {
    question: string;
    answer?: unknown[];
  }[];
};

function portableTextValue(value: unknown) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    return [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: value,
            marks: [],
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ];
  }

  return [];
}

function hasContent(value: unknown) {
  if (!value) return false;

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return false;
}

const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (      <p className="mb-5 leading-8 text-gray-600 dark:text-gray-300">
        {children}
      </p>
    ),

    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mb-4 mt-8 text-xl font-bold text-charcoal dark:text-white">
        {children}
      </h3>
    ),

    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="mb-3 mt-6 text-lg font-semibold text-charcoal dark:text-white">
        {children}
      </h4>
    ),
  },

  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (      <ul className="mb-6 ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-300">
        {children}
      </ul>
    ),

    number: ({ children }: { children?: React.ReactNode }) => (      <ol className="mb-6 ml-6 list-decimal space-y-2 text-gray-600 dark:text-gray-300">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (      <li className="leading-7">{children}</li>
    ),

    number: ({ children }: { children?: React.ReactNode }) => (      <li className="leading-7">{children}</li>
    ),
  },
};

const getIngredient = cache(
  async (slug: string): Promise<Ingredient | undefined> => {
    const sanityIngredient: SanityIngredient | null = await client.fetch(
      INGREDIENT_BY_SLUG_QUERY,
      { slug }
    );

    if (!sanityIngredient) {
      return undefined;
    }

    return {
      id: 9999,
      name: sanityIngredient.name,
      slug: sanityIngredient.slug?.current ?? slug,

      image: sanityIngredient.image
        ? urlFor(sanityIngredient.image)
            .width(1200)
            .height(700)
            .url()
        : "",

      description: sanityIngredient.description ?? "",

      introduction: sanityIngredient.introduction ?? [],

      howItWorks: sanityIngredient.howItWorks ?? [],

      benefits: sanityIngredient.benefits ?? [],

      bestFor: sanityIngredient.bestFor ?? [],

      howToUse: sanityIngredient.howToUse ?? [],

      pairsWith: sanityIngredient.pairsWith ?? [],

      avoidWith: sanityIngredient.avoidWith ?? [],

      proTip: sanityIngredient.proTip ?? [],

      faqs:
        sanityIngredient.faqs?.map((faq) => ({
          question: faq.question,
          answer: faq.answer ?? [],
        })) ?? [],
    };
  }
);

const getRelatedIngredients = cache(
  async (currentSlug: string): Promise<Ingredient[]> => {
    const sanityIngredients: SanityIngredient[] = await client.fetch(
      INGREDIENTS_QUERY
    );

    return sanityIngredients
      .filter((item) => item.slug?.current !== currentSlug)
      .slice(0, 3)
      .map((item, index) => ({
        id: 3000 + index,
        name: item.name,
        slug: item.slug?.current ?? "",
        image: item.image
          ? urlFor(item.image).width(600).height(400).url()
          : "",
        description: item.description ?? "",
        introduction: item.introduction ?? [],
        howItWorks: item.howItWorks ?? [],
        benefits: item.benefits ?? [],
        bestFor: item.bestFor ?? [],
        howToUse: item.howToUse ?? [],
        pairsWith: item.pairsWith ?? [],
        avoidWith: item.avoidWith ?? [],
        proTip: item.proTip ?? [],
        faqs:
          item.faqs?.map((faq) => ({
            question: faq.question,
            answer: faq.answer ?? [],
          })) ?? [],
      }));
  }
);

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const ingredient = await getIngredient(slug);

  if (!ingredient) {
    return {
      title: "Ingredient Coming Soon",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const title = `${ingredient.name}: Benefits, How to Use & More`;

  const description =
    ingredient.description?.slice(0, 155) ||
    `Learn about ${ingredient.name} ΓÇö benefits, how it works, and how to use it.`;

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      images: ingredient.image
        ? [
            {
              url: ingredient.image,
              width: 1200,
              height: 700,
            },
          ]
        : [],
      type: "article",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ingredient.image ? [ingredient.image] : [],
    },

    alternates: {
      canonical: `/ingredients/${ingredient.slug}`,
    },
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

  const relatedIngredients = await getRelatedIngredients(ingredient.slug);

  const faqSchema =
    ingredient.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: ingredient.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text:
                typeof faq.answer === "string"
                  ? faq.answer
                  : "",
            },
          })),
        }
      : null;

  return (
    <>
      <Navbar />

      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: ingredient.name,
            image: ingredient.image
              ? [ingredient.image]
              : undefined,
            description: ingredient.description,
          }),
        }}
      />

      {/* FAQ Schema */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}

      <main className="mx-auto max-w-4xl px-6 py-20">
        {/* Back */}
        <Link
          href="/ingredients"
          className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Ingredients
        </Link>

        {/* Header */}
        <header className="mt-10">
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
        </header>

        {/* Introduction */}
        {hasContent(ingredient.introduction) && (
          <section className="mt-16">
            <h2 className="mb-6 text-3xl font-bold text-charcoal dark:text-white">
              What Is {ingredient.name}?
            </h2>

            <PortableText
              value={portableTextValue(ingredient.introduction)}
              components={portableTextComponents}
            />
          </section>
        )}

        {/* How It Works */}
        {hasContent(ingredient.howItWorks) && (
          <section className="mt-16">
            <h2 className="mb-6 text-3xl font-bold text-charcoal dark:text-white">
              How It Works
            </h2>

            <PortableText
              value={portableTextValue(ingredient.howItWorks)}
              components={portableTextComponents}
            />
          </section>
        )}

        {/* Benefits */}
        {hasContent(ingredient.benefits) && (
          <section className="mt-16">
            <h2 className="mb-6 text-3xl font-bold text-charcoal dark:text-white">
              Benefits
            </h2>

            <PortableText
              value={portableTextValue(ingredient.benefits)}
              components={portableTextComponents}
            />
          </section>
        )}

        {/* Best For */}
        {hasContent(ingredient.bestFor) && (
          <section className="mt-16">
            <h2 className="mb-6 text-3xl font-bold text-charcoal dark:text-white">
              Best For
            </h2>

            <PortableText
              value={portableTextValue(ingredient.bestFor)}
              components={portableTextComponents}
            />
          </section>
        )}

        {/* How To Use */}
        {hasContent(ingredient.howToUse) && (
          <section className="mt-16">
            <h2 className="mb-6 text-3xl font-bold text-charcoal dark:text-white">
              How to Use
            </h2>

            <PortableText
              value={portableTextValue(ingredient.howToUse)}
              components={portableTextComponents}
            />
          </section>
        )}

        {/* Pairs With */}
        {hasContent(ingredient.pairsWith) && (
          <section className="mt-16">
            <h2 className="mb-6 text-3xl font-bold text-charcoal dark:text-white">
              Pairs Well With
            </h2>

            <PortableText
              value={portableTextValue(ingredient.pairsWith)}
              components={portableTextComponents}
            />
          </section>
        )}

        {/* Use With Caution */}
        {hasContent(ingredient.avoidWith) && (
          <section className="mt-16">
            <h2 className="mb-6 text-3xl font-bold text-charcoal dark:text-white">
              Use With Caution
            </h2>

            <PortableText
              value={portableTextValue(ingredient.avoidWith)}
              components={portableTextComponents}
            />
          </section>
        )}

        {/* Pro Tip */}
        {hasContent(ingredient.proTip) && (
          <section className="mt-16 flex gap-4 rounded-3xl bg-primary/10 p-6 dark:bg-primary/15">
            <Sparkles
              className="mt-1 flex-shrink-0 text-primary"
              size={22}
            />

            <div>
              <h2 className="font-bold text-charcoal dark:text-white">
                Pro Tip
              </h2>

              <div className="mt-2">
                <PortableText
                  value={portableTextValue(ingredient.proTip)}
                  components={portableTextComponents}
                />
              </div>
            </div>
          </section>
        )}

        {/* FAQs */}
        {ingredient.faqs.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-charcoal dark:text-white">
              Frequently Asked Questions
            </h2>

            <div className="mt-6 space-y-4">
              {ingredient.faqs.map((faq, index) => (
                <div
                  key={`${faq.question}-${index}`}
                  className="rounded-2xl border border-primary-light p-5 dark:border-primary-dark/40"
                >
                  <h3 className="font-semibold text-charcoal dark:text-white">
                    {faq.question}
                  </h3>

                  <div className="mt-3">
                    {typeof faq.answer === "string" ? (
                      <p className="leading-7 text-gray-600 dark:text-gray-300">
                        {faq.answer}
                      </p>
                    ) : (
                      <PortableText
                        value={portableTextValue(faq.answer)}
                        components={portableTextComponents}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Ingredients */}
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
