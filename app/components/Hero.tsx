import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative w-full aspect-[16/9]">
        <Image
          src="/images/hero/hero-banner.jpg"
          alt="GlowSkin - Reveal Your Natural Glow"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Clickable hotspot: Explore Skincare button */}
        <Link
          href="/products"
          aria-label="Explore Skincare"
          className="absolute rounded-full transition hover:ring-2 hover:ring-white/70"
          style={{ left: "8%", top: "62%", width: "18%", height: "8%" }}
        />

        {/* Clickable hotspot: Clean Ingredients */}
        <Link
          href="/ingredients"
          aria-label="Clean Ingredients"
          className="absolute rounded-xl transition hover:ring-2 hover:ring-white/70"
          style={{ left: "8%", top: "78%", width: "12%", height: "8%" }}
        />

        {/* Clickable hotspot: Science Backed */}
        <Link
          href="/blog/category/beginner-guide"
          aria-label="Science Backed"
          className="absolute rounded-xl transition hover:ring-2 hover:ring-white/70"
          style={{ left: "21%", top: "78%", width: "12%", height: "8%" }}
        />

        {/* Clickable hotspot: Made for Every Skin */}
        <Link
          href="/skin-concerns"
          aria-label="Made for Every Skin"
          className="absolute rounded-xl transition hover:ring-2 hover:ring-white/70"
          style={{ left: "34%", top: "78%", width: "13%", height: "8%" }}
        />

        {/* Clickable hotspot: Hyaluronic Acid Serum */}
        <Link
          href="/ingredients/hyaluronic-acid"
          aria-label="Hyaluronic Acid Serum"
          className="absolute rounded-2xl transition hover:ring-2 hover:ring-white/70"
          style={{ left: "51%", top: "30%", width: "12%", height: "50%" }}
        />

        {/* Clickable hotspot: Daily Cleanser */}
        <Link
          href="/products"
          aria-label="Daily Cleanser"
          className="absolute rounded-2xl transition hover:ring-2 hover:ring-white/70"
          style={{ left: "59%", top: "19%", width: "14%", height: "62%" }}
        />

        {/* Clickable hotspot: Daily Moisturizer */}
        <Link
          href="/products"
          aria-label="Daily Moisturizer"
          className="absolute rounded-2xl transition hover:ring-2 hover:ring-white/70"
          style={{ left: "71%", top: "61%", width: "14%", height: "23%" }}
        />

        {/* Clickable hotspot: Balancing Toner */}
        <Link
          href="/products"
          aria-label="Balancing Toner"
          className="absolute rounded-2xl transition hover:ring-2 hover:ring-white/70"
          style={{ left: "84%", top: "36%", width: "11%", height: "47%" }}
        />
      </div>
    </section>
  );
}