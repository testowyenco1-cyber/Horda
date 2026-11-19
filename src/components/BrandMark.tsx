import React, { useState } from 'react';
import { Package } from 'lucide-react';

export function HordaLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <svg
        width={compact ? 28 : 34}
        height={compact ? 28 : 34}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* Gothic shield / castle silhouette */}
        <path
          d="M20 2L34 8.5V21C34 29.8 27.9 35.6 20 38.5C12.1 35.6 6 29.8 6 21V8.5L20 2Z"
          fill="#111925"
          stroke="#9CDEF7"
          strokeWidth="1.75"
        />
        {/* Inner crescent & spire */}
        <path
          d="M20 7.5L23.5 14H27.5L25 22.5L29 25.5L20 32.5L11 25.5L15 22.5L12.5 14H16.5L20 7.5Z"
          fill="#172333"
          stroke="#D8AD6C"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="19.5" r="2.75" fill="#9CDEF7" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-fantasy text-xl sm:text-2xl font-bold tracking-[0.14em] text-[#F1F5F9]">
          HORDA
        </span>
      </span>
    </span>
  );
}

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
}

export function SafeImage({
  src,
  alt,
  className = '',
  fallbackTitle,
  ...rest
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt || fallbackTitle || 'Obraz niedostępny'}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#172333] via-[#111925] to-[#090D14] text-[#9CDEF7]/70 p-4 text-center ${className}`}
      >
        <Package className="w-8 h-8 mb-2 opacity-75" />
        <span className="text-xs text-[#C5CFD8]/80 font-medium line-clamp-2">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
