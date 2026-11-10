import type { SceneKind } from "@/lib/app-data";

/**
 * Flat, four-colour postcard illustrations standing in for destination
 * photography until licensed photos exist. One per landscape type rather
 * than one per city, so a new destination only has to say which kind of
 * place it is. Swapping in a real photo later means replacing this one
 * component's output with an <Image>.
 */
export default function PostcardScene({
  scene,
  label,
  className = "",
}: {
  scene: SceneKind;
  label: string;
  className?: string;
}) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 320 160"
      preserveAspectRatio="xMidYMid slice"
      className={`block w-full ${className}`}
    >
      <rect width="320" height="160" fill="#E0C9A6" />
      {scene === "harbour" && <Harbour />}
      {scene === "mountains" && <Mountains />}
      {scene === "desert" && <Desert />}
    </svg>
  );
}

function Harbour() {
  return (
    <>
      <g stroke="#E8A23D" strokeWidth="3" opacity=".55">
        {[0, 45, 90, 270, 315].map((a) => (
          <line key={a} x1="236" y1="22" x2="236" y2="-4" transform={`rotate(${a} 236 62)`} />
        ))}
      </g>
      <circle cx="236" cy="62" r="28" fill="#E8A23D" />
      <path d="M0 106 L44 80 L86 102 L130 72 L178 100 L216 84 L264 106 L320 88 V160 H0 Z" fill="#7A2E33" />
      <path d="M0 124 C 50 106, 96 126, 150 114 S 250 102, 320 120 V160 H0 Z" fill="#C0532E" />
      <g fill="#F7F2EA">
        <rect x="52" y="104" width="13" height="13" />
        <rect x="70" y="108" width="11" height="11" />
        <rect x="118" y="103" width="12" height="13" />
      </g>
      <g fill="#26201B">
        <path d="M50 104 l8.5 -7 l8.5 7 z" />
        <path d="M68 108 l7.5 -6 l7.5 6 z" />
        <path d="M116 103 l8 -7 l8 7 z" />
      </g>
      <rect y="136" width="320" height="24" fill="#2E6E5B" />
      <path
        d="M10 146 q 8 -5 16 0 t 16 0 M70 153 q 8 -5 16 0 t 16 0 M132 145 q 8 -5 16 0 t 16 0 M250 152 q 8 -5 16 0 t 16 0"
        fill="none"
        stroke="#F7F2EA"
        strokeWidth="1.4"
        opacity=".7"
      />
      <g transform="translate(206 0)">
        <path d="M-16 140 h34 l-6 9 h-22 z" fill="#26201B" />
        <line x1="1" y1="140" x2="1" y2="110" stroke="#26201B" strokeWidth="1.5" />
        <path d="M3 112 L17 136 H3 Z" fill="#F7F2EA" />
        <path d="M-1 116 L-12 136 H-1 Z" fill="#F7F2EA" />
      </g>
    </>
  );
}

function Mountains() {
  return (
    <>
      <circle cx="66" cy="48" r="22" fill="#E8A23D" />
      <path d="M0 112 L48 54 L84 94 L134 36 L188 102 L228 62 L278 106 L320 72 V160 H0 Z" fill="#2E6E5B" />
      <path
        d="M134 36 L148 54 L139 50 L132 57 L122 51 Z M228 62 L240 73 L232 71 L226 77 L218 73 Z"
        fill="#F7F2EA"
      />
      <path d="M0 130 C 60 106, 120 134, 180 118 S 280 110, 320 128 V160 H0 Z" fill="#7A2E33" />
      <path d="M244 116 V96 h3 v-3 h3 v3 h3 v-3 h3 v3 h3 V116 Z" fill="#F7F2EA" />
      <path d="M0 146 C 80 134, 200 152, 320 140 V160 H0 Z" fill="#C0532E" />
      <path
        d="M30 160 C 70 146, 110 150, 150 134 S 220 124, 246 116"
        fill="none"
        stroke="#F7F2EA"
        strokeWidth="2"
        strokeDasharray="1 6"
        strokeLinecap="round"
      />
    </>
  );
}

function Desert() {
  return (
    <>
      <circle cx="160" cy="74" r="40" fill="#E8A23D" />
      <path d="M0 114 H30 L38 94 H96 L104 114 H190 L198 86 H250 L258 114 H320 V160 H0 Z" fill="#7A2E33" />
      <path d="M0 132 C 80 122, 220 140, 320 128 V160 H0 Z" fill="#C0532E" />
      <g fill="none" stroke="#2E6E5B" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M70 152 V108 M70 132 H56 V118 M70 126 H84 V112" />
        <path d="M268 154 V124 M268 142 H258 V132" />
      </g>
    </>
  );
}
