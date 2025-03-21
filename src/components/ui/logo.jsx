import React from "react";
import { cn } from "@/lib/utils";

export default function Logo({
  className,
  image: SvgImage,
  name,
  version,
  width = 24,
  height = 24,
  showName = true,
  ...props
}) {
  return (
    (<div
      className={cn("flex items-center gap-2 text-sm font-medium", className)}
      {...props}>
      <SvgImage
        width={width}
        height={height}
        aria-hidden="true"
        className="max-h-full max-w-full opacity-70" />
      <span className={cn(!showName && "sr-only")}>{name}</span>
      {version && <span className="text-muted-foreground">{version}</span>}
    </div>)
  );
}
