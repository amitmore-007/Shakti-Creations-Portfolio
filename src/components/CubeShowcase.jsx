import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./CubeShowcase.css";
import cubeVideo1 from "../assets/cube-video-1.mp4";
import cubeVideo2 from "../assets/cube-video-2.mp4";
import cubeImage1 from "../assets/gallery-1.webp";
import cubeImage2 from "../assets/service-travel.webp";

gsap.registerPlugin(ScrollTrigger);

// Uses local videos and available still-image fallbacks for cube faces.

const getCubeTransform = (y) =>
  `scaleX(var(--cube-scale-x)) rotateX(-8deg) rotateY(${y}deg)`;

const FACES = [
  {
    type: "image",
    src: cubeImage1,
    label: "Fashion Shoot",
    transform: "rotateY(0deg) translateZ(var(--cube-half))",
  },
  {
    type: "video",
    src: cubeVideo1,
    label: "Brand Film",
    transform: "rotateY(90deg) translateZ(var(--cube-half))",
  },
  {
    type: "image",
    src: cubeImage2,
    label: "Travel Edit",
    transform: "rotateY(180deg) translateZ(var(--cube-half))",
  },
  {
    type: "video",
    src: cubeVideo2,
    label: "Cinematic Reel",
    transform: "rotateY(270deg) translateZ(var(--cube-half))",
  },
];

export default function CubeShowcase() {
  const sectionRef = useRef(null);
  const cubeRef = useRef(null);
  const sceneRef = useRef(null);
  const rotationRef = useRef({ y: 0 });
  const tlRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);
  const dragStartRef = useRef(0);
  const dragRotationRef = useRef(0);
  const headingRef = useRef(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;

    if (!("IntersectionObserver" in window)) {
      setMediaReady(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setMediaReady(true);
          observer.disconnect();
        });
      },
      {
        root: null,
        threshold: 0.01,
        rootMargin: "320px 0px",
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let visibilityTrigger;

    const ctx = gsap.context(() => {
      const mediaEls = Array.from(
        sectionRef.current?.querySelectorAll("video.cube-media") || [],
      );

      const playMedia = () => {
        mediaEls.forEach((videoEl) => {
          const playPromise = videoEl.play();
          if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {});
          }
        });
      };

      const pauseMedia = () => {
        mediaEls.forEach((videoEl) => videoEl.pause());
      };

      const setCubeActive = (active) => {
        if (active) {
          tlRef.current?.resume();
          playMedia();
        } else {
          tlRef.current?.pause();
          pauseMedia();
        }
      };

      // Auto-rotate
      tlRef.current = gsap.to(rotationRef.current, {
        y: -360,
        duration: 20,
        ease: "none",
        repeat: -1,
        onUpdate: () => {
          if (!isDragging && cubeRef.current) {
            cubeRef.current.style.transform = getCubeTransform(
              rotationRef.current.y,
            );
          }
        },
      });

      visibilityTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 92%",
        end: "bottom 40%",
        onEnter: () => setCubeActive(true),
        onEnterBack: () => setCubeActive(true),
        onLeave: () => setCubeActive(false),
        onLeaveBack: () => setCubeActive(false),
      });

      setCubeActive(ScrollTrigger.isInViewport(sectionRef.current, 0.25));

      // Section reveal
      gsap.fromTo(
        headingRef.current?.querySelectorAll("[data-text-fx]") || [],
        { y: 36, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        },
      );

      gsap.fromTo(
        sceneRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        },
      );
    }, sectionRef);

    return () => {
      visibilityTrigger?.kill();
      ctx.revert();
    };
  }, []);

  // Drag to rotate
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = e.clientX;
    dragRotationRef.current = rotationRef.current.y;
    tlRef.current?.pause();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const delta = (e.clientX - dragStartRef.current) * 0.5;
    const newY = dragRotationRef.current - delta;
    rotationRef.current.y = newY;
    if (cubeRef.current) {
      cubeRef.current.style.transform = getCubeTransform(newY);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    // Resume auto-rotate from current position
    gsap.killTweensOf(rotationRef.current);
    tlRef.current = gsap.to(rotationRef.current, {
      y: rotationRef.current.y - 360,
      duration: 20,
      ease: "none",
      repeat: -1,
      onUpdate: () => {
        if (cubeRef.current) {
          cubeRef.current.style.transform = getCubeTransform(
            rotationRef.current.y,
          );
        }
      },
    });
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    dragStartRef.current = e.touches[0].clientX;
    dragRotationRef.current = rotationRef.current.y;
    tlRef.current?.pause();
  };
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const delta = (e.touches[0].clientX - dragStartRef.current) * 0.5;
    const newY = dragRotationRef.current - delta;
    rotationRef.current.y = newY;
    if (cubeRef.current) {
      cubeRef.current.style.transform = getCubeTransform(newY);
    }
  };

  return (
    <section ref={sectionRef} className="cube-section">
      <div className="cube-section-header" ref={headingRef}>
        <span className="section-label" data-text-fx>
          Showcase
        </span>
        <h2 className="cube-heading" data-text-fx>
          Work in <em>motion</em>
        </h2>
        <p className="cube-sub" data-text-fx>
          Drag to explore · Auto-rotating showcase
        </p>
      </div>

      <div
        className="cube-scene-wrap"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <div className="cube-scene" ref={sceneRef}>
          <div
            className="cube"
            ref={cubeRef}
            style={{ transform: getCubeTransform(0) }}
          >
            {FACES.map((face, i) => (
              <div
                key={i}
                className="cube-face"
                style={{ transform: face.transform }}
              >
                {face.type === "image" ? (
                  <img
                    src={face.src}
                    alt={face.label}
                    className="cube-media"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <video
                    className="cube-media"
                    autoPlay={mediaReady}
                    muted
                    loop
                    playsInline
                    preload="none"
                  >
                    {mediaReady && <source src={face.src} type="video/mp4" />}
                  </video>
                )}
                <div className="cube-face-overlay" />
                <span className="cube-face-label">{face.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reflective floor */}
        <div className="cube-floor" />

        {/* Ambient glow */}
        <div className="cube-glow" />
      </div>

      <div className="cube-indicators">
        {FACES.map((face, i) => (
          <div key={i} className="cube-indicator">
            <span className="cube-indicator-type">
              {face.type === "video" ? "▶" : "◼"}
            </span>
            <span className="cube-indicator-label">{face.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
