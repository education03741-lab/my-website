import { Star, Quote, Users, FileText, Sparkles } from "lucide-react";

const stats = [
  { icon: Users, number: "25K+", label: "Monthly Readers" },
  { icon: FileText, number: "150+", label: "Skincare Articles" },
  { icon: Sparkles, number: "50+", label: "Ingredient Guides" },
  { icon: Star, number: "98%", label: "Reader Satisfaction" },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Skincare Enthusiast",
    review:
      "GlowSkin completely transformed my skincare routine. The ingredient guides are simple, trustworthy, and easy to follow.",
  },
  {
    name: "Emily Brown",
    role: "Beauty Blogger",
    review:
      "I love how every article is backed by science. It has become my go-to resource before buying any skincare product.",
  },
  {
    name: "Olivia Wilson",
    role: "Regular Reader",
    review:
      "The routines are practical and easy to understand. My skin has improved dramatically after following GlowSkin's advice.",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export default function Testimonials() {
  return (
    <section className="bg-linear-to-b from-primary-light/20 to-white py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">
          <span className="inline-block rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm">
            Testimonials
          </span>

          <h2 className="mt-6 text-5xl font-bold text-charcoal">
            What Our Readers Say
          </h2>

          <p className="mt-5 max-w-2xl mx-auto text-lg text-gray-600">
            Thousands of readers trust GlowSkin for reliable skincare education.
          </p>
        </div>

        {/* Compact Stats Strip */}
        <div className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary-dark">
                  <Icon className="h-5 w-5 text-white" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-charcoal leading-tight">
                    {stat.number}
                  </p>
                  <p className="text-xs text-gray-500 leading-tight">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Testimonial Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="relative rounded-3xl bg-white p-8 shadow-[0_2px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(196,112,122,0.18)]"
            >
              <Quote
                className="absolute right-8 top-8 h-10 w-10 text-primary-light"
                fill="currentColor"
                strokeWidth={0}
              />

              <div className="flex gap-1 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5" fill="currentColor" strokeWidth={0} />
                ))}
              </div>

              <p className="relative mt-6 leading-7 text-gray-600">
                {testimonial.review}
              </p>

              <div className="mt-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary-dark text-sm font-bold text-white">
                  {getInitials(testimonial.name)}
                </div>

                <div>
                  <h3 className="font-bold text-charcoal">
                    {testimonial.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}