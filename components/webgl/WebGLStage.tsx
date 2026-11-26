"use client";

import { useEffect, useRef } from "react";
import type { FogScene } from "./FogScene";

export default function WebGLStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let scene: FogScene | null = null;
    let cancelled = false;
    let timer = 0;
    let idleId = 0;

    // three.js is the heaviest dependency in the app. Load it once the main
    // thread is free so the headline paints and the preloader animates
    // without fighting it for the first few seconds.
    const boot = async () => {
      try {
        const { FogScene } = await import("./FogScene");
        if (cancelled) return;
        scene = new FogScene(canvas);
        scene.start();
      } catch {
        document.documentElement.classList.add("no-webgl");
      }
    };

    const ric = window.requestIdleCallback as
      | Window["requestIdleCallback"]
      | undefined;

    if (typeof ric === "function") {
      idleId = ric(boot, { timeout: 2000 });
    } else {
      timer = window.setTimeout(boot, 900);
    }

    return () => {
      cancelled = true;
      if (idleId) window.cancelIdleCallback(idleId);
      if (timer) window.clearTimeout(timer);
      scene?.dispose();
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
