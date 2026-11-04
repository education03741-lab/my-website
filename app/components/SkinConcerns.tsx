import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Leaf } from "lucide-react";
import type { Concern } from "../data/concerns";

interface SkinConcernsProps {
  concerns: Concern[];
  showAll?: boolean;
}

export default function SkinConcerns({ concerns, showAll = false }: SkinConcernsProps) {
  const displayedConcerns = showAll ? concerns : concerns.slice(0, 6);

  return (
    <section className="gs-botanical-concerns border-y border-[#E4E9DF] bg-[#F8F8F1] py-16 dark:!border-[#536B55] dark:!bg-[#253128] sm:py-24" aria-labelledby="concerns-heading">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[.24em] text-[#54764D] dark:text-[#B4D2AA]">FIND YOUR FOCUS</p>
            <h2 id="concerns-heading" className="font-heading text-4xl font-medium tracking-[-.035em] !text-[#29372B] dark:!text-[#F6F7EF] sm:text-5xl">
              Explore your <span className="italic !text-[#436D3E] dark:!text-[#BED9B4]">skin concerns.</span>
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#5B685B] dark:text-[#D5DECF]">
              Learn about common skin concerns, everyday routines and questions worth considering.
            </p>
          </div>
          {!showAll && (
            <Link href="/skin-concerns" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#2D5830] underline-offset-4 hover:underline dark:text-[#C7DDBB]">
              View all concerns <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {displayedConcerns.map((item) => (
            <Link
              key={item.slug}
              href={`/skin-concerns/${item.slug}`}
              className="gs-botanical-card group flex h-full flex-col overflow-hidden rounded-[1.3rem] border border-[#DCE3D6] bg-[#FFFEFB] shadow-[0_8px_26px_rgba(44,59,42,.045)] transition hover:-translate-y-1 hover:border-[#8DA784] hover:shadow-[0_20px_46px_rgba(44,59,42,.11)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2D5830] dark:border-[#536B55] dark:bg-[#303D33]"
            >
              <div className="relative aspect-[16/10] overflow-hidden border-b border-[#E6E9DE] bg-[#EFF1E7] dark:border-[#536B55] dark:bg-[#435444]">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.015]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center" aria-hidden="true"><Leaf className="h-14 w-14 stroke-[1.2] text-[#829E78]" /></div>
                )}
              </div>
              <div className="flex flex-1 flex-col px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
                <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#54764D] dark:text-[#B4D2AA]">Skin concern guide</p>
                <h3 className="mt-3 font-heading text-[1.55rem] font-medium leading-[1.2] tracking-[-.025em] !text-[#29372B] dark:!text-[#F6F7F0]">{item.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#5B685B] dark:text-[#D4DEC8]">{item.description}</p>
                <span className="mt-auto flex items-center justify-between gap-3 border-t border-[#E3E9DF] pt-5 text-sm font-semibold text-[#2D5830] dark:border-[#566B56] dark:text-[#C7E0BA]">
                  Read concern guide
                  <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E6EDD9] text-[#315835] transition group-hover:bg-[#2D5830] group-hover:text-white">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
