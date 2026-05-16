import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import Reveal from "../components/Reveal";
import { fetchReviews, fetchReviewSummary, submitReview } from "../lib/api";
import { toast } from "sonner";

const PRESS = [
  { source: "Vogue", quote: "ELARA is the rare boutique that treats footwear like literature." },
  { source: "Harper's Bazaar", quote: "A floral whisper in a marketplace of shouting brands." },
  { source: "Elle", quote: "Where editorial taste meets concierge service." },
];

const Stars = ({ n = 5, size = "w-4 h-4" }) => (
  <span className="inline-flex gap-0.5 text-gold" aria-label={`${n} stars`}>
    {[1,2,3,4,5].map(i => (
      <Star key={i} className={`${size} ${i <= n ? "fill-gold" : "fill-none"}`} />
    ))}
  </span>
);

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ average: 0, total: 0, breakdown: { 5:0,4:0,3:0,2:0,1:0 } });
  const [form, setForm] = useState({ name: "", rating: 5, text: "", location: "" });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const [r, s] = await Promise.all([fetchReviews(), fetchReviewSummary()]);
      setReviews(r);
      setSummary(s);
    } catch {
      toast.error("Could not load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.text) { toast.error("Please fill name and review"); return; }
    setBusy(true);
    try {
      await submitReview(form);
      toast.success("Thank you — your reverie is in bloom");
      setForm({ name: "", rating: 5, text: "", location: "" });
      refresh();
    } catch {
      toast.error("Could not submit review");
    } finally {
      setBusy(false);
    }
  };

  const total = summary.total || 1;

  return (
    <main className="pt-32 pb-32" data-testid="page-reviews">
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-20">
        <Reveal className="text-center">
          <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-4">In Their Own Words</p>
          <h1 className="font-serif font-light text-palm text-5xl sm:text-6xl lg:text-7xl tracking-tighter">
            Reviews & <span className="italic text-pines">Reverie</span>
          </h1>
        </Reveal>
      </section>

      {/* Press strip */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-20" data-testid="press-strip">
        <div className="grid md:grid-cols-3 gap-6">
          {PRESS.map((p, i) => (
            <Reveal key={p.source} delay={i * 100}>
              <blockquote className="elara-glass p-8 rounded-md h-full">
                <Quote className="w-6 h-6 text-gold mb-4" />
                <p className="font-serif italic text-palm text-xl leading-snug">"{p.quote}"</p>
                <p className="mt-6 text-[0.65rem] tracking-[0.3em] uppercase text-willow">— {p.source}</p>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Summary */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-20" data-testid="reviews-summary">
        <div className="grid md:grid-cols-3 gap-10 elara-glass p-10 rounded-md">
          <div className="text-center md:text-left">
            <p className="font-serif text-7xl text-palm">{summary.average?.toFixed(1) || "0.0"}</p>
            <Stars n={Math.round(summary.average || 0)} size="w-5 h-5" />
            <p className="mt-3 text-sm text-palm/60">From {summary.total} clients</p>
          </div>
          <div className="md:col-span-2 space-y-2">
            {[5,4,3,2,1].map(n => {
              const v = summary.breakdown?.[n] || 0;
              const pct = (v / total) * 100;
              return (
                <div key={n} className="flex items-center gap-3 text-sm" data-testid={`reviews-bar-${n}`}>
                  <span className="w-8 text-palm">{n}★</span>
                  <div className="flex-1 h-1.5 bg-dolce rounded-full overflow-hidden">
                    <div className="h-full bg-pines rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-10 text-right text-palm/60">{v}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reviews grid */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-20" data-testid="reviews-grid">
        {loading ? (
          <div className="flex justify-center py-20"><div className="elara-loader" /></div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
            {reviews.map((r, i) => (
              <Reveal key={r.id} delay={(i % 6) * 60} className="break-inside-avoid mb-6">
                <article className="elara-glass p-7 rounded-md" data-testid={`review-${r.id}`}>
                  <Stars n={r.rating} />
                  <p className="font-serif text-lg italic text-palm mt-4 leading-relaxed">"{r.text}"</p>
                  <div className="mt-6 flex items-center gap-3">
                    {r.photo_url ? (
                      <img src={r.photo_url} alt={r.name} className="w-12 h-12 rounded-full object-cover ring-1 ring-gold/40" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-dolce flex items-center justify-center text-palm font-serif text-lg">
                        {r.name?.[0] || "E"}
                      </div>
                    )}
                    <div>
                      <p className="font-serif text-palm">{r.name}</p>
                      {r.location && <p className="text-[0.65rem] tracking-[0.25em] uppercase text-willow">{r.location}</p>}
                    </div>
                  </div>
                  {r.product && <p className="mt-4 text-[0.65rem] tracking-[0.25em] uppercase text-palm/50">— {r.product}</p>}
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Submit form */}
      <section className="px-6 md:px-12 max-w-3xl mx-auto" data-testid="reviews-form">
        <Reveal className="text-center mb-8">
          <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-3">Leave a Petal</p>
          <h2 className="font-serif font-light text-palm text-3xl sm:text-4xl">Share your reverie</h2>
        </Reveal>
        <form onSubmit={onSubmit} className="elara-glass p-8 rounded-md space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-[0.6rem] tracking-[0.3em] uppercase text-palm/60">Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-transparent border-b border-palm/30 py-2 focus:outline-none focus:border-gold text-palm"
                data-testid="review-input-name" />
            </div>
            <div>
              <label className="text-[0.6rem] tracking-[0.3em] uppercase text-palm/60">City</label>
              <input value={form.location} onChange={e => setForm({...form, location: e.target.value})}
                className="w-full bg-transparent border-b border-palm/30 py-2 focus:outline-none focus:border-gold text-palm"
                data-testid="review-input-location" />
            </div>
          </div>
          <div>
            <label className="text-[0.6rem] tracking-[0.3em] uppercase text-palm/60 block mb-2">Rating</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button" onClick={() => setForm({...form, rating: n})}
                  data-testid={`review-rating-${n}`}
                  className="text-gold hover:scale-110 transition-transform">
                  <Star className={`w-6 h-6 ${n <= form.rating ? "fill-gold" : "fill-none"}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[0.6rem] tracking-[0.3em] uppercase text-palm/60">Your reverie</label>
            <textarea rows={4} value={form.text} onChange={e => setForm({...form, text: e.target.value})}
              className="w-full bg-transparent border-b border-palm/30 py-2 focus:outline-none focus:border-gold text-palm resize-none"
              data-testid="review-input-text" />
          </div>
          <button type="submit" disabled={busy} className="btn-elara w-full justify-center disabled:opacity-60" data-testid="review-submit">
            {busy ? "Sending…" : "Send to Atelier"}
          </button>
        </form>
      </section>
    </main>
  );
}
