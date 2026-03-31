import { useState, type ImgHTMLAttributes } from 'react';

import Logo from '@/assets/Logo.png';
import LogoWebp from '@/assets/Logo.webp';

import PictureWithFallback from './PictureWithFallback';

type FallbackImgProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src?: string | null;
  fallbackSrc?: string;
  fallbackWebpSrc?: string;
  fallbackClassName?: string;
  pictureClassName?: string;
};

export default function FallbackImg({
  src,
  fallbackSrc = Logo,
  fallbackWebpSrc = LogoWebp,
  fallbackClassName,
  pictureClassName,
  className,
  alt,
  onError,
  ...imgProps
}: FallbackImgProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return (
      <PictureWithFallback
        webpSrc={fallbackWebpSrc}
        fallbackSrc={fallbackSrc}
        pictureClassName={pictureClassName}
        className={fallbackClassName ?? className}
        alt={alt}
        {...imgProps}
      />
    );
  }

  return (
    <img
      {...imgProps}
      src={src}
      alt={alt}
      className={className}
      onError={(event) => {
        setFailedSrc(src);
        onError?.(event);
      }}
    />
  );
}
