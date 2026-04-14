import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./About.css";
import aboutPortrait from "../assets/about-portrait.webp";

gsap.registerPlugin(ScrollTrigger);

// Uses available portrait image from local assets.

const MARQUEE_ITEMS = [
  "Model Shoots",
  "·",
  "Brand Content",
  "·",
  "Travel Films",
  "·",
  "Editorial",
  "·",
  "Campaigns",
  "·",
  "Visual Stories",
  "·",
];

const MARQUEE_LOOP_COPIES = 10;

function renderMarqueeTrackItems(prefix) {
  return Array.from({ length: MARQUEE_LOOP_COPIES }, (_, segmentIndex) => (
    <div className="marquee-segment" key={`${prefix}-${segmentIndex}`}>
      {MARQUEE_ITEMS.map((item, itemIndex) => (
        <span
          key={`${prefix}-${segmentIndex}-${itemIndex}`}
          className={item === "·" ? "marquee-dot" : "marquee-item"}
        >
          {item}
        </span>
      ))}
    </div>
  ));
}

export default function About() {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  const textRef = useRef(null);
  const marqueeRef = useRef(null);
  const marquee2Ref = useRef(null);
  const statsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal text on scroll
      gsap.fromTo(
        textRef.current.querySelectorAll("[data-text-fx]"),
        { y: 42, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.09,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
          },
        },
      );

      // Image parallax
      gsap.fromTo(
        imgRef.current,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      // Image reveal
      gsap.fromTo(
        imgRef.current.parentElement,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: imgRef.current,
            start: "top 85%",
          },
        },
      );

      // Continuous marquee
      const topSegment = marqueeRef.current?.querySelector(".marquee-segment");
      const bottomSegment =
        marquee2Ref.current?.querySelector(".marquee-segment");

      if (topSegment) {
        gsap.to(marqueeRef.current, {
          x: -topSegment.scrollWidth,
          duration: 25,
          ease: "none",
          repeat: -1,
        });
      }

      if (bottomSegment) {
        gsap.fromTo(
          marquee2Ref.current,
          { x: -bottomSegment.scrollWidth },
          {
            x: 0,
            duration: 30,
            ease: "none",
            repeat: -1,
          },
        );
      }

      // Stats counter
      statsRef.current.forEach((stat) => {
        if (!stat) return;
        const target = parseInt(stat.dataset.target);
        ScrollTrigger.create({
          trigger: stat,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              { val: 0 },
              { val: 0 },
              {
                val: target,
                duration: 2,
                ease: "power2.out",
                onUpdate: function () {
                  stat.textContent =
                    Math.round(this.targets()[0].val) +
                    (stat.dataset.suffix || "");
                },
              },
            );
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="about" id="about">
      {/* Marquee top */}
      <div className="marquee-wrap">
        <div ref={marqueeRef} className="marquee-track">
          {renderMarqueeTrackItems("top")}
        </div>
      </div>

      <div className="about-inner">
        {/* Image column */}
        <div className="about-image-col">
          <div className="about-img-wrap">
            <img
              ref={imgRef}
              src={aboutPortrait}
              alt="Creator portrait"
              className="about-portrait"
              loading="lazy"
              decoding="async"
            />
            <div className="about-img-overlay" />
          </div>

          {/* Stats */}
          <div className="about-stats">
            <div className="stat-item">
              <span
                className="stat-number"
                data-target="200"
                data-suffix="+"
                ref={(el) => (statsRef.current[0] = el)}
              >
                200+
              </span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span
                className="stat-number"
                data-target="50"
                data-suffix="+"
                ref={(el) => (statsRef.current[1] = el)}
              >
                50+
              </span>
              <span className="stat-label">Brands</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span
                className="stat-number"
                data-target="15"
                data-suffix=""
                ref={(el) => (statsRef.current[2] = el)}
              >
                15
              </span>
              <span className="stat-label">Countries</span>
            </div>
          </div>
        </div>

        {/* Text column */}
        <div ref={textRef} className="about-text-col">
          <span className="section-label reveal-line" data-text-fx>
            About
          </span>

          <h2 className="about-heading reveal-line" data-text-fx>
            Creating visuals
            <br />
            <em>that leave marks</em>
          </h2>

          <p className="about-body reveal-line" data-text-fx>
            I'm a visual storyteller based in Pune — blending the worlds of
            fashion photography, branded content creation, and cinematic travel
            filmmaking into a singular artistic voice.
          </p>

          <p className="about-body reveal-line" data-text-fx>
            Every frame is intentional. Every colour grade deliberate. Whether
            I'm on a mountaintop or a studio set, I bring the same obsessive
            attention to light, mood, and narrative.
          </p>

          <div className="about-tags reveal-line" data-text-fx>
            {["Canon R5", "Sony FX3", "DJI Pro", "Adobe Suite", "Resolve"].map(
              (tag) => (
                <span key={tag} className="about-tag">
                  {tag}
                </span>
              ),
            )}
          </div>

          <a href="#work" className="about-cta reveal-line" data-text-fx>
            <span>View Portfolio</span>
            <div className="about-cta-arrow">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4 10H16M16 10L11 5M16 10L11 15"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
            </div>
          </a>
        </div>
      </div>

      {/* Second marquee */}
      <div className="marquee-wrap marquee-reverse">
        <div ref={marquee2Ref} className="marquee-track">
          {renderMarqueeTrackItems("bottom")}
        </div>
      </div>
    </section>
  );
}
