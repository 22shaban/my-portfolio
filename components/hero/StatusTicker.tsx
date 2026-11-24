"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/content";

export default function StatusTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((v) => (v + 1) % site.ticker.length);
    }, 3800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="relative h-[1.5em] overflow-hidden text-xxs text-muted"
      aria-live="polite"
    >
      <div
        className="transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)]"
        style={{ transform: `translateY(-${index * 1.5}em)` }}
      >
        {site.ticker.map((item, i) => (
          <div
            key={item}
            className="flex h-[1.5em] items-center justify-center gap-[0.6em] leading-[1.5em]"
            aria-hidden={i !== index}
          >
            <span className="inline-block h-[0.4em] w-[0.4em] rounded-full bg-fg/60" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
