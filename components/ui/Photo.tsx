"use client";

import { useEffect, useRef, useState } from "react";
import { PHOTOS, photoUrl, type PhotoKey } from "@/lib/photos";

/**
 * A photo that fills its box. The box (size, aspect ratio, corners) comes
 * from `className`. Behind the image sits a two-tone wash in the photo's
 * own colours, so the layout holds while it loads and still reads as a
 * picture if the image can't be fetched.
 */
export default function Photo({
  name,
  width = 1200,
  eager = false,
  className = "",
  children,
}: {
  name: PhotoKey;
  /** Largest width this photo is shown at, in CSS pixels. */
  width?: number;
  eager?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  const img = useRef<HTMLImageElement>(null);
  const p = PHOTOS[name];

  // An image that failed before React attached its error handler never
  // fires onError, so check once after mount as well.
  useEffect(() => {
    if (img.current?.complete && img.current.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundImage: `linear-gradient(135deg, ${p.tone[0]}, ${p.tone[1]})` }}
      role={failed ? "img" : undefined}
      aria-label={failed ? p.alt : undefined}
    >
      {!failed && (
        <img
          ref={img}
          src={photoUrl(name, width)}
          srcSet={`${photoUrl(name, Math.round(width / 2))} ${Math.round(width / 2)}w, ${photoUrl(name, width)} ${width}w, ${photoUrl(name, width * 2)} ${width * 2}w`}
          sizes={`(min-width: 768px) ${width}px, 100vw`}
          alt={p.alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover text-transparent"
        />
      )}
      {children}
    </div>
  );
}
