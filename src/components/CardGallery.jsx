import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import "./CardGallery.css";
import gallery1 from "../assets/gallery-1.webp";
import gallery2 from "../assets/gallery-2.webp";
import gallery3 from "../assets/gallery-3.webp";
import gallery4 from "../assets/gallery-4.webp";
import gallery5 from "../assets/gallery-5.webp";
import gallery6 from "../assets/gallery-6.webp";
import gallery7 from "../assets/service-model.webp";
import gallery8 from "../assets/service-travel.webp";

// Uses available local assets with fallbacks for missing slots.

const CARDS = [
  { id: 1, src: gallery1, title: "Monsoon Editorial", cat: "Model" },
  { id: 2, src: gallery2, title: "Studio Noir", cat: "Fashion" },
  { id: 3, src: gallery3, title: "Bloom Campaign", cat: "Brand" },
  { id: 4, src: gallery4, title: "Rajasthan Gold", cat: "Travel" },
  { id: 5, src: gallery5, title: "Street Portrait", cat: "Travel" },
  { id: 6, src: gallery6, title: "Product Launch", cat: "Brand" },
  { id: 7, src: gallery7, title: "Dusk Rooftop", cat: "Fashion" },
  { id: 8, src: gallery8, title: "Kerala Aerial", cat: "Travel" },
];

// Fan positions for 8 cards spread in a half-arc
const FAN_POSITIONS = [
  { x: -430, y: 56, rotate: -26, z: 1 },
  { x: -305, y: 26, rotate: -18, z: 2 },
  { x: -180, y: 4, rotate: -10, z: 3 },
  { x: -55, y: -10, rotate: -3, z: 4 },
  { x: 70, y: -10, rotate: 3, z: 5 },
  { x: 195, y: 4, rotate: 10, z: 6 },
  { x: 320, y: 26, rotate: 18, z: 7 },
  { x: 445, y: 56, rotate: 26, z: 8 },
];

export default function CardGallery({ onViewAll }) {
  const sectionRef = useRef(null);
  const deckRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [focusedId, setFocusedId] = useState(null);
  const [isMobileLayout, setIsMobileLayout] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(
      "(max-width: 900px), (hover: none), (pointer: coarse)",
    ).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(
      "(max-width: 900px), (hover: none), (pointer: coarse)",
    );

    const onChange = (e) => setIsMobileLayout(e.matches);

    setIsMobileLayout(media.matches);

    if (media.addEventListener) {
      media.addEventListener("change", onChange);
    } else {
      media.addListener(onChange);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", onChange);
      } else {
        media.removeListener(onChange);
      }
    };
  }, []);

  const setDesktopCardState = useCallback(() => {
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const pos = FAN_POSITIONS[i];
      gsap.killTweensOf(card);
      gsap.set(card, {
        x: pos.x,
        y: pos.y,
        rotate: pos.rotate,
        scale: 1,
        opacity: 1,
        zIndex: pos.z,
        force3D: true,
      });
    });
  }, []);

  const setMobileCardState = useCallback(() => {
    cardsRef.current.forEach((card) => {
      if (!card) return;
      gsap.killTweensOf(card);
      gsap.set(card, {
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
        force3D: true,
      });
    });
  }, []);

  useEffect(() => {
    const headerTargets =
      headerRef.current?.querySelectorAll("[data-text-fx]") || [];
    const cards = cardsRef.current.filter(Boolean);

    if (!cards.length) return undefined;

    if (isMobileLayout) {
      setHoveredId(null);
      setFocusedId(null);

      setMobileCardState();

      const tl = gsap.timeline();
      tl.fromTo(
        headerTargets,
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.42,
          ease: "power2.out",
        },
      );

      tl.fromTo(
        cards,
        {
          x: (i) => (i % 2 === 0 ? -30 : 30),
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          stagger: 0.07,
          duration: 0.45,
          ease: "power2.out",
          overwrite: "auto",
        },
        "-=0.2",
      );

      return () => {
        tl.kill();
      };
    }

    setDesktopCardState();

    const tl = gsap.timeline();
    tl.fromTo(
      headerTargets,
      { y: 18, opacity: 0, filter: "blur(4px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.52,
        stagger: 0.08,
        ease: "power2.out",
      },
    );

    tl.from(
      cards,
      {
        y: "+=18",
        opacity: 0,
        scale: 0.98,
        stagger: 0.05,
        duration: 0.52,
        ease: "power2.out",
        overwrite: "auto",
        force3D: true,
      },
      "-=0.22",
    );

    return () => {
      tl.kill();
    };
  }, [isMobileLayout, setDesktopCardState, setMobileCardState]);

  const handleHover = (id) => {
    if (isMobileLayout || focusedId) return;
    setHoveredId(id);

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.killTweensOf(card);
      const pos = FAN_POSITIONS[i];
      const cardId = CARDS[i].id;

      if (cardId === id) {
        // Hovered card lifts up
        gsap.to(card, {
          y: pos.y - 40,
          scale: 1.05,
          zIndex: 20,
          force3D: true,
          duration: 0.36,
          ease: "power3.out",
          overwrite: "auto",
        });
      } else {
        // Others dim down and desaturate (via CSS class)
        gsap.to(card, {
          scale: 0.97,
          force3D: true,
          duration: 0.32,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    });
  };

  const handleHoverLeave = () => {
    if (isMobileLayout || focusedId) return;
    setHoveredId(null);

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.killTweensOf(card);
      const pos = FAN_POSITIONS[i];
      gsap.to(card, {
        y: pos.y,
        scale: 1,
        zIndex: pos.z,
        force3D: true,
        duration: 0.38,
        ease: "power3.out",
        overwrite: "auto",
      });
    });
  };

  const handleClick = (id) => {
    if (isMobileLayout) return;

    if (focusedId === id) {
      closeFocus();
      return;
    }

    setFocusedId(id);
    setHoveredId(null);

    const idx = CARDS.findIndex((c) => c.id === id);
    const allCards = cardsRef.current.filter(Boolean);
    gsap.killTweensOf(allCards);

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      if (CARDS[i].id === id) {
        gsap.to(card, {
          x: 0,
          y: -16,
          rotate: 0,
          scale: 1.13,
          zIndex: 50,
          force3D: true,
          duration: 0.44,
          ease: "power3.out",
          overwrite: "auto",
        });
      } else {
        const pos = FAN_POSITIONS[i];
        const direction = i < idx ? -1 : 1;
        gsap.to(card, {
          x: pos.x + direction * 60,
          y: pos.y + 60,
          scale: 0.92,
          opacity: 0.5,
          zIndex: pos.z,
          force3D: true,
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    });
  };

  const closeFocus = () => {
    setFocusedId(null);

    const allCards = cardsRef.current.filter(Boolean);
    gsap.killTweensOf(allCards);

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const pos = FAN_POSITIONS[i];
      gsap.to(card, {
        x: pos.x,
        y: pos.y,
        rotate: pos.rotate,
        scale: 1,
        opacity: 1,
        zIndex: pos.z,
        force3D: true,
        duration: 0.46,
        ease: "power3.out",
        overwrite: "auto",
      });
    });
  };

  return (
    <section ref={sectionRef} className="card-gallery">
      {/* Focused overlay backdrop */}
      <div
        className={`gallery-backdrop ${focusedId && !isMobileLayout ? "active" : ""}`}
        onClick={closeFocus}
      />

      {/* Header */}
      <div className="gallery-header" ref={headerRef}>
        <span className="section-label" data-text-fx>
          Photography
        </span>
        <h2 className="gallery-heading" data-text-fx>
          Featured <em>Shots</em>
        </h2>
        <p className="gallery-sub" data-text-fx>
          {isMobileLayout
            ? "Portrait · Travel · Fashion · Commercial"
            : "Hover to preview · Click to focus · Click again to dismiss"}
        </p>
      </div>

      {/* The deck */}
      <div
        ref={deckRef}
        className={`card-deck-wrap ${isMobileLayout ? "mobile-layout" : ""}`}
        onMouseLeave={isMobileLayout ? undefined : handleHoverLeave}
      >
        {CARDS.map((card, i) => (
          <div
            key={card.id}
            ref={(el) => (cardsRef.current[i] = el)}
            className={`gallery-card
              ${hoveredId && hoveredId !== card.id ? "dimmed" : ""}
              ${focusedId === card.id ? "focused" : ""}
              ${focusedId && focusedId !== card.id ? "bg-dimmed" : ""}
            `}
            style={
              isMobileLayout
                ? undefined
                : {
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    marginLeft: "-140px",
                    marginTop: "-200px",
                  }
            }
            onMouseEnter={
              isMobileLayout ? undefined : () => handleHover(card.id)
            }
            onClick={isMobileLayout ? undefined : () => handleClick(card.id)}
          >
            <div className="gallery-card-inner">
              <img
                src={card.src}
                alt={card.title}
                className="gallery-card-img"
                loading="lazy"
                decoding="async"
                fetchPriority="auto"
              />
              <div className="gallery-card-overlay" />

              {/* Focused expanded info */}
              {focusedId === card.id && (
                <div className="gallery-card-focus-info">
                  <button
                    className="gallery-close"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeFocus();
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M4 4L16 16M16 4L4 16"
                        stroke="white"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </button>
                  <div className="focus-details">
                    <span className="section-label">{card.cat}</span>
                    <h3 className="focus-title">{card.title}</h3>
                    <a href="#contact" className="focus-enquire">
                      Enquire about this project →
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="gallery-hint">
        {isMobileLayout
          ? "Scroll down to see all 8 featured photographs"
          : focusedId
            ? "Click anywhere to close · or click another card"
            : "8 featured photographs in the deck"}
      </p>

      <button className="gallery-view-all" onClick={onViewAll}>
        <span>View All Photography</span>
        <span className="gallery-view-all-arrow">→</span>
      </button>
    </section>
  );
}
