import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, FlaskConical, Sparkles } from "lucide-react";
import { cache } from "react";
import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { notFound } from "next/navigation";

import type { Ingredient } from "@/app/data/ingredients";

import { client } from "@/sanity/lib/client";
import {
  INGREDIENT_BY_SLUG_QUERY,
  INGREDIENTS_QUERY,
} from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { getIngredientCover } from "@/app/data/approvedCovers";
import { getArticleTopic } from "@/app/data/articleTopics";

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

      image:
        getIngredientCover(sanityIngredient.slug?.current ?? slug) ??
        (sanityIngredient.image
          ? urlFor(sanityIngredient.image).width(1200).url()
          : ""),

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
        image:
          getIngredientCover(item.slug?.current) ??
          (item.image ? urlFor(item.image).width(600).url() : ""),
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
              height: getIngredientCover(ingredient.slug) ? 750 : 700,
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
    notFound();
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

      <main className="gs-ingredient-guide min-h-screen bg-[#F9F8F2] px-5 pb-20 pt-10 dark:bg-[#253128] sm:px-6 sm:pt-16">
        <div className="mx-auto max-w-5xl">
        {/* Back */}
        <Link
          href="/ingredients"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#2D5830] underline-offset-4 hover:underline dark:text-[#C7DDBB]"
        >
          <ArrowLeft size={18} />
          Back to Ingredients
        </Link>

        {/* Ingredient editorial header */}
        <header className="gs-mineral-surface relative isolate mt-7 overflow-hidden rounded-[2rem] border border-[#DCE4D5] px-6 py-9 shadow-[0_16px_45px_rgba(46,63,42,.06)] sm:px-10 sm:py-12">
          <div className="relative z-10">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[.23em] text-[#52754D] dark:text-[#C5DCBB]">THE GLOW SKIN INGREDIENT LIBRARY</p>
            <h1 className="max-w-4xl font-heading text-4xl font-medium leading-[1.1] tracking-[-.045em] !text-[#26382A] dark:!text-[#F7F6EF] sm:text-6xl">
              {ingredient.name}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#4B5849] dark:text-[#D6E2D0] sm:text-lg">
              {ingredient.description}
            </p>
            {getArticleTopic(ingredient.slug) && (
              <Link
                href={`/blog/topic/${ingredient.slug}`}
                className="mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#2D5830] underline underline-offset-4 dark:text-[#C8DEBD]"
              >
                Browse {ingredient.name} articles <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
            {ingredient.image && (
              <figure className="mx-auto mt-8 w-full max-w-4xl">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.25rem] border border-[#D6E0D1] bg-[#F9F8F2] dark:border-[#536B55] dark:bg-[#435444]">
                  <Image
                    src={ingredient.image}
                    alt={`Illustrated skincare cover for ${ingredient.name}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) calc(100vw - 3rem), 850px"
                    className="object-contain"
                  />
                </div>
              </figure>
            )}
          </div>
        </header>

        <div className="mx-auto max-w-3xl">
        {ingredient.slug === "niacinamide" && (
          <aside className="mt-10 rounded-[1.3rem] border border-[#C7D7BE] bg-[#EDF3E8] p-6 shadow-[0_8px_24px_rgba(44,59,42,.04)] dark:border-[#567354] dark:bg-[#304534]" aria-labelledby="niacinamide-answer">
            <h2 id="niacinamide-answer" className="font-heading text-xl font-medium !text-[#304232] dark:!text-[#F7F6EF]">What does niacinamide do for skin?</h2>
            <p className="mt-3 leading-7 text-[#536151] dark:text-[#D4E0CE]">
              Niacinamide is a form of vitamin B3 used in many skincare products. It may help support the skin barrier, improve the appearance of redness and reduce excess oiliness. Results depend on the formula and individual skin tolerance. Start gradually, and stop using a product if irritation develops.
            </p>
            <a href="https://health.clevelandclinic.org/niacinamide" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold text-[#4D6953] underline underline-offset-4">Read the clinical ingredient overview</a>
          </aside>
        )}
        {/* Introduction */}
        {hasContent(ingredient.introduction) && (
          <section className="gs-ingredient-prose-section mt-12 border-t border-[#D9E2D5] pt-9 dark:border-[#536B55]">
            <h2 className="mb-5 font-heading text-3xl font-medium leading-tight !text-[#29372B] dark:!text-[#F7F6EF]">
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
          <section className="gs-ingredient-prose-section mt-12 border-t border-[#D9E2D5] pt-9 dark:border-[#536B55]">
            <h2 className="mb-5 font-heading text-3xl font-medium leading-tight !text-[#29372B] dark:!text-[#F7F6EF]">
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
          <section className="gs-ingredient-prose-section mt-12 border-t border-[#D9E2D5] pt-9 dark:border-[#536B55]">
            <h2 className="mb-5 font-heading text-3xl font-medium leading-tight !text-[#29372B] dark:!text-[#F7F6EF]">
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
          <section className="gs-ingredient-prose-section mt-12 border-t border-[#D9E2D5] pt-9 dark:border-[#536B55]">
            <h2 className="mb-5 font-heading text-3xl font-medium leading-tight !text-[#29372B] dark:!text-[#F7F6EF]">
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
          <section className="gs-ingredient-prose-section mt-12 border-t border-[#D9E2D5] pt-9 dark:border-[#536B55]">
            <h2 className="mb-5 font-heading text-3xl font-medium leading-tight !text-[#29372B] dark:!text-[#F7F6EF]">
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
          <section className="gs-ingredient-prose-section mt-12 border-t border-[#D9E2D5] pt-9 dark:border-[#536B55]">
            <h2 className="mb-5 font-heading text-3xl font-medium leading-tight !text-[#29372B] dark:!text-[#F7F6EF]">
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
          <section className="gs-ingredient-prose-section mt-12 border-t border-[#D9E2D5] pt-9 dark:border-[#536B55]">
            <h2 className="mb-5 font-heading text-3xl font-medium leading-tight !text-[#29372B] dark:!text-[#F7F6EF]">
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
          <section className="mt-12 flex gap-4 rounded-[1.3rem] border border-[#C7D7BE] bg-[#EDF3E8] p-6 dark:border-[#567354] dark:bg-[#304534]">
            <Sparkles
              className="mt-1 flex-shrink-0 text-primary"
              size={22}
            />

            <div>
              <h2 className="font-heading text-xl font-medium !text-[#29372B] dark:!text-[#F7F6EF]">
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
          <section className="gs-ingredient-prose-section mt-12 border-t border-[#D9E2D5] pt-9 dark:border-[#536B55]">
            <h2 className="font-heading text-3xl font-medium !text-[#29372B] dark:!text-[#F7F6EF]">
              Frequently Asked Questions
            </h2>

            <div className="mt-6 space-y-4">
              {ingredient.faqs.map((faq, index) => (
                <div
                  key={`${faq.question}-${index}`}
                  className="rounded-[1.1rem] border border-[#D9E2D5] bg-white/75 p-5 dark:border-[#567354] dark:bg-[#304034]"
                >
                  <h3 className="font-heading text-lg font-medium !text-[#29372B] dark:!text-[#F7F6EF]">
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

        </div>

        {/* Related Ingredients */}
        <section className="mt-20 border-t border-[#D9E2D5] pt-12 dark:border-[#536B55]">
          <h2 className="mb-8 font-heading text-3xl font-medium !text-[#29372B] dark:!text-[#F7F6EF]">
            Related Ingredients
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedIngredients.map((item) => (
              <Link
                key={item.id}
                href={`/ingredients/${item.slug}`}
                className="gs-botanical-card group flex h-full flex-col overflow-hidden rounded-[1.3rem] border border-[#DCE3D6] bg-[#FFFEFB] shadow-[0_8px_26px_rgba(44,59,42,.045)] transition hover:-translate-y-1 hover:border-[#8DA784] hover:shadow-[0_20px_46px_rgba(44,59,42,.11)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2D5830] dark:bg-[#303D33]"
              >
                <div className="relative aspect-[16/10] overflow-hidden border-b border-[#E6E9DE] bg-[#EFF1E7] dark:border-[#536B55] dark:bg-[#435444]">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.015]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center" aria-hidden="true"><FlaskConical className="h-12 w-12 stroke-[1.2] text-[#829E78]" /></div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="font-heading text-2xl font-medium leading-tight !text-[#29372B] dark:!text-[#F6F7F0]">
                    {item.name}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#5B685B] dark:text-[#D4DEC8]">
                    {item.description}
                  </p>
                  <span className="mt-auto flex items-center justify-between gap-2 border-t border-[#E3E9DF] pt-5 text-sm font-semibold text-[#2D5830] dark:border-[#566B56] dark:text-[#C7E0BA]">
                    Read ingredient guide
                    <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E6EDD9] text-[#315835] transition group-hover:bg-[#2D5830] group-hover:text-white"><ArrowUpRight className="h-4 w-4" /></span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
