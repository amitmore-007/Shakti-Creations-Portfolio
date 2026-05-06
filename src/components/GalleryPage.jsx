import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import gsap from "gsap";
import "./GalleryPage.css";

import gallery1 from "../assets/gallery-1.webp";
import gallery2 from "../assets/gallery-2.webp";
import gallery4 from "../assets/gallery-4.webp";
import gallery5 from "../assets/gallery-5.webp";
import gallery6 from "../assets/gallery-6.webp";
import serviceModel from "../assets/service-model.webp";
import serviceTravel from "../assets/service-travel.webp";
import aboutPortrait from "../assets/about-portrait.webp";

const CATEGORIES = [
  "All",
  "Models",
  "Travel",
  "Food",
  "Architecture",
  "Portraits",
  "Events",
];

const STRIP_A = Array(4)
  .fill("MODELS • TRAVEL • FOOD • ARCHITECTURE • PORTRAITS • EVENTS • ")
  .join("");
const STRIP_B = Array(4)
  .fill("EDITORIAL • LIFESTYLE • COMMERCIAL • FASHION • PORTRAIT • NATURE • ")
  .join("");

const FOOD_IMAGES = Object.entries(
  import.meta.glob("../assets/food_images/*.webp", {
    eager: true,
    import: "default",
  }),
)
  .sort(([a], [b]) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
  )
  .map(([, src]) => src);

const FOOD_PHOTOS = FOOD_IMAGES.map((src, index) => ({
  id: 1000 + index,
  src,
  title: `Food Story ${String(index + 1).padStart(2, "0")}`,
  cat: "Food",
}));

const ALL_PHOTOS = [
  // Models
  { id: 1, src: gallery1, title: "Monsoon Editorial", cat: "Models" },
  { id: 2, src: gallery2, title: "Studio Noir", cat: "Models" },
  { id: 3, src: serviceModel, title: "Dusk Rooftop", cat: "Models" },
  { id: 4, src: aboutPortrait, title: "Golden Frame", cat: "Models" },
  { id: 5, src: gallery1, title: "Urban Story", cat: "Models" },
  { id: 6, src: gallery2, title: "Night Vision", cat: "Models" },
  { id: 7, src: serviceModel, title: "Soft Light", cat: "Models" },
  { id: 8, src: aboutPortrait, title: "Street Pose", cat: "Models" },
  { id: 9, src: gallery1, title: "Bloom Campaign", cat: "Models" },
  { id: 10, src: gallery2, title: "Minimal Frame", cat: "Models" },
  // Travel
  { id: 11, src: gallery4, title: "Rajasthan Gold", cat: "Travel" },
  { id: 12, src: gallery5, title: "Kerala Aerial", cat: "Travel" },
  { id: 13, src: serviceTravel, title: "Coastal Journey", cat: "Travel" },
  { id: 14, src: gallery4, title: "Desert Dunes", cat: "Travel" },
  { id: 15, src: gallery5, title: "Hill Station", cat: "Travel" },
  { id: 16, src: serviceTravel, title: "Backwater Drift", cat: "Travel" },
  { id: 17, src: gallery4, title: "Temple Ruins", cat: "Travel" },
  { id: 18, src: gallery5, title: "Mountain Pass", cat: "Travel" },
  { id: 19, src: serviceTravel, title: "Old City Walls", cat: "Travel" },
  { id: 20, src: gallery4, title: "Sunrise Valley", cat: "Travel" },
  // Food
  ...FOOD_PHOTOS,
  // Architecture
  { id: 31, src: gallery6, title: "Glass Tower", cat: "Architecture" },
  { id: 32, src: gallery5, title: "Heritage Facade", cat: "Architecture" },
  { id: 33, src: gallery4, title: "Modern Arch", cat: "Architecture" },
  { id: 34, src: gallery6, title: "Steel & Sky", cat: "Architecture" },
  { id: 35, src: gallery5, title: "Corridor Light", cat: "Architecture" },
  { id: 36, src: gallery4, title: "Dome Interior", cat: "Architecture" },
  { id: 37, src: gallery6, title: "Minimalist Home", cat: "Architecture" },
  { id: 38, src: gallery5, title: "Rooftop Garden", cat: "Architecture" },
  { id: 39, src: gallery4, title: "Bridge Lines", cat: "Architecture" },
  { id: 40, src: gallery6, title: "Staircase Study", cat: "Architecture" },
  // Portraits
  { id: 41, src: aboutPortrait, title: "Contemplation", cat: "Portraits" },
  { id: 42, src: gallery1, title: "Window Light", cat: "Portraits" },
  { id: 43, src: gallery2, title: "Silhouette", cat: "Portraits" },
  { id: 44, src: aboutPortrait, title: "Close Up", cat: "Portraits" },
  { id: 45, src: gallery1, title: "Expression", cat: "Portraits" },
  { id: 46, src: gallery2, title: "Golden Hour", cat: "Portraits" },
  { id: 47, src: aboutPortrait, title: "Urban Soul", cat: "Portraits" },
  { id: 48, src: gallery1, title: "Rain Portrait", cat: "Portraits" },
  { id: 49, src: gallery2, title: "Candid Moment", cat: "Portraits" },
  { id: 50, src: aboutPortrait, title: "Soft Focus", cat: "Portraits" },
  // Events
  { id: 51, src: gallery2, title: "Wedding Story", cat: "Events" },
  { id: 52, src: gallery5, title: "Concert Night", cat: "Events" },
  { id: 53, src: gallery6, title: "Product Launch", cat: "Events" },
  { id: 54, src: gallery2, title: "Gala Evening", cat: "Events" },
  { id: 55, src: gallery5, title: "Corporate Day", cat: "Events" },
  { id: 56, src: gallery6, title: "Birthday Bash", cat: "Events" },
  { id: 57, src: gallery2, title: "Fashion Show", cat: "Events" },
  { id: 58, src: gallery5, title: "Art Exhibition", cat: "Events" },
  { id: 59, src: gallery6, title: "Sports Event", cat: "Events" },
  { id: 60, src: gallery2, title: "Award Night", cat: "Events" },
];

const GalleryPage = forwardRef(function GalleryPage({ isOpen, onClose }, ref) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxImg, setLightboxImg] = useState(null);
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const catsRef = useRef(null);
  const gridRef = useRef(null);
  const tlRef = useRef(null);
  const isChanging = useRef(false);

  const filteredPhotos =
    activeCategory === "All"
      ? ALL_PHOTOS
      : ALL_PHOTOS.filter((p) => p.cat === activeCategory);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (lightboxImg) {
        setLightboxImg(null);
        return;
      }
      handleClose();
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, lightboxImg]);

  // Entry animation
  useEffect(() => {
    if (!isOpen || !pageRef.current) return;
    tlRef.current?.kill();
    const tl = gsap.timeline();
    tlRef.current = tl;

    tl.to(pageRef.current, {
      clipPath: "inset(0% 0 0 0)",
      duration: 0.72,
      ease: "power4.inOut",
    });

    const heroEls = heroRef.current?.querySelectorAll("[data-anim]") ?? [];
    tl.fromTo(
      heroEls,
      { y: 52, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.62, ease: "power3.out" },
      "-=0.44",
    );

    const catBtns = catsRef.current?.querySelectorAll("button") ?? [];
    tl.fromTo(
      catBtns,
      { y: 22, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.42, ease: "power3.out" },
      "-=0.32",
    );

    return () => tl.kill();
  }, [isOpen]);

  // Grid animation on category change (and initial load)
  useEffect(() => {
    if (!isOpen || !gridRef.current) return;
    const items = gridRef.current.querySelectorAll(".gp-photo-item");
    if (!items.length) return;
    gsap.fromTo(
      items,
      { y: 64, opacity: 0, scale: 0.93 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.032,
        duration: 0.56,
        ease: "power3.out",
      },
    );
  }, [activeCategory, isOpen]);

  const handleClose = useCallback(() => {
    if (!pageRef.current) {
      onClose();
      return;
    }
    gsap.to(pageRef.current, {
      clipPath: "inset(100% 0 0 0)",
      duration: 0.52,
      ease: "power4.in",
      onComplete: onClose,
    });
  }, [onClose]);

  useImperativeHandle(
    ref,
    () => ({
      close: handleClose,
    }),
    [handleClose],
  );

  const handleCategoryChange = useCallback(
    (cat) => {
      if (cat === activeCategory || isChanging.current) return;
      isChanging.current = true;
      setActiveCategory(cat);

      window.setTimeout(() => {
        isChanging.current = false;
      }, 180);
    },
    [activeCategory],
  );

  if (!isOpen) return null;

  return (
    <>
      <div className="gp-overlay" ref={pageRef} data-lenis-prevent>
        {/* Sticky top bar */}
        <div className="gp-topbar">
          <button
            className="gp-close-btn"
            onClick={handleClose}
            aria-label="Close gallery"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path
                d="M1.5 1.5L13.5 13.5M13.5 1.5L1.5 13.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Hero */}
        <div className="gp-hero" ref={heroRef}>
          <span className="gp-eyebrow" data-anim>
            Visual Archive
          </span>
          <h1 className="gp-main-title" data-anim>
            Our <em>Photography</em>
          </h1>
          <p className="gp-count-line" data-anim>
            {ALL_PHOTOS.length} photographs &nbsp;·&nbsp;{" "}
            {CATEGORIES.length - 1} categories
          </p>
        </div>

        {/* Marquee strips */}
        <div className="gp-strips">
          <div className="gp-strip gp-strip--left">
            <div className="gp-strip-track">
              <span className="gp-strip-text">{STRIP_A}</span>
              <span className="gp-strip-text">{STRIP_A}</span>
            </div>
          </div>
          <div className="gp-strip gp-strip--right">
            <div className="gp-strip-track">
              <span className="gp-strip-text">{STRIP_B}</span>
              <span className="gp-strip-text">{STRIP_B}</span>
            </div>
          </div>
        </div>

        {/* Category filter */}
        <div className="gp-cats-bar" ref={catsRef}>
          {CATEGORIES.map((cat) => {
            const count =
              cat === "All"
                ? ALL_PHOTOS.length
                : ALL_PHOTOS.filter((p) => p.cat === cat).length;
            return (
              <button
                key={cat}
                className={`gp-cat-btn${activeCategory === cat ? " active" : ""}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
                <span className="gp-cat-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Photo grid */}
        <div className="gp-grid" ref={gridRef}>
          {filteredPhotos.map((photo, i) => {
            const variant = `v${(i % 5) + 1}`;
            return (
              <div
                key={photo.id}
                className={`gp-photo-item gp-photo-item--${variant}`}
                onClick={() => setLightboxImg(photo)}
              >
                <div className="gp-photo-inner">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    loading="lazy"
                    decoding="async"
                    onLoad={(e) => {
                      e.currentTarget.classList.add("img-loaded");
                      e.currentTarget.parentElement?.classList.add("img-loaded");
                    }}
                    ref={(el) => {
                      if (el?.complete && el.naturalWidth > 0) {
                        el.classList.add("img-loaded");
                        el.parentElement?.classList.add("img-loaded");
                      }
                    }}
                  />
                  <div className="gp-photo-overlay">
                    <span className="gp-photo-cat-label">{photo.cat}</span>
                    <h3 className="gp-photo-name">{photo.title}</h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div className="gp-lightbox" onClick={() => setLightboxImg(null)}>
          <button
            className="gp-lb-close"
            onClick={() => setLightboxImg(null)}
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 2L14 14M14 2L2 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className="gp-lb-content" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxImg.src} alt={lightboxImg.title} />
            <div className="gp-lb-info">
              <span className="gp-photo-cat-label">{lightboxImg.cat}</span>
              <h3 className="gp-lb-title">{lightboxImg.title}</h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default GalleryPage;
