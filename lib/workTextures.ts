import type { Project } from "./content";

/** CSS-only preview used as the base layer of the dialog plate. */
export function projectGradient(p: Project) {
  return `radial-gradient(120% 90% at 20% 10%, hsl(${p.hue} 32% 42% / 0.55), transparent 60%),
    radial-gradient(90% 80% at 80% 90%, hsl(${p.hue + 40} 36% 38% / 0.5), transparent 65%),
    linear-gradient(140deg, hsl(${p.hue} 18% 10%), hsl(${p.hue + 60} 14% 16%))`;
}

/**
 * Draws a generated "art direction" plate into any canvas. No binary assets,
 * no third-party imagery — every project preview is drawn from its hue.
 */
export function drawWorkTexture(
  canvas: HTMLCanvasElement,
  p: Project,
  index: number,
) {
  const w = canvas.width;
  const h = canvas.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const base = ctx.createLinearGradient(0, 0, w, h);
  base.addColorStop(0, `hsl(${p.hue} 22% 8%)`);
  base.addColorStop(0.55, `hsl(${p.hue + 20} 26% 13%)`);
  base.addColorStop(1, `hsl(${p.hue + 55} 18% 9%)`);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  // soft light blooms
  const blooms = [
    { x: 0.2, y: 0.25, r: 0.62, h: p.hue + 10, a: 0.52 },
    { x: 0.84, y: 0.74, r: 0.66, h: p.hue + 50, a: 0.44 },
    { x: 0.56, y: 0.12, r: 0.4, h: p.hue - 25, a: 0.32 },
  ];
  for (const b of blooms) {
    const g = ctx.createRadialGradient(
      b.x * w,
      b.y * h,
      0,
      b.x * w,
      b.y * h,
      b.r * Math.max(w, h),
    );
    g.addColorStop(0, `hsl(${b.h} 58% 60% / ${b.a})`);
    g.addColorStop(1, `hsl(${b.h} 58% 40% / 0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  // editorial rules
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = Math.max(1, w / 1200);
  for (let i = 1; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(0, (h / 8) * i);
    ctx.lineTo(w, (h / 8) * i);
    ctx.stroke();
  }
  for (let i = 1; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo((w / 6) * i, 0);
    ctx.lineTo((w / 6) * i, h);
    ctx.stroke();
  }

  // concentric arcs
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  for (let i = 1; i <= 5; i++) {
    ctx.beginPath();
    ctx.arc(w * 0.76, h * 0.58, (i * 0.09 + 0.05) * w, 0, Math.PI * 2);
    ctx.stroke();
  }

  // oversized initial
  const letter = p.title.charAt(0).toUpperCase();
  ctx.font = `400 ${Math.round(h * 0.94)}px "Instrument Serif", Georgia, serif`;
  ctx.fillStyle = "rgba(255,255,255,0.075)";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(letter, -w * 0.015, h * 0.9);

  // index + year, mono
  ctx.font = `500 ${Math.round(h * 0.032)}px "Sometype Mono", ui-monospace, monospace`;
  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(
    `${String(index + 1).padStart(2, "0")} / ${p.year}`,
    w - w * 0.16,
    h - h * 0.05,
  );

  // grain
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 14;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

export function createWorkTexture(p: Project, index: number, w = 1200, h = 760) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  drawWorkTexture(canvas, p, index);
  return canvas;
}
