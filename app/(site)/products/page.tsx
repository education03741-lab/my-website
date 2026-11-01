import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Products from "@/app/components/Products";
import Link from "next/link";
import { products as staticProducts, Product } from "@/app/data/products";
import { client } from "@/sanity/lib/client";
import { PRODUCTS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const metadata: Metadata = {
  title: "Skincare Products & Guides",
  description: "Explore skincare products, ingredients and usage guidance to make more informed product choices.",
  alternates: { canonical: "/products" },
};

type SanityProduct = Omit<Product, "id" | "slug" | "image"> & {
  slug: { current: string };
  image?: Parameters<typeof urlFor>[0];
};

export default async function ProductsPage() {
  const sanityProducts = await client.fetch<SanityProduct[]>(PRODUCTS_QUERY);

  const mappedSanityProducts: Product[] = sanityProducts.map(
    (item, index) => ({
      id: 1000 + index,
      title: item.title,
      slug: item.slug?.current,
      brand: item.brand ?? "",
      image: item.image ? urlFor(item.image).width(800).height(600).url() : "",
      price: item.price ?? "",
      buyLink: item.buyLink ?? "",
      rating: item.rating ?? 0,
      reviewCount: item.reviewCount ?? 0,
      description: item.description ?? "",
      featuresIntro: item.featuresIntro ?? "",
      features: item.features ?? [],
      howToUseIntro: item.howToUseIntro ?? "",
      howToUse: item.howToUse ?? [],
      relatedArticleSlugs: item.relatedArticleSlugs ?? [],
      reviews: item.reviews ?? [],
    })
  );

  const allProducts = [...staticProducts, ...mappedSanityProducts];

  return (
    <>
      <Navbar />
      <main className="bg-[#F5F0E8]">
        <section className="mx-auto max-w-7xl px-6 pt-16 sm:pt-24">
          <div className="rounded-[2rem] border border-[#DBCCB5] bg-gradient-to-r from-[#E9DCC9] via-[#FFF9F0] to-[#E5E0D4] px-7 py-14 sm:px-14 sm:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.27em] text-[#8B6944]">THE SKIN ATELIER · THE EDIT</p>
            <h1 className="mt-6 max-w-3xl font-heading text-4xl font-medium leading-tight text-[#3E302A] sm:text-6xl">Products, <span className="italic text-[#9D7653]">considered.</span></h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#67584D]">Look beyond packaging. Explore product details, ingredient context, and practical use notes before you choose.</p>
            <Link href="/ingredients" className="mt-8 inline-flex rounded-full border border-[#9C7E57] px-6 py-3 text-sm font-semibold text-[#5D4934] hover:bg-[#EFE1CD]">Understand ingredients ↗</Link>
          </div>
        </section>
        <Products products={allProducts} />
      </main>
      <Footer />
    </>
  );
}