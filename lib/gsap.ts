"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, ScrambleTextPlugin);

  // same custom ease as the reference loader
  if (!CustomEase.get("custom-loader")) {
    CustomEase.create("custom-loader", "M0,0 C0.104,0.204 0.711,0.986 1,1");
  }

  gsap.defaults({ ease: "expo.out", duration: 1 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/**
 * Masked line reveal — identical to the reference's `mainTextIn` effect:
 * clip inset(-50% 0% 150% 0%) + yPercent 110 -> 0.
 */
export function mainTextIn(
  targets: gsap.TweenTarget,
  vars: { duration?: number; ease?: string; delay?: number } = {},
) {
  return gsap.fromTo(
    targets,
    { clipPath: "inset(-50% 0% 150% 0%)", yPercent: 110 },
    {
      duration: vars.duration ?? 1,
      ease: vars.ease ?? "none",
      delay: vars.delay ?? 0,
      yPercent: 0,
      clipPath: "inset(-50% 0% 0% 0%)",
    },
  );
}

/** Reference binary scramble character set. */
export const SCRAMBLE = "01 00 11";

export { gsap, ScrollTrigger, SplitText };
