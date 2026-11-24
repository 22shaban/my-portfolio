"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

export default function ThemeSwitch({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isInk = theme === "ink";

  return (
    <button
      type="button"
      aria-label={isInk ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isInk}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      className={cn(
        "relative flex h-[1.55em] w-[3.1em] items-center rounded-full border border-fg/80 px-[0.18em] text-xs transition-colors duration-500",
        className,
      )}
    >
      <span
        className={cn(
          "block h-[1.12em] w-[1.12em] rounded-full bg-fg transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          isInk ? "translate-x-[1.5em]" : "translate-x-0",
        )}
      />
      <span className="sr-only">Toggle colour mode</span>
    </button>
  );
}
