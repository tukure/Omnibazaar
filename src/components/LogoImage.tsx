import React from 'react';

interface LogoImageProps {
  alt?: string;
  className?: string;
}

export const LogoImage: React.FC<LogoImageProps> = ({
  alt = 'OmniBazaar Logo',
  className = 'w-full h-full',
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={alt}
    >
      <defs>
        <linearGradient id="obLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>
      </defs>
      {/* Background card container */}
      <rect x="4" y="4" width="92" height="92" rx="22" fill="#0F172A" stroke="#3A506B" strokeWidth="4" />
      
      {/* Dynamic P2P infinity loop path */}
      <path
        d="M28 50 C28 34, 42 30, 50 42 C58 54, 72 66, 72 50 C72 34, 58 30, 50 42 C42 54, 28 66, 28 50 Z"
        stroke="url(#obLogoGrad)"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      {/* Exchange Arrow Heads */}
      <polygon points="31,38 22,45 31,52" fill="#38BDF8" />
      <polygon points="69,62 78,55 69,48" fill="#34D399" />
      
      {/* Center Verified Node */}
      <circle cx="50" cy="50" r="6" fill="#38BDF8" />
      <circle cx="50" cy="50" r="2.5" fill="#FFFFFF" />
    </svg>
  );
};
