"use client";

import { useState } from "react";
import Image from "next/image";
import { FlaskConical, Stethoscope, Leaf, ShieldCheck, BookOpen, Heart, Plus, Minus } from "lucide-react";

const features = [
  {
    icon: FlaskConical,
    title: "Science-Based Advice",
    description:
      "Our articles are based on trusted skincare research and evidence-based practices, not trends or guesswork.",
  },
  {
    icon: Stethoscope,
    title: "Expert Inspired",
    description:
      "We simplify dermatologist-inspired skincare routines into practical steps you can actually follow every day.",
  },
  {
    icon: Leaf,
    title: "Ingredient Education",
    description:
      "Learn what every ingredient does, how it works, and whether it's right for your skin before you spend money.",
  },
  {
    icon: ShieldCheck,
    title: "No Sponsored Bias",
    description:
      "We recommend what actually works for your skin type, not what pays the most commission.",
  },
  {
    icon: BookOpen,
    title: "Beginner Friendly",
    description:
      "New to skincare? Our guides are written in plain language, with no confusing jargon or assumed knowledge.",
  },
  {
    icon: Heart,
    title: "Trusted by Readers",
    description:
      "Thousands of skincare enthusiasts rely on GlowSkin for practical guidance they can trust and act on.",
  },
];

export default function WhyChooseUs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-linear-to-b from-white to-primary-light/15">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid gap-16 lg:grid-cols-2 items-center">

          {/* Left: Image + Heading */}
          <div>
            <span className="inline-block rounded-full bg-primary-light px-4 py-2 text-sm font-semibold text-primary-dark">
              Why GlowSkin?
            </span>

            <h2 className="mt-6 text-5xl font-bold text-charcoal leading-tight">
              Why Choose GlowSkin
            </h2>

            <p className="mt-5 text-lg text-gray-600">
              We make skincare simple, trustworthy, and backed by science —
              here's what sets us apart from the rest.
            </p>

            <div className="relative mt-10 h-96 w-full overflow-hidden rounded-4xl shadow-2xl">
              <Image
                src="/images/why-choose/why-choose.jpg"
                alt="GlowSkin approach to skincare education"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
            </div>
          </div>

          {/* Right: Accordion */}
          <div className="space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isOpen = openIndex === index;

              return (
                <div
                  key={feature.title}
                  className={`rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? "border-primary-light bg-white shadow-[0_10px_30px_rgba(177,90,102,0.18)]"
                      : "border-gray-100 bg-white/60"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center gap-4 px-6 py-5 text-left"
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                        isOpen
                          ? "bg-linear-to-br from-primary to-primary-dark text-white"
                          : "bg-primary-light/50 text-primary"
                      }`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </div>

                    <span className="flex-1 text-lg font-semibold text-charcoal">
                      {feature.title}
                    </span>

                    <span className="text-primary">
                      {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pl-[4.5rem]">
                      <p className="leading-7 text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}