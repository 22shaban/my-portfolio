"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { getLenis } from "@/components/providers/SmoothScroll";
import type { Project } from "@/lib/content";
import ProjectPlate from "./ProjectPlate";
import { ArrowUpRight, CloseIcon } from "@/components/ui/icons";

type Props = { project: Project; index: number; onClose: () => void };

export default function WorkDialog({ project, index, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const lenis = getLenis();
    lenis?.stop();
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.45, ease: "power2.out" },
      );
      gsap.fromTo(
        panelRef.current,
        { yPercent: 102 },
        { yPercent: 0, duration: 0.95, ease: "expo.out" },
      );
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      ctx.revert();
      lenis?.start();
      prev?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[150]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="work-dialog-title"
    >
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/50 backdrop-blur-[3px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        className="absolute inset-x-0 bottom-0 max-h-[92svh] overflow-y-auto overscroll-contain border-t border-fg bg-base"
      >
        <div className="mx-auto w-full max-w-[1400px] p-[var(--grid-margin)] pb-[3em]">
          <div className="mb-[2em] flex items-center justify-between">
            <span className="text-xxs text-muted">
              Selected work — {project.year}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="box-1 flex h-[2.4em] w-[2.4em] items-center justify-center transition-colors duration-300 hover:bg-fg hover:text-base"
              aria-label="Close project"
              data-cursor="CLOSE"
            >
              <CloseIcon className="h-[0.9em] w-[0.9em]" />
            </button>
          </div>

          <div className="grid gap-[2.4em] tab:grid-cols-12 tab:gap-[var(--grid-gutter)]">
            <div className="relative col-span-7 aspect-[16/10] w-full overflow-hidden border border-line bg-black">
              <ProjectPlate
                project={project}
                index={index}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute left-[1.2em] top-[1.2em] text-[10px] tracking-[0.04em] text-white/75">
                {project.year} / {project.tags[0]}
              </span>
            </div>

            <div className="col-span-5 flex flex-col justify-between">
              <div>
                <h2
                  id="work-dialog-title"
                  className="display text-m tab:text-[var(--text-ml)]"
                >
                  {project.title}
                </h2>
                <div className="mt-[1.2em] flex flex-wrap gap-[0.35em]">
                  {project.tags.map((t) => (
                    <span className="pill" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
                <p className="mt-[1.6em] max-w-[46ch] text-xxs leading-[1.6] normal-case">
                  {project.blurb}
                </p>
                <dl className="mt-[2em] grid grid-cols-2 gap-y-[0.8em] text-xxs">
                  <dt className="text-muted">Year</dt>
                  <dd>{project.year}</dd>
                  <dt className="text-muted">Recognition</dt>
                  <dd>{project.awards.filter(Boolean).join(" · ") || "—"}</dd>
                  <dt className="text-muted">Stack</dt>
                  <dd>{project.tags.join(" · ")}</dd>
                </dl>
              </div>

              <a
                href="#contact"
                onClick={onClose}
                className="mt-[2.4em] inline-flex w-max items-center gap-[0.6em] border border-fg px-[1.4em] py-[0.9em] text-xxs transition-colors duration-300 hover:bg-fg hover:text-base"
                data-cursor="SAY HI"
              >
                Start a similar project
                <ArrowUpRight className="h-[0.85em] w-[0.85em]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
