import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Ingredient } from "@/app/data/ingredients";
import { client } from "@/sanity/lib/client";
import { INGREDIENTS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Skincare Ingredients Explained",
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
      image: item.image ? urlFor(item.image).width(800).height(600).url() : "",
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
      <main className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-20">
        <div className="mb-14 rounded-[2rem] border border-[#D9D7C6] bg-gradient-to-r from-[#E5E9DC] via-[#F8F6EC] to-[#EEE0D0] px-6 py-14 text-left sm:px-12 sm:py-20">
          <span className="inline-block rounded-full bg-primary-light/40 px-4 py-2 text-sm font-semibold text-primary-dark dark:bg-primary-dark/20 dark:text-primary-light">
            THE SKIN ATELIER · FORMULA LIBRARY
          </span>
          <h1 className="mt-6 font-heading text-4xl font-medium tracking-tight text-[#292F27] sm:text-6xl">
            Inside the <span className="italic text-[#687C61]">formula.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#4B5849]">
            Discover what each skincare ingredient does and how it benefits your skin.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {allIngredients.map((ingredient, index) => (
            <Link
              key={ingredient.id}
              href={`/ingredients/${ingredient.slug}`}
              className="group overflow-hidden rounded-t-[7rem] rounded-b-2xl border border-[#D8DFD2] bg-[#FBFCF8] shadow-[0_10px_30px_rgba(58,79,59,.06)] transition hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(58,79,59,.14)]"
            >
              <div className="relative aspect-[4/3] w-full bg-[#E4E9DE]">
                <Image
                  src={ingredient.image}
                  alt={ingredient.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  priority={index < 2}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h2 className="font-heading text-2xl font-medium text-[#29382F]">
                  {ingredient.name}
                </h2>
                <p className="mt-4 line-clamp-3 text-[#526052]">
                  {ingredient.description}
                </p>
                <p className="mt-6 font-semibold text-primary">
                  Read More →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
