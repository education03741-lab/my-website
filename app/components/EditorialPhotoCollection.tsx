import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Theme = "concerns" | "ingredients" | "products" | "journal";

type Tile = {
  label: string;
  href: string;
  image: string;
  alt: string;
};

const visualSets: Record<Theme, { kicker: string; lead: Tile; tiles: Tile[] }> = {
  concerns: {
    kicker: "THE SKIN CONCERN EDIT",
    lead: {label:"Explore acne",href:"/skin-concerns/acne",image:"/images/concerns/acne.jpg",alt:"Close-up skincare photograph illustrating acne-prone skin"},
    tiles: [
      {label:"Dry skin",href:"/skin-concerns/dry-skin",image:"/images/concerns/dry-skin.jpg",alt:"Close-up skincare image associated with dry skin"},
      {label:"Sensitivity",href:"/skin-concerns/sensitive-skin",image:"/images/concerns/sensitive-skin.jpg",alt:"Close-up skincare image illustrating sensitive skin"},
      {label:"Pigmentation",href:"/skin-concerns/pigmentation",image:"/images/concerns/pigmentation.jpg",alt:"Skin detail associated with uneven tone and pigmentation"},
    ],
  },
  ingredients: {
    kicker: "INGREDIENTS, IN FOCUS",
    lead: {label:"Vitamin C",href:"/ingredients/vitamin-c",image:"/images/ingredients/vitamin-c.jpg",alt:"Editorial skincare ingredient photography featuring vitamin C"},
    tiles: [
      {label:"Niacinamide",href:"/ingredients/niacinamide",image:"/images/ingredients/niacinamide.jpg",alt:"Editorial skincare photography for niacinamide"},
      {label:"Hyaluronic acid",href:"/ingredients/hyaluronic-acid",image:"/images/ingredients/hyaluronic-acid.jpg",alt:"Editorial skincare photography for hyaluronic acid"},
      {label:"Retinol",href:"/ingredients/retinol",image:"/images/ingredients/retinol.jpg",alt:"Editorial skincare photography for retinol"},
    ],
  },
  products: {
    kicker: "THE PRODUCT WARDROBE",
    lead: {label:"The skincare ritual",href:"/products",image:"/images/concerns/sensitive-skin.jpg",alt:"Premium close-up editorial photograph of facial skin"},
    tiles: [
      {label:"Serums",href:"/products",image:"/images/products/hydra-glow-serum.png",alt:"Hydrating serum skincare product"},
      {label:"Cleansers",href:"/products",image:"/images/products/daily-gentle-cleanser.png",alt:"Gentle cleanser skincare product"},
      {label:"Vitamin C",href:"/products",image:"/images/products/vitamin-c-brightening-serum.png",alt:"Vitamin C brightening serum skincare product"},
    ],
  },
  journal: {
    kicker: "COVER STORIES / 01—04",
    lead: {label:"The evening ritual",href:"/blog/nighttime-skincare-routine",image:"/images/blog/nighttime-skincare-routine.png",alt:"Editorial skincare photography for an evening skincare routine"},
    tiles: [
      {label:"Skincare foundations",href:"/blog/beginners-skincare-routine",image:"/images/blog/beginners-skincare-routine.jpg",alt:"Skincare products and hands demonstrating beginner-friendly care"},
      {label:"Vitamin C or niacinamide?",href:"/blog/vitamin-c-vs-niacinamide",image:"/images/blog/vitamin-c-vs-niacinamide.png",alt:"Skincare ingredient comparison editorial photography"},
      {label:"Sun protection",href:"/blog/how-to-choose-the-right-sunscreen",image:"/images/blog/how-to-choose-the-right-sunscreen.jpg",alt:"Sun protection editorial image"},
    ],
  },
};

function EditorialTile({tile, featured=false, priority=false}: {tile:Tile;featured?:boolean;priority?:boolean}) {
  return (
    <Link href={tile.href} className={`group relative block min-w-0 overflow-hidden bg-[#E9D8D0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#733D52] ${featured ? "h-full min-h-72 rounded-t-[8rem] rounded-b-[1.4rem] sm:rounded-t-[11rem]" : "aspect-[5/4] rounded-t-[4rem] rounded-b-xl sm:rounded-t-[5rem]"}`}>
      <Image src={tile.image} alt={tile.alt} fill priority={priority} sizes={featured?"(max-width:1024px) 100vw, 35vw":"(max-width:640px) 50vw, 15vw"} className="object-cover transition-transform duration-700 group-hover:scale-[1.055]" />
      <span className="absolute inset-0 bg-gradient-to-t from-[#2D2226]/75 via-transparent to-transparent" aria-hidden="true"/>
      <span className={`absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 font-semibold text-white drop-shadow-sm ${featured ? "text-lg sm:text-xl" : "text-xs sm:text-sm"}`}>
        {tile.label}<ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"/>
      </span>
    </Link>
  );
}

/** Photographic topic collections, with links using existing published URLs. */
export function EditorialPhotoCollection({type}:{type:Theme}) {
  const data=visualSets[type];
  return (
    <div className="relative rounded-[1.75rem] border border-white/65 bg-[#FFFDF9]/80 p-3 shadow-[0_20px_65px_rgba(70,41,45,.13)] sm:p-4">
      <div className="mb-3 flex items-center gap-3 px-2 pt-1 text-[10px] font-bold tracking-[.2em] text-[#815566]">
        <span className="h-px w-8 bg-[#A77C86]"/>{data.kicker}
      </div>
      <div className="grid gap-2.5 sm:grid-cols-[1fr_.95fr] sm:gap-3">
        <EditorialTile tile={data.lead} featured priority />
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {data.tiles.map(tile=><EditorialTile key={tile.href+tile.label} tile={tile}/>)}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 px-2 text-[10px] font-semibold uppercase tracking-[.13em] text-[#967977]">
        <span>Explore the collection</span><span>GLOWSKIN / THE ATELIER</span>
      </div>
    </div>
  );
}

export function CategoryCoverPhoto({slug}:{slug:string}) {
  const images: Record<string,Tile> = {
    "acne-care":{image:"/images/concerns/acne.jpg",label:"Acne care",href:"/skin-concerns/acne",alt:"Close-up skincare portrait relating to acne-prone skin"},
    "sun-protection":{image:"/images/blog/how-to-choose-the-right-sunscreen.jpg",label:"Sun protection",href:"/blog/how-to-choose-the-right-sunscreen",alt:"Skincare editorial photograph illustrating sun protection"},
    "beginner-guide":{image:"/images/blog/beginners-skincare-routine.jpg",label:"The essentials",href:"/blog/beginners-skincare-routine",alt:"Premium editorial skincare routine photography"},
  };
  const image=images[slug]??images["beginner-guide"];
  return (
    <figure className="mx-auto w-full">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.25rem] border border-[#DCE5D7] bg-[#F4F3EA] dark:border-[#536B55] dark:bg-[#354638]">
        <Image src={image.image} alt={image.alt} fill sizes="(max-width:1024px) 100vw, 48vw" priority className="object-contain"/>
      </div>
      <figcaption className="mt-3 text-xs font-semibold uppercase tracking-[.12em] text-[#52714A] dark:text-[#D1E0C9]">{image.label} · GlowSkin</figcaption>
    </figure>
  );
}
