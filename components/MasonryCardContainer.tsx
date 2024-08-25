"use client";

import { useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

export default function MasonryCardContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  if (!isClient) return;

  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{
        255: 1,
        511: 2,
        767: 3,
        1023: 4,
      }}
    >
      <Masonry gutter="1rem">{children}</Masonry>
    </ResponsiveMasonry>
  );
}
