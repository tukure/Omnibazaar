import React from 'react';
import { OMNIBAZAAR_LOGO_BASE64 } from '../assets/logoBase64';

interface LogoImageProps {
  alt?: string;
  className?: string;
}

export const LogoImage: React.FC<LogoImageProps> = ({
  alt = 'OmniBazaar Logo',
  className = 'w-full h-full object-contain',
}) => {
  return (
    <img
      src={OMNIBAZAAR_LOGO_BASE64}
      alt={alt}
      className={`${className} object-contain`}
    />
  );
};
