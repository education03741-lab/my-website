import { Users, FileText, Sparkles, Star } from "lucide-react";

const stats = [
  {
    icon: Users,
    number: "25K+",
    label: "Monthly Readers",
  },
  {
    icon: FileText,
    number: "150+",
    label: "Skincare Articles",
  },
  {
    icon: Sparkles,
    number: "50+",
    label: "Ingredient Guides",
  },
  {
    icon: Star,
    number: "98%",
    label: "Reader Satisfaction",
  },
];

export default function Stats() {
  return (
    <section className="bg-linear-to-br from-primary-dark to-primary py-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">

          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-3xl bg-white/10 backdrop-blur-sm p-8 text-center border border-white/20 transition hover:bg-white/15"
              >
                <Icon className="mx-auto h-8 w-8 text-white/80" strokeWidth={1.5} />

                <h2 className="mt-4 text-5xl font-extrabold text-white">
                  {item.number}
                </h2>

                <p className="mt-3 text-primary-light/90 font-medium">
                  {item.label}
                </p>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}