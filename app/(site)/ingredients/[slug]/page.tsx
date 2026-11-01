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


// Convert Sanity Portable Text FAQ answers into readable JSON-LD text.
function faqAnswerText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (!Array.isArray(value)) return "";
  return value.flatMap((block: unknown) => {
    if (!block || typeof block !== "object" || !("children" in block)) return [];
    const children = (block as { children?: unknown }).children;
    if (!Array.isArray(children)) return [];
    const words = children.flatMap((child: unknown) => {
      if (!child || typeof child !== "object" || !("text" in child)) return [];
      return typeof child.text === "string" ? [child.text] : [];
    });
    return [words.join("")];
  }).join(" ").trim();
}

const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (      <p className="mb-5 leading-8 text-[#536151] dark:text-gray-300">
        {children}
      </p>
    ),

    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mb-4 mt-8 text-xl font-bold text-[#304232] dark:text-white">
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

  const title = ingredient.slug === "niacinamide"
    ? "What Does Niacinamide Do for Skin? Benefits"
    : `${ingredient.name}: Benefits, How to Use & More`;

  const description =
    ingredient.slug === "niacinamide"
      ? "What does niacinamide do for skin? Explore potential benefits for skin-barrier support, redness and oiliness, plus how to use it."
      : ingredient.description?.slice(0, 155) ||
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

  const validFaqs = ingredient.faqs
    .map((faq) => ({ question: faq.question?.trim(), answer: faqAnswerText(faq.answer) }))
    .filter((faq) => Boolean(faq.question && faq.answer));
  const faqSchema = validFaqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: validFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
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

        {ingredient.slug === "niacinamide" && (
          <aside className="mt-10 rounded-r-2xl border-l-4 border-[#829879] bg-[#F0F4E8] p-6" aria-labelledby="niacinamide-answer">
            <h2 id="niacinamide-answer" className="font-heading text-xl font-medium text-[#304232]">What does niacinamide do for skin?</h2>
            <p className="mt-3 leading-7 text-[#536151]">
              Niacinamide is a form of vitamin B3 used in many skincare products. It may help support the skin barrier, improve the appearance of redness and reduce excess oiliness. Results depend on the formula and individual skin tolerance. Start gradually, and stop using a product if irritation develops.
            </p>
            <a href="https://health.clevelandclinic.org/niacinamide" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold text-[#4D6953] underline underline-offset-4">Read the clinical ingredient overview</a>
          </aside>
        )}
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
          <section className="mt-16 flex gap-4 rounded-2xl border border-[#D7DEC9] bg-[#F0F4E8] p-6 dark:bg-primary/15">
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
