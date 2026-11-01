import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import SkinConcerns from "@/app/components/SkinConcerns";
import Link from "next/link";
import { concerns as staticConcerns, Concern } from "@/app/data/concerns";
import { client } from "@/sanity/lib/client";
import { CONCERNS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const metadata: Metadata = {
  title: "Skin Concerns & Skincare Routines",
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
      image: item.image ? urlFor(item.image).width(800).height(600).url() : "",
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

  const allConcerns = [...staticConcerns, ...mappedSanityConcerns];

  return (
    <>
      <Navbar />
      <main className="bg-[#F6EDE9]">
        <section className="mx-auto max-w-7xl px-6 pt-16 sm:pt-24">
          <div className="rounded-[2rem] border border-[#E5CFCB] bg-gradient-to-br from-[#F0DBD9] via-[#FFF8F3] to-[#E9D7D2] px-7 py-14 sm:px-14 sm:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.27em] text-[#8D4E60]">THE SKIN ATELIER · YOUR SKIN STORY</p>
            <h1 className="mt-6 max-w-3xl font-heading text-4xl font-medium leading-tight text-[#442B32] sm:text-6xl">Every skin has <span className="italic text-[#985D6B]">a story.</span></h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6D555B]">Explore the questions, routines, and ingredients connected to the skin concerns you want to understand.</p>
            <Link href="/blog/beginners-skincare-routine" className="mt-8 inline-flex rounded-full bg-[#6C3344] px-6 py-3 text-sm font-semibold text-white hover:bg-[#502536]">Start with skincare basics ↗</Link>
          </div>
        </section>
        <SkinConcerns concerns={allConcerns} />
      </main>
      <Footer />
    </>
  );
}