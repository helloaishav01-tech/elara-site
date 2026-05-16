import { BRANDS } from "../data/products";

export default function BrandStrip() {
  const items = [...BRANDS, ...BRANDS]; // duplicate for seamless marquee
  return (
    <section className="relative py-16 border-y border-gold/15 bg-cream/60 overflow-hidden" data-testid="brand-strip">
      <p className="text-center text-[0.7rem] tracking-[0.35em] uppercase text-palm/55 mb-8">
        A House of Houses · Curated Maisons
      </p>
      <div className="marquee-track animate-marquee">
        {items.map((b, i) => (
          <span
            key={i}
            className="font-serif italic text-2xl md:text-3xl text-palm/70 hover:text-gold transition-colors px-10 whitespace-nowrap"
          >
            {b}
            <span className="ml-10 text-gold">·</span>
          </span>
        ))}
      </div>
    </section>
  );
}
