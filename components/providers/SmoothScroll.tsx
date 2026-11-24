"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { hoverStore } from "@/lib/store";

let lenisInstance: Lenis | null = null;

export const getLenis = () => lenisInstance;

export function scrollToTop() {
  if (lenisInstance) lenisInstance.scrollTo(0, { duration: 1.4 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // exact reference setup: only smoothWheel is configured
    const lenis = new Lenis({ smoothWheel: true });
    lenisInstance = lenis;

    lenis.on("scroll", (e: { scroll: number; velocity: number }) => {
      hoverStore.scroll = e.scroll;
      hoverStore.scrollVelocity = e.velocity;
      ScrollTrigger.update();
    });

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return null;
}
