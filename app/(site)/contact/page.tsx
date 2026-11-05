"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: unknown) {
      setStatus("error");
      const detail = typeof err === "object" && err !== null && "message" in err && typeof err.message === "string"
        ? err.message
        : "Something went wrong. Please try again.";
      setErrorMsg(detail);
    }
  }

  return (
    <>
      <Navbar />

      <main className="gs-atelier-contact mx-auto max-w-5xl px-5 py-12 sm:px-6 sm:py-20">
        <div className="rounded-[2rem] border border-[#E3D2C6] bg-[#FFF9F3] px-6 py-12 text-center sm:px-12">
          <span className="inline-block rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-600">
            Contact Us
          </span>

          <h1 className="mt-6 text-5xl font-bold text-gray-900">
            We&apos;d Love to Hear From You
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Have a question, suggestion, or business inquiry? Fill out the
            form below and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        <section
          aria-labelledby="contact-guidance-heading"
          className="mt-9 rounded-[1.5rem] border border-[#DCE5D7] bg-[#FFFEFA] px-6 py-8 sm:px-10 sm:py-10"
        >
          <h2
            id="contact-guidance-heading"
            className="font-heading text-2xl font-medium text-[#29372B] sm:text-3xl"
          >
            How we can help
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-[#526052]">
            GlowSkin welcomes questions about our published skincare articles,
            suggestions for future educational topics, and messages about potential
            corrections. We also welcome general editorial or business inquiries.
            This contact form is for communicating with the GlowSkin team, not for
            diagnosing a skin condition or providing personalized treatment plans.
          </p>
          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-semibold text-[#304A32]">Reporting an article issue</h3>
              <p className="mt-2 leading-7 text-[#526052]">
                If you have spotted a possible factual error or an outdated source,
                include the article title or URL and describe the specific passage.
                A link to a reputable dermatology or research source can help us
                understand your feedback.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#304A32]">Before sharing information</h3>
              <p className="mt-2 leading-7 text-[#526052]">
                Please avoid including passwords, medical records, or other sensitive
                health information in your message. For an individual skin concern,
                a qualified dermatologist is the appropriate professional to consult.
                Learn about our approach on the{" "}
                <Link href="/about" className="font-semibold text-[#2D5830] underline underline-offset-4">
                  About page
                </Link>.
              </p>
            </div>
          </div>
          <p className="mt-6 text-sm leading-7 text-[#526052]">
            For information about website data practices, see our{" "}
            <Link href="/privacy-policy" className="font-semibold text-[#2D5830] underline underline-offset-4">
              Privacy Policy
            </Link>.
          </p>
        </section>

        {status === "success" ? (
          <div className="mt-16 rounded-3xl bg-white p-10 shadow-lg text-center">
            <h2 className="text-2xl font-bold text-gray-900">Message sent! 🎉</h2>
            <p className="mt-3 text-gray-600">
              Thanks for reaching out — we&apos;ll get back to you soon.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-6 rounded-xl bg-pink-600 px-8 py-4 font-semibold text-white hover:bg-pink-700 transition"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-16 rounded-3xl bg-white p-10 shadow-lg">
            <div className="grid gap-6 md:grid-cols-2">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-xl border border-gray-300 p-4 outline-none focus:border-pink-500"
              />

              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl border border-gray-300 p-4 outline-none focus:border-pink-500"
              />
            </div>

            <textarea
              placeholder="Your Message"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="mt-6 w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-pink-500"
            />

            {status === "error" && (
              <p className="mt-4 text-sm font-medium text-red-600">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-6 rounded-xl bg-pink-600 px-8 py-4 font-semibold text-white hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </main>

      <Footer />
    </>
  );
}