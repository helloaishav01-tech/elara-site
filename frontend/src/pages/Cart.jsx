import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../lib/CartContext";
import Reveal from "../components/Reveal";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <main className="pt-40 pb-32 min-h-screen" data-testid="page-cart">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <ShoppingBag className="w-16 h-16 text-gold mx-auto mb-6" />
          <h1 className="font-serif font-light text-palm text-5xl mb-4">Your bag is empty.</h1>
          <p className="text-palm/60 mb-10 font-serif italic">The garden awaits — find your bloom.</p>
          <Link to="/collections?cat=all" className="btn-elara">
            Explore Collections <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  const shipping = total > 1000 ? 0 : 25;
  const tax = Math.round(total * 0.08);
  const grandTotal = total + shipping + tax;

  return (
    <main className="pt-32 pb-32" data-testid="page-cart">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-4">Your Selection</p>
          <h1 className="font-serif font-light text-palm text-5xl sm:text-6xl tracking-tighter mb-16">
            The <span className="italic text-pines">Bag</span>
          </h1>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            {cart.map((item, i) => (
              <Reveal key={item.id} delay={i * 60}>
                <div className="elara-glass p-6 rounded-md flex gap-6 items-start" data-testid={`cart-item-${item.id}`}>
                  {/* Image */}
                  <div className="w-24 h-32 flex-shrink-0 rounded overflow-hidden bg-dolce">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />

                      : <div className="w-full h-full flex items-center justify-center text-[0.6rem] text-willow text-center p-2">Shoe Image</div>
                    }
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <p className="text-[0.6rem] tracking-[0.3em] uppercase text-willow mb-1">{item.brand}</p>
                    <h3 className="font-serif text-2xl text-palm">{item.name}</h3>
                    <p className="text-sm text-palm/60 italic mt-1">{item.color}</p>
{item.selectedSize && (
  <p className="text-[0.65rem] tracking-[0.25em] uppercase text-willow mt-1">
    EU {item.selectedSize}
  </p>
)}
                    {item.badge && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-cream border border-gold/40 text-palm text-[0.6rem] tracking-widest uppercase">
                        {item.badge}
                      </span>
                    )}

                    {/* Quantity + Remove */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}

                          className="w-7 h-7 rounded-full border border-palm/30 flex items-center justify-center hover:border-gold transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-serif text-lg text-palm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                          className="w-7 h-7 rounded-full border border-palm/30 flex items-center justify-center hover:border-gold transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.selectedSize)}
                        className="flex items-center gap-1 text-palm/40 hover:text-red-400 transition-colors text-xs"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-serif text-2xl text-palm">€ {(item.price * item.quantity).toLocaleString()}</p>
                    <p className="text-xs text-palm/50 mt-1">€ {item.price.toLocaleString()} each</p>
                  </div>
                </div>
              </Reveal>
            ))}

            <button onClick={clearCart} className="text-palm/40 hover:text-red-400 transition-colors text-xs flex items-center gap-2 mt-4">
              <Trash2 className="w-3 h-3" /> Clear entire bag
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <Reveal>
              <div className="elara-glass p-8 rounded-md sticky top-32">
                <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-6">Order Summary</p>
{coupon && (
  <div className="flex justify-between text-pines">
    <span>Discount ({coupon.code})</span>
    <span>− € {coupon.discount_amount.toLocaleString()}</span>
  </div>
)}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-palm">
                    <span>Subtotal ({cart.length} item{cart.length > 1 ? "s" : ""})</span>
                    <span className="font-serif">€ {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-palm">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-pines font-medium" : ""}>
                      {shipping === 0 ? "Free" : `€ ${shipping}`}
                    </span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-[0.65rem] text-pines">✓ Complimentary shipping on orders over €1,000</p>
                  )}
                  <div className="flex justify-between text-palm">
                    <span>Tax (8%)</span>
                    <span className="font-serif">€ {tax.toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-gold/20 my-2" />
                  <div className="flex justify-between text-palm">
                    <span className="text-[0.65rem] tracking-[0.3em] uppercase">Total</span>
                    <span className="font-serif text-2xl">€ {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <Link to="/checkout" className="btn-elara w-full justify-center mt-8 block text-center">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/collections?cat=all" className="block text-center mt-4 text-[0.65rem] tracking-[0.3em] uppercase text-palm/50 hover:text-gold transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </main>
  );
}