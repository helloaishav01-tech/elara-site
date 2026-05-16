import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Reveal from "../components/Reveal";
import Petals from "../components/Petals";

export default function OrderConfirmation() {
  const orderNum = `ELARA-${Math.floor(Math.random() * 90000) + 10000}`;

  return (
    <main className="pt-40 pb-32 min-h-screen relative overflow-hidden" data-testid="page-confirmation">
      <Petals />
      <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
        <Reveal>
          <CheckCircle className="w-20 h-20 text-pines mx-auto mb-6" />
          <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-4">Order Confirmed</p>
          <h1 className="font-serif font-light text-palm text-5xl sm:text-6xl mb-6 leading-tight">
            Your blooms are <span className="italic text-pines">on their way.</span>
          </h1>
          <p className="text-palm/70 mb-3 leading-relaxed">
            Thank you for your order. Your ELARA selection will be hand-packed
            in our signature blossom box and dispatched with care.
          </p>
          <p className="font-serif italic text-gold text-lg mb-10">Order {orderNum}</p>
          <p className="text-sm text-palm/60 mb-12">
            A confirmation has been noted for your records. Expect your parcel within 3-5 business days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-elara">Return Home</Link>
            <Link to="/collections?cat=all" className="btn-elara-outline">Continue Shopping</Link>
          </div>
        </Reveal>
      </div>
    </main>
  );
}