import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-cream px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <span className="inline-block rounded-full bg-primary-light px-4 py-2 text-sm font-semibold text-primary-dark">
            About GlowSkin
          </span>

          <h1 className="mt-6 text-5xl font-semibold text-charcoal">
            Skincare, made simple and honest
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            GlowSkin was built on a simple idea: skincare shouldn't be
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
                Every article and guide on GlowSkin is grounded in
                dermatologist-backed principles and widely accepted skincare
                science. We focus on what actually works — not trends,
                fads, or products dressed up in vague promises.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-charcoal">
                Why We Started
              </h2>
              <p className="mt-4 leading-7 text-gray-600">
                Like a lot of people, we spent years buying products that
                didn't match our skin's actual needs. GlowSkin exists so
                you can skip that trial and error — and build a routine
                that's actually right for you, from day one.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-charcoal">
                What You'll Find Here
              </h2>
              <p className="mt-4 leading-7 text-gray-600">
                Ingredient breakdowns, guides organized by skin concern,
                beginner-friendly routines, and honest product
                recommendations — all written to help you understand your
                skin, not just sell you something.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-charcoal">
                Get In Touch
              </h2>
              <p className="mt-4 leading-7 text-gray-600">
                Have a question, suggestion, or a skin concern you'd like
                us to cover? We'd love to hear from you — visit our{" "}
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
