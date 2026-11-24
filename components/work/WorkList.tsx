"use client";

import { useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";
import { projects, type Project } from "@/lib/content";
import { ArrowUpRight } from "@/components/ui/icons";
import HoverPreview, { type HoverItem } from "./HoverPreview";
import WorkDialog from "./WorkDialog";

function SplitTitle({ title }: { title: string }) {
  return (
    <span className="work-title">
      <span className="work-title-row" aria-hidden="true">
        {title.split("").map((ch, i) => (
          <span
            key={`a-${i}`}
            className="work-title-ch"
            style={{ ["--ci" as string]: i }}
          >
            {ch}
          </span>
        ))}
      </span>
      <span className="work-title-row work-title-clone" aria-hidden="true">
        {title.split("").map((ch, i) => (
          <span
            key={`b-${i}`}
            className="work-title-ch"
            style={{ ["--ci" as string]: i }}
          >
            {ch}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function WorkList() {
  const [active, setActive] = useState<{ project: Project; index: number } | null>(
    null,
  );
  const [hovered, setHovered] = useState<HoverItem>(null);

  // hide the preview when the page moves under the pointer
  useEffect(() => {
    const onScroll = () => setHovered(null);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // reference motion: row clip reveal + per-character title roll
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rows = Array.from(document.querySelectorAll<HTMLElement>(".work-row"));
    const cleanups: (() => void)[] = [];

    rows.forEach((row) => {
      const original = row.querySelector<HTMLElement>(".work-title-row");
      const clone = row.querySelector<HTMLElement>(".work-title-clone");
      if (!original || !clone) return;

      gsap.set(clone.children, { yPercent: 10 });

      const tl = gsap
        .timeline({ paused: true, defaults: { duration: 0.8, ease: "none" } })
        .to(original.children, { yPercent: -110, stagger: 0.06 }, "<")
        .fromTo(
          clone.children,
          { yPercent: 10 },
          { yPercent: -100, stagger: 0.06 },
          "<",
        )
        .addLabel("end");

      const enter = () => tl.tweenTo("end", { ease: "expo.out" });
      const leave = () => tl.tweenTo(0, { ease: "expo.out" });

      row.addEventListener("mouseenter", enter);
      row.addEventListener("mouseleave", leave);
      row.addEventListener("focusin", enter);
      row.addEventListener("focusout", leave);

      cleanups.push(() => {
        row.removeEventListener("mouseenter", enter);
        row.removeEventListener("mouseleave", leave);
        row.removeEventListener("focusin", enter);
        row.removeEventListener("focusout", leave);
        tl.kill();
      });

      // row reveal — same inset/yPercent values as the reference
      const reveal = gsap.fromTo(
        row,
        { clipPath: "inset(0% 0% 100% 0%)", yPercent: 100 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          yPercent: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: row,
            start: "top-=100% bottom",
            end: "top-=100% bottom",
            toggleActions: "none play none reset",
          },
        },
      );

      cleanups.push(() => {
        reveal.scrollTrigger?.kill();
        reveal.kill();
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  const enter = (project: Project, index: number) => {
    if (window.matchMedia("(hover: none)").matches) return;
    setHovered({ project, index });
  };

  return (
    <section id="work" className="pt-[16svh] tab:pt-[22svh]">
      <div className="mb-[1.2em] flex px-[var(--grid-margin)] text-xxs tab:grid tab:grid-cols-[35fr_25fr_25fr_25fr_10fr] tab:items-center">
        <h2 className="text-xs">Selected work</h2>
        <div className="hidden text-muted tab:block">Awards</div>
        <div className="hidden text-muted tab:block">Recognition</div>
        <div className="hidden text-muted tab:block">Year</div>
        <div className="hidden tab:block" aria-hidden="true" />
      </div>

      <div>
        {projects.map((p, i) => (
          <article
            key={p.slug}
            data-work-index={i}
            className="work-row group"
            onMouseEnter={() => enter(p, i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex items-start gap-x-[1em] px-[var(--grid-margin)] py-[1.2em] tab:grid tab:grid-cols-[35fr_25fr_25fr_25fr_10fr] tab:items-center tab:gap-x-0 tab:py-[1em]">
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-[0.35em]">
                  <h3 className="display text-m tab:text-[var(--text-ml)] desktop:text-l">
                    <SplitTitle title={p.title} />
                  </h3>
                  <span className="shrink-0 text-xxs text-muted">
                    ./{p.year}
                  </span>
                </div>
                <div className="mt-[0.85em] flex flex-wrap gap-[0.35em]">
                  {p.tags.map((t) => (
                    <span className="pill" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="hidden text-xxs tab:block">
                {p.awards[0] || "—"}
              </div>
              <div className="hidden text-xxs tab:block">
                {p.awards[1] || "—"}
              </div>
              <div className="hidden text-xxs tab:block">{p.year}</div>

              <div className="ml-auto hidden items-center gap-[0.5em] text-xxs tab:ml-0 tab:flex">
                View
                <ArrowUpRight className="h-[0.85em] w-[0.85em]" />
              </div>

              <ArrowUpRight className="ml-2 h-[1em] w-[1em] shrink-0 self-center tab:hidden" />
            </div>

            <button
              type="button"
              className="absolute inset-0 z-10 cursor-pointer"
              onClick={() => {
                setHovered(null);
                setActive({ project: p, index: i });
              }}
              aria-label={`View ${p.title} project`}
              data-cursor="OPEN"
            />
          </article>
        ))}
      </div>

      <HoverPreview item={hovered} />

      {active && (
        <WorkDialog
          project={active.project}
          index={active.index}
          onClose={() => setActive(null)}
        />
      )}
    </section>
  );
}
