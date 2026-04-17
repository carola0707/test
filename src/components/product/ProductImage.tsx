/**
 * ProductImage — renders a product image with error fallback.
 * If the image URL fails to load, shows a clean category-based placeholder
 * instead of a broken image icon.
 */
import { useEffect, useState } from "react";

/** Fallback placeholder image */
// Use a neutral placeholder PNG stored in the public folder.
const FALLBACK = "/placeholder.png";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}

export function ProductImage({ src, alt, className = "", loading = "lazy" }: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
  setImgSrc(src);
  setHasError(false);
}, [src]);

  /** On error, swap to the placeholder */
  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(FALLBACK);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
    />
  );
}
