import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ingredients as staticIngredients, Ingredient } from "../data/ingredients";
import { client } from "../../sanity/lib/client";
import { INGREDIENTS_QUERY } from "../../sanity/lib/queries";
import { urlFor } from "../../sanity/lib/image";

export default async function IngredientsPage() {
  const sanityIngredients = await client.fetch(INGREDIENTS_QUERY);

  const mappedSanityIngredients: Ingredient[] = sanityIngredients.map(
    (item: any, index: number) => ({
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

  const allIngredients = [...staticIngredients, ...mappedSanityIngredients];

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <span className="inline-block rounded-full bg-primary-light/40 px-4 py-2 text-sm font-semibold text-primary-dark dark:bg-primary-dark/20 dark:text-primary-light">
            Ingredient Encyclopedia
          </span>
          <h1 className="mt-6 text-5xl font-bold text-charcoal dark:text-white">
            Popular Skincare Ingredients
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            Discover what each skincare ingredient does and how it benefits your skin.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {allIngredients.map((ingredient, index) => (
            <Link
              key={ingredient.id}
              href={`/ingredients/${ingredient.slug}`}
              className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-2 hover:shadow-2xl dark:bg-charcoal/60 dark:shadow-black/30"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={ingredient.image}
                  alt={ingredient.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  priority={index < 4}
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-charcoal dark:text-white">
                  {ingredient.name}
                </h2>
                <p className="mt-4 text-gray-600 dark:text-gray-300">
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