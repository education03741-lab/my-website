import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "About GlowSkin: Our Approach to Skincare Education",
  description: "Learn about GlowSkin's approach to skincare education, ingredient guides and practical skincare advice.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="gs-atelier-about min-h-screen bg-[#F8F2EB] px-5 py-14 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-[#E7D8CD] bg-[#FFFCF8] px-6 py-12 shadow-[0_22px_75px_rgba(68,39,44,.06)] sm:px-14 sm:py-20">
          <span className="inline-block rounded-full bg-primary-light px-4 py-2 text-sm font-semibold text-primary-dark">
            THE SKIN ATELIER · ABOUT
          </span>

          <h1 className="mt-6 max-w-3xl font-heading text-4xl font-medium leading-tight text-[#432D35] sm:text-6xl">
            Beauty begins with understanding.
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            GlowSkin was built on a simple idea: skincare shouldn&apos;t be
            confusing, overpriced, or full of marketing noise. We break down
            ingredients, routines, and skin concerns into clear, practical
            guidance you can actually use — without needing a chemistry
            degree to understand it.
          </p>

          <div className="mt-16 grid gap-10 sm:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold text-charcoal">
                Our Approach
              </h2>
              <p className="mt-4 leading-7 text-gray-600">
                We aim to explain skincare topics using reputable dermatology
                resources and published research where available. Articles
                are educational, not individual medical advice, and an
                expert review is credited only when it actually occurred.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-charcoal">
                Why We Started
              </h2>
              <p className="mt-4 leading-7 text-gray-600">
                GlowSkin focuses on explaining ingredients and routines in
                everyday language. Our goal is to help readers make informed
                choices without implying one routine suits every skin type.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-charcoal">
                What You&apos;ll Find Here
              </h2>
              <p className="mt-4 leading-7 text-gray-600">
                Ingredient breakdowns, guides organized by skin concern,
                beginner-friendly routines, and practical explanations
                of skincare products and their ingredients. We do not
                currently publish product ratings or shopping recommendations.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-charcoal">
                Get In Touch
              </h2>
              <p className="mt-4 leading-7 text-gray-600">
                Have a question, suggestion, or a skin concern you&apos;d like
                us to cover? We&apos;d love to hear from you — visit our{" "}
                <a href="/contact" className="text-primary hover:underline">
                  Contact page
                </a>{" "}
                to reach out.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
