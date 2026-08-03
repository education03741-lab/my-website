import SeoSchema from "./components/SeoSchema";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WhyChooseUs from "./components/WhyChooseUs";
import FeaturedArticles from "./components/FeaturedArticles";
import SkinConcerns from "./components/SkinConcerns";
import Ingredients from "./components/Ingredients";
import Testimonials from "./components/Testimonials";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import { concerns as staticConcerns, Concern } from "./data/concerns";
import { ingredients as staticIngredients, Ingredient } from "./data/ingredients";
import { client } from "../sanity/lib/client";
import { CONCERNS_QUERY, INGREDIENTS_QUERY } from "../sanity/lib/queries";
import { urlFor } from "../sanity/lib/image";

export default async function Home() {
  const sanityConcerns = await client.fetch(CONCERNS_QUERY);
  const sanityIngredients = await client.fetch(INGREDIENTS_QUERY);

  const mappedSanityConcerns: Concern[] = sanityConcerns.map(
    (item: any, index: number) => ({
      id: 1000 + index,
      title: item.title,
      slug: item.slug?.current,
      image: item.image ? urlFor(item.image).width(800).height(600).url() : "",
      emoji: item.emoji ?? "",
      description: item.description ?? "",
      overview: item.overview ?? "",
      causesIntro: item.causesIntro ?? "",
      causes: item.causes ?? [],
      treatmentsIntro: item.treatmentsIntro ?? "",
      treatments: item.treatments ?? [],
      avoidIntro: item.avoidIntro ?? "",
      avoid: item.avoid ?? [],
      routineIntro: item.routineIntro ?? "",
      routine: item.routine ?? [],
      dermIntro: item.dermIntro ?? "",
      seeADermatologistIf: item.seeADermatologistIf ?? [],
    })
  );

  const mappedSanityIngredients: Ingredient[] = sanityIngredients.map(
    (item: any, index: number) => ({
      id: 2000 + index,
      name: item.name,
      slug: item.slug?.current,
      image: item.image ? urlFor(item.image).width(800).height(600).url() : "",
      description: item.description ?? "",
      benefits: item.benefits ?? [],
      howItWorks: item.howItWorks ?? "",
      keyBenefits: item.keyBenefits ?? [],
      bestFor: item.bestFor ?? [],
      howToUse: item.howToUse ?? "",
      pairsWith: item.pairsWith ?? [],
      avoidWith: item.avoidWith ?? [],
      proTip: item.proTip ?? "",
      faqs: item.faqs ?? [],
    })
  );

  const allConcerns = [...staticConcerns, ...mappedSanityConcerns];
  const allIngredients = [...staticIngredients, ...mappedSanityIngredients];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://glowskin.blog/#organization",
        name: "GlowSkin",
        url: "https://glowskin.blog",
        logo: {
          "@type": "ImageObject",
          url: "https://glowskin.blog/logo.png",
          width: 512,
          height: 512,
        },
        sameAs: [
          "https://www.pinterest.com/glowskin_official/",
        ],
        description:
          "Science-backed skincare guides, ingredient education, and skincare routines.",
      },
      {
        "@type": "WebSite",
        "@id": "https://glowskin.blog/#website",
        url: "https://glowskin.blog",
        name: "GlowSkin",
        publisher: {
          "@id": "https://glowskin.blog/#organization",
        },
        inLanguage: "en",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <main className="bg-white">
        <Navbar />

        <section id="home">
          <Hero />
        </section>

        <WhyChooseUs />

        <section id="blog">
          <FeaturedArticles />
        </section>

        <section id="ingredients">
          <Ingredients ingredients={allIngredients} />
        </section>

        <section id="skin-concerns">
          <SkinConcerns concerns={allConcerns} />
        </section>

        <Testimonials />

        <Newsletter />

        <section id="contact">
          <Footer />
        </section>
      </main>
    </>
  );
}