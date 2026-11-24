"use client";

import { useEffect, useRef } from "react";
import { FogScene } from "./FogScene";

export default function WebGLStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let scene: FogScene | null = null;
    try {
      scene = new FogScene(canvas);
      scene.start();
    } catch {
      document.documentElement.classList.add("no-webgl");
    }

    return () => {
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
