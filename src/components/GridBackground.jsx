import React, { useEffect, useRef } from "react";
import "./GridBackground.css";

export default function GridBackground({ className = "", direction = "left" }) {
  const gridRef = useRef(null);
  const directionClass = direction ? `grid-direction-${direction}` : "";
  const classes = ["grid-background", directionClass, className]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    const node = gridRef.current;
    if (!node) return undefined;

    const host = node.closest(".grid-host") || node.parentElement;
    if (!host) return undefined;

    let frameId = null;
    let lastX = 0;
    let lastY = 0;
    let isInside = false;

    const update = () => {
      frameId = null;
      node.style.setProperty("--grid-cursor-x", `${lastX}px`);
      node.style.setProperty("--grid-cursor-y", `${lastY}px`);
    };

    const handleLeave = () => {
      if (!isInside) return;
      isInside = false;
      node.style.setProperty("--grid-glow-opacity", "0");
    };

    const handleMove = (clientX, clientY, pointerType) => {
      if (pointerType && pointerType !== "mouse") return;
      const rect = host.getBoundingClientRect();
      const inside =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

      if (!inside) {
        handleLeave();
        return;
      }

      isInside = true;
      const gridRect = node.getBoundingClientRect();
      const nextX = clientX - gridRect.left;
      const nextY = clientY - gridRect.top;
      lastX = Math.min(Math.max(nextX, 0), gridRect.width);
      lastY = Math.min(Math.max(nextY, 0), gridRect.height);
      node.style.setProperty("--grid-glow-opacity", "1");
      if (frameId === null) {
        frameId = window.requestAnimationFrame(update);
      }
    };

    const handlePointerMove = (event) =>
      handleMove(event.clientX, event.clientY, event.pointerType);
    const handleMouseMove = (event) => handleMove(event.clientX, event.clientY);

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("blur", handleLeave);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("blur", handleLeave);
    };
  }, []);

  return <div ref={gridRef} className={classes} aria-hidden="true" />;
}
