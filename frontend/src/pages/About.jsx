import Reveal from "../components/Reveal";
import floralBg from "../images/floral-bg.jpg";
import floral2 from "../images/floral-2.jpg";

const VALUES = [
  { n: "01", t: "Curation", d: "Every pair chosen by an editor's eye — never a buyer's spreadsheet." },
  { n: "02", t: "Concierge", d: "A florist's care for each parcel. Hand-tied, hand-noted, hand-sent." },
  { n: "03", t: "Conscience", d: "Sustainable maisons, repair partnerships, second-bloom resale." },
];

export default function About() {
  return (
    <main className="pt-32 pb-32" data-testid="page-about">
      <section className="relative px-6 md:px-12 max-w-7xl mx-auto mb-24">
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

      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32 grid lg:grid-cols-12 gap-10 items-center">
        <Reveal className="lg:col-span-6">
          <img src={floralBg} alt="Botanical floral" className="w-full aspect-[4/5] object-cover rounded shadow-xl" />
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
          <p className="font-serif italic text-lg text-palm/80 leading-relaxed">
            "We treat shoes the way florists treat petals — with reverence, water, and time."
          </p>
        </Reveal>
      </section>

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

      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={floral2} alt="Flowers" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-cream/80" />
        </div>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-5">The Atelier</p>
            <h2 className="font-serif font-light text-palm text-4xl sm:text-5xl mb-6">
              Curated with <span className="italic text-pines">devotion.</span>
            </h2>
            <p className="text-palm/75 leading-relaxed max-w-xl mx-auto">
              Every pair in our atelier is handpicked, every detail considered, every
              delivery prepared with the same care as a bridal bouquet. This is not
              retail — this is a love letter to beautiful things.
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}