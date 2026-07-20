"use client";

import { useState } from "react";
import { Mail, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 py-24">

      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6">

        <div className="overflow-hidden rounded-[40px] bg-white p-12 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* Left */}

            <div>

              <div className="mb-6 inline-flex items-center rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-600">
                <Sparkles className="mr-2 h-4 w-4" />
                Join the GlowSkin Community
              </div>

              <h2 className="text-5xl font-bold text-gray-900 leading-tight">
                Healthy Skin Starts With Better Knowledge
              </h2>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                Receive weekly skincare tips, dermatologist-inspired routines,
                ingredient breakdowns, and exclusive GlowSkin content delivered
                directly to your inbox.
              </p>

              <div className="mt-8 space-y-4">

                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-100">
                    <ShieldCheck className="h-3.5 w-3.5 text-pink-600" />
                  </div>
                  <span className="text-gray-700">No spam. Ever.</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-100">
                    <ShieldCheck className="h-3.5 w-3.5 text-pink-600" />
                  </div>
                  <span className="text-gray-700">100% Free skincare education.</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-100">
                    <ShieldCheck className="h-3.5 w-3.5 text-pink-600" />
                  </div>
                  <span className="text-gray-700">Unsubscribe anytime.</span>
                </div>

              </div>

            </div>

            {/* Right */}

            <div className="rounded-3xl bg-gradient-to-br from-pink-50 to-rose-50 p-8">

              {!submitted ? (
                <>
                  <div className="mb-6 flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-400 text-white shadow-lg shadow-pink-300">
                      <Mail size={32} />
                    </div>
                  </div>

                  <h3 className="text-center text-2xl font-bold text-gray-900">
                    Join 15,000+ Readers
                  </h3>

                  <p className="mt-3 text-center text-gray-600">
                    Weekly skincare advice that actually helps.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-8 space-y-4">

                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full rounded-xl border border-pink-200 bg-white px-5 py-4 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    />

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 py-4 font-semibold text-white shadow-lg shadow-pink-200 transition hover:shadow-xl hover:shadow-pink-300"
                    >
                      Subscribe Free
                    </button>

                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-400 text-white shadow-lg shadow-pink-300">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    You're In!
                  </h3>
                  <p className="mt-3 text-gray-600">
                    Check your inbox soon for your first GlowSkin update.
                  </p>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}