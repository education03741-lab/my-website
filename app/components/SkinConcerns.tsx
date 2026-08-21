import Image from "next/image";
import Link from "next/link";
import { Concern } from "../data/concerns";

interface SkinConcernsProps {
  concerns: Concern[];
}

export default function SkinConcerns({ concerns }: SkinConcernsProps) {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">
          <span className="rounded-full bg-primary-light px-4 py-2 text-sm font-semibold text-primary-dark">
            Personalized Skincare
          </span>

          <h2 className="mt-6 text-5xl font-bold text-charcoal">
            Browse by Skin Concern
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
            Every skin type is different. Explore dermatologist-inspired guides
            tailored to your unique skincare concerns.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {concerns.map((item, index) => (
            <Link
              key={item.slug}
              href={`/skin-concerns/${item.slug}`}
              className="group overflow-hidden rounded-[30px] bg-white shadow-[0_2px_20px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(196,112,122,0.25)]"
            >
              <div className="relative h-72 w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Duotone-style tint for a cohesive, editorial look across all photos */}
                <div className="absolute inset-0 bg-gradient-to-b from-charcoal/10 via-transparent to-charcoal/90 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                {/* Numbered index, top-left — quiet premium detail */}
                <span className="absolute left-6 top-6 font-serif text-sm italic !text-white/70">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Title block, bottom — serif type with a thin accent rule */}
                <div className="absolute inset-x-6 bottom-6">
                  <div className="mb-3 h-px w-10 !bg-white/70" />
                  <h3 className="font-serif text-[28px] leading-tight !text-white" style={{ color: "#ffffff" }}>
                    {item.title}
                  </h3>
                </div>
              </div>

              <div className="p-8">
                <p className="leading-7 text-gray-600">
                  {item.description}
                </p>

                <div className="mt-6 flex items-center gap-2 font-semibold text-primary transition group-hover:translate-x-2">
                  Explore Guides
                  <span className="transition group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
