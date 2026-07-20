import Image from "next/image";
import Link from "next/link";
import { cache } from "react";
import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ComingSoon from "../../components/ComingSoon";
import { concerns as staticConcerns, Concern } from "../../data/concerns";
import { client } from "../../../sanity/lib/client";
import { CONCERN_BY_SLUG_QUERY } from "../../../sanity/lib/queries";
import { urlFor } from "../../../sanity/lib/image";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// cache() dedupes this so generateMetadata() and the page component
// share one Sanity fetch instead of two per page load
const getConcern = cache(async (slug: string): Promise<Concern | undefined> => {
  let concern: Concern | undefined = staticConcerns.find((c) => c.slug === slug);

  if (!concern) {
    const sanityConcern = await client.fetch(CONCERN_BY_SLUG_QUERY, { slug });

    if (sanityConcern) {
      concern = {
        id: 9999,
        title: sanityConcern.title,
        slug: sanityConcern.slug?.current,
        image: sanityConcern.image
          ? urlFor(sanityConcern.image).width(1200).height(700).url()
          : "",
        emoji: sanityConcern.emoji ?? "",
        description: sanityConcern.description ?? "",
        overview: sanityConcern.overview ?? "",
        causesIntro: sanityConcern.causesIntro ?? "",
        causes: sanityConcern.causes ?? [],
        treatmentsIntro: sanityConcern.treatmentsIntro ?? "",
        treatments: sanityConcern.treatments ?? [],
        avoidIntro: sanityConcern.avoidIntro ?? "",
        avoid: sanityConcern.avoid ?? [],
        routineIntro: sanityConcern.routineIntro ?? "",
        routine: sanityConcern.routine ?? [],
        dermIntro: sanityConcern.dermIntro ?? "",
        seeADermatologistIf: sanityConcern.seeADermatologistIf ?? [],
      };
    }
  }

  return concern;
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const concern = await getConcern(slug);

  if (!concern) {
    return {
      title: "Skin Concern Guide Coming Soon",
      robots: { index: false, follow: true },
    };
  }

  const title = `${concern.title}: Causes, Treatment & Routine`;
  const description =
    concern.description?.slice(0, 155) ||
    `Understand ${concern.title} — causes, treatments, and a recommended skincare routine.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: concern.image ? [{ url: concern.image, width: 1200, height: 700 }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: concern.image ? [concern.image] : [],
    },
    alternates: { canonical: `/skin-concerns/${concern.slug}` },
  };
}

export default async function SkinConcernPage({ params }: PageProps) {
  const { slug } = await params;

  const concern = await getConcern(slug);

  if (!concern) {
    return (
      <>
        <Navbar />
        <ComingSoon
          backHref="/skin-concerns"
          backLabel="Back to Skin Concerns"
          itemLabel="skin concern guide"
        />
        <Footer />
      </>
    );
  }

  const relatedConcerns = staticConcerns
    .filter((c) => c.id !== concern.id)
    .slice(0, 2);

  return (
    <>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: concern.title,
            image: concern.image ? [concern.image] : undefined,
            description: concern.description,
          }),
        }}
      />

      <main className="max-w-4xl mx-auto px-6 py-20">
        <Link
          href="/skin-concerns"
          className="text-pink-600 font-semibold hover:underline"
        >
          ← Back to Skin Concerns
        </Link>

        <div className="mt-8">
          <span className="inline-block rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-600">
            {concern.emoji} {concern.title}
          </span>

          <h1 className="mt-6 text-5xl font-extrabold text-gray-900 leading-tight">
            {concern.title}
          </h1>

          <p className="mt-4 text-gray-500">{concern.description}</p>

          {concern.image && (
            <div className="relative mt-10 h-80 w-full overflow-hidden rounded-3xl">
              <Image
                src={concern.image}
                alt={concern.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          )}

          <article className="prose prose-lg max-w-none mt-12">
            <p className="whitespace-pre-line">{concern.overview}</p>
          </article>

          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-4">What Causes It</h2>
            <p className="text-gray-600 mb-6">{concern.causesIntro}</p>
            <ul className="grid sm:grid-cols-2 gap-3">
              {concern.causes.map((cause) => (
                <li
                  key={cause}
                  className="rounded-2xl bg-pink-50 px-5 py-3 text-gray-800"
                >
                  {cause}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-4">Recommended Treatments</h2>
            <p className="text-gray-600 mb-6">{concern.treatmentsIntro}</p>
            <ul className="grid sm:grid-cols-2 gap-3">
              {concern.treatments.map((treatment) => (
                <li
                  key={treatment}
                  className="rounded-2xl bg-pink-50 px-5 py-3 text-gray-800"
                >
                  {treatment}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-4">What to Avoid</h2>
            <p className="text-gray-600 mb-6">{concern.avoidIntro}</p>
            <ul className="space-y-3">
              {concern.avoid.map((item) => (
                <li key={item} className="flex gap-3 text-gray-800">
                  <span className="text-pink-600">✒</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-4">Suggested Routine</h2>
            <p className="text-gray-600 mb-6">{concern.routineIntro}</p>
            <div className="grid sm:grid-cols-2 gap-6">
              {concern.routine.map((block) => (
                <div
                  key={block.time}
                  className="rounded-3xl bg-white shadow-sm p-6"
                >
                  <h3 className="text-xl font-bold text-pink-600 mb-4">
                    {block.time} Routine
                  </h3>
                  <ol className="space-y-2 list-decimal list-inside text-gray-700">
                    {block.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-4">
              When to See a Dermatologist
            </h2>
            <p className="text-gray-600 mb-6">{concern.dermIntro}</p>
            <ul className="space-y-3">
              {concern.seeADermatologistIf.map((item) => (
                <li key={item} className="flex gap-3 text-gray-800">
                  <span className="text-pink-600">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-24">
          <h2 className="text-3xl font-bold mb-8">Related Concerns</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {relatedConcerns.map((item) => (
              <Link
                key={item.id}
                href={`/skin-concerns/${item.slug}`}
                className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 w-full">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="mt-3 text-2xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-gray-600">{item.description}</p>
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
