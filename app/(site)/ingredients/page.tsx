import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FlaskConical, Leaf } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Ingredient } from "@/app/data/ingredients";
import { client } from "@/sanity/lib/client";
import { INGREDIENTS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Skincare Ingredients: Benefits & How to Use Them",
  description: "Discover skincare ingredients, their benefits, how to use them and which skin concerns they may suit.",
  alternates: { canonical: "/ingredients" },
};

type SanityIngredient = Omit<Ingredient, "id" | "slug" | "image"> & {
  slug: { current: string };
  image?: Parameters<typeof urlFor>[0];
};

export default async function IngredientsPage() {
  const sanityIngredients = await client.fetch<SanityIngredient[]>(INGREDIENTS_QUERY);

  const mappedSanityIngredients: Ingredient[] = sanityIngredients.map(
    (item, index) => ({
      id: 1000 + index,
      name: item.name,
      slug: item.slug?.current,
      image: item.image ? urlFor(item.image).width(900).url() : "",
      description: item.description ?? "",
      benefits: item.benefits ?? [],
      howItWorks: item.howItWorks ?? "",
      keyBenefits: item.keyBenefits ?? [],
      bestFor: item.bestFor ?? [],
      howToUse: item.howToUse ?? "",
      pairsWith: item.pairsWith ?? [],
      avoidWith: item.avoidWith ?? [],
      proTip: item.proTip ?? "",
      faqs: item.faqs ?? [],
    })
  );

  const allIngredients = mappedSanityIngredients;

  return (
    <>
      <Navbar />
      <main className="gs-ingredient-index min-h-screen bg-[#F9F8F2] pb-20 dark:bg-[#253128]">
        <div className="mx-auto max-w-7xl px-5 pt-10 sm:px-6 sm:pt-14">
          <header className="gs-mineral-surface relative isolate overflow-hidden rounded-[2rem] border border-[#DCE4D5] px-6 py-10 shadow-[0_16px_45px_rgba(46,63,42,.06)] sm:px-10 sm:py-14">
            <div className="relative z-10 grid items-center gap-10 md:grid-cols-[1.45fr_.55fr]">
              <div>
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[.23em] text-[#52754D] dark:text-[#C5DCBB]">THE GLOW SKIN INGREDIENT LIBRARY</p>
                <h1 className="mt-0 max-w-[15ch] font-heading text-4xl font-medium leading-[1.08] tracking-[-.045em] !text-[#26382A] dark:!text-[#F7F6EF] sm:text-6xl">
                  Inside the <span className="italic !text-[#436D3E] dark:!text-[#BED9B4]">formula.</span>
                </h1>
                <p className="mt-5 max-w-xl text-base leading-8 text-[#4B5849] dark:text-[#D6E2D0] sm:text-lg">
                  Discover what each skincare ingredient does and how it is used in skincare.
                </p>
              </div>
              <div aria-hidden="true" className="hidden items-center justify-center md:flex">
                <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-[#BED0B6] bg-[#E7EFDD]/70 shadow-[0_12px_30px_rgba(45,76,45,.08)]">
                  <div className="absolute -right-4 -top-3 flex h-14 w-14 items-center justify-center rounded-full border border-[#CDD9C4] bg-[#FAFAF4]"><Leaf className="h-7 w-7 stroke-[1.4] text-[#587C51]" /></div>
                  <FlaskConical className="h-20 w-20 stroke-[.95] text-[#466947]" />
                </div>
              </div>
            </div>
          </header>

          <section aria-labelledby="ingredient-guide-intro" className="mb-9 mt-14 max-w-3xl">
            <h2 id="ingredient-guide-intro" className="font-heading text-3xl font-medium !text-[#29382F] dark:!text-[#F7F6EF] sm:text-4xl">
              Skincare ingredients, explained
            </h2>
            <p className="mt-4 leading-8 text-[#526052] dark:text-[#D4E0CE]">
              Each ingredient has a different role in a skincare formula. Explore
              what ingredients are commonly used for, how to introduce them
              thoughtfully, and which questions to consider for your skin type.
              Formulation, concentration and personal tolerance matter as much
              as an ingredient name.
            </p>
          </section>

          {allIngredients.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {allIngredients.map((ingredient, index) => (
                <Link
                  key={ingredient.slug || ingredient.id}
                  href={`/ingredients/${ingredient.slug}`}
                  className="gs-botanical-card group flex h-full flex-col overflow-hidden rounded-[1.3rem] border border-[#DCE3D6] bg-[#FFFEFB] shadow-[0_8px_26px_rgba(44,59,42,.045)] transition hover:-translate-y-1 hover:border-[#8DA784] hover:shadow-[0_20px_46px_rgba(44,59,42,.11)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2D5830] dark:bg-[#303D33]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-[#E6E9DE] bg-[#EFF1E7] dark:border-[#536B55] dark:bg-[#435444]">
                    {ingredient.image ? (
                      <Image
                        src={ingredient.image}
                        alt={ingredient.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={index < 2}
                        className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.015]"
                      />
                    ) : (
                      <div aria-hidden="true" className="flex h-full items-center justify-center"><FlaskConical className="h-14 w-14 stroke-[1.2] text-[#829E78]" /></div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
                    <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#54764D] dark:text-[#B4D2AA]">Ingredient guide</p>
                    <h2 className="mt-3 font-heading text-[1.55rem] font-medium leading-[1.2] tracking-[-.025em] !text-[#29372B] dark:!text-[#F6F7F0]">{ingredient.name}</h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#5B685B] dark:text-[#D4DEC8]">{ingredient.description}</p>
                    <span className="mt-auto flex items-center justify-between gap-3 border-t border-[#E3E9DF] pt-5 text-sm font-semibold text-[#2D5830] dark:border-[#566B56] dark:text-[#C7E0BA]">
                      Read ingredient guide
                      <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E6EDD9] text-[#315835] transition group-hover:bg-[#2D5830] group-hover:text-white"><ArrowUpRight className="h-4 w-4" /></span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-[#DCE3D6] bg-white px-6 py-10 text-[#526052] dark:bg-[#303D33] dark:text-[#D4DEC8]">
              Ingredient guides are being prepared. Explore the skincare journal in the meantime.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
