import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * Original, lightweight SVG educational illustrations.
 * These are conceptual navigation diagrams, not diagnostic skin imagery.
 * Labels stay as real HTML or SVG text instead of text baked into photographs.
 */
const concerns = [
  { label: "Acne", href: "/skin-concerns/acne", note: "Breakouts and clogged pores" },
  { label: "Dry skin", href: "/skin-concerns/dry-skin", note: "Tightness and flaky patches" },
  { label: "Oily skin", href: "/skin-concerns/oily-skin", note: "Shine and excess oil" },
  { label: "Sensitive skin", href: "/skin-concerns/sensitive-skin", note: "Redness and reactivity" },
  { label: "Pigmentation", href: "/skin-concerns/pigmentation", note: "Uneven-looking tone" },
];

export function SkinAtlasVisual({ compact = false }: { compact?: boolean }) {
  return (
    <figure className="w-full rounded-[1.75rem] border border-[#E5CFCB] bg-gradient-to-br from-[#FFF9F5] via-[#F6E6E0] to-[#EED9D4] p-3 shadow-[0_18px_50px_rgba(93,52,61,.07)] sm:p-5">
      <svg viewBox="0 0 540 430" className="h-auto w-full" role="img" aria-labelledby="skin-atlas-title skin-atlas-desc">
        <title id="skin-atlas-title">An illustrated face with a map of common skin concerns</title>
        <desc id="skin-atlas-desc">Representative locations of acne, dryness, redness or sensitivity, uneven tone, and oiliness. These patterns vary from person to person.</desc>
        <defs>
          <linearGradient id="atlas-skin" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F4C5AA" /><stop offset="55%" stopColor="#E9AB91"/><stop offset="100%" stopColor="#CC8977"/>
          </linearGradient>
          <linearGradient id="atlas-hair" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#68433F"/><stop offset="100%" stopColor="#35272B"/>
          </linearGradient>
          <linearGradient id="atlas-neck" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E9AE99"/><stop offset="100%" stopColor="#D69B85"/>
          </linearGradient>
        </defs>
        <circle cx="266" cy="213" r="177" fill="#F5DDD5" opacity=".75"/>
        <path d="M165 417c16-42 63-59 101-60 42 0 95 21 111 60" fill="#CEB3AD"/>
        <path d="M230 320h72v73c-15 23-56 24-72 0Z" fill="url(#atlas-neck)"/>
        <path d="M177 147c-12-75 31-126 93-126 70 0 106 55 92 129 16 75-3 154-37 183H207c-36-37-48-126-30-186Z" fill="url(#atlas-hair)"/>
        <ellipse cx="270" cy="209" rx="95" ry="126" fill="url(#atlas-skin)"/>
        <ellipse cx="177" cy="225" rx="15" ry="26" fill="#E4A58F"/>
        <ellipse cx="363" cy="225" rx="15" ry="26" fill="#D99685"/>
        <path d="M172 164c-1-78 37-129 104-125 58 2 89 43 90 124-17-13-29-39-33-69-37 37-104 33-161 70Z" fill="url(#atlas-hair)"/>
        <path d="M199 192q28-18 55-4M286 188q28-17 55 1" fill="none" stroke="#704943" strokeWidth="6" strokeLinecap="round"/>
        <path d="M205 211q24-14 45 0M290 210q23-14 45 0" fill="none" stroke="#503A36" strokeWidth="3" strokeLinecap="round"/>
        <path d="M268 205q-9 33 3 46l13 1" fill="none" stroke="#C07F73" strokeWidth="3" strokeLinecap="round"/>
        <path d="M241 277q26 17 55 0" fill="none" stroke="#A66370" strokeWidth="4" strokeLinecap="round"/>
        <path d="M240 276q28-7 57 0" fill="none" stroke="#D38D8B" strokeWidth="3"/>
        {/* Subtle conceptual markers, not realistic clinical representations. */}
        <ellipse cx="268" cy="168" rx="35" ry="14" fill="#FFF9E9" opacity=".43" />
        <ellipse cx="211" cy="241" rx="27" ry="31" fill="#CA6B70" opacity=".27" />
        <ellipse cx="330" cy="260" rx="27" ry="30" fill="#F5D9BC" opacity=".62" stroke="#DBA48F" strokeDasharray="5 6" />
        <ellipse cx="320" cy="214" rx="21" ry="18" fill="#A95B55" opacity=".17" />
        {[[204,222],[216,233],[226,244],[208,252],[222,263]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i%2?3.4:2.4} fill="#B85B62" opacity=".8"/>)}
        {[[318,191],[329,199],[337,212],[319,223]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i%2?3:2} fill="#9C766A" opacity=".75"/>)}
        <g fill="none" stroke="#B98F8A" strokeWidth="1.5" strokeLinecap="round">
          <path d="M208 239L129 151H80"/>
          <path d="M329 256L412 307H455"/>
          <path d="M271 163L389 68H459"/>
          <path d="M319 206L414 160H474"/>
          <path d="M229 252L129 320H76"/>
        </g>
        <g fill="#753F51" fontFamily="Arial,sans-serif" fontSize="15" fontWeight="600">
          <text x="17" y="146">Acne</text>
          <text x="389" y="60">Oiliness</text>
          <text x="412" y="155">Dark spots</text>
          <text x="414" y="302">Dryness</text>
          <text x="16" y="314">Sensitivity</text>
        </g>
        <g fill="#9B6572">
          <circle cx="208" cy="239" r="4"/><circle cx="329" cy="256" r="4"/>
          <circle cx="271" cy="163" r="4"/><circle cx="319" cy="206" r="4"/>
          <circle cx="229" cy="252" r="4"/>
        </g>
      </svg>
      {!compact && (
        <figcaption className="px-3 pb-2 text-center text-xs leading-5 text-[#745D61]">
          Illustrative skin-concern atlas. Skin conditions do not always appear in these areas.
        </figcaption>
      )}
    </figure>
  );
}

export function SkinConcernMap() {
  return (
    <div className="space-y-4">
      <SkinAtlasVisual />
      <nav aria-label="Explore skin concerns on the illustrated map" className="grid gap-2 sm:grid-cols-2">
        {concerns.map(({label,href,note})=>(
          <Link key={href} href={href} className="group rounded-xl border border-[#E5D0CE] bg-[#FFFAF7] px-4 py-3 transition hover:border-[#9C6877] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#743E54]">
            <span className="flex items-center justify-between gap-2 text-sm font-semibold text-[#693B4B]">{label}<ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true"/></span>
            <span className="mt-1 block text-xs text-[#785F63]">{note}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

const ingredients = [
  { name:"Vitamin C", note:"Antioxidant", href:"/ingredients/vitamin-c" },
  { name:"Niacinamide", note:"Barrier support", href:"/ingredients/niacinamide" },
  { name:"Hyaluronic acid", note:"Hydration", href:"/ingredients/hyaluronic-acid" },
  { name:"Retinol", note:"Skin renewal", href:"/ingredients/retinol" },
];
export function IngredientMap() {
  return (
    <div className="rounded-[1.75rem] border border-[#D0DDCB] bg-[#F7FAF3] p-5 shadow-[0_18px_45px_rgba(64,92,65,.07)] sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#597050]">THE INGREDIENT ATLAS</p>
      <svg viewBox="0 0 530 315" className="mt-2 h-auto w-full" role="img" aria-label="Illustrated skin-layer cross-section with skincare droplets and a serum pipette">
        <defs>
          <linearGradient id="layer-a" x1="0" x2="1"><stop stopColor="#F2C5AD"/><stop offset="1" stopColor="#EBC2AD"/></linearGradient>
          <linearGradient id="layer-b" x1="0" x2="1"><stop stopColor="#E9A98F"/><stop offset="1" stopColor="#F3D0B9"/></linearGradient>
        </defs>
        <rect x="34" y="178" width="462" height="105" rx="17" fill="#DDB19C"/>
        <path d="M34 189q26-20 51 0t52 0t52 0t52 0t52 0t52 0t52 0t52 0t47 0v39H34Z" fill="url(#layer-a)"/>
        <path d="M34 226q25-13 50 0t52 0t52 0t52 0t52 0t52 0t52 0t52 0t48 0v42H34Z" fill="url(#layer-b)"/>
        <path d="M34 270q28-12 56 0t56 0t56 0t56 0t56 0t56 0t56 0t70 0v13H34Z" fill="#D49587"/>
        <path d="M342 24l27-9 33 74-23 10Z" fill="#FCFCF5" stroke="#91A48A" strokeWidth="5"/>
        <path d="M379 89l12 42-23 0-13-35Z" fill="#B9D4BE" opacity=".8"/>
        <path d="M377 134c-10 13-13 22 0 27 14-4 12-15 0-27Z" fill="#87B5A7"/>
        <g fill="#86A69A">{[[91,197],[174,211],[247,194],[316,221],[425,198],[372,245]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={8+(i%3)*2}/>)}</g>
        <g fill="#F7E1A0">{[[75,244],[138,231],[220,251],[275,233],[457,234]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="7"/>)}</g>
        <g stroke="#728F6C" strokeWidth="2" fill="none"><path d="M50 154h140M298 154h190M53 295h430"/></g>
        <g fill="#526C50" fontSize="14" fontFamily="Arial,sans-serif" fontWeight="600">
          <text x="48" y="144">Surface</text><text x="417" y="144">Hydration</text><text x="45" y="311">Skin layers (illustrative, not to scale)</text>
        </g>
      </svg>
      <div className="grid grid-cols-2 gap-2">
        {ingredients.map((item)=>(
          <Link key={item.href} href={item.href} className="rounded-xl border border-[#D6DFD0] bg-white/85 p-3 transition hover:border-[#839A7D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#597050]">
            <span className="flex items-center gap-1 text-sm font-semibold text-[#35523F]">{item.name}<ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0" aria-hidden="true"/></span>
            <span className="mt-1 block text-xs text-[#617460]">{item.note}</span>
          </Link>
        ))}
      </div>
      <p className="mt-3 text-xs leading-5 text-[#6F806C]">Conceptual ingredient map, not a diagram of clinical penetration or efficacy.</p>
    </div>
  );
}

const routine = [
  { number:"01",title:"Cleanse", detail:"Remove surface impurities", symbol:"pump" },
  { number:"02",title:"Serum", detail:"Explore active ingredients", symbol:"drop" },
  { number:"03",title:"Moisturize", detail:"Support skin comfort", symbol:"jar" },
  { number:"04",title:"Protect", detail:"Daily sun protection", symbol:"tube" },
];
export function ProductRoutineMap() {
  return (
    <div className="rounded-[1.75rem] border border-[#E1D2BA] bg-gradient-to-b from-[#FFFAF3] to-[#F4E8DC] p-5 shadow-[0_18px_45px_rgba(94,64,35,.07)] sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#8C6C44]">A ROUTINE, VISUALLY EXPLAINED</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {routine.map(({number,title,detail,symbol})=>(
          <div key={number} className="relative flex min-h-48 flex-col items-center justify-center rounded-t-[4rem] rounded-b-xl border border-[#E6D6C4] bg-[#FFFDF9] px-3 py-5 text-center">
            <span className="absolute left-4 top-4 text-xs font-semibold text-[#997450]">{number}</span>
            <svg viewBox="0 0 94 105" aria-hidden="true" className="h-24 w-24" fill="none">
              {symbol==="pump" && <><path d="M30 32h35v57H30Z" fill="#E6B1A7" stroke="#9C6B60" strokeWidth="3"/><path d="M39 31V17h18v13M48 17V9h29v9H62" stroke="#9C6B60" strokeWidth="5" strokeLinecap="round"/><rect x="36" y="47" width="23" height="22" rx="4" fill="#FFF7EC"/></>}
              {symbol==="drop" && <><path d="M37 35h22v54H37Z" fill="#DFA95C" stroke="#A67949" strokeWidth="3"/><path d="M42 35V23h13v12M45 22V7h8v15" stroke="#926542" strokeWidth="4" strokeLinecap="round"/><path d="M49 47v24" stroke="#F9E4B5" strokeWidth="6" strokeLinecap="round"/></>}
              {symbol==="jar" && <><rect x="22" y="42" width="52" height="46" rx="10" fill="#F6E5CF" stroke="#B59A75" strokeWidth="3"/><rect x="18" y="34" width="60" height="14" rx="5" fill="#D8C1A4" stroke="#B59A75" strokeWidth="3"/><path d="M32 66q16-8 32 0" stroke="#E7D5B9" strokeWidth="4"/></>}
              {symbol==="tube" && <><path d="M31 21h40l-6 56H37Z" fill="#E1C1AD" stroke="#9C7968" strokeWidth="3"/><rect x="38" y="77" width="26" height="13" rx="3" fill="#C8A48B" stroke="#9C7968" strokeWidth="2"/><circle cx="51" cy="47" r="10" stroke="#A87D47" strokeWidth="3"/><path d="M51 29v6m0 24v6m-18-18h7m23 0h7" stroke="#A87D47" strokeWidth="2"/></>}
            </svg>
            <span className="mt-2 font-heading text-lg font-medium text-[#4C3930]">{title}</span>
            <span className="mt-1 text-xs leading-5 text-[#79685B]">{detail}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-[#7F6C60]">A simple product-type guide—not a prescribed routine or an endorsement of particular products.</p>
    </div>
  );
}

export function JournalReadingMap() {
  const sections = [
    {label:"Start",note:"Beginner guides",href:"/blog/category/beginner-guide"},
    {label:"Explore",note:"Acne care",href:"/blog/category/acne-care"},
    {label:"Protect",note:"Sun protection",href:"/blog/category/sun-protection"},
  ];
  return (
    <div className="rounded-[1.75rem] border border-[#E8D3C7] bg-gradient-to-br from-[#FFFCF8] to-[#F1DFD5] p-5 shadow-[0_18px_45px_rgba(98,58,63,.07)] sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#8D5961]">YOUR READING ROUTE</p>
      <svg viewBox="0 0 530 290" className="my-3 h-auto w-full" role="img" aria-label="Open editorial journal with three pathways: start, explore and protect">
        <path d="M259 77q-94-60-215-16v178q114-35 215 19Z" fill="#E8C6B4" stroke="#AC8A80" strokeWidth="3"/>
        <path d="M261 77q96-60 225-16v178q-123-35-225 19Z" fill="#F2DACA" stroke="#AC8A80" strokeWidth="3"/>
        <path d="M259 84q-100-47-202-12v150q103-30 202 20Z" fill="#FFFCF7"/>
        <path d="M262 84q102-47 213-12v150q-105-30-213 20Z" fill="#FFF9EE"/>
        <path d="M260 82v165" stroke="#BE9B89" strokeWidth="4"/>
        <g stroke="#DFCABC" strokeWidth="4" strokeLinecap="round"><path d="M86 142h134M86 157h112M86 172h125M86 187h100M296 142h140M296 157h118M296 172h128M296 187h105"/></g>
        <text x="85" y="119" fontFamily="Georgia,serif" fontSize="23" fill="#7E4756">The Skin Edit</text>
        <text x="295" y="117" fontFamily="Georgia,serif" fontSize="22" fill="#7E4756">Your next read</text>
        <path d="M232 35q-10-14-20 0t20 14q10-14 0-14Z" fill="#D3A8A1"/>
        <circle cx="264" cy="44" r="15" fill="#B89487"/>
        <circle cx="294" cy="44" r="11" fill="#D7BD9D"/>
      </svg>
      <nav aria-label="Explore journal reading paths" className="grid gap-2 sm:grid-cols-3">
        {sections.map((item,idx)=><Link key={item.href} href={item.href} className="rounded-xl border border-[#E3CFC7] bg-white/90 p-3 transition hover:border-[#986D75] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7E4756]">
          <span className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#A16E76]">{String(idx+1).padStart(2,"0")} · {item.label}</span>
          <span className="mt-1 flex items-center justify-between gap-1 text-sm font-semibold text-[#663B49]">{item.note}<ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true"/></span>
        </Link>)}
      </nav>
    </div>
  );
}
