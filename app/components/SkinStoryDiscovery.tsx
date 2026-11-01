"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Droplets, Leaf, Sun, Heart } from "lucide-react";

const paths = [
  { id: "acne", label: "Breakouts", title: "Understand breakout-prone skin", description: "Explore common acne concerns and a gentle starting point for learning about your skin.", href: "/skin-concerns/acne", Icon: Heart },
  { id: "dry", label: "Dryness", title: "Explore comfortable, hydrated skin", description: "Learn about dry skin and simple considerations for a supportive daily routine.", href: "/skin-concerns/dry-skin", Icon: Droplets },
  { id: "sensitive", label: "Sensitivity", title: "Find a calmer approach", description: "Read about sensitive skin, ingredient choices, and how to keep routines straightforward.", href: "/skin-concerns/sensitive-skin", Icon: Leaf },
  { id: "pigmentation", label: "Uneven tone", title: "Understand uneven skin tone", description: "Explore pigmentation questions and ingredient information without one-size-fits-all promises.", href: "/skin-concerns/pigmentation", Icon: Sun },
  { id: "routine", label: "Starting fresh", title: "Build your skincare knowledge", description: "Begin with the essentials and explore a manageable skincare routine.", href: "/blog/beginners-skincare-routine", Icon: Sparkles },
] as const;

export default function SkinStoryDiscovery() {
  const [selected, setSelected] = useState<(typeof paths)[number]["id"]>("dry");
  const chosen = paths.find((path) => path.id === selected) ?? paths[0];

  return (
    <section aria-labelledby="skin-story-title" className="relative overflow-hidden bg-[#33242B] py-16 text-[#FFF8F0] sm:py-24">
      <div className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-[#825C66]/30 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[.95fr_1.05fr] lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.28em] text-[#E1BBA7]">The Skin Atelier · Discover</p>
          <h2 id="skin-story-title" className="mt-6 font-heading text-4xl font-medium leading-tight !text-[#FFF8F0] sm:text-5xl">Start with <span className="italic !text-[#E5BDBB]">your skin story.</span></h2>
          <p className="mt-6 max-w-lg leading-8 text-[#E3D5CE]">A thoughtful way to find GlowSkin guides that speak to your questions. What would you like to explore first?</p>
          <p className="mt-8 text-xs leading-6 text-[#CDB9B1]">For learning and discovery only. This is not a skin diagnosis or personalized medical advice.</p>
        </div>
        <div className="rounded-[1.75rem] border border-white/15 bg-[#FFF9F2] p-5 text-[#33242B] shadow-[0_30px_80px_rgba(0,0,0,.18)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#855B62]">01 / Choose a focus</p>
          <div aria-label="Your skincare interest" className="mt-5 flex flex-wrap gap-2">
            {paths.map(({ id, label, Icon }) => (
              <button key={id} type="button" aria-pressed={selected === id} onClick={() => setSelected(id)} className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#662F42] ${selected === id ? "border-[#713D4E] bg-[#713D4E] text-white" : "border-[#D9C8BE] bg-white text-[#57484A] hover:border-[#9D7780]"}`}>
                <Icon className="h-4 w-4" aria-hidden="true" />{label}
              </button>
            ))}
          </div>
          <div aria-live="polite" className="mt-7 border-t border-[#E5D6CD] pt-6">
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#997667]">02 / Your starting point</p>
            <h3 className="mt-3 font-heading text-2xl font-medium text-[#35262B] sm:text-3xl">{chosen.title}</h3>
            <p className="mt-3 leading-7 text-[#695C57]">{chosen.description}</p>
            <Link href={chosen.href} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#713D4E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#552C3B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#713D4E]">
              Explore this guide <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
