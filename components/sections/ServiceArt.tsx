/** Thin-stroke drawings, one per service. Every path is drawn on reveal. */
export function ServiceArt({ slug }: { slug: string }) {
  const common = {
    viewBox: "0 0 240 150",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
    className: "h-full w-auto overflow-visible",
  };

  if (slug === "web")
    return (
      <svg {...common}>
        <rect x="18" y="14" width="204" height="122" rx="10" />
        <path d="M18 34h204" />
        <circle cx="32" cy="24" r="2.5" />
        <circle cx="42" cy="24" r="2.5" />
        <circle cx="52" cy="24" r="2.5" />
        <path d="M34 52h84M34 64h62" />
        <rect x="34" y="80" width="70" height="40" rx="5" />
        <rect x="132" y="48" width="74" height="72" rx="5" />
        <path d="M140 108l16-18 12 12 10-8 20 14" />
        <path d="M118 110l10 22 4-9 9-3z" className="text-lagoon" stroke="currentColor" />
      </svg>
    );

  if (slug === "custom")
    return (
      <svg {...common}>
        <rect x="14" y="58" width="48" height="34" rx="6" />
        <rect x="96" y="18" width="48" height="34" rx="6" />
        <rect x="96" y="98" width="48" height="34" rx="6" />
        <rect x="178" y="58" width="48" height="34" rx="6" />
        <path d="M62 75h14c8 0 10-40 20-40M62 75h14c8 0 10 40 20 40M144 35h10c10 0 12 40 24 40M144 115h10c10 0 12-40 24-40" />
        <path d="M26 75h24M108 35h24M108 115h16M190 75h24" />
        <circle cx="120" cy="75" r="4" className="text-lagoon" stroke="currentColor" />
      </svg>
    );

  if (slug === "cloud")
    return (
      <svg {...common}>
        <path d="M70 66a26 26 0 0 1 50-14 22 22 0 0 1 40 6 18 18 0 0 1 4 36H76a20 20 0 0 1-6-28z" />
        <path d="M120 94v14" />
        <rect x="60" y="108" width="120" height="14" rx="4" />
        <rect x="60" y="126" width="120" height="14" rx="4" />
        <path d="M72 115h3M72 133h3M84 115h3M84 133h3" />
        <path d="M150 115h18M150 133h18" className="text-lagoon" stroke="currentColor" />
      </svg>
    );

  return (
    <svg {...common}>
      <path d="M44 112a54 54 0 1 1 22 20" />
      <path d="M38 104l6 10 10-5" />
      <path d="M64 92l22-18 18 12 22-26 22 10 20-24" className="text-lagoon" stroke="currentColor" />
      <circle cx="168" cy="46" r="4" className="text-lagoon" stroke="currentColor" />
      <path d="M190 30h30M190 46h22M190 62h26" />
    </svg>
  );
}
