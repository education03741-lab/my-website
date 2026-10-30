import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Products from "@/app/components/Products";
import { products as staticProducts, Product } from "@/app/data/products";
import { client } from "@/sanity/lib/client";
import { PRODUCTS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

type SanityProduct = Omit<Product, "id" | "slug" | "image"> & {
  slug?: { current?: string };
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
      <main>
        <Products products={allProducts} />
      </main>
      <Footer />
    </>
  );
}