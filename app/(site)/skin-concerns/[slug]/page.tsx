import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Leaf } from "lucide-react";
import { cache } from "react";
import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { notFound } from "next/navigation";
import { concerns as staticConcerns, Concern } from "@/app/data/concerns";
import { client } from "@/sanity/lib/client";
import { CONCERN_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

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
          ? urlFor(sanityConcern.image).width(1200).url()
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
      images: concern.image ? [{ url: concern.image }] : [],
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
    notFound();
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

      <main className="gs-skin-concern-guide min-h-screen bg-[#F9F8F2] px-5 pb-20 pt-10 dark:bg-[#253128] sm:px-6 sm:pt-16">
        <div className="mx-auto max-w-5xl">
          <Link href="/skin-concerns" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#2D5830] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[#2B552D] dark:text-[#C7DDBB]">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to skin concerns
          </Link>

          <header className="gs-mineral-surface relative isolate mt-7 overflow-hidden rounded-[2rem] border border-[#DCE4D5] px-6 py-10 shadow-[0_16px_45px_rgba(46,63,42,.06)] sm:px-10 sm:py-12">
            <div className={`relative z-10 grid items-center gap-9 ${concern.image ? "lg:grid-cols-[1.05fr_.95fr]" : ""}`}>
              <div>
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[.23em] text-[#52754D] dark:text-[#C5DCBB]">THE GLOW SKIN CONCERN LIBRARY</p>
                <h1 className="mt-0 font-heading text-4xl font-medium leading-[1.1] tracking-[-.045em] !text-[#26382A] dark:!text-[#F7F6EF] sm:text-6xl">
                  {concern.title}
                </h1>
                <p className="mt-6 text-base leading-8 text-[#4B5849] dark:text-[#D6E2D0] sm:text-lg">
                  {concern.description}
                </p>
              </div>
              {concern.image && (
                <div className="relative aspect-[16/11] overflow-hidden rounded-[1.3rem] border border-[#D6E0D1] bg-[#EFF2E8] dark:border-[#536B55] dark:bg-[#435444]">
                  <Image
                    src={concern.image}
                    alt={concern.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    priority
                    className="object-contain p-3"
                  />
                </div>
              )}
            </div>
          </header>

          <div className="mx-auto mt-8 max-w-3xl rounded-[1.4rem] border border-[#E2E9DD] bg-[#FFFEFB] px-6 py-10 shadow-[0_10px_34px_rgba(44,59,42,.035)] dark:border-[#526B54] dark:bg-[#303D33] sm:px-10 sm:py-12">
            <article className="text-base leading-8 text-[#4E5E4E] dark:text-[#D4DECF] sm:text-lg">
              <p className="whitespace-pre-line">{concern.overview}</p>
            </article>

            <section className="mt-12 border-t border-[#DFE6DA] pt-9 dark:border-[#536B55]">
              <h2 className="mb-4 font-heading text-3xl font-medium !text-[#29372B] dark:!text-[#F7F6EF]">What Causes It</h2>
              <p className="mb-6 leading-8 text-[#5B685B] dark:text-[#D4DECF]">{concern.causesIntro}</p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {concern.causes.map((cause) => (
                  <li key={cause} className="rounded-xl border border-[#DCE6D8] bg-[#F4F7EF] px-5 py-4 text-sm leading-7 text-[#405443] dark:border-[#5B7559] dark:bg-[#374B3B] dark:text-[#DFEADA]">
                    {cause}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12 border-t border-[#DFE6DA] pt-9 dark:border-[#536B55]">
              <h2 className="mb-4 font-heading text-3xl font-medium !text-[#29372B] dark:!text-[#F7F6EF]">Recommended Treatments</h2>
              <p className="mb-6 leading-8 text-[#5B685B] dark:text-[#D4DECF]">{concern.treatmentsIntro}</p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {concern.treatments.map((treatment) => (
                  <li key={treatment} className="rounded-xl border border-[#DCE6D8] bg-[#F4F7EF] px-5 py-4 text-sm leading-7 text-[#405443] dark:border-[#5B7559] dark:bg-[#374B3B] dark:text-[#DFEADA]">
                    {treatment}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12 border-t border-[#DFE6DA] pt-9 dark:border-[#536B55]">
              <h2 className="mb-4 font-heading text-3xl font-medium !text-[#29372B] dark:!text-[#F7F6EF]">What to Avoid</h2>
              <p className="mb-6 leading-8 text-[#5B685B] dark:text-[#D4DECF]">{concern.avoidIntro}</p>
              <ul className="space-y-3">
                {concern.avoid.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-7 text-[#4E5E4E] dark:text-[#DFEADA]">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#62845A]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12 border-t border-[#DFE6DA] pt-9 dark:border-[#536B55]">
              <h2 className="mb-4 font-heading text-3xl font-medium !text-[#29372B] dark:!text-[#F7F6EF]">Suggested Routine</h2>
              <p className="mb-6 leading-8 text-[#5B685B] dark:text-[#D4DECF]">{concern.routineIntro}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {concern.routine.map((block) => (
                  <div key={block.time} className="rounded-[1.2rem] border border-[#DCE6D8] bg-[#F8FAF5] p-6 dark:border-[#5B7559] dark:bg-[#374B3B]">
                    <h3 className="mb-4 font-heading text-xl font-medium !text-[#2C5331] dark:!text-[#D1E7C9]">{block.time} Routine</h3>
                    <ol className="list-inside list-decimal space-y-3 text-sm leading-7 text-[#4E5E4E] dark:text-[#DFEADA]">
                      {block.steps.map((step, i) => <li key={i}>{step}</li>)}
                    </ol>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12 border-t border-[#DFE6DA] pt-9 dark:border-[#536B55]">
              <h2 className="mb-4 font-heading text-3xl font-medium !text-[#29372B] dark:!text-[#F7F6EF]">When to See a Dermatologist</h2>
              <p className="mb-6 leading-8 text-[#5B685B] dark:text-[#D4DECF]">{concern.dermIntro}</p>
              <ul className="space-y-3">
                {concern.seeADermatologistIf.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-7 text-[#4E5E4E] dark:text-[#DFEADA]">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#62845A]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="mt-16 border-t border-[#D9E2D5] pt-12 dark:border-[#536B55]" aria-labelledby="related-concerns-heading">
            <h2 id="related-concerns-heading" className="mb-8 font-heading text-3xl font-medium !text-[#29372B] dark:!text-[#F7F6EF]">Related Concerns</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {relatedConcerns.map((item) => (
                <Link
                  key={item.id}
                  href={`/skin-concerns/${item.slug}`}
                  className="gs-botanical-card group flex h-full flex-col overflow-hidden rounded-[1.3rem] border border-[#DCE3D6] bg-[#FFFEFB] shadow-[0_8px_26px_rgba(44,59,42,.045)] transition hover:-translate-y-1 hover:border-[#8DA784] hover:shadow-[0_20px_46px_rgba(44,59,42,.11)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2D5830] dark:border-[#536B55] dark:bg-[#303D33]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-[#E6E9DE] bg-[#EFF1E7] dark:border-[#536B55] dark:bg-[#435444]">
                    {item.image ? (
                      <Image src={item.image} alt={item.title} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.015]" />
                    ) : (
                      <div className="flex h-full items-center justify-center" aria-hidden="true"><Leaf className="h-12 w-12 stroke-[1.2] text-[#829E78]" /></div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-heading text-2xl font-medium !text-[#29372B] dark:!text-[#F6F7F0]">{item.title}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#5B685B] dark:text-[#D4DEC8]">{item.description}</p>
                    <span className="mt-auto flex items-center justify-between gap-2 border-t border-[#E3E9DF] pt-5 text-sm font-semibold text-[#2D5830] dark:border-[#566B56] dark:text-[#C7E0BA]">
                      Read concern guide <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E6EDD9] text-[#315835] transition group-hover:bg-[#2D5830] group-hover:text-white"><ArrowUpRight className="h-4 w-4" /></span>
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
