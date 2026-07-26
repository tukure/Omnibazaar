import React, { useState } from 'react';
import logoImg from '../assets/images/omnibazaar_logo_1784789812369.jpg';
import { OMNIBAZAAR_LOGO_BASE64 } from '../assets/logoBase64';

interface LogoImageProps {
  alt?: string;
  className?: string;
}

export const LogoImage: React.FC<LogoImageProps> = ({
  alt = 'OmniBazaar Logo',
  className = 'w-full h-full object-cover',
}) => {
  const [imgSrc, setImgSrc] = useState<string>(OMNIBAZAAR_LOGO_BASE64);

  const handleError = () => {
    if (imgSrc === OMNIBAZAAR_LOGO_BASE64) {
      setImgSrc(logoImg);
    } else if (imgSrc === logoImg) {
      setImgSrc('/omnibazaar_logo.png');
    } else if (imgSrc === '/omnibazaar_logo.png') {
      setImgSrc('/omnibazaar_logo.jpg');
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};
