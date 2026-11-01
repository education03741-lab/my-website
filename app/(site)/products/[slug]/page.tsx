import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ComingSoon from "@/app/components/ComingSoon";

type PageProps = { params: Promise<{ slug: string }> };

// Product data stays in the repository but is intentionally unpublished
// until product facts, ratings, prices and availability are independently verified.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: "Product Guide Not Yet Published",
    description: "This GlowSkin product guide is not yet available. Explore skincare ingredients and educational articles instead.",
    robots: { index: false, follow: true },
    alternates: { canonical: `/products/${slug}` },
  };
}

export default function ProductPage() {
  return (
    <>
      <Navbar />
      <ComingSoon backHref="/ingredients" backLabel="Explore ingredient guides" itemLabel="product guide" />
      <Footer />
    </>
  );
}
