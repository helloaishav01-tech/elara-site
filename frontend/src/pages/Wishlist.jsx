import { useWishlist } from "../lib/WishlistContext";
import { useCart } from "../lib/CartContext";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import { useState } from "react";

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [sizes, setSizes] = useState({});

  if (wishlist.length === 0) {
    return (
      <main className="pt-40 pb-32 min-h-screen">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <Heart className="w-16 h-16 text-gold mx-auto mb-6" />
          <h1 className="font-serif font-light text-palm text-5xl mb-4">Your wishlist is empty.</h1>
          <p className="text-palm/60 mb-10 font-serif italic">Save pieces that move you.</p>
          <Link to="/collections?cat=all" className="btn-elara">
            Explore Collections <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-4">Saved Pieces</p>
          <h1 className="font-serif font-light text-palm text-5xl sm:text-6xl tracking-tighter mb-16">
            Your <span className="italic text-pines">Wishlist</span>
          </h1>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlist.map((product, i) => (
            <Reveal key={product.id} delay={i * 60}>
              <div className="elara-glass rounded-md overflow-hidden group">
                <div className="relative">
                  {product.image
                    ? <img src={product.image} alt={product.name} className="w-full aspect-[3/4] object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                    : <div className="elara-placeholder aspect-[3/4]"><span>Shoe Image</span></div>
                  }
                  <button onClick={() => toggleWishlist(product)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-cream/90 flex items-center justify-center">
                    <Heart className="w-4 h-4 fill-red-400 text-red-400" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-[0.6rem] tracking-[0.3em] uppercase text-willow">{product.brand}</p>
                  <p className="font-serif text-lg text-palm">{product.name}</p>
                  <p className="font-serif text-palm mt-1">€ {product.price.toLocaleString()}</p>

                  {/* Size selector */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {product.sizes?.map(size => (
                      <button key={size}
                        onClick={() => setSizes(p => ({ ...p, [product.id]: size }))}
                        className={`w-8 h-8 text-xs rounded border transition-all
                          ${sizes[product.id] === size ? "bg-palm text-cream border-palm" : "border-palm/30 text-palm hover:border-gold"}`}>
                        {size}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if (!sizes[product.id]) { alert("Please select a size!"); return; }
                      addToCart({ ...product, selectedSize: sizes[product.id] });
                    }}
                    className="btn-elara w-full justify-center mt-3 !py-2 !text-xs">
                    <ShoppingBag className="w-3 h-3" />
                    {sizes[product.id] ? `Move to Bag · EU ${sizes[product.id]}` : "Select Size"}
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}