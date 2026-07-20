import Link from "next/link";
import { Sparkles } from "lucide-react";

interface ComingSoonProps {
  backHref: string;
  backLabel: string;
  itemLabel: string; // e.g. "product", "article", "ingredient", "skin concern guide"
}

export default function ComingSoon({ backHref, backLabel, itemLabel }: ComingSoonProps) {
  return (
    <main className="max-w-2xl mx-auto px-6 py-32 text-center">
      <Sparkles className="mx-auto text-pink-500" size={40} />

      <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
        Thanks for stopping by!
      </h1>

      <p className="mt-4 text-gray-600 leading-7">
        {`We appreciate your visit. This ${itemLabel} isn't available just yet, but we're actively adding new content — check back soon.`}
      </p>

      <Link
        href={backHref}
        className="mt-8 inline-block rounded-full bg-pink-600 px-8 py-3 font-semibold text-white transition hover:bg-pink-700"
      >
        {backLabel}
      </Link>
    </main>
  );
}
