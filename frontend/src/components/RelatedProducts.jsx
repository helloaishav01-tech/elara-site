import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { api } from "../lib/api";
import { useWishlist } from "../lib/WishlistContext";

export default function RelatedProducts({ currentProduct }) {
  const [products, setProducts] = useState([]);
  const { wishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await api.get("/products");
        // Filter by same category, exclude current product, take first 4
        const related = response.data
          .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
          .slice(0, 4);
        setProducts(related);
      } catch (error) {
        console.error("Failed to load related products:", error);
      }
    };
    
    if (currentProduct) {
      fetchRelated();
    }
  }, [currentProduct]);

  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-cream/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <p className="text-[0.6rem] tracking-[0.4em] uppercase text-gold mb-2 text-center">
          You might also love
        </p>
        <h2 className="font-serif text-4xl text-palm text-center mb-12">
          From the <span className="italic text-pines">same garden</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <div key={product.id} className="group relative">
              <Link to={`/product/${product.id}`} className="block">
                <div className="aspect-[3/4] bg-dolce rounded overflow-hidden mb-4 relative">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-willow">
                      No Image
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-cream/90 px-2 py-1 text-[0.6rem] tracking-wider uppercase text-palm">
                    NEW
                  </span>
                </div>
              </Link>

              <button
                onClick={() => toggleWishlist(product)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-cream/90 flex items-center justify-center hover:bg-cream transition-colors z-10"
              >
                <Heart
                  className={`w-4 h-4 ${
                    wishlist.some(w => w.id === product.id)
                      ? "fill-blossom text-blossom"
                      : "text-palm"
                  }`}
                />
              </button>

              <p className="text-[0.6rem] tracking-[0.3em] uppercase text-willow mb-1">
                {product.brand}
              </p>
              <Link to={`/product/${product.id}`}>
                <h3 className="font-serif text-palm text-lg mb-2 hover:text-pines transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="font-serif text-palm">€ {product.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}