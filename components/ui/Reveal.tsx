"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  start?: string;
};

export default function Reveal({
  children,
  className,
  y = 42,
  delay = 0,
  start = "top 88%",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // same masked-reveal language as the reference's mainTextIn
      gsap.fromTo(
        el,
        { clipPath: "inset(-50% 0% 150% 0%)", y },
        {
          clipPath: "inset(-50% 0% 0% 0%)",
          y: 0,
          duration: 1.5,
          ease: "expo.out",
          delay,
          scrollTrigger: {
            trigger: el,
            start,
            end: "top center",
            toggleActions: "none play none reset",
          },
        },
      );
    }, el);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [y, delay, start]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
