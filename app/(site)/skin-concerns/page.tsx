import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import SkinConcerns from "@/app/components/SkinConcerns";
import Link from "next/link";
import { ArrowUpRight, Droplets, HeartPulse, Leaf } from "lucide-react";
import { concerns as staticConcerns, Concern } from "@/app/data/concerns";
import { client } from "@/sanity/lib/client";
import { CONCERNS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { getConcernCover } from "@/app/data/approvedCovers";

export const metadata: Metadata = {
  title: "Skin Concerns: Acne, Dryness, Oiliness & More",
  description: "Understand common skin concerns and explore practical routines for acne, dry skin, oily skin and more.",
  alternates: { canonical: "/skin-concerns" },
};

type SanityConcern = Omit<Concern, "id" | "slug" | "image"> & {
  slug: { current: string };
  image?: Parameters<typeof urlFor>[0];
};

export default async function SkinConcernsPage() {
  const sanityConcerns = await client.fetch<SanityConcern[]>(CONCERNS_QUERY);

  const mappedSanityConcerns: Concern[] = sanityConcerns.map(
    (item, index) => ({
      id: 1000 + index,
      title: item.title,
      slug: item.slug?.current,
      image: getConcernCover(item.slug?.current) ?? (item.image ? urlFor(item.image).width(800).url() : ""),
      emoji: item.emoji ?? "",
      description: item.description ?? "",
      overview: item.overview ?? "",
      causesIntro: item.causesIntro ?? "",
      causes: item.causes ?? [],
      treatmentsIntro: item.treatmentsIntro ?? "",
      treatments: item.treatments ?? [],
      avoidIntro: item.avoidIntro ?? "",
      avoid: item.avoid ?? [],
      routineIntro: item.routineIntro ?? "",
      routine: item.routine ?? [],
      dermIntro: item.dermIntro ?? "",
      seeADermatologistIf: item.seeADermatologistIf ?? [],
    })
  );

  const allConcerns = [
    ...staticConcerns,
    ...mappedSanityConcerns.filter((item) => item.slug && !staticConcerns.some((staticItem) => staticItem.slug === item.slug)),
  ];

  return (
    <>
      <Navbar />
      <main className="gs-skin-concerns-index min-h-screen bg-[#F9F8F2] dark:bg-[#253128]">
        <div className="mx-auto max-w-7xl px-5 pt-10 sm:px-6 sm:pt-14">
          <header className="gs-mineral-surface relative isolate overflow-hidden rounded-[2rem] border border-[#DCE4D5] px-6 py-10 shadow-[0_16px_45px_rgba(46,63,42,.06)] sm:px-10 sm:py-14">
            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.25fr_.75fr] lg:gap-16">
              <div>
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[.23em] text-[#52754D] dark:text-[#C5DCBB]">THE GLOW SKIN CONCERN LIBRARY</p>
                <h1 className="mt-0 max-w-[16ch] font-heading text-4xl font-medium leading-[1.08] tracking-[-.045em] !text-[#26382A] dark:!text-[#F7F6EF] sm:text-6xl">
                  Understand <span className="italic !text-[#436D3E] dark:!text-[#BED9B4]">your skin.</span>
                </h1>
                <p className="mt-5 max-w-xl text-base leading-8 text-[#4B5849] dark:text-[#D6E2D0] sm:text-lg">
                  Explore the questions, routines, and ingredients connected to the skin concerns you want to understand.
                </p>
                <Link href="/blog/beginners-skincare-routine" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#2B552D] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(35,68,37,.12)] transition hover:-translate-y-0.5 hover:bg-[#1F4325] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2B552D]">
                  Start with skincare basics <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <nav aria-label="Popular skin concern guides" className="rounded-[1.5rem] border border-[#CFDDC8] bg-[#FFFEFA]/85 p-5 shadow-[0_12px_38px_rgba(47,66,43,.07)] dark:border-[#556B53] dark:bg-[#344538] sm:p-7">
                <p className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#587654] dark:text-[#D0E0C8]">
                  <Leaf className="h-4 w-4" aria-hidden="true" /> POPULAR STARTING POINTS
                </p>
                <div className="space-y-2">
                  <Link href="/skin-concerns/acne" className="group flex min-h-14 items-center gap-3 rounded-xl border border-[#E2E9DC] bg-white/90 px-4 py-3 text-sm font-semibold text-[#294A30] transition hover:border-[#8AA383] hover:bg-[#EDF4E7] focus-visible:outline-2 focus-visible:outline-[#2B552D] dark:border-[#5C735B] dark:bg-[#3C5040] dark:text-[#F3F7F0]">
                    <HeartPulse className="h-5 w-5 text-[#68865F]" aria-hidden="true" /> Acne <ArrowUpRight className="ml-auto h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                  <Link href="/skin-concerns/dry-skin" className="group flex min-h-14 items-center gap-3 rounded-xl border border-[#E2E9DC] bg-white/90 px-4 py-3 text-sm font-semibold text-[#294A30] transition hover:border-[#8AA383] hover:bg-[#EDF4E7] focus-visible:outline-2 focus-visible:outline-[#2B552D] dark:border-[#5C735B] dark:bg-[#3C5040] dark:text-[#F3F7F0]">
                    <Droplets className="h-5 w-5 text-[#68865F]" aria-hidden="true" /> Dry skin <ArrowUpRight className="ml-auto h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                  <Link href="/skin-concerns/sensitive-skin" className="group flex min-h-14 items-center gap-3 rounded-xl border border-[#E2E9DC] bg-white/90 px-4 py-3 text-sm font-semibold text-[#294A30] transition hover:border-[#8AA383] hover:bg-[#EDF4E7] focus-visible:outline-2 focus-visible:outline-[#2B552D] dark:border-[#5C735B] dark:bg-[#3C5040] dark:text-[#F3F7F0]">
                    <Leaf className="h-5 w-5 text-[#68865F]" aria-hidden="true" /> Sensitive skin <ArrowUpRight className="ml-auto h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </div>
              </nav>
            </div>
          </header>
        </div>
        <SkinConcerns concerns={allConcerns} showAll />
      </main>
      <Footer />
    </>
  );
}
