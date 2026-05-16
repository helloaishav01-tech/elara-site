import SizeGuide from "./SizeGuide";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../lib/CartContext";
import { useState } from "react";

export default function QuickViewDialog({ product, open, onOpenChange }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    if (!selectedSize) { setSizeError(true); return; }
    addToCart({ ...product, selectedSize }, qty);
    onOpenChange(false);
    setSelectedSize(null);
    setQty(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-cream border-gold/30">
        <DialogHeader>
          <p className="text-[0.65rem] tracking-[0.3em] uppercase text-willow">{product.brand}</p>
          <DialogTitle className="font-serif text-3xl text-palm font-light">{product.name}</DialogTitle>
          <DialogDescription className="text-palm/70 text-sm leading-relaxed pt-2">
            A garden in motion. The {product.name} arrives in petal-soft packaging, hand-finished
            and accompanied by ELARA's editorial card.
          </DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-6 mt-2">
          <div>
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full aspect-[3/4] object-cover rounded" />
            ) : (
              <div className="elara-placeholder !aspect-[3/4]"><span>Add Shoe Image</span></div>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[0.6rem] tracking-[0.3em] uppercase text-willow mb-1">Colour</p>
              <p className="text-palm font-serif text-lg italic">{product.color}</p>
            </div>
            <div>
              <p className="text-[0.6rem] tracking-[0.3em] uppercase text-willow mb-1">Investment</p>
              <p className="font-serif text-2xl text-palm">€ {product.price.toLocaleString()}</p>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
  <p className={`text-[0.6rem] tracking-[0.3em] uppercase ${sizeError ? "text-red-400" : "text-willow"}`}>
    {sizeError ? "Please select a size! *" : "Size (EU) *"}
  </p>
  <SizeGuide />
</div>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map(size => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className={`w-9 h-9 text-xs rounded border transition-all
                      ${selectedSize === size
                        ? "bg-palm text-cream border-palm"
                        : "border-palm/30 text-palm hover:border-gold"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-[0.6rem] tracking-[0.3em] uppercase text-willow mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full border border-palm/30 flex items-center justify-center hover:border-gold transition-colors text-palm">−</button>
                <span className="font-serif text-xl text-palm w-6 text-center">{qty}</span>
                <button onClick={() => setQty(q => q + 1)}
                  className="w-8 h-8 rounded-full border border-palm/30 flex items-center justify-center hover:border-gold transition-colors text-palm">+</button>
              </div>
            </div>

            <button className="btn-elara w-full justify-center" onClick={handleAdd}>
              <ShoppingBag className="w-4 h-4" />
              {selectedSize ? `Add to Bag · EU ${selectedSize} · €${(product.price * qty).toLocaleString()}` : "Select Size First"}
            </button>
            <p className="text-[0.65rem] text-palm/50 italic text-center">Delivered in ELARA's signature blossom box.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}