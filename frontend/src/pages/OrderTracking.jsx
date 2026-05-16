import { useState } from "react";
import { api } from "../lib/api";
import Reveal from "../components/Reveal";
import { Search, Package, Check, Truck, MapPin, Clock } from "lucide-react";

const STATUS_STEPS = [
  { key: "pending",   label: "Order Placed",  icon: Package, desc: "We've received your order" },
  { key: "confirmed", label: "Confirmed",      icon: Check,   desc: "Your order is confirmed" },
  { key: "shipped",   label: "Shipped",        icon: Truck,   desc: "On its way to you" },
  { key: "delivered", label: "Delivered",      icon: MapPin,  desc: "Delivered successfully" },
];

export default function OrderTracking() {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await api.get(`/orders/track?q=${encodeURIComponent(query.trim())}`);
      setOrder(res.data);
    } catch {
      setError("No order found. Please check your order number or email.");
    } finally {
      setLoading(false);
    }
  };

  const currentStep = STATUS_STEPS.findIndex(s => s.key === order?.status);
  const activeStep = currentStep === -1 ? 0 : currentStep;

  return (
    <main className="pt-32 pb-32 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-4">Atelier</p>
          <h1 className="font-serif font-light text-palm text-5xl tracking-tighter mb-4">
            Track your <span className="italic text-pines">order</span>
          </h1>
          <p className="text-palm/60 font-serif italic mb-12">
            Enter your order number (e.g. #1001) or email address
          </p>
        </Reveal>

        {/* Search Box */}
        <Reveal>
          <div className="elara-glass p-8 rounded-md mb-8">
            <div className="flex gap-3">
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Order #1001 or email@example.com"
                className="flex-1 bg-transparent border-b border-palm/30 focus:border-gold py-2 text-palm focus:outline-none transition-colors"
              />
              <button onClick={handleSearch} className="btn-elara !px-6">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-cream/40 border-t-cream rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </button>
            </div>
            {error && <p className="text-red-400 text-xs mt-3 flex items-center gap-1">⚠️ {error}</p>}
          </div>
        </Reveal>

        {/* Order Result */}
        {order && (
          <Reveal>
            {/* Order Header */}
            <div className="elara-glass p-8 rounded-md mb-6">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <p className="text-[0.6rem] tracking-[0.3em] uppercase text-gold mb-1">Order Number</p>
                  <p className="font-serif text-3xl text-palm">#{order.order_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-[0.6rem] tracking-[0.3em] uppercase text-gold mb-1">Total</p>
                  <p className="font-serif text-2xl text-palm">€ {order.total?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[0.6rem] tracking-[0.3em] uppercase text-gold mb-1">Date</p>
                  <p className="text-palm text-sm">{new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <div>
                  <p className="text-[0.6rem] tracking-[0.3em] uppercase text-gold mb-1">Payment</p>
                  <p className="text-palm text-sm capitalize">{order.payment_method}</p>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="elara-glass p-8 rounded-md mb-6">
              <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-8">Order Status</p>
              <div className="relative">
                {/* Progress line */}
                <div className="absolute top-5 left-5 right-5 h-px bg-gold/20" />
                <div
                  className="absolute top-5 left-5 h-px bg-pines transition-all duration-700"
                  style={{ width: activeStep === 0 ? "0%" : `${(activeStep / (STATUS_STEPS.length - 1)) * 100}%` }}
                />

                <div className="relative flex justify-between">
                  {STATUS_STEPS.map((s, i) => {
                    const Icon = s.icon;
                    const done = i <= activeStep;
                    const active = i === activeStep;
                    return (
                      <div key={s.key} className="flex flex-col items-center gap-2 flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-500 border-2
                          ${done ? "bg-pines border-pines text-cream" : "bg-cream border-gold/30 text-palm/30"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <p className={`text-[0.6rem] tracking-widest uppercase text-center ${active ? "text-palm font-medium" : done ? "text-pines" : "text-palm/40"}`}>
                          {s.label}
                        </p>
                        <p className="text-[0.55rem] text-palm/50 text-center hidden sm:block">{s.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tracking number if available */}
              {order.tracking_number && (
                <div className="mt-8 p-4 bg-cream/60 rounded border border-gold/20">
                  <p className="text-[0.6rem] tracking-[0.3em] uppercase text-gold mb-1">Tracking Number</p>
                  <p className="font-serif text-palm text-lg">{order.tracking_number}</p>
                  <p className="text-xs text-palm/50 mt-1">Use this number on your courier's website to track your shipment</p>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="elara-glass p-8 rounded-md mb-6">
              <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-5">Items in this order</p>
              <div className="space-y-4">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-14 h-18 bg-dolce rounded overflow-hidden flex-shrink-0">
                      {item.image
                        ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-[0.55rem] text-willow">Shoe</div>
                      }
                    </div>
                    <div className="flex-1">
                      <p className="font-serif text-palm">{item.name}</p>
                      <p className="text-xs text-willow uppercase tracking-wider">{item.brand}</p>
                      {item.selectedSize && <p className="text-xs text-palm/60">EU {item.selectedSize}</p>}
                      <p className="text-xs text-palm/60">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-serif text-palm">€ {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="elara-glass p-8 rounded-md">
              <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-4">Shipping Address</p>
              <p className="text-palm">{order.shipping?.firstName} {order.shipping?.lastName}</p>
              <p className="text-palm/70">{order.shipping?.address}</p>
              <p className="text-palm/70">{order.shipping?.city}, {order.shipping?.zip}</p>
              <p className="text-palm/70">{order.shipping?.country}</p>
              <p className="text-palm/70 mt-2">{order.email}</p>
            </div>
          </Reveal>
        )}
      </div>
    </main>
  );
}