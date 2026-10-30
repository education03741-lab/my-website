import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import SkinConcerns from "@/app/components/SkinConcerns";
import { concerns as staticConcerns, Concern } from "@/app/data/concerns";
import { client } from "@/sanity/lib/client";
import { CONCERNS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

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
      <main>
        <SkinConcerns concerns={allConcerns} />
      </main>
      <Footer />
    </>
  );
}