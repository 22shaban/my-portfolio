"use client";

import { Fragment, useLayoutEffect, useRef } from "react";
import { gsap, mainTextIn } from "@/lib/gsap";
import { site } from "@/lib/content";
import StatusTicker from "./StatusTicker";
import GridToggle from "@/components/ui/GridToggle";
import { ArrowDown, ArrowUpRight } from "@/components/ui/icons";

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  // first line is always the name; the rest comes from content/site.json
  const heroLines = [`${site.name},`, ...site.headline];

  // Keep the headline inside the grid on narrow screens. Every line is broken
  // into words, and if the longest word is wider than the column the whole
  // headline is scaled down uniformly — no overflow, and the accent glyph can
  // never be orphaned on its own line.
  useLayoutEffect(() => {
    const root = rootRef.current;
    const h1 = root?.querySelector("h1");
    if (!root || !h1) return;

    const fit = () => {
      h1.style.fontSize = "";
      const available = h1.clientWidth;
      let widest = 0;
      root.querySelectorAll<HTMLElement>(".hero-word").forEach((word) => {
        widest = Math.max(widest, word.getBoundingClientRect().width);
      });
      if (!available || !widest || widest <= available) return;
      const base = parseFloat(getComputedStyle(h1).fontSize);
      h1.style.fontSize = `${(base * available) / widest}px`;
    };

    fit();
    document.fonts?.ready.then(fit).catch(() => {});
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lines = root.querySelectorAll<HTMLElement>(".hero-line");
    const scrambles = root.querySelectorAll<HTMLElement>(".hero-scramble");
    const marks = root.querySelectorAll<HTMLElement>(".hero-mark");

    // hold the hero behind the loader, exactly like the reference
    gsap.set(lines, { clipPath: "inset(-50% 0% 150% 0%)", yPercent: 110 });
    gsap.set(marks, { scale: 0, transformOrigin: "center" });
    gsap.set(root.querySelectorAll(".hero-rule"), {
      scaleX: 0,
      transformOrigin: "left",
    });

    // keep the final strings, start from empty like the reference
    const texts = Array.from(scrambles).map((el) => el.textContent ?? "");
    scrambles.forEach((el) => {
      el.textContent = "";
    });

    let played = false;
    const run = () => {
      if (played) return;
      played = true;

      const tl = gsap.timeline();

      // masked line reveal — 1.5s expo.out, 0.1s stagger (reference values)
      lines.forEach((line, i) => {
        tl.add(mainTextIn(line, { duration: 1.5, ease: "expo.out" }), i * 0.1);
        tl.set(line, { clearProps: "clipPath" }, ">");
      });

      // meta strip: binary scramble, then settle on the real copy
      scrambles.forEach((el, i) => {
        tl.to(
          el,
          {
            scrambleText: { text: texts[i], chars: "01 00 11", speed: 0.6 },
            duration: 1.2,
            ease: "expo.out",
          },
          0.5 + i * 0.15,
        );
      });

      // bullets + arrows pop in, same 0.6s expo.inOut as the reference
      tl.to(
        marks,
        { scale: 1, transformOrigin: "center", duration: 0.6, ease: "expo.inOut" },
        0.8,
      );
      tl.to(
        root.querySelectorAll(".hero-rule"),
        { scaleX: 1, transformOrigin: "left", duration: 1, ease: "expo.inOut" },
        0.5,
      );
    };

    if (document.documentElement.dataset.ready === "1") run();
    else window.addEventListener("app:ready", run, { once: true });

    return () => {
      window.removeEventListener("app:ready", run);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={rootRef}
      className="relative flex min-h-svh flex-col justify-between p-[var(--grid-margin)] pt-[calc(var(--grid-margin)+2.8rem)]"
    >
      <div className="relative flex flex-1 flex-col items-center justify-center">
        <h1
          className="display text-hero w-full text-center"
          aria-label={`${site.name}, ${site.headline.join(" ")}`}
        >
          <span className="sr-only">{`${site.name}, ${site.headline.join(" ")}`}</span>
          {heroLines.map((line, li) => {
            const words = line.split(/\s+/).filter(Boolean);
            const isLast = li === heroLines.length - 1;

            return (
              <span
                className={`hero-line${li === 0 ? " hero-line--name" : ""}`}
                aria-hidden="true"
                key={`${line}-${li}`}
              >
                <span className="hero-line-inner">
                  {words.map((word, wi) => (
                    <Fragment key={`${word}-${wi}`}>
                      {wi > 0 && " "}
                      <span className="hero-word">
                        {isLast && wi === 0 ? (
                          <>
                            <span className="accent-glyph">{word.slice(0, 1)}</span>
                            {word.slice(1)}
                          </>
                        ) : (
                          word
                        )}
                      </span>
                    </Fragment>
                  ))}
                </span>
              </span>
            );
          })}
        </h1>

        <div className="mt-[1.71em] flex w-full flex-wrap items-center justify-center gap-x-[2.4em] gap-y-[0.9em] text-xxs tab:mt-[1.42em]">
          <span className="hero-scramble">{site.availability}</span>
          <span className="hero-scramble">{site.location}</span>
          <span className="flex items-center gap-[0.6em]">
            <span className="hero-mark inline-block h-[0.88em] w-[0.88em] bg-fg" />
            <span className="hero-scramble">{site.name}</span>
          </span>
          <span className="hero-scramble">{site.studio}</span>
        </div>

        <div className="mt-[1.4em] w-full">
          <StatusTicker />
        </div>

        <span className="hero-mark absolute left-0 top-1/2 h-[0.9em] w-[0.9em] -translate-y-1/2 border-b border-l border-fg/45" />
        <span className="hero-mark absolute right-0 top-1/2 h-[0.9em] w-[0.9em] -translate-y-1/2 border-b border-r border-fg/45" />
      </div>

      <div className="mt-[5svh] flex w-full flex-col gap-[1.5em] tab:flex-row tab:items-end tab:justify-between">
        <div className="flex items-start gap-[1em]">
          <a
            href="#about"
            aria-label="Scroll to about"
            className="hero-mark box-1 flex h-[2.6em] w-[2.6em] shrink-0 items-center justify-center transition-colors duration-300 hover:bg-fg hover:text-base"
            data-cursor="SCROLL"
          >
            <ArrowDown className="h-[1em] w-[1em]" />
          </a>
          <p className="max-w-[24ch] text-xxs leading-[1.4]">{site.statement}</p>
        </div>

        <div className="hero-rule flex items-center justify-between gap-[1.2em] border-t border-line pt-[1em] tab:justify-end">
          <GridToggle />
          <a href="#work" className="arrow-link text-xxs" data-cursor="SEE">
            Selected work
            <ArrowUpRight className="h-[0.85em] w-[0.85em]" />
          </a>
        </div>
      </div>
    </section>
  );
}
