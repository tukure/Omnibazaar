import React, { useState } from 'react';
import logoImg from '../assets/images/omnibazaar_logo_1784789812369.jpg';
import { Store } from 'lucide-react';

interface LogoImageProps {
  alt?: string;
  className?: string;
}

export const LogoImage: React.FC<LogoImageProps> = ({
  alt = 'OmniBazaar Logo',
  className = 'w-full h-full object-contain',
}) => {
  const [imgSrc, setImgSrc] = useState<string>(logoImg);
  const [hasError, setHasError] = useState<boolean>(false);

  const handleError = () => {
    if (imgSrc !== '/omnibazaar_logo.jpg') {
      // Fallback to static public folder copy if bundled path has issue
      setImgSrc('/omnibazaar_logo.jpg');
    } else {
      // If image fails to load, render clean SVG logo fallback
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div className="w-full h-full bg-[#182533] text-[#93ACCC] flex items-center justify-center p-1 rounded font-bold">
        <Store className="w-full h-full text-[#93ACCC]" />
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};
