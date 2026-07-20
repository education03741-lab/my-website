"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <>
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center">
          <span className="inline-block rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-600">
            Contact Us
          </span>

          <h1 className="mt-6 text-5xl font-bold text-gray-900">
            We'd Love to Hear From You
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Have a question, suggestion, or business inquiry? Fill out the
            form below and we'll get back to you as soon as possible.
          </p>
        </div>

        {status === "success" ? (
          <div className="mt-16 rounded-3xl bg-white p-10 shadow-lg text-center">
            <h2 className="text-2xl font-bold text-gray-900">Message sent! 🎉</h2>
            <p className="mt-3 text-gray-600">
              Thanks for reaching out — we'll get back to you soon.
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