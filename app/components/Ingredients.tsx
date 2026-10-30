import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Ingredient } from "../data/ingredients";

interface IngredientsProps {
  ingredients: Ingredient[];
}

export default function Ingredients({ ingredients }: IngredientsProps) {
  return (
    <section className="bg-[#FFFCF8] py-20 sm:py-28" aria-labelledby="ingredient-heading">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-[0.36fr_0.64fr] lg:gap-14">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#A66370]">The ingredient index</p>
            <h2 id="ingredient-heading" className="font-heading text-4xl font-medium leading-tight text-[#282521] sm:text-5xl">
              What&apos;s in <span className="italic text-[#A66370]">your bottle?</span>
            </h2>
            <p className="mt-5 max-w-sm text-base leading-8 text-[#625A53]">
              Discover how familiar skincare ingredients are used, what to consider, and where to learn more.
            </p>
            <Link href="/ingredients" className="mt-7 inline-flex items-center gap-2 border-b border-[#662F42] pb-2 text-sm font-semibold text-[#662F42] hover:text-[#A66370]">
              View ingredient library <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <div className="mt-16 hidden max-w-[15rem] border-t border-[#E3D9D0] pt-5 font-heading text-xl italic leading-relaxed text-[#80756D] lg:block">
              Learn the language of skincare, one ingredient at a time.
            </div>
          </div>
          {ingredients.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {ingredients.slice(0, 4).map((item, index) => (
                <Link
                  key={item.slug || item.id}
                  href={`/ingredients/${item.slug}`}
                  className="group flex flex-col overflow-hidden border border-[#E5DAD0] bg-[#F7F3EC] transition hover:-translate-y-1 hover:border-[#A66370] hover:shadow-[0_18px_36px_rgba(60,40,45,0.08)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#662F42]"
                >
                  <div className="relative aspect-[5/3] overflow-hidden bg-[#E8DED6]">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw" className="object-cover transition duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center font-heading text-6xl italic text-[#B5979A]" aria-hidden="true">gs.</div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66370]">Ingredient {String(index + 1).padStart(2, "0")}</span>
                    <h3 className="mt-3 font-heading text-2xl font-medium text-[#282521]">{item.name}</h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-7 text-[#635D56]">{item.description}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-[#662F42]">Read the guide <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex min-h-64 flex-col justify-center border border-[#E5DAD0] bg-[#F7F3EC] p-10">
              <h3 className="font-heading text-2xl text-[#282521]">Explore the ingredient library</h3>
              <p className="mt-3 text-[#635D56]">Ingredient guides are collected in one place, with explanations in plain English.</p>
              <Link href="/ingredients" className="mt-6 font-semibold text-[#662F42] underline underline-offset-4">Browse ingredients</Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
