import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section aria-labelledby="home-hero-title" className="gs-luxury-hero gs-atelier-campaign relative overflow-hidden bg-[#F7F3EC]">
      <div className="pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-[#E8D1D3]/40 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-14 pt-12 sm:px-6 md:pb-16 md:pt-16 lg:grid-cols-[1.03fr_0.97fr] lg:gap-12 lg:py-20">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-[#A66370]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#662F42]">
              THE SKIN ATELIER · GLOWSKIN
            </p>
          </div>
          <h1
            id="home-hero-title"
            className="max-w-[19ch] font-heading text-[clamp(2.8rem,5.2vw,5.4rem)] font-medium leading-[1.02] tracking-[-0.045em] !text-[#282521]"
          >
            Healthier, clearer,<br />
            <span className="italic !text-[#A66370]">more radiant skin.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#514C47] sm:text-lg sm:leading-8">
            A considered world of skincare. Discover thoughtful guidance on ingredients, routines,
            and the questions you actually have about your skin.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/blog"
              className="gs-luxury-button group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#662F42] px-7 py-3 font-semibold text-white transition hover:bg-[#4B2331] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#662F42]"
            >
              Explore the journal
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </Link>
            <Link
              href="/ingredients"
              className="inline-flex min-h-12 items-center gap-2 border-b border-[#662F42] px-1 py-3 font-semibold text-[#662F42] transition hover:border-[#A66370] hover:text-[#A66370]"
            >
              Explore ingredients <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-4 border-t border-[#DAD0C5] pt-5 text-xs uppercase tracking-[0.17em] text-[#6B635C]">
            <span>Skincare, explained simply</span>
            <ArrowDownRight className="h-4 w-4 text-[#A66370]" aria-hidden="true" />
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -left-5 top-8 hidden h-[86%] w-[86%] rounded-t-[220px] bg-[#DFC9C6] sm:block" />
          <div className="relative aspect-[5/4] overflow-hidden rounded-t-[100px] rounded-b-[16px] bg-[#D8C4BE] shadow-[0_32px_80px_rgba(68,43,43,0.13)] sm:rounded-t-[180px]">
            <Image
              src="/images/hero/hero-product.jpg"
              alt="GlowSkin skincare editorial image"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <div className="gs-hero-note absolute -bottom-3 left-4 right-4 border border-[#E3D9D0] bg-[#FFFCF8] px-6 py-5 shadow-[0_10px_36px_rgba(48,37,33,0.10)] sm:-left-5 sm:right-auto sm:w-60">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.23em] text-[#A66370]">Our point of view</span>
            <p className="mt-2 font-heading text-xl leading-snug text-[#282521]">
              Better skin decisions start with better information.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
