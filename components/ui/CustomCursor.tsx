"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const activeRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) {
      if (ringRef.current) ringRef.current.style.display = "none";
      if (dotRef.current) dotRef.current.style.display = "none";
      return;
    }
    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!ring || !dot || !label) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { x: pos.x, y: pos.y };

    const xTo = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const setActive = (value: boolean, text = "") => {
      if (activeRef.current === value && label.textContent === text) return;
      activeRef.current = value;
      label.textContent = text;
      gsap.to(ring, {
        width: value ? 58 : 34,
        height: value ? 58 : 34,
        opacity: value ? 1 : 0.5,
        duration: 0.35,
        ease: "power3.out",
      });
      gsap.to(label, { opacity: value ? 1 : 0, duration: 0.25 });
    };

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest?.("[data-cursor]");
      if (el) setActive(true, el.getAttribute("data-cursor") || "");
      else setActive(false);
    };

    const onLeave = () => setActive(false);

    let raf = 0;
    const loop = () => {
      pos.x += (target.x - pos.x) * 0.16;
      pos.y += (target.y - pos.y) * 0.16;
      ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="cursor-dot flex h-[34px] w-[34px] items-center justify-center rounded-full border border-white opacity-50"
        aria-hidden="true"
      >
        <span
          ref={labelRef}
          className="text-[8px] tracking-[0.08em] text-white opacity-0"
          style={{ fontFamily: "var(--font-mono)" }}
        />
      </div>
      <div
        ref={dotRef}
        className="cursor-dot h-[5px] w-[5px] rounded-full bg-white"
        style={{ margin: "-2.5px 0 0 -2.5px" }}
        aria-hidden="true"
      />
    </>
  );
}
