import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TermsPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-cream px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <span className="inline-block rounded-full bg-primary-light px-4 py-2 text-sm font-semibold text-primary-dark">
            Legal
          </span>

          <h1 className="mt-6 text-5xl font-semibold text-charcoal">
            Terms &amp; Conditions
          </h1>

          <p className="mt-4 text-gray-500">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="prose prose-lg mt-12 max-w-none text-gray-600">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-charcoal">
                1. Acceptance of Terms
              </h2>
              <p className="mt-4 leading-7">
                By accessing and using GlowSkin, you agree to be bound by
                these Terms & Conditions. If you do not agree with any part
                of these terms, please discontinue use of the site.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-charcoal">
                2. Educational Purpose Only
              </h2>
              <p className="mt-4 leading-7">
                Content on GlowSkin, including articles, routines, and
                ingredient guides, is provided for general informational
                and educational purposes only. It is not intended as
                medical advice, diagnosis, or treatment. Always consult a
                qualified dermatologist or healthcare provider before
                starting a new skincare regimen, especially if you have a
                pre-existing skin condition.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-charcoal">
                3. Product Recommendations
              </h2>
              <p className="mt-4 leading-7">
                Any products mentioned or featured on this site are shared
                based on ingredient research and general suitability. We
                do not guarantee results, and individual skin reactions
                may vary. Always patch test new products before full use.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-charcoal">
                4. Intellectual Property
              </h2>
              <p className="mt-4 leading-7">
                All content on GlowSkin, including text, graphics, and
                images, is the property of GlowSkin unless otherwise
                stated, and may not be reproduced or distributed without
                permission.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-charcoal">
                5. External Links
              </h2>
              <p className="mt-4 leading-7">
                Our site may contain links to third-party websites,
                including retailers for recommended products. We are not
                responsible for the content, accuracy, or practices of
                these external sites.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-charcoal">
                6. Limitation of Liability
              </h2>
              <p className="mt-4 leading-7">
                GlowSkin is not liable for any damages or adverse effects
                resulting from the use of information, routines, or
                product recommendations found on this site. Use of any
                guidance provided is at your own discretion and risk.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-charcoal">
                7. Changes to These Terms
              </h2>
              <p className="mt-4 leading-7">
                We may revise these Terms & Conditions at any time. Updates
                will be reflected on this page with a new "Last updated"
                date. Continued use of the site after changes constitutes
                acceptance of the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-charcoal">
                8. Contact Us
              </h2>
              <p className="mt-4 leading-7">
                Questions about these Terms & Conditions can be sent via
                our{" "}
                <a href="/contact" className="text-primary hover:underline">
                  Contact page
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
