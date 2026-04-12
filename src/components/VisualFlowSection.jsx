import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./VisualFlowSection.css";
import frame1 from "../assets/gallery-1.webp";
import frame2 from "../assets/gallery-2.webp";
import frame3 from "../assets/gallery-3.webp";
import frame4 from "../assets/gallery-4.webp";
import frame5 from "../assets/gallery-5.webp";
import frame6 from "../assets/gallery-6.webp";

gsap.registerPlugin(ScrollTrigger);

const FRAMES = [
  { src: frame1, alt: "Fashion editorial frame" },
  { src: frame2, alt: "Portrait frame" },
  { src: frame3, alt: "Campaign frame" },
  { src: frame4, alt: "Travel frame" },
  { src: frame5, alt: "Street frame" },
  { src: frame6, alt: "Brand frame" },
];

const getLayout = () => {
  const mobile = window.matchMedia(
    "(max-width: 900px), (pointer: coarse)",
  ).matches;

  const sideTile = mobile
    ? Math.min(window.innerWidth * 0.29, 146)
    : Math.min(window.innerWidth * 0.15, 230);
  const edgePad = mobile ? 14 : 30;
  const maxCornerX = Math.max(
    72,
    window.innerWidth / 2 - sideTile / 2 - edgePad,
  );
  const maxMidX = Math.max(52, maxCornerX - (mobile ? 24 : 68));

  const xMid = Math.min(window.innerWidth * (mobile ? 0.3 : 0.27), maxMidX);
  const xCorner = Math.min(
    window.innerWidth * (mobile ? 0.4 : 0.37),
    maxCornerX,
  );
  const yRow = window.innerHeight * (mobile ? 0.22 : 0.2);
  const yCenter = window.innerHeight * (mobile ? 0.12 : 0.11);
  const yBetween = -window.innerHeight * (mobile ? 0.11 : 0.15);
  const yCorner = -window.innerHeight * (mobile ? 0.2 : 0.25);

  return [
    { x: -xMid, y: yRow, r: 0 },
    { x: 0, y: yCenter, r: 0 },
    { x: xMid, y: yRow, r: 0 },
    { x: 0, y: yBetween, r: 0 },
    { x: -xCorner, y: yCorner, r: 0 },
    { x: xCorner, y: yCorner, r: 0 },
  ];
};

export default function VisualFlowSection() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const cardsRef = useRef([]);

  useLayoutEffect(() => {
    if (!sectionRef.current) return undefined;

    let layout = getLayout();

    const applyStartState = () => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const target = layout[i];

        gsap.set(card, {
          x: target.x,
          y: window.innerHeight * 0.94,
          rotation: 0,
          opacity: 0,
          scale: 0.9,
          zIndex: i === 1 ? 14 : 8 + i,
          force3D: true,
        });
      });

      gsap.set(textRef.current, {
        opacity: 1,
        scale: 1,
      });
    };

    applyStartState();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=150%",
          scrub: 0.9,
          pin: true,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      const reveal = (idx, at) => {
        tl.to(
          cardsRef.current[idx],
          {
            x: () => layout[idx].x,
            y: () => layout[idx].y,
            rotation: 0,
            opacity: 1,
            scale: 1,
            force3D: true,
            duration: 0.52,
          },
          at,
        );
      };

      // First 3 tiles
      reveal(0, 0.08);
      reveal(1, 0.16);
      reveal(2, 0.24);

      // Then one in-between
      reveal(3, 0.48);

      // Then two at the corners
      reveal(4, 0.72);
      reveal(5, 0.8);

      tl.to(
        textRef.current,
        {
          opacity: 0.8,
          duration: 0.4,
          ease: "sine.out",
        },
        0.86,
      );
    }, sectionRef);

    let resizeTimer;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        layout = getLayout();
        applyStartState();
        ScrollTrigger.refresh();
      }, 120);
    };

    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="visual-flow" id="visual-flow">
      <div className="visual-flow-sticky">
        <span className="visual-flow-label">Signature Frames</span>

        <p ref={textRef} className="visual-flow-text">
          I capture images that blend imagination and emotion for standout
          visuals.
        </p>

        <div className="visual-flow-stage" aria-hidden="true">
          {FRAMES.map((item, i) => (
            <figure
              key={item.src}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className={`visual-flow-card card-${i + 1}`}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
