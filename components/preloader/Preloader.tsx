"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Binary preloader — timeline values copied from the reference:
 * 4 counter steps (10 / 35 / 70 / 100) on the custom-loader ease, a 2s
 * background fade, a 1s expo.out clip wipe, then binary scramble-in.
 */
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const clusterRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const barCtnRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const smallRef = useRef<(HTMLDivElement | null)[]>([]);
  const bitsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const cluster = clusterRef.current;
    const bar = barRef.current;
    const barCtn = barCtnRef.current;
    const indicator = indicatorRef.current;
    if (!root || !cluster || !bar || !barCtn || !indicator) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      try {
        sessionStorage.setItem("preloaded", "1");
      } catch {}
      document.documentElement.dataset.ready = "1";
      window.setTimeout(() => {
        window.dispatchEvent(new Event("app:ready"));
      }, 0);
      setHidden(true);
    };

    let preloaded = false;
    try {
      preloaded = sessionStorage.getItem("preloaded") === "1";
    } catch {}

    if (preloaded || reduced) {
      if (pctRef.current) pctRef.current.textContent = "100";
      bar.style.transform = "scaleX(1)";
      indicator.style.transform = "translateX(100%)";
      gsap.to(root, {
        opacity: 0,
        duration: reduced ? 0.05 : 0.35,
        delay: 0.1,
        onComplete: finish,
      });
      return;
    }

    const counter = { v: 0 };
    const render = () => {
      const v = Math.round(counter.v);
      if (pctRef.current) pctRef.current.textContent = String(v);
    };

    const tl = gsap.timeline({ paused: true });
    const steps = [
      { v: 10, d: 0.75 },
      { v: 35, d: 0.6 },
      { v: 70, d: 1 },
      { v: 100, d: 0.9 },
    ];

    steps.forEach((step) => {
      tl.to(counter, {
        v: step.v,
        duration: step.d,
        ease: "custom-loader",
        modifiers: { v: (value: number) => Math.round(value) },
        onUpdate: render,
      })
        .to(bar, { scaleX: step.v / 100, duration: step.d, ease: "custom-loader" }, "<")
        .to(
          indicator,
          {
            xPercent: -step.v,
            x: barCtn.clientWidth * (step.v / 100),
            duration: step.d,
            ease: "custom-loader",
          },
          "<",
        );
    });

    tl.to(root, { backgroundColor: "rgba(0,0,0,0)", duration: 2 }, 0)
      .fromTo(
        barCtn,
        { yPercent: 0, clipPath: "inset(0% 0% 0% 0%)" },
        {
          yPercent: -100,
          clipPath: "inset(100% 0% 0% 0%)",
          delay: 0.2,
          ease: "expo.out",
          duration: 1,
        },
      )
      .fromTo(
        cluster,
        { yPercent: 0, clipPath: "inset(0% 0% 0% 0%)" },
        {
          yPercent: -100,
          clipPath: "inset(100% 0% 0% 0%)",
          ease: "expo.out",
          duration: 0.3,
        },
        "<+=0.2",
      );

    const n = tl.duration() - 0.5;

    smallRef.current.forEach((el, i) => {
      if (!el) return;
      tl.set(el, { opacity: 1 }, i * 0.2).from(
        el,
        {
          scrambleText: {
            text: "",
            chars: "01 0 1",
            speed: 0.3,
            revealDelay: n * 0.6,
          },
          duration: n * 0.6,
          ease: "expo.out",
        },
        ">",
      );
    });

    tl.addLabel("end");

    bitsRef.current.forEach((el) => {
      if (!el) return;
      gsap.set(el, {
        width: el.clientWidth,
        height: el.clientHeight,
        opacity: 1,
      });
      tl.from(
        el,
        {
          scrambleText: {
            text: "",
            chars: "01 0 1",
            speed: 0.3,
            revealDelay: n,
          },
          duration: n,
          stagger: 0.1,
          ease: "power1.out",
        },
        0,
      );
    });

    const scrub = tl.tweenTo("end", {
      ease: "none",
      paused: true,
      onComplete: finish,
    });
    scrub.play();

    return () => {
      scrub.kill();
      tl.kill();
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-black px-[var(--grid-margin)] pb-[13.77svh] text-white"
      role="status"
      aria-label="Loading"
    >
      <div
        ref={clusterRef}
        className="relative flex items-end justify-center text-loader-s uppercase"
        aria-hidden="true"
      >
        <div
          ref={(el) => {
            smallRef.current[0] = el;
          }}
          className="absolute bottom-full mb-[1em] opacity-0"
        >
          Hello Guys
        </div>

        <span className="display block text-loader-l leading-[0.85]">Loading</span>

        <div className="absolute right-full top-[0.3em] w-max translate-x-[0.5em] text-right opacity-[0.7]">
          <div
            ref={(el) => {
              smallRef.current[1] = el;
            }}
            className="mr-[1em] opacity-0"
          >
            Welcome Here
          </div>
          <div
            ref={(el) => {
              smallRef.current[2] = el;
            }}
            className="opacity-0"
          >
            Bonjour/
          </div>
        </div>

        <div className="absolute left-full top-0 w-max -translate-x-[1.78em] opacity-[0.7]">
          <div
            ref={(el) => {
              bitsRef.current[0] = el;
            }}
            className="min-w-max opacity-0"
          >
            111001101 010
          </div>
          <div
            ref={(el) => {
              smallRef.current[3] = el;
            }}
            className="ml-[3.18em] opacity-0"
          >
            Nice to meet U
          </div>
          <div
            ref={(el) => {
              bitsRef.current[1] = el;
            }}
            className="ml-[2.45em] min-w-max opacity-0"
          >
            0110 1
          </div>
        </div>

        <div className="opacity-[0.7]">
          <div
            ref={(el) => {
              bitsRef.current[2] = el;
            }}
            className="absolute right-full top-full mt-[0.5em] min-w-max opacity-0"
          >
            0110
          </div>
          <div
            ref={(el) => {
              smallRef.current[4] = el;
            }}
            className="absolute right-[1.27em] top-full mt-[0.5em] opacity-0"
          >
            &lt;HI/&gt;
          </div>
        </div>
      </div>

      <div className="absolute inset-x-[var(--grid-margin)] bottom-[calc(10px+env(safe-area-inset-bottom))] text-xxs">
        <div ref={indicatorRef} className="w-max pb-[0.6em]">
          <span ref={pctRef}>0</span>%
        </div>
        <div ref={barCtnRef} className="border">
          <div
            ref={barRef}
            className="relative h-[0.4em] w-full origin-left scale-x-0 bg-white"
          />
        </div>
      </div>
    </div>
  );
}
