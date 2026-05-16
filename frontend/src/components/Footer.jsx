import { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Heart } from "lucide-react";
import { subscribeNewsletter } from "../lib/api";
import { toast } from "sonner";

const PinterestIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
    <path d="M12.04 2C6.5 2 2 6.5 2 12.04c0 4.13 2.49 7.69 6.05 9.24-.08-.78-.16-2 .03-2.86.18-.78 1.16-4.93 1.16-4.93s-.3-.6-.3-1.48c0-1.39.81-2.43 1.81-2.43.86 0 1.27.64 1.27 1.41 0 .86-.55 2.15-.83 3.34-.24 1 .5 1.82 1.49 1.82 1.79 0 3.16-1.89 3.16-4.6 0-2.41-1.73-4.09-4.2-4.09-2.86 0-4.54 2.14-4.54 4.36 0 .86.33 1.79.74 2.3.08.1.09.18.07.28-.08.31-.25 1-.28 1.14-.04.18-.15.22-.34.13-1.27-.59-2.06-2.45-2.06-3.94 0-3.21 2.33-6.16 6.72-6.16 3.53 0 6.27 2.51 6.27 5.87 0 3.5-2.21 6.32-5.27 6.32-1.03 0-2-.53-2.33-1.17l-.63 2.41c-.23.88-.85 1.99-1.27 2.66.96.3 1.97.46 3.03.46 5.54 0 10.04-4.5 10.04-10.04S17.58 2 12.04 2z"/>
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    setBusy(true);
    try {
      await subscribeNewsletter(email);
      toast.success("Welcome to ELARA — check your inbox for petals", { duration: 4000 });
      setEmail("");
    } catch {
      toast.error("Could not subscribe — try again");
    } finally {
      setBusy(false);
    }
  };

  return (
    <footer className="relative mt-32 bg-palm text-cream overflow-hidden" data-testid="elara-footer">
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 20% 30%, #e6b1c4, transparent 40%), radial-gradient(circle at 80% 70%, #c9a96e, transparent 40%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-20">
        {/* Newsletter */}
        <div className="mb-16 max-w-2xl">
          <p className="text-[0.7rem] tracking-[0.3em] uppercase text-gold mb-4">The Letter</p>
          <h3 className="font-serif text-4xl md:text-5xl mb-4 text-cream font-light">
            Receive a petal in your inbox
          </h3>
          <p className="text-cream/70 mb-6 text-sm leading-relaxed">
            Editorial reflections, private previews, and the occasional poem. Curated thrice a season.
          </p>
          <form onSubmit={onSubscribe} className="flex flex-col sm:flex-row gap-3" data-testid="footer-newsletter-form">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 bg-transparent border-b border-cream/40 px-2 py-3 text-cream placeholder-cream/40 focus:outline-none focus:border-gold transition-colors"
              data-testid="footer-newsletter-email"
            />
            <button
              type="submit"
              disabled={busy}
              className="btn-gold disabled:opacity-60"
              data-testid="footer-newsletter-submit"
            >
              {busy ? "Sending…" : "Subscribe"}
            </button>
          </form>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-cream/15 pt-12">
          <div className="col-span-2">
            <span className="font-serif italic text-3xl text-cream">Elara</span>
            <p className="mt-3 text-sm text-cream/65 leading-relaxed max-w-sm">
              A curated atelier of luxury footwear, where every pair carries the story of a flower in bloom.
            </p>
          </div>
          <div>
            <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-3">Boutique</p>
            <ul className="space-y-2 text-sm text-cream/80">
              <li><Link to="/collections?cat=all" className="hover:text-gold transition-colors" data-testid="footer-link-collections">Collections</Link></li>
              <li><Link to="/products" className="hover:text-gold transition-colors" data-testid="footer-link-arrivals">New Arrivals</Link></li>
              <li><Link to="/editorial" className="hover:text-gold transition-colors" data-testid="footer-link-editorial">Editorial</Link></li>
              <li><Link to="/reviews" className="hover:text-gold transition-colors" data-testid="footer-link-reviews">Reviews</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-3">Atelier</p>
            <ul className="space-y-2 text-sm text-cream/80">
              <li><Link to="/about" className="hover:text-gold transition-colors" data-testid="footer-link-about">Our Story</Link></li>
              <li><a href="mailto:concierge@elara.luxury" className="hover:text-gold transition-colors">Concierge</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Care &amp; Repair</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Shipping</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-cream/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-cream/50">
          <p>© {new Date().getFullYear()} ELARA Atelier. Where flowers bloom underfoot.</p>
          <div className="flex items-center gap-5">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-gold transition-colors" data-testid="footer-instagram">
              <Instagram className="w-4 h-4" /> @elara.luxury
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-gold transition-colors" data-testid="footer-pinterest">
              <PinterestIcon /> @elara.luxury
            </a>
            <span className="hidden md:flex items-center gap-1.5"><Heart className="w-3 h-3 text-blossom" /> Crafted in Paris</span>
          </div>
        </div>
      </div>
    </footer>
  );
}