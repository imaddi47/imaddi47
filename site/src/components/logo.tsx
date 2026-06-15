/**
 * LoneBuilder mark — an "lB" monogram on a cream badge with the brand's
 * purple→cyan underline. Recreated as SVG; size via the `className`.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" role="img" aria-label="LoneBuilder">
      <defs>
        <linearGradient id="lb-underline" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7b5cff" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="58" height="58" rx="15" fill="#f2efe7" />
      <g stroke="#17172b" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 17 V44" />
        <path d="M32 17 V44" />
        <path d="M32 18 H40 a7 7 0 0 1 0 13 H32" />
        <path d="M32 31 H42.5 a7.5 7.5 0 0 1 0 13 H32" />
      </g>
      <rect x="20" y="49.5" width="24" height="3.6" rx="1.8" fill="url(#lb-underline)" />
    </svg>
  );
}
