/**
 * Vendara Logo Component
 * SVG version of the Vendara logo (R icon)
 */

interface RealServLogoProps {
  className?: string;
  size?: number;
}

export function RealServLogo({ className, size = 48 }: RealServLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background */}
      <rect width="48" height="48" rx="12" fill="#2F3E46" />
      
      {/* R Letter */}
      <path
        d="M16 14H26C29.866 14 33 17.134 33 21C33 23.618 31.528 25.886 29.382 27L34 34H29L25 27H21V34H16V14Z"
        fill="white"
      />
      <path
        d="M21 18V23H26C27.657 23 29 21.657 29 20C29 18.343 27.657 17 26 17H21V18Z"
        fill="#2F3E46"
      />
    </svg>
  );
}
