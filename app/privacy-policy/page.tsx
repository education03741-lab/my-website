import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-cream px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <span className="inline-block rounded-full bg-primary-light px-4 py-2 text-sm font-semibold text-primary-dark">
            Legal
          </span>

          <h1 className="mt-6 text-5xl font-semibold text-charcoal">
            Privacy Policy
          </h1>

          <p className="mt-4 text-gray-500">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="prose prose-lg mt-12 max-w-none text-gray-600">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-charcoal">
                1. Introduction
              </h2>
              <p className="mt-4 leading-7">
                This Privacy Policy explains how GlowSkin ("we," "us," or
                "our") collects, uses, and protects information when you
                visit our website. By using this site, you agree to the
                practices described below.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-charcoal">
                2. Information We Collect
              </h2>
              <p className="mt-4 leading-7">
                We may collect information you voluntarily provide, such as
                your email address when subscribing to our newsletter or
                submitting a contact form. We may also collect standard
                technical data automatically, such as browser type, device
                information, and pages visited, to help us understand how
                our site is used.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-charcoal">
                3. How We Use Your Information
              </h2>
              <p className="mt-4 leading-7">
                Information we collect is used to operate and improve the
                site, respond to inquiries, send newsletter updates to
                subscribers who opt in, and understand overall site
                performance. We do not sell your personal information to
                third parties.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-charcoal">
                4. Cookies
              </h2>
              <p className="mt-4 leading-7">
                Our site may use cookies or similar technologies to improve
                your browsing experience, remember preferences, and gather
                analytics. You can disable cookies through your browser
                settings, though some site features may not function as
                intended.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-charcoal">
                5. Third-Party Links
              </h2>
              <p className="mt-4 leading-7">
                Our site may contain links to third-party websites or
                products. We are not responsible for the privacy practices
                or content of these external sites, and encourage you to
                review their policies separately.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-charcoal">
                6. Your Choices
              </h2>
              <p className="mt-4 leading-7">
                You may unsubscribe from our newsletter at any time using
                the link provided in our emails. You may also contact us
                directly to request information about data we hold
                relating to you.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-charcoal">
                7. Changes to This Policy
              </h2>
              <p className="mt-4 leading-7">
                We may update this Privacy Policy from time to time. Any
                changes will be reflected on this page with an updated
                "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-charcoal">
                8. Contact Us
              </h2>
              <p className="mt-4 leading-7">
                If you have questions about this Privacy Policy, please
                reach out via our{" "}
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
