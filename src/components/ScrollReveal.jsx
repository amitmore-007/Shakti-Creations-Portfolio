import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ScrollReveal.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollReveal wraps a section so it "rises" over the previous
 * section as the user scrolls — creating the stacked-panel effect
 * seen in the reference AirLens template.
 *
 * Usage:
 *   <ScrollReveal>
 *     <YourSection />
 *   </ScrollReveal>
 */
export default function ScrollReveal({
  children,
  className = "",
  insetTop = 6,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    // On desktop, clip from bottom and reveal upward on scroll
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const initialInsetTop = Math.max(0, Number(insetTop));

      if (initialInsetTop <= 0) {
        gsap.set(panel, { clipPath: "none" });
        return;
      }

      gsap.set(panel, {
        clipPath: `inset(${initialInsetTop}% 0% 0% 0% round ${initialInsetTop * 2.5}px ${initialInsetTop * 2.5}px 0 0)`,
      });

      const revealTrigger = ScrollTrigger.create({
        trigger: panel,
        start: "top 92%",
        end: "top 20%",
        scrub: 0.8,
        onUpdate: (self) => {
          const p = self.progress;
          const pct = initialInsetTop - p * initialInsetTop;
          panel.style.clipPath = `inset(${pct}% 0% 0% 0% round ${pct * 2.5}px ${pct * 2.5}px 0 0)`;
        },
      });

      return () => revealTrigger.kill();
    });

    return () => mm.revert();
  }, [insetTop]);

  return (
    <div ref={panelRef} className={`scroll-reveal-panel ${className}`}>
      {children}
    </div>
  );
}
