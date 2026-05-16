import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import QuickViewDialog from "../components/QuickViewDialog";
import Reveal from "../components/Reveal";
import StainedGlass from "../components/StainedGlass";
import { PRODUCTS, BRANDS } from "../data/products";

export default function Products() {
  const newArrivals = PRODUCTS.filter(p => p.badge === "New" || p.badge === "Editor's pick");
  const others = PRODUCTS.filter(p => !(p.badge === "New" || p.badge === "Editor's pick"));
  const [open, setOpen] = useState(null);
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState("all");

  const list = useMemo(() => {
    const all = [...newArrivals, ...others];
    return all
      .filter(p => brand === "all" || p.brand === brand)
      .filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.brand.toLowerCase().includes(q.toLowerCase()));
  }, [q, brand, newArrivals, others]);

  return (
    <main className="pt-32 pb-32 relative overflow-hidden" data-testid="page-products">
      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] opacity-30 pointer-events-none hidden md:block">
        <StainedGlass />
      </div>

      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-14">
        <Reveal>
          <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-4">Spring · Edition 03</p>
          <h1 className="font-serif font-light text-palm text-5xl sm:text-6xl lg:text-7xl tracking-tighter">
            New <span className="italic text-pines">Arrivals</span>
          </h1>
          <p className="mt-5 max-w-xl text-palm/70 text-sm leading-relaxed">
            Freshly arrived in the atelier — the first blooms of the new season.
          </p>
        </Reveal>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-stretch sm:items-end" data-testid="products-toolbar">
          <div className="flex-1">
            <p className="text-[0.6rem] tracking-[0.3em] uppercase text-palm/60 mb-2">Search</p>
            <input
              value={q} onChange={e => setQ(e.target.value)}
              placeholder="By pair or maison…"
              className="w-full bg-transparent border-b border-palm/30 text-palm py-2 focus:outline-none focus:border-gold"
              data-testid="products-search"
            />
          </div>
          <div className="sm:w-56">
            <p className="text-[0.6rem] tracking-[0.3em] uppercase text-palm/60 mb-2">Maison</p>
            <select
              value={brand} onChange={e => setBrand(e.target.value)}
              className="w-full bg-transparent border-b border-palm/30 text-palm py-2 focus:outline-none focus:border-gold"
              data-testid="products-brand"
            >
              <option value="all">All</option>
              {BRANDS.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8" data-testid="products-grid">
          {list.map((p, i) => (
            <Reveal key={p.id} delay={i * 40}>
              <ProductCard product={p} onQuickView={(prod) => setOpen(prod)} />
            </Reveal>
          ))}
        </div>
        {list.length === 0 && (
          <p className="text-center font-serif italic text-2xl text-palm/60 py-32">Nothing in bloom yet.</p>
        )}
      </section>

      <QuickViewDialog product={open} open={!!open} onOpenChange={(v) => !v && setOpen(null)} />
    </main>
  );
}
