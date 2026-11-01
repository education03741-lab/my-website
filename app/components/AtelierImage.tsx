"use client";
import { useState } from "react";
import Image from "next/image";

type Props = {
  src: string;
  fallbackSrc: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

/**
 * New original editorial images are provided as a separate WebP asset pack.
 * Until the binary assets are uploaded to /public/images/skin-atelier/,
 * keep every page visually functional with its verified, existing photo.
 */
export default function AtelierImage({src,fallbackSrc,alt,sizes,className,priority}:Props) {
  const [failed,setFailed]=useState(false);
  return <Image
    src={failed ? fallbackSrc : src}
    alt={alt}
    fill
    sizes={sizes}
    priority={priority}
    className={className}
    onError={() => setFailed(true)}
  />;
}
