import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Skincare Product Guides",
  description: "GlowSkin's product guide collection is being prepared. Explore ingredient education and skincare routines in the meantime.",
  alternates: { canonical: "/products" },
  robots: { index: false, follow: true },
};

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[55vh] bg-[#F5F0E8] px-6 py-20">
        <section className="mx-auto max-w-4xl rounded-[2rem] border border-[#DBCCB5] bg-[#FFF9F0] px-7 py-16 text-center sm:px-12">
          <p className="text-xs font-semibold uppercase tracking-[.25em] text-[#8B6944]">THE SKIN ATELIER · THE EDIT</p>
          <h1 className="mt-5 font-heading text-4xl font-medium text-[#3E302A] sm:text-6xl">Product guides <span className="italic text-[#9D7653]">coming soon.</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#67584D]">
            We are not publishing product recommendations or customer ratings until the underlying information has been verified.
            Our ingredient guides and skincare journal remain available.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/ingredients" className="rounded-full bg-[#673C49] px-6 py-3 text-sm font-semibold text-white hover:bg-[#4D2B34]">Explore ingredients</Link>
            <Link href="/blog" className="rounded-full border border-[#9C7E57] px-6 py-3 text-sm font-semibold text-[#5D4934] hover:bg-[#EFE1CD]">Read skincare guides</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
