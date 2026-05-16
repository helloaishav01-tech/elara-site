import { useState } from "react";
import { X, Ruler } from "lucide-react";

const SIZE_DATA = [
  { eu: 35, uk: 2.5, us: 5, cm: 22.5 },
  { eu: 36, uk: 3.5, us: 6, cm: 23 },
  { eu: 37, uk: 4,   us: 6.5, cm: 23.5 },
  { eu: 38, uk: 5,   us: 7.5, cm: 24 },
  { eu: 39, uk: 6,   us: 8.5, cm: 25 },
  { eu: 40, uk: 6.5, us: 9,   cm: 25.5 },
  { eu: 41, uk: 7.5, us: 10,  cm: 26 },
  { eu: 42, uk: 8,   us: 10.5, cm: 26.5 },
];

const TIPS = [
  "Measure your foot in the afternoon — feet swell slightly during the day.",
  "If between sizes, size up for heels and size down for boots.",
  "All ELARA pieces are true to European sizing.",
];

export default function SizeGuide() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-[0.6rem] tracking-[0.25em] uppercase text-palm/50 hover:text-gold transition-colors"
      >
        <Ruler className="w-3 h-3" /> Size Guide
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-palm/40 backdrop-blur-sm" onClick={() => setOpen(false)} />

          {/* Modal */}
          <div className="relative bg-cream rounded-md shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto z-10">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-[0.6rem] tracking-[0.3em] uppercase text-gold mb-1">ELARA Atelier</p>
                  <h2 className="font-serif text-3xl text-palm font-light">Size Guide</h2>
                </div>
                <button onClick={() => setOpen(false)}
                  className="text-palm/40 hover:text-palm transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Size Table */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gold/20">
                      {["EU", "UK", "US", "CM"].map(h => (
                        <th key={h} className="text-left py-3 px-4 text-[0.6rem] tracking-[0.3em] uppercase text-gold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SIZE_DATA.map((row, i) => (
                      <tr key={row.eu}
                        className={`border-b border-gold/10 transition-colors hover:bg-dolce/50
                          ${i % 2 === 0 ? "bg-white/30" : ""}`}>
                        <td className="py-3 px-4 font-serif text-palm font-medium">{row.eu}</td>
                        <td className="py-3 px-4 text-palm/70">{row.uk}</td>
                        <td className="py-3 px-4 text-palm/70">{row.us}</td>
                        <td className="py-3 px-4 text-palm/70">{row.cm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tips */}
              <div className="bg-dolce/40 rounded-md p-5">
                <p className="text-[0.6rem] tracking-[0.3em] uppercase text-gold mb-3">Fitting Tips</p>
                <ul className="space-y-2">
                  {TIPS.map((tip, i) => (
                    <li key={i} className="flex gap-2 text-xs text-palm/70 leading-relaxed">
                      <span className="text-gold mt-0.5">✦</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-[0.6rem] text-palm/40 text-center mt-4 italic">
                Still unsure? Contact our atelier — we'll help you find your perfect fit.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}