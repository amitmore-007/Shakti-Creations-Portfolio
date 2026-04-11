import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Hero.css";
import heroVideo from "../assets/hero-video.mp4";

gsap.registerPlugin(ScrollTrigger);

// ASSET: src/assets/hero-video.mp4  — full screen background reel (~15-30s loop)

export default function Hero() {
  const heroRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const scrollLineRef = useRef(null);
  const charsRef = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states before first paint to avoid text flash on refresh.
      gsap.set(charsRef.current, { y: "100%", opacity: 0 });
      gsap.set(subRef.current, { y: 30, opacity: 0 });
      gsap.set(heroRef.current.querySelectorAll("[data-hero-text]"), {
        y: 24,
        opacity: 0,
        filter: "blur(8px)",
      });
      gsap.set(scrollLineRef.current, {
        scaleY: 0,
        transformOrigin: "top center",
      });

      // Initial load animation
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(
        videoRef.current,
        { scale: 1.15, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.6, ease: "power3.out" },
      )
        .fromTo(
          charsRef.current,
          { y: "100%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            stagger: 0.04,
            duration: 0.9,
            ease: "power4.out",
          },
          "-=0.8",
        )
        .fromTo(
          subRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.4",
        )
        .fromTo(
          heroRef.current.querySelectorAll("[data-hero-text]"),
          { y: 24, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            stagger: 0.1,
            duration: 0.75,
            ease: "power3.out",
          },
          "-=0.5",
        )
        .fromTo(
          scrollLineRef.current,
          { scaleY: 0, transformOrigin: "top center" },
          { scaleY: 1, duration: 1, ease: "power3.inOut" },
          "-=0.4",
        );

      // Parallax on scroll
      gsap.to(videoRef.current, {
        yPercent: 25,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(overlayRef.current, {
        opacity: 0.85,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "60% top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const words = ["CONTENT", "VIDEOGRAPHER"];
  charsRef.current = [];

  return (
    <section ref={heroRef} className="hero" id="home">
      {/* Background Video — replace src with your hero reel */}
      <video
        ref={videoRef}
        className="hero-video"
        src={heroVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />

      {/* Gradient overlays */}
      <div ref={overlayRef} className="hero-overlay" />
      <div className="hero-overlay-bottom" />
      <div className="hero-overlay-sides" />

      {/* Content */}
      <div className="hero-content">
        <div className="hero-label-wrap" data-hero-text>
          <span className="section-label">
            Content Creator · Videographer · Editor
          </span>
          <span className="hero-label-line" />
        </div>

        <h1 ref={headingRef} className="hero-heading">
          {words.map((word, wi) => (
            <div key={wi} className="hero-word-row">
              {word.split("").map((char, ci) => (
                <span
                  key={ci}
                  className="hero-char clip-text"
                  ref={(el) => {
                    if (el) charsRef.current.push(el);
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
          ))}
        </h1>

        <p ref={subRef} className="hero-sub">
          I create scroll-stopping stories for brands and creators. <br />
          <em>From YouTube episodes to high-converting reels.</em>
        </p>

        <div className="hero-ctas" data-hero-text>
          <a href="#work" className="hero-btn-primary">
            <span>View Showreel</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8H13M13 8L8 3M13 8L8 13"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
          </a>
          <a href="#contact" className="hero-btn-ghost">
            Get In Touch
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-indicator">
        <span ref={scrollLineRef} className="scroll-line" />
        <span className="scroll-text">SCROLL</span>
      </div>

      {/* Corner info */}
      <div className="hero-corner-info">
        <span>Pune · India</span>
        <span className="hero-corner-dot">·</span>
        <span>Est. 2020</span>
      </div>
    </section>
  );
}
