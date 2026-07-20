import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Ingredient } from "../data/ingredients";

interface IngredientsProps {
  ingredients: Ingredient[];
}

export default function Ingredients({ ingredients }: IngredientsProps) {
  return (
    <section className="bg-linear-to-b from-primary-light/20 to-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">
          <span className="rounded-full bg-primary-light px-4 py-2 text-sm font-semibold text-primary-dark">
            Ingredient Encyclopedia
          </span>

          <h2 className="mt-6 text-5xl font-bold text-charcoal">
            Discover Powerful Ingredients
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
            Understand what each ingredient does, who it's best for,
            and how to build a smarter skincare routine.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {ingredients.map((item) => (
            <Link
              key={item.id}
              href={`/ingredients/${item.slug}`}
              className="group overflow-hidden rounded-4xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"                />
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-charcoal group-hover:text-primary">
                  {item.name}
                </h3>

                <p className="mt-4 leading-7 text-gray-600">
                  {item.description}
                </p>

                <div className="mt-6 flex items-center gap-2 font-semibold text-primary transition group-hover:translate-x-2">
                  Learn More
                  <ArrowRight size={18} />
                </div>
              </div>
            </Link>
          ))}

        </div>

      </div>
    </section>
  );
}