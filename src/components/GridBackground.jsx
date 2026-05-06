import React, { useRef, useEffect } from "react";
import "./GridBackground.css";

const GAP = 26;
const SIGMA = 200;
const WAVE_SPEED = 6;
const DIRECTIONS = ["ltr", "rtl", "ttb", "btt"];

export default function GridBackground({ className = "" }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const stateRef = useRef({ animId: null, wave: null, dirIndex: 0 });

  const classes = ["grid-background", className].filter(Boolean).join(" ");

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    const state = stateRef.current;

    const setSize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(container);

    const startPos = (dir, w, h) => {
      if (dir === "ltr") return -SIGMA * 3;
      if (dir === "rtl") return w + SIGMA * 3;
      if (dir === "ttb") return -SIGMA * 3;
      return h + SIGMA * 3;
    };

    const isDone = (dir, wave, w, h) => {
      if (dir === "ltr") return wave > w + SIGMA * 3;
      if (dir === "rtl") return wave < -SIGMA * 3;
      if (dir === "ttb") return wave > h + SIGMA * 3;
      return wave < -SIGMA * 3;
    };

    const frame = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (!w || !h) { state.animId = requestAnimationFrame(frame); return; }

      const dir = DIRECTIONS[state.dirIndex];

      if (state.wave === null) state.wave = startPos(dir, w, h);

      // advance wave
      if (dir === "ltr" || dir === "ttb") state.wave += WAVE_SPEED;
      else state.wave -= WAVE_SPEED;

      // when wave fully exits, move to next direction
      if (isDone(dir, state.wave, w, h)) {
        state.dirIndex = (state.dirIndex + 1) % DIRECTIONS.length;
        state.wave = null;
      }

      const wv = state.wave ?? startPos(DIRECTIONS[state.dirIndex], w, h);
      const g = (v) => Math.exp(-((v - wv) ** 2) / (2 * SIGMA * SIGMA));

      ctx.clearRect(0, 0, w, h);

      const isHoriz = dir === "ltr" || dir === "rtl";
      if (isHoriz) {
        // vertical lines glow individually as wave passes their x
        for (let x = 0; x <= w + GAP; x += GAP) {
          const b = g(x);
          ctx.strokeStyle = `rgba(255,255,255,${0.03 + b * 0.30})`;
          ctx.lineWidth = 0.8 + b * 0.8;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        // horizontal lines get a traveling bright band via gradient
        for (let y = 0; y <= h + GAP; y += GAP) {
          const grad = ctx.createLinearGradient(0, y, w, y);
          for (let i = 0; i <= 14; i++) {
            const px = (w * i) / 14;
            const b = g(px);
            grad.addColorStop(i / 14, `rgba(255,255,255,${0.03 + b * 0.30})`);
          }
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
      } else {
        // horizontal lines glow individually as wave passes their y
        for (let y = 0; y <= h + GAP; y += GAP) {
          const b = g(y);
          ctx.strokeStyle = `rgba(255,255,255,${0.03 + b * 0.30})`;
          ctx.lineWidth = 0.8 + b * 0.8;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
        // vertical lines get a traveling bright band via gradient
        for (let x = 0; x <= w + GAP; x += GAP) {
          const grad = ctx.createLinearGradient(x, 0, x, h);
          for (let i = 0; i <= 14; i++) {
            const py = (h * i) / 14;
            const b = g(py);
            grad.addColorStop(i / 14, `rgba(255,255,255,${0.03 + b * 0.30})`);
          }
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
      }


      state.animId = requestAnimationFrame(frame);
    };

    frame();

    return () => {
      cancelAnimationFrame(state.animId);
      ro.disconnect();
      state.wave = null;
    };
  }, []);

  return (
    <div ref={containerRef} className={classes} aria-hidden="true">
      <canvas ref={canvasRef} style={{ display: "block", position: "absolute", top: 0, left: 0 }} />
    </div>
  );
}
