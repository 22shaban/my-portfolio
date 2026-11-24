"use client";

import { useEffect, useRef } from "react";
import { site } from "@/lib/content";
import ThemeSwitch from "@/components/ui/ThemeSwitch";
import { ArrowUpRight } from "@/components/ui/icons";

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;
      if (pctRef.current) pctRef.current.textContent = `${Math.round(p * 100)}%`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-[100] flex items-start justify-between p-[var(--grid-margin)]"
    >
      <div className="w-[27svw] tab:w-[25svw] desktop:w-[15svw]">
        <div className="h-[0.63em] border border-line p-px">
          <div
            ref={fillRef}
            className="h-full w-full origin-left bg-fg"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
        <div className="mt-[0.42em] text-xxs">
          <span ref={pctRef}>0%</span>
        </div>
      </div>

      <div className="absolute left-1/2 top-[var(--grid-margin)] -translate-x-1/2">
        <ThemeSwitch />
      </div>

      <div className="flex flex-col items-end text-xxs">
        <nav
          className="hidden items-center gap-[0.9em] tab:flex"
          aria-label="Social"
        >
          {site.socials.slice(0, 2).map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="arrow-link items-start"
              data-cursor="VISIT"
            >
              {s.label}
              <ArrowUpRight className="h-[0.85em] w-[0.85em]" />
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="mt-[0.9em] border border-fg px-[1.1em] py-[0.8em] text-xxs transition-colors duration-300 hover:bg-fg hover:text-base"
          data-cursor="SAY HI"
        >
          Contact
        </a>
      </div>
    </header>
  );
}
