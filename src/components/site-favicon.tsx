"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type SiteFaviconProps = {
  src: string;
  title: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClass = {
  sm: "size-8 text-xs",
  md: "size-11 text-sm",
  lg: "size-14 text-lg",
};

export function SiteFavicon({
  src,
  title,
  size = "md",
  className,
}: SiteFaviconProps) {
  const [failed, setFailed] = useState(false);
  const initial = title.trim().charAt(0).toUpperCase() || "A";

  if (failed) {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl bg-slate-900 font-semibold text-white dark:bg-slate-100 dark:text-slate-900",
          sizeClass[size],
          className,
        )}
        aria-hidden
      >
        {initial}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={56}
      height={56}
      loading="lazy"
      className={cn(
        "shrink-0 rounded-xl bg-white object-contain ring-1 ring-border/80",
        sizeClass[size],
        className,
      )}
      onError={() => setFailed(true)}
    />
  );
}
