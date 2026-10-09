export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <svg viewBox="0 0 210 64" role="img" aria-label="TAPJR" className={`tapjr-logo ${light ? "logo-light" : ""} ${className}`}>
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M9 30c0-13 9-23 22-25M15 30c0-10 6-17 16-19M21 30c0-6 4-11 10-13" />
        <path d="M201 30c0-13-9-23-22-25M195 30c0-10-6-17-16-19M189 30c0-6-4-11-10-13" />
      </g>
      <text x="105" y="48" textAnchor="middle" fill="currentColor" fontFamily="'DM Serif Display', Georgia, serif" fontSize="45">TAPJR</text>
    </svg>
  );
}
