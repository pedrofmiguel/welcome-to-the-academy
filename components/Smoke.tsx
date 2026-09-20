"use client";

import { useEffect, useRef } from "react";

/**
 * Blue lamp smoke.
 *
 * Drawn at a fraction of viewport size and CSS-blurred back up, so a
 * phone only ever composites a handful of cheap radial gradients per
 * frame. Honours prefers-reduced-motion by drawing a single still frame.
 */
export default function Smoke() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SCALE = 0.18;

    let w = 0;
    let h = 0;
    let raf = 0;
    let puffs: {
      x: number; y: number; r: number;
      vx: number; vy: number; ph: number; sp: number; col: string;
    }[] = [];

    const css = (n: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(n).trim();

    function size() {
      w = cv!.width = Math.max(2, Math.ceil(window.innerWidth * SCALE));
      h = cv!.height = Math.max(2, Math.ceil(window.innerHeight * SCALE));
    }

    function seed() {
      const cols = [css("--smoke-a"), css("--smoke-b"), css("--smoke-c")];
      puffs = Array.from({ length: 11 }, (_, i) => ({
        x: Math.random(),
        y: Math.random(),
        r: 0.28 + Math.random() * 0.42,
        vx: (Math.random() - 0.5) * 0.00016,
        vy: -0.00008 - Math.random() * 0.00016,
        ph: Math.random() * Math.PI * 2,
        sp: 0.0003 + Math.random() * 0.0005,
        col: cols[i % cols.length] || "#1C4E8A",
      }));
    }

    function draw(t: number) {
      ctx!.clearRect(0, 0, w, h);
      ctx!.globalCompositeOperation = "lighter";
      const d = Math.min(w, h);
      for (const p of puffs) {
        const x = (p.x + Math.sin(t * p.sp + p.ph) * 0.05) * w;
        const y = ((((p.y % 1) + 1) % 1)) * h;
        const r = p.r * d;
        const g = ctx!.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, p.col);
        g.addColorStop(1, "transparent");
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(x, y, r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalCompositeOperation = "source-over";
    }

    function tick(t: number) {
      for (const p of puffs) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -0.4) p.x = 1.4;
        if (p.x > 1.4) p.x = -0.4;
        if (p.y < -0.4) p.y = 1.4;
      }
      draw(t);
      raf = requestAnimationFrame(tick);
    }

    function start() {
      size();
      seed();
      cancelAnimationFrame(raf);
      if (reduce) draw(0);
      else raf = requestAnimationFrame(tick);
    }

    let rs: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(rs);
      rs = setTimeout(start, 200);
    };
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => setTimeout(start, 50);

    window.addEventListener("resize", onResize);
    scheme.addEventListener("change", onScheme);
    document.addEventListener("themechange", onScheme);
    start();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(rs);
      window.removeEventListener("resize", onResize);
      scheme.removeEventListener("change", onScheme);
      document.removeEventListener("themechange", onScheme);
    };
  }, []);

  return (
    <>
      <canvas ref={ref} className="smoke" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
    </>
  );
}
