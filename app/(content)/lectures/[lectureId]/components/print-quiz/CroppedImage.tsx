"use client";

import React from "react";

interface CroppedImageProps {
  image: string;
  x: number;
  y: number;
  w: number;
  h: number;
  originalWidth: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function CroppedImage({
  image,
  x,
  y,
  w,
  h,
  originalWidth,
  className,
  style,
}: CroppedImageProps) {
  return (
    <div
      className={className}
      style={{
        backgroundImage: `url(${process.env.NEXT_PUBLIC_STATIC_URL}/image/${image})`,
        backgroundPosition: `-${x - 2}px -${y - 2}px`,
        width: w + 4,
        height: h + 4,
        backgroundSize: `${originalWidth}px auto`,
        backgroundRepeat: "no-repeat",
        ...style,
      }}
    />
  );
}
