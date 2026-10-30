import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section aria-labelledby="home-hero-title" className="relative overflow-hidden bg-[#F7F3EC]">
      <div className="pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-[#E8D1D3]/40 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-16 pt-14 md:pb-20 md:pt-20 lg:grid-cols-[1.04fr_0.96fr] lg:gap-16 lg:py-24">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px w-10 bg-[#A66370]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#662F42]">
              The Skin Edit · A GlowSkin Journal
            </p>
          </div>
          <h1
            id="home-hero-title"
            className="max-w-[13ch] font-heading text-[clamp(3.6rem,7.5vw,7.2rem)] font-medium leading-[0.98] tracking-[-0.05em] !text-[#282521]"
          >
            Understand your skin.<br />
            <span className="italic !text-[#A66370]">Find your glow.</span>
          </h1>
          <p className="mt-8 max-w-lg text-lg leading-8 text-[#514C47] sm:text-xl">
            Less skincare noise. More thoughtful guidance on ingredients, routines,
            and the questions you actually have about your skin.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/blog/beginners-skincare-routine"
              className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#662F42] px-7 py-3 font-semibold text-white transition hover:bg-[#4B2331] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#662F42]"
            >
              Start with the basics
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </Link>
            <Link
              href="/ingredients"
              className="inline-flex min-h-12 items-center gap-2 border-b border-[#662F42] px-1 py-3 font-semibold text-[#662F42] transition hover:border-[#A66370] hover:text-[#A66370]"
            >
              Explore ingredients <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-14 flex items-center gap-4 border-t border-[#DAD0C5] pt-5 text-xs uppercase tracking-[0.17em] text-[#6B635C]">
            <span>Skincare, explained simply</span>
            <ArrowDownRight className="h-4 w-4 text-[#A66370]" aria-hidden="true" />
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -left-5 top-8 hidden h-[86%] w-[86%] rounded-t-[170px] bg-[#DFC9C6] sm:block" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[170px] rounded-b-[16px] bg-[#D8C4BE] shadow-[0_32px_80px_rgba(68,43,43,0.13)] sm:rounded-t-[230px]">
            <Image
              src="/images/hero/hero-product.jpg"
              alt="GlowSkin skincare editorial image"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 left-4 right-4 border border-[#E3D9D0] bg-[#FFFCF8] px-6 py-5 shadow-[0_10px_36px_rgba(48,37,33,0.10)] sm:-left-8 sm:right-auto sm:w-64">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.23em] text-[#A66370]">Our point of view</span>
            <p className="mt-2 font-heading text-xl leading-snug text-[#282521]">
              Good skin decisions start with good information.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
