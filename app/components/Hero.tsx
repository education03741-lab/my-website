import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, FlaskConical, Leaf } from "lucide-react";

export default function Hero() {
  return (
    <section aria-labelledby="home-hero-title" className="gs-mineral-surface gs-botanical-hero relative isolate overflow-hidden border-b border-[#E2E3D8]">
      <div aria-hidden="true" className="pointer-events-none absolute -left-28 bottom-0 h-80 w-80 rounded-full border border-[#E0E3D3]/70 bg-[#E8ECD9]/25 blur-2xl" />
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-8 px-6 py-12 sm:py-16 lg:min-h-[590px] lg:grid-cols-[1.03fr_.97fr] lg:gap-10 lg:py-20">
        <div className="relative z-20 max-w-2xl">
          <p className="mb-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[.24em] text-[#37563A] dark:text-[#C9D9BB]">
            THE GLOW SKIN JOURNAL <span aria-hidden="true" className="h-px w-12 bg-[#94A78B]" />
          </p>
          <h1 id="home-hero-title" className="max-w-[13ch] font-heading text-[clamp(3.1rem,5.5vw,5.8rem)] font-medium leading-[1.04] tracking-[-.052em] !text-[#26382A] dark:!text-[#F7F6EF]">
            Simpler skincare for <span className="italic !text-[#436D3E] dark:!text-[#B8D4AB]">healthier-looking skin.</span>
          </h1>
          <p className="mt-6 max-w-[30rem] text-base leading-8 text-[#4B584B] dark:text-[#DAE4D7] sm:text-lg">
            Clear ingredient guides, thoughtful routines, and practical advice to help you understand your skin.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/blog" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#2B552D] px-7 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(35,68,37,.16)] transition hover:-translate-y-0.5 hover:bg-[#1F4325] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2B552D]">
              Explore articles <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/ingredients" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#A2B09C] bg-white/55 px-6 py-3 text-sm font-semibold text-[#28462B] transition hover:border-[#52714A] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2B552D] dark:bg-[#344537] dark:text-[#EDF4E8]">
              Browse ingredients <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#CAD5C1] pt-5 text-xs font-semibold text-[#52634F] dark:border-[#52644E] dark:text-[#D5E0D0] sm:gap-x-8">
            <li className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4 text-[#416843]" aria-hidden="true" /> Easy-to-follow guides</li>
            <li className="inline-flex items-center gap-2"><FlaskConical className="h-4 w-4 text-[#416843]" aria-hidden="true" /> Ingredient explainers</li>
            <li className="inline-flex items-center gap-2"><Leaf className="h-4 w-4 text-[#416843]" aria-hidden="true" /> Everyday routines</li>
          </ul>
        </div>
        <div className="relative mx-auto w-full max-w-[555px] pb-6 pt-5 sm:pb-8 lg:pt-0">
          <div className="absolute -right-1 top-3 h-[90%] w-[83%] rounded-t-[46%] rounded-b-[2rem] border border-[#CAD5BF] bg-[#DDE3D1] sm:-right-4" aria-hidden="true" />
          <div className="relative ml-3 aspect-[5/5.25] w-[88%] overflow-hidden rounded-t-[46%] rounded-b-[1.5rem] bg-[#DADFD0] shadow-[0_28px_70px_rgba(42,59,38,.13)] sm:ml-6">
            <Image src="/images/concerns/sensitive-skin.jpg" alt="Editorial portrait showing natural skin texture" fill priority sizes="(max-width: 1024px) 90vw, 44vw" className="object-cover object-center" />
          </div>
          <div className="absolute -bottom-1 right-0 w-[29%] overflow-hidden rounded-[1.25rem] border-[5px] border-[#F8F7EF] bg-[#EEECE2] shadow-[0_15px_38px_rgba(47,58,39,.17)] sm:right-2">
            <div className="relative aspect-[4/4.7]">
              <Image src="/images/hero/hero-product.jpg" alt="Skincare product editorial detail" fill sizes="(max-width: 768px) 28vw, 13vw" className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
