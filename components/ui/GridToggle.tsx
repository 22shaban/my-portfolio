"use client";

import { useState } from "react";
import { GridIcon } from "./icons";
import { cn } from "@/lib/utils";

export default function GridToggle() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-pressed={open}
        aria-label={open ? "Hide layout grid" : "Show layout grid"}
        onClick={() => setOpen((v) => !v)}
        className="box-1 flex h-[2.6em] w-[2.6em] shrink-0 items-center justify-center transition-colors duration-300 hover:bg-fg hover:text-base"
        data-cursor="GRID"
      >
        <GridIcon className="h-[1em] w-[1em]" />
      </button>

      <div
        className={cn(
          "pointer-events-none fixed inset-0 z-[80] transition-opacity duration-500",
          open ? "opacity-100" : "opacity-0",
        )}
        aria-hidden="true"
      >
        <div className="mx-[var(--grid-margin)] grid h-full grid-cols-6 tab:grid-cols-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "relative border-l border-fg/15 last:border-r",
                i >= 6 && "hidden tab:block",
              )}
            >
              <span className="absolute left-[3px] top-[72px] text-[10px] text-fg/40">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
