import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./CubeShowcase.css";
import cubeImage1 from "../assets/gallery-1.webp";
import cubeImage2 from "../assets/gallery-2.webp";
import cubeImage3 from "../assets/service-travel.webp";
import cubeImage4 from "../assets/gallery-3.webp";

gsap.registerPlugin(ScrollTrigger);

const MEDIA_ITEMS = [
  {
    src: cubeImage1,
    label: "Fashion Shoot",
  },
  {
    src: cubeImage2,
    label: "Brand Film",
  },
  {
    src: cubeImage3,
    label: "Travel Edit",
  },
  {
    src: cubeImage4,
    label: "Cinematic Reel",
  },
];

const SEPARATE_TARGETS = [
  { xPercent: -128, yPercent: -76, rotation: -11 },
  { xPercent: 128, yPercent: -76, rotation: 11 },
  { xPercent: -128, yPercent: 76, rotation: -8 },
  { xPercent: 128, yPercent: 76, rotation: 9 },
];

export default function CubeShowcase() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        root: null,
        threshold: [0, 0.15, 0.35],
        rootMargin: "180px 0px",
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!sectionRef.current) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const cardMotions = gsap.utils.toArray(".stack-card-motion");
      const revealCopy =
        sectionRef.current?.querySelector(".stack-reveal-copy");

      if (!cardMotions.length || !revealCopy) {
        return;
      }

      gsap.set(cardMotions, {
        xPercent: 0,
        yPercent: 0,
        rotation: 0,
        scale: 0.98,
        transformOrigin: "50% 50%",
      });

      gsap.set(revealCopy, { y: 72, opacity: 0 });

      const separateTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "bottom 36%",
          scrub: 1.12,
          invalidateOnRefresh: true,
        },
      });

      cardMotions.forEach((cardMotion, index) => {
        const target = SEPARATE_TARGETS[index] || SEPARATE_TARGETS[0];

        separateTl.to(
          cardMotion,
          {
            xPercent: target.xPercent,
            yPercent: target.yPercent,
            rotation: target.rotation,
            scale: 1,
            duration: 1,
            ease: "power3.out",
          },
          0.08,
        );
      });

      separateTl.to(
        revealCopy,
        {
          y: 0,
          opacity: 1,
          duration: 0.48,
          ease: "power2.out",
        },
        0.38,
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`cube-section${isVisible ? " is-visible" : ""}`}
    >
      <div
        className="stack-stage"
        aria-label="Scroll animated stacked media showcase"
      >
        <div className="stack-stage-glow" />

        {MEDIA_ITEMS.map((item, index) => (
          <article
            key={item.label}
            className="stack-card"
            style={{ zIndex: MEDIA_ITEMS.length - index + 3 }}
          >
            <div className="stack-card-motion">
              <div
                className="stack-card-shell"
                style={{ "--card-delay": `${index * 140}ms` }}
              >
                <img
                  src={item.src}
                  alt={item.label}
                  className="stack-card-media"
                  loading="lazy"
                  decoding="async"
                />
                <div className="stack-card-overlay" />
                <span className="stack-card-label">{item.label}</span>
              </div>
            </div>
          </article>
        ))}

        <div className="stack-reveal-copy">
          <p>Capturing memories</p>
          <p>that evoke your story.</p>
        </div>
      </div>
    </section>
  );
}
