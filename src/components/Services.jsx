import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Services.css";
import GridBackground from "./GridBackground";
import serviceModelImage from "../assets/service-model.webp";
import serviceTravelImage from "../assets/service-travel.webp";
import serviceBrandImage from "../assets/gallery-6.webp";

gsap.registerPlugin(ScrollTrigger);

// Uses available local assets, with a brand fallback image.

const SERVICES = [
  {
    num: "01",
    title: "Model Photoshoots",
    subtitle: "Fashion & Editorial",
    desc: "High-concept fashion shoots, portfolio builds, editorial campaigns, and lookbooks. Crafted for agencies, models, and luxury brands.",
    image: serviceModelImage,
    tags: ["Fashion", "Editorial", "Portfolio", "Lookbook"],
  },
  {
    num: "02",
    title: "Brand Content",
    subtitle: "Visual Marketing",
    desc: "Full-service brand content creation — from product photography to social reels, campaign stills, and branded video stories.",
    image: serviceBrandImage,
    tags: ["Social Media", "Campaigns", "Product", "Reels"],
  },
  {
    num: "03",
    title: "Travel Filmmaking",
    subtitle: "Cinematic Journeys",
    desc: "Cinematic travel films that capture culture, landscape, and human emotion. Destination reels, tourism campaigns, and personal adventure films.",
    image: serviceTravelImage,
    tags: ["Cinematic", "Aerial", "Documentary", "Tourism"],
  },
];

export default function Services() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current?.querySelectorAll("[data-text-fx]") || [],
        { y: 32, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.75,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
          },
        },
      );

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            delay: i * 0.1,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
          },
        );

        // Image parallax inside each card
        const img = card.querySelector(".service-img");
        if (img) {
          gsap.to(img, {
            yPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="services grid-host" id="services">
      <GridBackground direction="up-left" />
      <div className="services-header" ref={headerRef}>
        <span className="section-label" data-text-fx>
          Services
        </span>
        <h2 className="services-heading" data-text-fx>
          What I <em>create</em>
        </h2>
        <p className="services-sub" data-text-fx>
          Three disciplines, one singular vision — every project delivers
          unforgettable visuals.
        </p>
      </div>

      <div className="services-grid">
        {SERVICES.map((svc, i) => (
          <div
            key={i}
            ref={(el) => (cardsRef.current[i] = el)}
            className="service-card"
          >
            <div className="service-img-wrap">
              <img
                src={svc.image}
                alt={svc.title}
                className="service-img"
                loading="lazy"
                decoding="async"
              />
              <div className="service-img-overlay" />
              <span className="service-num">{svc.num}</span>
            </div>

            <div className="service-body">
              <div className="service-title-wrap">
                <h3 className="service-title">{svc.title}</h3>
                <span className="service-subtitle">{svc.subtitle}</span>
              </div>

              <p className="service-desc">{svc.desc}</p>

              <div className="service-tags">
                {svc.tags.map((tag) => (
                  <span key={tag} className="service-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <a href="#contact" className="service-link">
                <span>Enquire</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7H12M12 7L8 3M12 7L8 11"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
