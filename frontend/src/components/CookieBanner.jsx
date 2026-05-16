import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("elara_cookies");
    if (!consent) setTimeout(() => setShow(true), 1500);
  }, []);

  const accept = () => { localStorage.setItem("elara_cookies", "accepted"); setShow(false); };
  const decline = () => { localStorage.setItem("elara_cookies", "declined"); setShow(false); };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-[200] animate-fade-in">
      <div className="elara-glass rounded-md p-6 shadow-2xl border border-gold/20">
        <p className="text-[0.6rem] tracking-[0.3em] uppercase text-gold mb-2">🍪 Cookie Notice</p>
        <p className="text-palm text-sm leading-relaxed mb-4">
          ELARA uses cookies to enhance your atelier experience — for remembering your bag,
          wishlist, and preferences. We never sell your data.
        </p>
        <div className="flex gap-3">
          <button onClick={accept} className="btn-elara !py-2 !px-4 !text-xs flex-1 justify-center">
            Accept All
          </button>
          <button onClick={decline}
            className="flex-1 text-center text-[0.65rem] tracking-widest uppercase text-palm/50 hover:text-palm transition-colors border border-palm/20 rounded py-2 px-4">
            Decline
          </button>
        </div>
        <p className="text-[0.55rem] text-palm/40 text-center mt-3">
          By accepting you agree to our{" "}
          <span className="text-gold cursor-pointer hover:underline">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}