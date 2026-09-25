"use client";

import { useEffect, useRef, useCallback } from "react";

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
}

function createOrb(width: number, height: number, i: number): Orb {
  const angle = (i / 5) * Math.PI * 2;
  return {
    x: width * 0.5 + Math.cos(angle) * width * 0.25,
    y: height * 0.4 + Math.sin(angle) * height * 0.2,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.1,
    radius: 200 + Math.random() * 250,
    hue: 168 + Math.random() * 18,
    saturation: 70 + Math.random() * 20,
    lightness: 50 + Math.random() * 15,
    alpha: 0.03 + Math.random() * 0.025,
  };
}

function drawOrbs(ctx: CanvasRenderingContext2D, orbs: Orb[]) {
  for (const orb of orbs) {
    const gradient = ctx.createRadialGradient(
      orb.x,
      orb.y,
      0,
      orb.x,
      orb.y,
      orb.radius
    );
    gradient.addColorStop(
      0,
      `hsla(${orb.hue}, ${orb.saturation}%, ${orb.lightness}%, ${orb.alpha})`
    );
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.fillRect(
      orb.x - orb.radius,
      orb.y - orb.radius,
      orb.radius * 2,
      orb.radius * 2
    );
  }
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  offset: number
) {
  const spacing = 60;
  const lineAlpha = 0.035;

  ctx.strokeStyle = `rgba(85, 198, 209, ${lineAlpha})`;
  ctx.lineWidth = 0.5;

  const yOff = offset % spacing;
  for (let y = yOff; y < h; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  const xOff = offset % spacing;
  for (let x = xOff; x < w; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  pulse: number;
  pulseSpeed: number;
}

function createParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.2,
    vy: -0.1 - Math.random() * 0.15,
    size: 1 + Math.random() * 1.5,
    alpha: 0.1 + Math.random() * 0.15,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.005 + Math.random() * 0.01,
  };
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  w: number,
  h: number
) {
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.pulse += p.pulseSpeed;

    if (p.y < -10) {
      p.y = h + 10;
      p.x = Math.random() * w;
    }
    if (p.x < -10) p.x = w + 10;
    if (p.x > w + 10) p.x = -10;

    const currentAlpha = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse));
    ctx.fillStyle = `rgba(241, 179, 92, ${currentAlpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbsRef = useRef<Orb[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  const init = useCallback(
    (w: number, h: number) => {
      orbsRef.current = [];
      for (let i = 0; i < 5; i++) {
        orbsRef.current.push(createOrb(w, h, i));
      }

      particlesRef.current = [];
      for (let i = 0; i < 40; i++) {
        particlesRef.current.push(createParticle(w, h));
      }
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let w = window.innerWidth;
    let h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let frame = 0;
    let running = false;
    let t = 0;

    const resizeCanvas = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      init(w, h);
    };

    const renderStatic = () => {
      ctx.clearRect(0, 0, w, h);
      drawOrbs(ctx, orbsRef.current);
      drawGrid(ctx, w, h, 0);
      drawParticles(ctx, particlesRef.current, w, h);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      running = false;
    };

    const animate = () => {
      if (motionQuery.matches) {
        stop();
        renderStatic();
        return;
      }

      t += 1;
      ctx.clearRect(0, 0, w, h);

      for (const orb of orbsRef.current) {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -orb.radius) orb.x = w + orb.radius;
        if (orb.x > w + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = h + orb.radius;
        if (orb.y > h + orb.radius) orb.y = -orb.radius;
      }

      drawOrbs(ctx, orbsRef.current);
      drawGrid(ctx, w, h, t * 0.3);
      drawParticles(ctx, particlesRef.current, w, h);
      frame = requestAnimationFrame(animate);
    };

    const start = () => {
      if (motionQuery.matches) {
        stop();
        renderStatic();
        return;
      }

      if (!running) {
        running = true;
        frame = requestAnimationFrame(animate);
      }
    };

    const handleMotionChange = () => {
      if (motionQuery.matches) {
        stop();
        renderStatic();
      } else {
        start();
      }
    };

    const resize = () => {
      resizeCanvas();
      if (motionQuery.matches) renderStatic();
    };

    resizeCanvas();
    window.addEventListener("resize", resize);
    motionQuery.addEventListener("change", handleMotionChange);
    start();

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
