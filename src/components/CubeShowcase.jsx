import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./CubeShowcase.css";
import cubeVideo1 from "../assets/cube-video-1.mp4";
import cubeVideo2 from "../assets/cube-video-2.mp4";
import cubeImage1 from "../assets/gallery-1.webp";
import cubeImage2 from "../assets/service-travel.webp";

gsap.registerPlugin(ScrollTrigger);

const MEDIA_ITEMS = [
  {
    type: "image",
    src: cubeImage1,
    label: "Fashion Shoot",
  },
  {
    type: "video",
    src: cubeVideo1,
    label: "Brand Film",
  },
  {
    type: "image",
    src: cubeImage2,
    label: "Travel Edit",
  },
  {
    type: "video",
    src: cubeVideo2,
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
  const [mediaReady, setMediaReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;

    if (!("IntersectionObserver" in window)) {
      setMediaReady(true);
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setMediaReady(true);
          }

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
    const mediaEls = Array.from(
      sectionRef.current?.querySelectorAll("video.stack-card-media") || [],
    );

    if (!mediaEls.length) {
      return undefined;
    }

    if (isVisible) {
      mediaEls.forEach((videoEl) => {
        const playPromise = videoEl.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {});
        }
      });
    } else {
      mediaEls.forEach((videoEl) => videoEl.pause());
    }

    return undefined;
  }, [isVisible, mediaReady]);

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
                {item.type === "image" ? (
                  <img
                    src={item.src}
                    alt={item.label}
                    className="stack-card-media"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <video
                    className="stack-card-media"
                    autoPlay={mediaReady && isVisible}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  >
                    {mediaReady && <source src={item.src} type="video/mp4" />}
                  </video>
                )}
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
