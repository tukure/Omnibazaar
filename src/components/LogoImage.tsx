import React, { useState } from 'react';
import { OMNIBAZAAR_LOGO_BASE64 } from '../assets/logoBase64';
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
  const [imgSrc, setImgSrc] = useState<string>(OMNIBAZAAR_LOGO_BASE64);
  const [hasError, setHasError] = useState<boolean>(false);

  const handleError = () => {
    if (imgSrc === OMNIBAZAAR_LOGO_BASE64) {
      setImgSrc(logoImg);
    } else if (imgSrc !== '/omnibazaar_logo.jpg') {
      setImgSrc('/omnibazaar_logo.jpg');
    } else {
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
