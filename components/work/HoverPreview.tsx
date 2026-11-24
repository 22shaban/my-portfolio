"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { clamp } from "@/lib/utils";
import { drawWorkTexture } from "@/lib/workTextures";
import type { Project } from "@/lib/content";
import { ArrowUpRight } from "@/components/ui/icons";

export type HoverItem = { project: Project; index: number } | null;

export default function HoverPreview({ item }: { item: HoverItem }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shownRef = useRef(false);
  const pointer = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const itemRef = useRef(item);
  const [label, setLabel] = useState<HoverItem>(null);

  itemRef.current = item;

  useEffect(() => {
    if (item) setLabel(item);
  }, [item]);

  const targetPos = () => {
    const outer = outerRef.current;
    const w = outer?.offsetWidth || 320;
    const h = outer?.offsetHeight || 250;
    const margin = 16;
    let x = pointer.current.x + 24;
    let y = pointer.current.y + 24;
    if (x + w > window.innerWidth - margin) x = pointer.current.x - w - 24;
    if (y + h > window.innerHeight - margin) y = pointer.current.y - h - 24;
    return {
      x: clamp(x, margin, Math.max(margin, window.innerWidth - w - margin)),
      y: clamp(y, margin, Math.max(margin, window.innerHeight - h - margin)),
    };
  };

  // lagging cursor follow, only while the card is visible
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    let raf = 0;
    let lastX = 0;
    let tilt = 0;

    const onMove = (e: PointerEvent) => {
      tilt = clamp((e.clientX - lastX) * 0.08, -5, 5);
      lastX = e.clientX;
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const outer = outerRef.current;
      const inner = innerRef.current;
      if (!outer || !inner || !shownRef.current) return;

      const t = targetPos();
      current.current.x += (t.x - current.current.x) * 0.16;
      current.current.y += (t.y - current.current.y) * 0.16;
      outer.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      tilt *= 0.92;
      inner.style.rotate = `${tilt.toFixed(2)}deg`;
    };

    loop();
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const inner = innerRef.current;
    const art = artRef.current;
    const canvas = canvasRef.current;
    if (!inner || !art || !canvas) return;

    if (!item) {
      if (!shownRef.current) return;
      shownRef.current = false;
      gsap.killTweensOf([inner, art]);
      gsap.to(inner, {
        autoAlpha: 0,
        scale: 0.95,
        duration: 0.26,
        ease: "power2.in",
        onComplete: () => gsap.set(art, { clipPath: "inset(0% 0% 0% 0%)" }),
      });
      return;
    }

    const project = item.project;
    const index = item.index;
    const draw = () => {
      if (itemRef.current?.project.slug === project.slug) {
        drawWorkTexture(canvas, project, index);
      }
    };
    draw();
    document.fonts?.ready.then(draw).catch(() => {});

    const t = targetPos();
    current.current = { ...t };
    if (outerRef.current) {
      outerRef.current.style.transform = `translate3d(${t.x}px, ${t.y}px, 0)`;
    }

    gsap.killTweensOf([inner, art]);
    const wasShown = shownRef.current;
    shownRef.current = true;

    if (!wasShown) {
      gsap.fromTo(
        inner,
        { autoAlpha: 0, scale: 0.88, y: 14 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.5, ease: "expo.out" },
      );
    } else {
      gsap.fromTo(
        art,
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "expo.out" },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  return (
    <div
      ref={outerRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[95] hidden w-[clamp(260px,23vw,340px)] will-change-transform tab:block"
    >
      <div
        ref={innerRef}
        className="relative border border-fg/25 bg-base shadow-[0_28px_70px_-30px_rgba(0,0,0,0.6)]"
        style={{ visibility: "hidden" }}
      >
        <div ref={artRef} className="relative aspect-[16/10] overflow-hidden">
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="block h-full w-full"
          />
        </div>
        <div className="flex items-center justify-between gap-[1em] border-t border-fg/20 px-[0.95em] py-[0.75em] text-xxs">
          <span className="truncate">{label?.project.title ?? ""}</span>
          <span className="flex shrink-0 items-center gap-[0.35em] text-muted">
            View
            <ArrowUpRight className="h-[0.8em] w-[0.8em]" />
          </span>
        </div>
      </div>
    </div>
  );
}
