import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const editorialGuides = [
  {
    number: "01",
    title: "Know the ingredients",
    description: "Get familiar with the formulas, everyday terms, and considerations behind your skincare choices.",
    href: "/ingredients",
    link: "Browse the ingredient library",
  },
  {
    number: "02",
    title: "Build your routine",
    description: "Find a practical starting point, then learn how to adjust your routine to what your skin needs.",
    href: "/blog/beginners-skincare-routine",
    link: "Explore the beginner guide",
  },
  {
    number: "03",
    title: "Understand your skin",
    description: "Read about common skin concerns and the questions worth asking before choosing a product.",
    href: "/skin-concerns",
    link: "Explore skin concerns",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#FFFCF8] py-20 sm:py-28" aria-labelledby="editorial-approach">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <div className="relative">
            <div className="relative aspect-[5/6] overflow-hidden rounded-t-[130px] bg-[#D8CEC4]">
              <Image
                src="/images/why-choose/why-choose.jpg"
                alt="GlowSkin editorial image illustrating skincare research and routines"
                fill
                sizes="(max-width: 1024px) 100vw, 38vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-3 bg-[#7B8B74] px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white sm:-right-6">
              Learn · Consider · Choose
            </div>
          </div>
          <div>
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#A66370]">
              How we approach skincare
            </p>
            <h2 id="editorial-approach" className="max-w-xl font-heading text-4xl font-medium leading-tight tracking-tight text-[#282521] sm:text-5xl">
              Curiosity first.<br /><span className="italic text-[#A66370]">Hype comes last.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#625A53]">
              GlowSkin is a skincare education journal. We bring common topics into focus
              so you can ask better questions, compare options, and build a routine that
              makes sense to you.
            </p>
            <div className="mt-10 divide-y divide-[#E4DCD2] border-y border-[#E4DCD2]">
              {editorialGuides.map((guide) => (
                <div key={guide.number} className="grid grid-cols-[2.5rem_1fr] gap-5 py-6">
                  <span className="pt-1 text-sm font-medium text-[#A66370]">{guide.number}</span>
                  <div>
                    <h3 className="font-heading text-2xl font-medium text-[#282521]">{guide.title}</h3>
                    <p className="mt-2 max-w-lg text-sm leading-7 text-[#625A53]">{guide.description}</p>
                    <Link href={guide.href} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#662F42] underline-offset-4 hover:underline">
                      {guide.link}<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm leading-6 text-[#716962]">
              This content is educational and cannot replace advice from a qualified healthcare professional.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
