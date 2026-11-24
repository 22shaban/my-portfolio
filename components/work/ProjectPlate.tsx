"use client";

import { useEffect, useRef } from "react";
import type { Project } from "@/lib/content";
import { drawWorkTexture } from "@/lib/workTextures";
import { cn } from "@/lib/utils";

type Props = {
  project: Project;
  index: number;
  className?: string;
};

export default function ProjectPlate({ project, index, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    let alive = true;
    const draw = () => {
      if (alive) drawWorkTexture(canvas, project, index);
    };
    draw();
    document.fonts?.ready.then(draw).catch(() => {});

    return () => {
      alive = false;
    };
  }, [project, index]);

  return (
    <canvas
      ref={ref}
      width={1200}
      height={760}
      aria-hidden="true"
      className={cn("block h-full w-full", className)}
    />
  );
}
