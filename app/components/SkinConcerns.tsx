import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Concern } from "../data/concerns";

interface SkinConcernsProps {
  concerns: Concern[];
}

export default function SkinConcerns({ concerns }: SkinConcernsProps) {
  return (
    <section className="bg-[#F0E8E1] py-20 sm:py-28" aria-labelledby="concerns-heading">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#662F42]">Find your focus</p>
            <h2 id="concerns-heading" className="max-w-2xl font-heading text-4xl font-medium leading-tight text-[#282521] sm:text-5xl">
              Every skin story <span className="italic text-[#A66370]">is different.</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#625A53]">
              Explore common concerns, learn the basics, and find useful questions to guide your next step.
            </p>
          </div>
          <Link href="/skin-concerns" className="inline-flex items-center gap-2 border-b border-[#662F42] pb-2 text-sm font-semibold text-[#662F42] hover:text-[#A66370]">
            All skin concerns <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {concerns.slice(0, 6).map((item, index) => (
            <Link
              key={item.slug}
              href={`/skin-concerns/${item.slug}`}
              className="group relative flex min-h-[350px] flex-col justify-end overflow-hidden bg-[#C7B9AC] p-8 text-white transition hover:shadow-[0_22px_48px_rgba(51,37,43,0.18)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#662F42]"
            >
              {item.image && <Image src={item.image} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />}
              <div className="absolute inset-0 bg-gradient-to-t from-[#231F20]/90 via-[#231F20]/25 to-[#231F20]/10" />
              <span className="absolute left-8 top-8 z-10 text-xs font-semibold tracking-[0.2em] text-white/90">{String(index + 1).padStart(2, "0")} / GUIDE</span>
              <div className="relative z-10">
                <h3 className="font-heading text-3xl font-medium !text-white">{item.title}</h3>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/85">{item.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
                  Explore this concern <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
