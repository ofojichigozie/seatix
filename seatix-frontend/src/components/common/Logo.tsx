interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 32, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Seatix logo"
    >
      {/* Seat back */}
      <rect x="4" y="2" width="24" height="15" rx="5" fill="currentColor" />
      {/* Armrests */}
      <rect x="1" y="13" width="5" height="11" rx="2.5" fill="currentColor" opacity="0.7" />
      <rect x="26" y="13" width="5" height="11" rx="2.5" fill="currentColor" opacity="0.7" />
      {/* Seat cushion */}
      <rect x="3" y="17" width="26" height="8" rx="4" fill="currentColor" />
      {/* Legs */}
      <rect x="7" y="24" width="4" height="6" rx="2" fill="currentColor" opacity="0.6" />
      <rect x="21" y="24" width="4" height="6" rx="2" fill="currentColor" opacity="0.6" />
    </svg>
  );
}
