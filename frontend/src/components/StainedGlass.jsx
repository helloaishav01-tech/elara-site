// SVG stained-glass decorative motif used as subtle background layer.
// Inspired by the user's reference window image — pink/green floral mandala in lead lines.
export default function StainedGlass({ className = "" }) {
  return (
    <svg
      viewBox="0 0 600 600"
      className={`elara-stained-svg ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="petalA" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#efd4dd" />
          <stop offset="100%" stopColor="#c7a39b" />
        </radialGradient>
        <radialGradient id="petalB" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9c9f69" />
          <stop offset="100%" stopColor="#6a823e" />
        </radialGradient>
        <radialGradient id="petalC" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#e6b1c4" />
        </radialGradient>
      </defs>

      {/* outer lattice */}
      <g stroke="#364023" strokeWidth="1.2" strokeOpacity="0.35" fill="none">
        {[...Array(11)].map((_, i) => (
          <line key={`v${i}`} x1={i * 60} y1="0" x2={i * 60} y2="600" />
        ))}
        {[...Array(11)].map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 60} x2="600" y2={i * 60} />
        ))}
      </g>

      {/* central mandala */}
      <g transform="translate(300 300)">
        <circle r="180" fill="url(#petalC)" opacity="0.45" />
        {[...Array(8)].map((_, i) => (
          <g key={i} transform={`rotate(${i * 45})`}>
            <ellipse cx="0" cy="-110" rx="34" ry="62" fill="url(#petalA)" stroke="#364023" strokeOpacity="0.35" />
            <circle cx="0" cy="-160" r="14" fill="url(#petalB)" stroke="#364023" strokeOpacity="0.35" />
          </g>
        ))}
        {[...Array(12)].map((_, i) => (
          <g key={`p${i}`} transform={`rotate(${i * 30})`}>
            <ellipse cx="0" cy="-60" rx="14" ry="28" fill="url(#petalC)" stroke="#364023" strokeOpacity="0.3" />
          </g>
        ))}
        <circle r="34" fill="url(#petalA)" stroke="#364023" strokeOpacity="0.45" />
        <circle r="10" fill="#c9a96e" />
      </g>

      {/* corner blossoms */}
      {[
        [80, 80], [520, 80], [80, 520], [520, 520],
      ].map(([cx, cy], idx) => (
        <g key={idx} transform={`translate(${cx} ${cy})`}>
          {[...Array(6)].map((_, i) => (
            <ellipse key={i} cx="0" cy="-22" rx="8" ry="16" fill="url(#petalA)" stroke="#364023" strokeOpacity="0.25" transform={`rotate(${i * 60})`} />
          ))}
          <circle r="6" fill="#c9a96e" />
        </g>
      ))}
    </svg>
  );
}
