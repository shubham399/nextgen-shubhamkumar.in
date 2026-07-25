"use client";

import { motion } from "framer-motion";

const shapes = [
  { type: "hexagon" as const, x: "8%", y: "15%", size: 48, rotate: 15, duration: 28, delay: 0 },
  { type: "cube" as const, x: "85%", y: "20%", size: 36, rotate: -20, duration: 34, delay: 2 },
  { type: "hexagon" as const, x: "75%", y: "70%", size: 28, rotate: 45, duration: 24, delay: 4 },
  { type: "cube" as const, x: "12%", y: "75%", size: 42, rotate: 30, duration: 30, delay: 1 },
  { type: "hexagon" as const, x: "50%", y: "10%", size: 32, rotate: -10, duration: 26, delay: 3 },
  { type: "cube" as const, x: "35%", y: "85%", size: 24, rotate: 60, duration: 32, delay: 5 },
];

function Hexagon({ size }: { size: number }) {
  const r = size / 2;
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${r + r * Math.cos(angle)},${r + r * Math.sin(angle)}`;
  }).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <polygon
        points={points}
        fill="none"
        stroke="rgba(0, 210, 255, 0.06)"
        strokeWidth="1"
      />
    </svg>
  );
}

function Cube({ size }: { size: number }) {
  const s = size * 0.4;
  const o = size * 0.2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g stroke="rgba(0, 210, 255, 0.06)" strokeWidth="1" fill="none">
        <rect x={o} y={o} width={s} height={s} />
        <rect x={o + s * 0.3} y={o - s * 0.3} width={s} height={s} />
        <line x1={o} y1={o} x2={o + s * 0.3} y2={o - s * 0.3} />
        <line x1={o + s} y1={o} x2={o + s + s * 0.3} y2={o - s * 0.3} />
        <line
          x1={o + s}
          y1={o + s}
          x2={o + s + s * 0.3}
          y2={o + s - s * 0.3}
        />
      </g>
    </svg>
  );
}

export default function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: shape.x, top: shape.y }}
          initial={{ opacity: 0, rotate: shape.rotate }}
          animate={{
            opacity: 1,
            rotate: [shape.rotate, shape.rotate + 360],
            y: [0, -15, 0, 10, 0],
          }}
          transition={{
            opacity: { duration: 1.5, delay: shape.delay * 0.3 },
            rotate: {
              duration: shape.duration,
              repeat: Infinity,
              ease: "linear",
            },
            y: {
              duration: shape.duration * 0.6,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          {shape.type === "hexagon" ? (
            <Hexagon size={shape.size} />
          ) : (
            <Cube size={shape.size} />
          )}
        </motion.div>
      ))}
    </div>
  );
}
