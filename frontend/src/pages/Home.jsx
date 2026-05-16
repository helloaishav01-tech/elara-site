import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import StainedGlass from "../components/StainedGlass";
import Petals from "../components/Petals";
import BrandStrip from "../components/BrandStrip";
import Reveal from "../components/Reveal";
import { CATEGORIES } from "../data/products";

const HERO_IMG = "https://images.unsplash.com/photo-1771620887053-09dfc403b1de?w=1200&q=80&auto=format&fit=crop";
const ABOUT_IMG = "https://images.unsplash.com/photo-1764423805989-ec426dfb8de8?w=1200&q=80&auto=format&fit=crop";

export default function Home() {
  return (
    <main data-testid="page-home">
      {/* ===================== HERO ===================== */}
      <section className="relative min-h-screen pt-32 pb-24 overflow-hidden elara-wallpaper" data-testid="hero-section">
        {/* Stained-glass parallax layer */}
        <div className="absolute -right-20 top-10 w-[640px] h-[640px] opacity-70 pointer-events-none hidden md:block">
          <StainedGlass />
        </div>
        {/* Soft floral wash */}
        <div
          className="absolute inset-0 opacity-60 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 12% 18%, rgba(239,212,221,0.55) 0, transparent 38%), radial-gradient(circle at 92% 82%, rgba(230,177,196,0.45) 0, transparent 42%), radial-gradient(circle at 50% 100%, rgba(156,159,105,0.18) 0, transparent 50%)",
          }}
        />
        <Petals />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-10 items-center">
          {/* Left: Text */}
          <div className="lg:col-span-6 z-10">
            <Reveal>
              <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-6 flex items-center gap-3">
                <Sparkles className="w-3 h-3" />
                Atelier · Spring Edition
              </p>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="font-serif font-light text-palm text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.02] tracking-tighter">
                Where flowers
                <br />
                <span className="italic text-pines">bloom</span>{" "}
                <span className="text-palm">underfoot.</span>
              </h1>
            </Reveal>
            <Reveal delay={260}>
              <p className="mt-8 max-w-md text-palm/75 leading-relaxed text-base">
                A curated atelier of luxury footwear from Chanel, Manolo Blahnik,
                Aquazzura and the houses we love — gathered into a single poem.
              </p>
            </Reveal>
            <Reveal delay={380}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/collections?cat=all" className="btn-elara" data-testid="hero-cta-collections">
                  Enter the Atelier <ArrowRight className="w-3 h-3" />
                </Link>
                <Link to="/editorial" className="btn-elara-outline" data-testid="hero-cta-editorial">
                  Read the Editorial
                </Link>
              </div>
            </Reveal>
            <Reveal delay={520}>
              <div className="mt-14 flex items-center gap-8 text-palm/55">
                <div>
                  <p className="font-serif text-3xl text-palm">8</p>
                  <p className="text-[0.65rem] tracking-[0.3em] uppercase">Maisons</p>
                </div>
                <div className="w-px h-10 bg-gold/30" />
                <div>
                  <p className="font-serif text-3xl text-palm">120+</p>
                  <p className="text-[0.65rem] tracking-[0.3em] uppercase">Pairs</p>
                </div>
                <div className="w-px h-10 bg-gold/30" />
                <div>
                  <p className="font-serif text-3xl text-palm">★ 4.9</p>
                  <p className="text-[0.65rem] tracking-[0.3em] uppercase">Loved</p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: Editorial visual + placeholder */}
          <div className="lg:col-span-6 relative h-[520px] lg:h-[640px]">
            {/* Real editorial image */}
            <Reveal className="absolute top-0 right-0 w-3/4 h-3/5 z-10">
              <img
                src={HERO_IMG}
                alt="Editorial fashion"
                className="w-full h-full object-cover rounded-sm shadow-2xl"
              />
              <div className="absolute inset-0 ring-1 ring-gold/30 rounded-sm pointer-events-none" />
            </Reveal>
            {/* Placeholder for shoe image */}
           <Reveal delay={200} className="absolute bottom-0 left-0 w-3/5 h-3/5 z-20 elara-glass p-3">
              <div className="elara-placeholder !aspect-auto h-full">
                <span>Image</span>
              </div>
              <p className="absolute -bottom-7 left-0 text-[0.6rem] tracking-[0.3em] uppercase text-palm/50">
                01 · Hero Pair
              </p>
            </Reveal>
            {/* Decorative tag */}
            <Reveal delay={400} className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-4 hidden md:block z-30">
              <div className="elara-glass px-5 py-3 rounded-full">
                <p className="text-[0.6rem] tracking-[0.3em] uppercase text-palm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-shimmer" />
                  In Bloom Now
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-palm/40 text-[0.6rem] tracking-[0.3em] uppercase flex flex-col items-center gap-2">
          Scroll <span className="w-px h-12 bg-gold/40 animate-shimmer" />
        </div>
      </section>

      {/* ===================== BRAND STRIP ===================== */}
      <BrandStrip />

      {/* ===================== COLLECTIONS PREVIEW ===================== */}
      <section className="relative py-32 px-6 md:px-12 max-w-7xl mx-auto" data-testid="home-collections">
        <Reveal className="text-center mb-20">
          <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-4">The Garden</p>
          <h2 className="font-serif font-light text-palm text-4xl sm:text-5xl lg:text-6xl tracking-tight">
            Six gardens, one <span className="italic text-pines">atelier</span>.
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-palm/70 text-sm leading-relaxed">
            Wander between collections — each curated to a season, each sole a different bloom.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 80}>
              <Link
                to={`/collections?cat=${c.slug}`}
                className="elara-card block group"
                data-testid={`home-cat-${c.slug}`}
              >
                <div className="elara-placeholder">
              a    <span>Image</span>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-[0.6rem] tracking-[0.3em] uppercase text-willow mb-1">
                      0{i + 1}
                    </p>
                    <h3 className="font-serif text-2xl text-palm">{c.name}</h3>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===================== EDITORIAL TEASER ===================== */}
      <section className="relative py-32 overflow-hidden" data-testid="home-editorial-teaser">
        <div className="absolute inset-0 -z-10">
          <img src={ABOUT_IMG} alt="Floral arrangement" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-cream/75" />
        </div>
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-5">Editorial No. 03</p>
            <p className="font-serif font-light text-palm text-3xl sm:text-4xl lg:text-5xl italic leading-tight">
              "She walks the way a peony unfurls — slowly, almost reluctantly,
              as if every petal were a private confession."
            </p>
            <p className="mt-8 text-[0.7rem] tracking-[0.3em] uppercase text-palm/60">
              From the Spring Lookbook
            </p>
            <Link to="/editorial" className="btn-elara-outline mt-10" data-testid="home-editorial-cta">
              Discover the Lookbook
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
