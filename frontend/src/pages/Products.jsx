import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/Reveal";
import { api } from "../lib/api";

export default function Products() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get("/products");
        setAllProducts(response.data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(allProducts.map(p => p.brand))];
    return uniqueBrands.sort();
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    let filtered = allProducts;
    
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    
    if (selectedBrand) {
      filtered = filtered.filter(p => p.brand === selectedBrand);
    }
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    
    return filtered;
  }, [allProducts, category, selectedBrand, searchQuery]);

  return (
    <main className="pt-32 pb-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-4">
            {category ? category : "All Collections"}
          </p>
          <h1 className="font-serif font-light text-palm text-5xl tracking-tighter mb-12">
            Our <span className="italic text-pines">Curated Selection</span>
          </h1>
        </Reveal>

        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, brand, or category..."
            className="flex-1 bg-transparent border-b border-palm/30 focus:border-gold py-2 text-palm focus:outline-none transition-colors"
          />
          <select
            value={selectedBrand}
            onChange={e => setSelectedBrand(e.target.value)}
            className="bg-cream border-b border-palm/30 focus:border-gold py-2 text-palm focus:outline-none transition-colors">
            <option value="">All Brands</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="elara-loader" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center font-serif italic text-palm/50 py-20">
            No products found.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, i) => (
              <Reveal key={product.id} delay={i * 50}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}