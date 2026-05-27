import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter } from "lucide-react";
import Reveal from "../components/Reveal";
import ProductCard from "../components/ProductCard";
import QuickViewDialog from "../components/QuickViewDialog";
import RelatedProducts from "../components/RelatedProducts";
import { api } from "../lib/api";

const CATEGORIES = [
  { id: "all",     name: "All",     desc: "Every piece in our collection" },
  { id: "heels",   name: "Heels",   desc: "Elevated elegance" },
  { id: "mules",   name: "Mules",   desc: "Effortless sophistication" },
  { id: "sandals", name: "Sandals", desc: "Summer essentials" },
  { id: "flats",   name: "Flats",   desc: "Refined comfort" },
  { id: "boots",   name: "Boots",   desc: "Statement footwear" },
  { id: "evening", name: "Evening", desc: "Red carpet ready" },
];

export default function Collections() {
  const [searchParams, setParams] = useSearchParams();
  const cat = searchParams.get("cat") || "all";

  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [brand, setBrand]         = useState("all");
  const [sort, setSort]           = useState("featured");
  const [maxPrice, setMaxPrice]   = useState(2000);
  const [open, setOpen]           = useState(null);

  // Derive unique brand list from fetched products
  const brands = useMemo(
    () => [...new Set(products.map(p => p.brand).filter(Boolean))],
    [products]
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);   // fetch once; filtering is done client-side below

  const items = useMemo(() => {
    let list = cat === "all" ? products : products.filter(p => p.category === cat);
    if (brand !== "all") list = list.filter(p => p.brand === brand);
    list = list.filter(p => p.price <= maxPrice);
    if (sort === "low")  list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, cat, brand, sort, maxPrice]);

  const setCat = (slug) => {
    const next = new URLSearchParams(searchParams);
    next.set("cat", slug);
    setParams(next);
  };

  // FIXED: was using c.slug — CATEGORIES uses c.id
  const activeName = CATEGORIES.find(c => c.id === cat)?.name || "All Footwear";

  return (
    <main className="pt-32 pb-32" data-testid="page-collections">
      {/* Header */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-16">
        <Reveal>
          <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-4">Collections</p>
          <h1 className="font-serif font-light text-palm text-5xl sm:text-6xl lg:text-7xl tracking-tighter">
            {activeName}
          </h1>
          <p className="mt-4 max-w-xl text-palm/70 text-sm leading-relaxed">
            {loading ? "Loading…" : `${items.length} pair${items.length === 1 ? "" : "s"} · Curated from ${brands.length} maisons.`}
          </p>
        </Reveal>
      </section>

      <section className="px-6 md:px-12 max-w-7xl mx-auto grid lg:grid-cols-12 gap-10">
        {/* Filter sidebar */}
        <aside className="lg:col-span-3 space-y-8 lg:sticky lg:top-32 self-start" data-testid="collections-filters">
          <div className="elara-glass p-6 rounded">
            <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-4 flex items-center gap-2">
              <Filter className="w-3 h-3" /> Refine
            </p>

            {/* Category */}
            <div>
              <p className="text-[0.6rem] tracking-[0.25em] uppercase text-palm/60 mb-3">Category</p>
              <ul className="space-y-2">
                {CATEGORIES.map(c => (
                  <li key={c.id}>
                    <button
                      onClick={() => setCat(c.id)}
                      className={`text-sm transition-colors ${cat === c.id ? "text-gold" : "text-palm hover:text-gold"}`}
                      data-testid={`filter-cat-${c.id}`}
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Maison */}
            <div className="mt-6">
              <p className="text-[0.6rem] tracking-[0.25em] uppercase text-palm/60 mb-3">Maison</p>
              <select
                value={brand}
                onChange={e => setBrand(e.target.value)}
                className="w-full bg-transparent border-b border-palm/30 text-sm text-palm py-2 focus:outline-none focus:border-gold"
                data-testid="filter-brand"
              >
                <option value="all">All maisons</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            {/* Price */}
            <div className="mt-6">
              <p className="text-[0.6rem] tracking-[0.25em] uppercase text-palm/60 mb-3">Up to € {maxPrice}</p>
              <input
                type="range" min="500" max="2000" step="50"
                value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-pines"
                data-testid="filter-price"
              />
            </div>

            {/* Sort */}
            <div className="mt-6">
              <p className="text-[0.6rem] tracking-[0.25em] uppercase text-palm/60 mb-3">Sort</p>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="w-full bg-transparent border-b border-palm/30 text-sm text-palm py-2 focus:outline-none focus:border-gold"
                data-testid="filter-sort"
              >
                <option value="featured">Featured</option>
                <option value="low">Price · low to high</option>
                <option value="high">Price · high to low</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="lg:col-span-9">
          {loading ? (
            <p className="text-center font-serif italic text-2xl text-palm/60 py-32">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-center font-serif italic text-2xl text-palm/60 py-32">No pairs match your reverie.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" data-testid="collections-grid">
              {items.map((p, i) => (
                <Reveal key={p.id} delay={i * 50}>
                  <ProductCard product={p} onQuickView={(prod) => setOpen(prod)} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {items.length > 0 && (
        <RelatedProducts
          currentId={null}
          category={cat !== "all" ? cat : items[0]?.category}
          brand={items[0]?.brand}
        />
      )}

      <QuickViewDialog product={open} open={!!open} onOpenChange={(v) => !v && setOpen(null)} />
    </main>
  );
}