import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section aria-labelledby="home-hero-title" className="gs-atelier-campaign relative overflow-hidden bg-[#F8F1E9]">
      <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[#DBAEB0]/20 blur-3xl"/>
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-[.94fr_1.06fr] lg:gap-14">
        <div className="relative z-10">
          <p className="mb-7 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[.27em] text-[#8C5B60]"><span className="h-px w-9 bg-[#AF8285]"/>THE SKIN ATELIER · ISSUE 01</p>
          <h1 id="home-hero-title" className="max-w-[13ch] font-heading text-[clamp(3.15rem,6.5vw,6.4rem)] font-medium leading-[1.01] tracking-[-.055em] !text-[#32282B]">
            Healthier, clearer, <span className="italic !text-[#995B67]">more radiant skin.</span>
          </h1>
          <p className="mt-7 max-w-lg text-base leading-8 text-[#665B56] sm:text-lg">
            Expert-informed skincare guidance, curated ingredient stories and considered routines — for skin that is uniquely yours.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/blog" className="gs-luxury-button inline-flex min-h-12 items-center gap-2 rounded-full bg-[#6B3045] px-7 py-3 text-sm font-semibold text-white hover:bg-[#4D2334] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6B3045]">Explore the journal <ArrowUpRight className="h-4 w-4" aria-hidden="true"/></Link>
            <Link href="/skin-concerns" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#AB8F80] px-7 py-3 text-sm font-semibold text-[#67384A] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6B3045]">Explore your skin <ArrowUpRight className="h-4 w-4" aria-hidden="true"/></Link>
          </div>
          <p className="mt-12 border-t border-[#DCCFC6] pt-5 text-xs uppercase tracking-[.17em] text-[#84736D]">A new perspective on everyday skincare</p>
        </div>
        <div className="relative mx-auto w-full max-w-[650px] pt-3 sm:pb-9">
          <div className="absolute -right-3 top-0 h-[87%] w-[75%] rounded-t-[12rem] rounded-b-2xl border border-[#CDAEAD] bg-[#EDD8D1] sm:-right-6" aria-hidden="true"/>
          <div className="relative ml-2 aspect-[5/5.6] w-[88%] overflow-hidden rounded-t-[12rem] rounded-b-[1.25rem] bg-[#DDC9BD] shadow-[0_30px_65px_rgba(76,40,48,.18)] sm:ml-6 sm:rounded-t-[15rem]">
            <Image src="/images/concerns/sensitive-skin.jpg" alt="Close-up editorial photograph of a person’s natural skin" fill priority sizes="(max-width:1024px) 90vw, 44vw" className="object-cover"/>
            <span className="absolute inset-0 bg-gradient-to-t from-[#39232F]/40 via-transparent to-transparent" aria-hidden="true"/>
            <span className="absolute bottom-7 left-6 text-xs font-bold uppercase tracking-[.22em] text-white">KNOW YOUR SKIN · BEYOND THE SURFACE</span>
          </div>
          <div className="absolute -bottom-2 right-0 w-[40%] overflow-hidden rounded-t-[5rem] rounded-b-xl border-[5px] border-[#F9F3EC] bg-[#E9D7CD] shadow-[0_18px_42px_rgba(62,38,43,.19)] sm:bottom-0 sm:right-1 sm:w-[36%]">
            <div className="relative aspect-[4/5]">
              <Image src="/images/hero/hero-product.jpg" alt="Skincare product editorial detail" fill sizes="(max-width:768px) 35vw, 16vw" className="object-cover"/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
