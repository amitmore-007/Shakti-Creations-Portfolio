import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./CardGallery.css";
import gallery1 from "../assets/gallery-1.webp";
import gallery2 from "../assets/gallery-2.webp";
import gallery3 from "../assets/gallery-3.webp";
import gallery4 from "../assets/gallery-4.webp";
import gallery5 from "../assets/gallery-5.webp";
import gallery6 from "../assets/gallery-6.webp";
import gallery7 from "../assets/service-model.webp";
import gallery8 from "../assets/service-travel.webp";

gsap.registerPlugin(ScrollTrigger);

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

const ENTRY_DIRECTIONS = [
  { fromX: -1, fromY: -1 },
  { fromX: 1, fromY: -1 },
  { fromX: -1, fromY: 1 },
  { fromX: 1, fromY: 1 },
  { fromX: 0, fromY: -1 },
  { fromX: 0, fromY: 1 },
  { fromX: -1, fromY: 0 },
  { fromX: 1, fromY: 0 },
];

export default function CardGallery() {
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
  const hasAnimatedIn = useRef(false);
  const introTlRef = useRef(null);
  const mobileTlRef = useRef(null);

  const getEntryState = useCallback((i) => {
    const pos = FAN_POSITIONS[i];
    const dir =
      ENTRY_DIRECTIONS[i] || ENTRY_DIRECTIONS[i % ENTRY_DIRECTIONS.length];
    const spreadX = Math.max(window.innerWidth * 0.52, 760);
    const spreadY = Math.max(window.innerHeight * 0.42, 360);

    return {
      x: dir.fromX * spreadX,
      y: dir.fromY * spreadY,
      rotate: pos.rotate + dir.fromX * 20 + dir.fromY * 12,
      opacity: 0,
      scale: 0.82,
      zIndex: pos.z,
      force3D: true,
    };
  }, []);

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

  const prepareMobileCards = useCallback(() => {
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.killTweensOf(card);
      gsap.set(card, {
        x: i % 2 === 0 ? -72 : 72,
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 0,
        force3D: true,
      });
    });
  }, []);

  const animateMobileCardsIn = useCallback(() => {
    const cards = cardsRef.current.filter(Boolean);
    if (!cards.length) return;

    mobileTlRef.current?.kill();
    mobileTlRef.current = gsap.to(cards, {
      x: 0,
      opacity: 1,
      duration: 0.56,
      stagger: 0.09,
      ease: "power3.out",
      overwrite: "auto",
      force3D: true,
    });
  }, []);

  const stopIntroTimeline = useCallback(() => {
    if (!introTlRef.current) return;
    introTlRef.current.kill();
    introTlRef.current = null;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const pos = FAN_POSITIONS[i];
      gsap.set(card, {
        x: pos.x,
        y: pos.y,
        rotate: pos.rotate,
        opacity: 1,
        scale: 1,
        zIndex: pos.z,
        force3D: true,
      });
    });
  }, []);

  const animateIn = useCallback(() => {
    if (hasAnimatedIn.current) return;
    if (isMobileLayout) {
      animateMobileCardsIn();
      return;
    }

    hasAnimatedIn.current = true;

    const cards = cardsRef.current.filter(Boolean);
    if (!cards.length) return;

    const tl = gsap.timeline();
    introTlRef.current = tl;

    cards.forEach((card, i) => {
      const pos = FAN_POSITIONS[i];

      gsap.set(card, getEntryState(i));

      tl.to(
        card,
        {
          x: pos.x,
          y: pos.y,
          rotate: pos.rotate,
          opacity: 1,
          scale: 1,
          zIndex: pos.z,
          force3D: true,
          duration: 0.84,
          ease: "power3.out",
          overwrite: "auto",
        },
        i * 0.07,
      );

      // Subtle wave pulse after reveal for a smoother, richer transition.
      tl.to(
        card,
        {
          y: pos.y - 10,
          force3D: true,
          duration: 0.18,
          yoyo: true,
          repeat: 1,
          ease: "sine.inOut",
          overwrite: "auto",
        },
        0.45 + i * 0.05,
      );
    });
  }, [animateMobileCardsIn, getEntryState, isMobileLayout]);

  useEffect(() => {
    if (isMobileLayout) {
      hasAnimatedIn.current = false;
      setHoveredId(null);
      setFocusedId(null);
      introTlRef.current?.kill();
      mobileTlRef.current?.kill();
      prepareMobileCards();

      const mobileTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 90%",
        once: true,
        onEnter: animateMobileCardsIn,
      });

      if (ScrollTrigger.isInViewport(sectionRef.current, 0.2)) {
        animateMobileCardsIn();
      }

      return () => {
        mobileTrigger.kill();
        mobileTlRef.current?.kill();
      };
    }

    mobileTlRef.current?.kill();
    setMobileCardState();

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.set(card, getEntryState(i));
    });

    const revealTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 88%",
      once: true,
      onEnter: animateIn,
    });

    const headerAnim = gsap.fromTo(
      headerRef.current?.querySelectorAll("[data-text-fx]") || [],
      { y: 32, opacity: 0, filter: "blur(8px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.82,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
        },
      },
    );

    return () => {
      revealTrigger.kill();
      introTlRef.current?.kill();
      headerAnim.scrollTrigger?.kill();
      headerAnim.kill();
    };
  }, [
    animateIn,
    animateMobileCardsIn,
    getEntryState,
    isMobileLayout,
    prepareMobileCards,
    setMobileCardState,
  ]);

  const handleHover = (id) => {
    if (isMobileLayout || focusedId) return;
    stopIntroTimeline();
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
    stopIntroTimeline();

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
          Portfolio
        </span>
        <h2 className="gallery-heading" data-text-fx>
          Featured <em>Work</em>
        </h2>
        <p className="gallery-sub" data-text-fx>
          {isMobileLayout
            ? "Cards enter alternately from left and right"
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
          ? "Scroll down to see all 8 featured projects"
          : focusedId
            ? "Click anywhere to close · or click another card"
            : "8 works in the deck"}
      </p>
    </section>
  );
}
