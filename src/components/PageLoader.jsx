import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function PageLoader({ onComplete }) {
  const loaderRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".loader-mark-wrap",
        { scale: 0.82, opacity: 0, rotate: -8 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.8, ease: "power3.out" },
      );

      gsap.fromTo(
        ".loader-title-block",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 0.1, ease: "power3.out" },
      );

      gsap.fromTo(
        ".loader-progress",
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: "power2.out" },
      );

      gsap.to(".loader-ring-outer", {
        rotate: 360,
        duration: 7.5,
        ease: "none",
        repeat: -1,
      });

      gsap.to(".loader-ring-inner", {
        rotate: -360,
        duration: 5.8,
        ease: "none",
        repeat: -1,
      });

      gsap.to(".loader-mark-core", {
        scale: 1.05,
        duration: 1.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, loaderRef);

    let p = 0;
    // Simulate loading progress
    const interval = setInterval(() => {
      p += Math.random() * 18 + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        // Exit animation
        setTimeout(() => {
          gsap.to(".loader-ring-outer, .loader-ring-inner, .loader-mark-core", {
            opacity: 0,
            duration: 0.35,
            ease: "power2.out",
          });

          gsap.to(".loader-title-block, .loader-progress, .loader-bar-wrap", {
            opacity: 0,
            y: -10,
            duration: 0.4,
            ease: "power2.out",
          });

          gsap.to(loaderRef.current, {
            yPercent: -100,
            duration: 1,
            delay: 0.12,
            ease: "power4.inOut",
            onComplete,
          });
        }, 300);
      }
      setProgress(Math.min(Math.round(p), 100));
    }, 80);

    return () => {
      clearInterval(interval);
      ctx.revert();
    };
  }, [onComplete]);

  return (
    <div ref={loaderRef} className="page-loader">
      <div className="loader-bg-glow" aria-hidden="true" />

      <div className="loader-mark-wrap" aria-hidden="true">
        <div className="loader-mark-ring loader-ring-outer" />
        <div className="loader-mark-ring loader-ring-inner" />
        <div className="loader-mark-core">
          <span className="loader-initials">SC</span>
        </div>
      </div>

      <div className="loader-title-block">
        <div className="loader-text">Shakti Creations</div>
        <p className="loader-sub">Cinematic Stories In Motion</p>
      </div>

      <div
        className="loader-bar-wrap"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={progress}
      >
        <div className="loader-bar" style={{ width: `${progress}%` }} />
      </div>

      <span className="loader-progress">{progress}%</span>
    </div>
  );
}
