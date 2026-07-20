import Image from "next/image";
import Link from "next/link";
import { Product } from "../data/products";

interface ProductsProps {
  products: Product[];
}

export default function Products({ products }: ProductsProps) {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">
          <span className="rounded-full bg-primary-light px-4 py-2 text-sm font-semibold text-primary-dark">
            Featured Products
          </span>

          <h2 className="mt-6 text-5xl font-bold text-charcoal">
            Products We Recommend
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
            Every product featured here is discussed in our articles — explore
            what's inside, how to use it, and where to buy.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-[30px] bg-primary-light/20 py-20 text-center">
            <p className="text-2xl font-semibold text-charcoal">
              No products available yet
            </p>
            <p className="mt-3 text-gray-600">
              We're working on curating our first recommendations — check back soon!
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((item) => (
              <Link
                key={item.slug}
                href={`/products/${item.slug}`}
                className="group overflow-hidden rounded-[30px] bg-white shadow-[0_2px_20px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(196,112,122,0.25)]"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                  <h3 className="absolute bottom-5 left-6 text-2xl font-bold text-white">
                    {item.title}
                  </h3>
                </div>

                <div className="p-8">
                  <p className="text-sm font-semibold text-primary">
                    {item.brand}
                  </p>

                  <p className="mt-2 leading-7 text-gray-600">
                    {item.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-bold text-charcoal">{item.price}</span>
                    <span className="text-sm text-gray-500">
                      ★ {item.rating} ({item.reviewCount})
                    </span>
                  </div>

                  <div className="mt-6 flex items-center gap-2 font-semibold text-primary transition group-hover:translate-x-2">
                    View Product
                    <span className="transition group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}