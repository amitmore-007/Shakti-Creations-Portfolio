import React, { useEffect, useRef } from "react";

export default function CustomCursor() {
  const targetPos = useRef({ x: 0, y: 0 });
  const smoothPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const idleTimerRef = useRef(null);

  useEffect(() => {
    const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!supportsFinePointer) return undefined;

    const root = document.documentElement;
    const body = document.body;
    const startX = window.innerWidth * 0.5;
    const startY = window.innerHeight * 0.5;

    targetPos.current = { x: startX, y: startY };
    smoothPos.current = { x: startX, y: startY };
    root.style.setProperty("--cursor-x", `${startX}px`);
    root.style.setProperty("--cursor-y", `${startY}px`);

    const onMove = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      body.classList.add("cursor-aura-active");

      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }

      idleTimerRef.current = window.setTimeout(() => {
        body.classList.remove("cursor-aura-active");
      }, 160);
    };

    const onLeave = () => {
      body.classList.remove("cursor-aura-active");
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const loop = () => {
      smoothPos.current.x = lerp(
        smoothPos.current.x,
        targetPos.current.x,
        0.18,
      );
      smoothPos.current.y = lerp(
        smoothPos.current.y,
        targetPos.current.y,
        0.18,
      );
      root.style.setProperty(
        "--cursor-x",
        `${smoothPos.current.x.toFixed(1)}px`,
      );
      root.style.setProperty(
        "--cursor-y",
        `${smoothPos.current.y.toFixed(1)}px`,
      );
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
      body.classList.remove("cursor-aura-active");

      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return <div className="cursor-aura" aria-hidden="true" />;
}
