import SizeGuide from "./SizeGuide";
import { Eye, ShoppingBag, Heart } from "lucide-react";
import { useCart } from "../lib/CartContext";
import { useWishlist } from "../lib/WishlistContext";
import { useState } from "react";

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [selectedSize, setSelectedSize] = useState(null);
  const [showSizes, setShowSizes] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setShowSizes(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addToCart({ ...product, selectedSize });
    setShowSizes(false);
  };

  return (
    <article className="elara-card group" data-testid={`product-card-${product.id}`}>
      <div className="relative">
        {product.image ? (
          <img src={product.image} alt={product.name}
            className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        ) : (
          <div className="elara-placeholder"><span>Add Shoe Image</span></div>
        )}
        {product.badge && (
          <span className="absolute top-4 left-4 px-3 py-1 bg-cream/90 text-palm text-[0.6rem] tracking-[0.25em] uppercase border border-gold/40">
            {product.badge}
          </span>
        )}
        {/* Wishlist heart */}
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cream/80 flex items-center justify-center shadow-sm hover:bg-cream transition-all"
        >
          <Heart className={`w-4 h-4 transition-colors ${wishlisted ? "fill-red-400 text-red-400" : "text-palm/50"}`} />
        </button>

        <div className="quick-view flex gap-2">
          <button className="btn-gold !py-2 !px-3 !text-[0.6rem]" onClick={() => onQuickView?.(product)}>
            <Eye className="w-3 h-3" />
          </button>
          <button className="btn-elara !py-2 !px-3 !text-[0.6rem]" onClick={handleAddToCart}>
            <ShoppingBag className="w-3 h-3" /> Add
          </button>
        </div>
      </div>

      <div className="p-5 text-center">
        <p className="text-[0.6rem] tracking-[0.3em] uppercase text-willow mb-1">{product.brand}</p>
        <h3 className="font-serif text-xl text-palm leading-tight">{product.name}</h3>
        <p className="text-xs text-palm/55 mt-1 italic">{product.color}</p>
        <p className="text-sm text-palm mt-3 tracking-wider">€ {product.price.toLocaleString()}</p>

        {showSizes && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
  <p className={`text-[0.6rem] tracking-widest uppercase ${sizeError ? "text-red-400" : "text-willow"}`}>
    {sizeError ? "Please select a size!" : "Select Size (EU)"}
  </p>
  <SizeGuide />
</div>
            <div className="flex flex-wrap gap-1 justify-center">
              {product.sizes?.map(size => (
                <button key={size} onClick={() => { setSelectedSize(size); setSizeError(false); }}
                  className={`w-8 h-8 text-xs rounded border transition-all
                    ${selectedSize === size ? "bg-palm text-cream border-palm" : "border-palm/30 text-palm hover:border-gold"}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => { if (!showSizes) { setShowSizes(true); return; } handleAddToCart(); }}
          className={`w-full justify-center mt-4 !py-2 flex items-center gap-2 transition-all
            ${selectedSize ? "btn-elara" : "btn-elara-outline"}`}>
          <ShoppingBag className="w-3 h-3" />
          {!showSizes ? "Select Size" : selectedSize ? `Add · EU ${selectedSize}` : "Pick a Size"}
        </button>
      </div>
    </article>
  );
}