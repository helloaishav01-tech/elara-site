import { PRODUCTS } from "../data/products";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import { useState } from "react";
import QuickViewDialog from "./QuickViewDialog";

export default function RelatedProducts({ currentId, category, brand }) {
  const [qv, setQv] = useState(null);

  const related = PRODUCTS
    .filter(p => p.id !== currentId && (p.category === category || p.brand === brand))
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="mt-20 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal>
          <div className="text-center mb-12">
            <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-3">You Might Also Love</p>
            <h2 className="font-serif font-light text-palm text-4xl">
              From the <span className="italic text-pines">same garden</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {related.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <ProductCard product={p} onQuickView={setQv} />
            </Reveal>
          ))}
        </div>
      </div>

      <QuickViewDialog
        product={qv}
        open={!!qv}
        onOpenChange={v => !v && setQv(null)}
      />
    </section>
  );
}