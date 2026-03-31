import type { ImgHTMLAttributes } from 'react';

type PictureWithFallbackProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  webpSrc: string;
  fallbackSrc: string;
  pictureClassName?: string;
};

export default function PictureWithFallback({
  webpSrc,
  fallbackSrc,
  pictureClassName,
  className,
  ...imgProps
}: PictureWithFallbackProps) {
  return (
    <picture className={pictureClassName}>
      <source srcSet={webpSrc} type="image/webp" />
      <img {...imgProps} src={fallbackSrc} className={className} />
    </picture>
  );
}
