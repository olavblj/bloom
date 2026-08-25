"use client";

import { useMemo } from "react";
import { renderFlower } from "@/lib/bloom";
import type { Variant, PaletteInput } from "@/lib/bloom";
import clsx from "clsx";

interface FlowerSvgProps {
  seed: string;
  variant?: Variant;
  palette?: PaletteInput;
  size?: number;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export function FlowerSvg({
  seed,
  variant,
  palette,
  size = 256,
  className,
  onClick,
  interactive = false,
}: FlowerSvgProps) {
  const svg = useMemo(
    () =>
      renderFlower({
        seed,
        variant,
        palette,
        size,
      }),
    [seed, variant, palette, size]
  );

  const Component = interactive ? "button" : "div";

  return (
    <Component
      type={interactive ? "button" : undefined}
      onClick={onClick}
      className={clsx(
        "overflow-hidden rounded-xl",
        interactive &&
          "cursor-pointer transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-500 motion-reduce:transition-none motion-reduce:hover:scale-100",
        className
      )}
      aria-label={interactive ? `Open studio for flower seed ${seed}` : undefined}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
