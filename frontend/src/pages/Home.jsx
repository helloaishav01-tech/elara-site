import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import Petals from "../components/Petals";
import BrandStrip from "../components/BrandStrip";
import Reveal from "../components/Reveal";
import { CATEGORIES } from "../data/products";
import peonyhero from "../images/peony-hero.jpg";
import floralBg from "../images/floral-bg.jpg";
import floral2 from "../images/floral-2.jpg";

const FLORAL_BG = <img src={floral2} alt="Flowers" className="w-full h-full object-cover" />;
const CATEGORY_IMGS = {
  heels: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80",
  mules: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&q=80",
  sandals: "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=600&q=80",
  flats: "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80",
  boots: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  evening: <img src={floralBg} alt="Botanical floral" className="w-full aspect-[4/5] object-cover rounded shadow-xl" />
};

export default function Home() {
  return (
    <main data-testid="page-home">
      {/* ===================== HERO ===================== */}
      <section className="relative min-h-screen pt-32 pb-24 overflow-hidden elara-wallpaper" data-testid="hero-section">

        {/* Peony fills entire right half with glow */}
        <div className="absolute right-0 top-0 w-[55%] h-full pointer-events-none hidden md:block">
          {/* Multiple glow layers */}
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 60% 40%, rgba(230,177,196,0.7) 0%, rgba(239,212,221,0.4) 35%, transparent 65%)" }} />
          <div className="absolute inset-0 blur-3xl opacity-50"
            style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(201,169,110,0.5) 0%, transparent 60%)" }} />
          {/* Peony image covering right side */}
          <img
            src={peonyhero}
            alt="Peony"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 20%, black 50%, black 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 20%, black 50%, black 100%)",
              filter: "drop-shadow(0 0 60px rgba(230,177,196,0.9)) drop-shadow(0 0 120px rgba(201,169,110,0.5)) brightness(1.05) saturate(1.1)",
            }}
          />
          {/* Glow overlay on top of image */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 70% 30%, rgba(255,220,235,0.3) 0%, transparent 50%), radial-gradient(ellipse at 30% 70%, rgba(201,169,110,0.2) 0%, transparent 40%)" }} />
        </div>

        {/* Soft floral wash on left */}
        <div className="absolute inset-0 opacity-50 pointer-events-none"
          style={{ background: "radial-gradient(circle at 5% 20%, rgba(239,212,221,0.6) 0, transparent 35%)" }} />
        <Petals />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-10 items-center min-h-[80vh]">
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

          {/* Right: In Bloom tag */}
          <div className="lg:col-span-6 relative hidden lg:flex items-end justify-start h-full pb-32">
            <Reveal delay={400}>
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
              <Link to={`/collections?cat=${c.slug}`} className="elara-card block group" data-testid={`home-cat-${c.slug}`}>
                <div className="relative overflow-hidden aspect-[3/4]">
                  <img
                    src={CATEGORY_IMGS[c.slug]}
                    alt={c.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-palm/20 to-transparent" />
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-[0.6rem] tracking-[0.3em] uppercase text-willow mb-1">0{i + 1}</p>
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
          <img src={peonyhero} alt="Floral arrangement" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-cream/70" />
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