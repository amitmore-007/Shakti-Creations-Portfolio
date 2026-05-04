import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Testimonials.css";
import GridBackground from "./GridBackground";

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    quote:
      "The brand campaign visuals exceeded every expectation. Our engagement went up 3x the week they went live. Pure magic.",
    name: "Priya Mehta",
    role: "Marketing Director, Lume Beauty",
    initials: "PM",
  },
  {
    quote:
      "Working on our travel series was a masterclass in storytelling. Every frame felt like it belonged in a film festival.",
    name: "Arjun Kapoor",
    role: "Co-Founder, NomadTrails",
    initials: "AK",
  },
  {
    quote:
      "The portfolio shoot completely transformed how I present myself to agencies. Booked 4 new clients within a month.",
    name: "Zara Singh",
    role: "Model & Influencer",
    initials: "ZS",
  },
  {
    quote:
      "I've worked with photographers across the globe. This level of editorial vision is genuinely rare to find.",
    name: "Marcus Webb",
    role: "Creative Director, Vox Creatives",
    initials: "MW",
  },
  {
    quote:
      "Our product launch reel got picked up by three major publications. The cinematic quality made it stand out completely.",
    name: "Deepika Rao",
    role: "Brand Manager, Arcana",
    initials: "DR",
  },
];

export default function Testimonials() {
  const sectionRef = useRef(null);
  const marqueeRef = useRef(null);
  const trackRef = useRef(null);
  const headingRef = useRef(null);
  const marqueeTlRef = useRef(null);

  useEffect(() => {
    let visibilityTrigger;
    let pauseMarquee;
    let resumeMarquee;
    let marqueeEl;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current?.querySelectorAll("[data-text-fx]") || [],
        { y: 34, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        },
      );
    }, sectionRef);

    const trackEl = trackRef.current;
    marqueeEl = marqueeRef.current;
    const firstSetEl = trackEl?.querySelector(".testimonials-set");

    if (trackEl && marqueeEl && firstSetEl) {
      const travelDistance = firstSetEl.getBoundingClientRect().width;

      marqueeTlRef.current = gsap.fromTo(
        trackEl,
        { x: 0 },
        {
          x: -travelDistance,
          duration: 32,
          ease: "none",
          repeat: -1,
          paused: true,
        },
      );

      visibilityTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 95%",
        end: "bottom 5%",
        onEnter: () => marqueeTlRef.current?.play(),
        onEnterBack: () => marqueeTlRef.current?.play(),
        onLeave: () => marqueeTlRef.current?.pause(),
        onLeaveBack: () => marqueeTlRef.current?.pause(),
      });

      if (ScrollTrigger.isInViewport(sectionRef.current, 0.2)) {
        marqueeTlRef.current.play();
      }

      pauseMarquee = () => marqueeTlRef.current?.pause();
      resumeMarquee = () => marqueeTlRef.current?.play();

      marqueeEl.addEventListener("mouseenter", pauseMarquee);
      marqueeEl.addEventListener("mouseleave", resumeMarquee);
    }

    return () => {
      if (marqueeEl && pauseMarquee) {
        marqueeEl.removeEventListener("mouseenter", pauseMarquee);
      }
      if (marqueeEl && resumeMarquee) {
        marqueeEl.removeEventListener("mouseleave", resumeMarquee);
      }
      visibilityTrigger?.kill();
      marqueeTlRef.current?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="testimonials grid-host">
      <GridBackground direction="right" />
      <div ref={headingRef} className="testimonials-header">
        <span className="section-label" data-text-fx>
          Testimonials
        </span>
        <h2 className="testimonials-heading" data-text-fx>
          What clients <em>say</em>
        </h2>
        <p className="testimonials-drag-hint" data-text-fx>
          Moving stories - right to left
        </p>
      </div>

      <div className="testimonials-marquee" ref={marqueeRef}>
        <div ref={trackRef} className="testimonials-track">
          <div className="testimonials-set">
            {TESTIMONIALS.map((t, i) => (
              <div key={`a-${i}`} className="testimonial-card">
                <div className="testimonial-quote-mark">"</div>
                <p className="testimonial-text">{t.quote}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.initials}</div>
                  <div className="testimonial-meta">
                    <span className="testimonial-name">{t.name}</span>
                    <span className="testimonial-role">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="testimonials-set" aria-hidden="true">
            {TESTIMONIALS.map((t, i) => (
              <div key={`b-${i}`} className="testimonial-card">
                <div className="testimonial-quote-mark">"</div>
                <p className="testimonial-text">{t.quote}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.initials}</div>
                  <div className="testimonial-meta">
                    <span className="testimonial-name">{t.name}</span>
                    <span className="testimonial-role">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
