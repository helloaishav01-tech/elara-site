import Reveal from "../components/Reveal";
import StainedGlass from "../components/StainedGlass";

const VALUES = [
  { n: "01", t: "Curation", d: "Every pair chosen by an editor's eye — never a buyer's spreadsheet." },
  { n: "02", t: "Concierge", d: "A florist's care for each parcel. Hand-tied, hand-noted, hand-sent." },
  { n: "03", t: "Conscience", d: "Sustainable maisons, repair partnerships, second-bloom resale." },
];

const TEAM = [
  { name: "Léa Dubois", role: "Founder · Curator", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80" },
  { name: "Margot Sinclair", role: "Editorial Director", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80" },
  { name: "Hana Mori", role: "Atelier Concierge", img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80" },
];

const FLORAL_BG = "https://images.unsplash.com/photo-1764423805989-ec426dfb8de8?w=1600&q=80";

export default function About() {
  return (
    <main className="pt-32 pb-32" data-testid="page-about">
      {/* Hero */}
      <section className="relative px-6 md:px-12 max-w-7xl mx-auto mb-24">
        <div className="absolute -top-10 right-0 w-[420px] h-[420px] opacity-50 pointer-events-none hidden md:block">
          <StainedGlass />
        </div>
        <Reveal>
          <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-4">Our Story</p>
          <h1 className="font-serif font-light text-palm text-5xl sm:text-6xl lg:text-7xl tracking-tighter max-w-4xl leading-[1.02]">
            A boutique born from a <span className="italic text-pines">single peony.</span>
          </h1>
        </Reveal>
        <Reveal delay={150}>
          <p className="mt-8 max-w-2xl text-palm/75 text-base leading-relaxed">
            ELARA began with a Sunday market, a cobbled rue in the 6th, and an armful
            of peonies cradled against a dusty pair of slingbacks. What if a shoe boutique
            felt like a flower shop? What if a pair of shoes arrived like a bouquet —
            wrapped in tissue, signed by hand, breath-held with anticipation?
          </p>
        </Reveal>
      </section>

      {/* Story image + text */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32 grid lg:grid-cols-12 gap-10 items-center">
        <Reveal className="lg:col-span-6">
          <img src={FLORAL_BG} alt="Botanical floral" className="w-full aspect-[4/5] object-cover rounded shadow-xl" />
        </Reveal>
        <Reveal delay={150} className="lg:col-span-6 space-y-6">
          <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold">The Mission</p>
          <h2 className="font-serif font-light text-palm text-4xl">A garden, not a warehouse.</h2>
          <p className="text-palm/75 leading-relaxed">
            We do not stock what is popular. We grow what is enduring. Every pair on
            ELARA is chosen for its soul: an Aquazzura mule that hums with summer, a
            Manolo bridal that whispers vows, a Bottega flat that walks beside you to
            quiet places.
          </p>
          <p className="text-palm/75 leading-relaxed font-italic-serif italic text-lg">
            "We treat shoes the way florists treat petals — with reverence, water, and time."
          </p>
        </Reveal>
      </section>

      {/* Values */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32" data-testid="about-values">
        <Reveal className="text-center mb-14">
          <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-4">Our Petals</p>
          <h2 className="font-serif font-light text-palm text-4xl sm:text-5xl">Three values, in bloom.</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-8">
          {VALUES.map((v, i) => (
            <Reveal key={v.n} delay={i * 100}>
              <div className="elara-glass p-10 rounded-md h-full">
                <p className="font-serif text-5xl text-gold mb-4">{v.n}</p>
                <h3 className="font-serif text-2xl text-palm mb-3">{v.t}</h3>
                <p className="text-palm/70 text-sm leading-relaxed">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto" data-testid="about-team">
        <Reveal className="text-center mb-14">
          <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-4">The Atelier</p>
          <h2 className="font-serif font-light text-palm text-4xl sm:text-5xl">The hands behind the bouquet.</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-8">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 100}>
              <article className="elara-card">
                <img src={m.img} alt={m.name} className="w-full aspect-[3/4] object-cover" />
                <div className="p-6 text-center">
                  <h3 className="font-serif text-2xl text-palm">{m.name}</h3>
                  <p className="text-[0.65rem] tracking-[0.3em] uppercase text-willow mt-1">{m.role}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
