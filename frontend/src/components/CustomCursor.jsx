import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const target = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFinePointer) return;

    document.body.classList.add("elara-cursor");

    const onMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    };
    const interactiveSel = "a, button, [role='button'], input, textarea, select, .elara-card, [data-cursor-hover]";
    const onOver = (e) => {
      if (e.target.closest && e.target.closest(interactiveSel)) {
        ringRef.current?.classList.add("is-hover");
        dotRef.current?.classList.add("is-hover");
      }
    };
    const onOut = (e) => {
      if (e.target.closest && e.target.closest(interactiveSel)) {
        ringRef.current?.classList.remove("is-hover");
        dotRef.current?.classList.remove("is-hover");
      }
    };

    let raf;
    const tick = () => {
      ringPos.current.x += (target.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (target.current.y - ringPos.current.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      document.body.classList.remove("elara-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="elara-cursor-ring" data-testid="elara-cursor-ring" />
      <div ref={dotRef} className="elara-cursor-dot" data-testid="elara-cursor-dot" />
    </>
  );
}
