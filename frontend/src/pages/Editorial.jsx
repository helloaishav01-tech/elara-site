import Reveal from "../components/Reveal";
import Petals from "../components/Petals";

const STORIES = [
  {
    n: "01",
    title: "The Slow Sunday",
    season: "Spring · Edition 03",
    image: "https://images.unsplash.com/photo-1490750967868-88df5691cc4f?w=1400&q=80",
    text: "She rose to a sky the color of cream. The peonies were already bored of waiting. We followed her, in flat Aquazzura mules, to a market that smelled of yeast and lilies.",
  },
  {
    n: "02",
    title: "An Afternoon in Lavender",
    season: "Provence · April",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1400&q=80",
    text: "Heels off, dusted with the gold of pollen. The Valentino slingbacks watched from the gravel. Some afternoons are made for bare feet; the shoes know it too.",
  },
  {
    n: "03",
    title: "Bridal · The First Walk",
    season: "Editorial · No. 07",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80",
    text: "She wore the Hangisi. Of course she wore the Hangisi. The aisle was scattered with hellebore petals. Her mother wept first; the photographer wept second.",
  },
];

export default function Editorial() {
  return (
    <main className="pt-32 pb-32 relative overflow-hidden" data-testid="page-editorial">
      <Petals />

      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-24 relative z-10">
        <Reveal>
          <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-4">The Lookbook</p>
          <h1 className="font-serif font-light text-palm text-5xl sm:text-6xl lg:text-7xl tracking-tighter max-w-4xl leading-[1.02]">
            Editorial. <span className="italic text-pines">Stories</span> for the soles.
          </h1>
          <p className="mt-6 max-w-xl text-palm/70 text-sm leading-relaxed">
            Quarterly reflections, styled stories, and the occasional poem. Wander slowly.
          </p>
        </Reveal>
      </section>

      <div className="space-y-32 relative z-10">
        {STORIES.map((s, i) => (
          <section key={s.n} className="px-6 md:px-12 max-w-7xl mx-auto" data-testid={`editorial-${s.n}`}>
            <div className={`grid lg:grid-cols-12 gap-10 items-center ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <Reveal className="lg:col-span-7">
                <div className="relative">
                  <img src={s.image} alt={s.title} className="w-full aspect-[5/4] object-cover rounded-sm shadow-xl" />
                  <div className="absolute inset-0 ring-1 ring-gold/30 rounded-sm pointer-events-none" />
                </div>
              </Reveal>
              <Reveal delay={150} className="lg:col-span-5 space-y-5">
                <p className="font-serif text-7xl text-gold">{s.n}</p>
                <p className="text-[0.65rem] tracking-[0.3em] uppercase text-willow">{s.season}</p>
                <h2 className="font-serif font-light text-palm text-4xl lg:text-5xl tracking-tight">{s.title}</h2>
                <p className="font-serif italic text-lg text-palm/80 leading-relaxed">{s.text}</p>
                <button className="btn-elara-outline" data-testid={`editorial-cta-${s.n}`}>
                  Read the Story
                </button>
              </Reveal>
            </div>
          </section>
        ))}
      </div>

      <section className="mt-32 px-6 md:px-12 max-w-3xl mx-auto text-center relative z-10">
        <Reveal>
          <p className="font-serif italic text-palm text-3xl sm:text-4xl leading-tight">
            "A shoe is not a thing you wear. It is a thing you remember."
          </p>
          <p className="mt-6 text-[0.65rem] tracking-[0.3em] uppercase text-willow">— Léa Dubois, Founder</p>
        </Reveal>
      </section>
    </main>
  );
}