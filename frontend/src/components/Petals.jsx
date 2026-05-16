// CSS-driven falling petals. Pointer-aware parallax via translate3d.
// Lightweight alternative to Three.js while preserving 3D depth feel.
import { useEffect, useRef } from "react";

const PETALS = Array.from({ length: 22 }, (_, i) => {
  const layer = i % 3; // 0,1,2 depth
  const left = (i * 53) % 100;
  const dur = 14 + (i * 1.7) % 16;
  const delay = (i * 0.9) % 12;
  const rot = (i * 47) % 360;
  const size = layer === 2 ? "tiny" : layer === 0 ? "large" : "";
  return { id: i, layer, left, dur, delay, rot, size };
});

export default function Petals({ pointerParallax = true, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!pointerParallax) return;
    const onMove = (e) => {
      const { innerWidth: w, innerHeight: h } = window;
      const px = (e.clientX / w - 0.5);
      const py = (e.clientY / h - 0.5);
      const el = ref.current;
      if (!el) return;
      el.querySelectorAll("[data-layer]").forEach((node) => {
        const depth = Number(node.dataset.layer);
        const factor = (depth + 1) * 8;
        node.style.transform = `translate3d(${px * factor}px, ${py * factor}px, 0)`;
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [pointerParallax]);

  return (
    <div ref={ref} className={`elara-stage ${className}`} aria-hidden="true">
      {PETALS.map(p => (
        <span
          key={p.id}
          data-layer={p.layer}
          className={`petal ${p.size}`}
          style={{
            left: `${p.left}%`,
            "--dur": `${p.dur}s`,
            "--delay": `${p.delay}s`,
            "--rot": `${p.rot}deg`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
