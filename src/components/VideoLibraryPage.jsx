import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import gsap from "gsap";
import CustomCursor from "./CustomCursor";
import { VIDEO_CATEGORIES, VIDEO_LIBRARY } from "../data/videoLibrary";
import "./VideoLibraryPage.css";

const VideoLibraryPage = forwardRef(function VideoLibraryPage(
  { isOpen = true, onClose },
  ref,
) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeVideo, setActiveVideo] = useState(null);
  const isOverlayMode = typeof onClose === "function";
  const [canPlayGridVideos, setCanPlayGridVideos] = useState(
    () => !isOverlayMode,
  );
  const pageRef = useRef(null);
  const tlRef = useRef(null);

  const filteredVideos = useMemo(() => {
    if (activeCategory === "All") return VIDEO_LIBRARY;
    return VIDEO_LIBRARY.filter((video) => video.category === activeCategory);
  }, [activeCategory]);

  const categoryCounts = useMemo(() => {
    return VIDEO_CATEGORIES.reduce((counts, category) => {
      counts[category] =
        category === "All"
          ? VIDEO_LIBRARY.length
          : VIDEO_LIBRARY.filter((video) => video.category === category).length;
      return counts;
    }, {});
  }, []);

  const handleClose = useCallback(() => {
    if (!isOverlayMode) return;

    setCanPlayGridVideos(false);
    tlRef.current?.kill();

    if (!pageRef.current) {
      onClose();
      return;
    }

    gsap.to(pageRef.current, {
      clipPath: "inset(0 0 100% 0)",
      duration: 0.52,
      ease: "power4.in",
      onComplete: onClose,
    });
  }, [isOverlayMode, onClose]);

  useImperativeHandle(
    ref,
    () => ({
      close: handleClose,
    }),
    [handleClose],
  );

  useEffect(() => {
    if (isOverlayMode) return;
    setCanPlayGridVideos(true);
    window.scrollTo(0, 0);
  }, [isOverlayMode]);

  useEffect(() => {
    if (!isOverlayMode || !isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOverlayMode, isOpen]);

  useEffect(() => {
    if (!isOverlayMode || !isOpen || !pageRef.current) return undefined;

    setCanPlayGridVideos(false);
    tlRef.current?.kill();
    gsap.set(pageRef.current, {
      clipPath: "inset(0% 0 100% 0)",
      willChange: "clip-path",
    });

    const tl = gsap.timeline({
      onComplete: () => {
        setCanPlayGridVideos(true);
        gsap.set(pageRef.current, { willChange: "auto" });
      },
    });
    tlRef.current = tl;

    tl.to(pageRef.current, {
      clipPath: "inset(0% 0 0 0)",
      duration: 0.84,
      ease: "power4.inOut",
    });

    const heroEls = pageRef.current.querySelectorAll("[data-anim]");
    tl.fromTo(
      heroEls,
      { y: -44, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.07,
        duration: 0.56,
        ease: "power3.out",
      },
      "-=0.44",
    );

    return () => tl.kill();
  }, [isOverlayMode, isOpen]);

  useEffect(() => {
    if (!activeVideo) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeVideo]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;

      if (activeVideo) {
        setActiveVideo(null);
        return;
      }

      if (isOverlayMode) {
        handleClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeVideo, handleClose, isOpen, isOverlayMode]);

  if (!isOpen) return null;

  return (
    <div
      className={`video-library-page grid-host${isOverlayMode ? " overlay-mode" : ""}`}
      ref={pageRef}
      data-lenis-prevent={isOverlayMode ? "" : undefined}
    >
      {!isOverlayMode && <div className="noise-overlay" aria-hidden="true" />}
      {!isOverlayMode && <CustomCursor />}

      <div className="vlp-shell">
        <header className="vlp-hero">
          <div className="vlp-hero-main">
            {isOverlayMode ? (
              <button
                className="vlp-back-btn"
                type="button"
                onClick={handleClose}
                data-anim
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path
                    d="M13.5 7.5H1.5M1.5 7.5L6.5 2.5M1.5 7.5L6.5 12.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Close Video Library
              </button>
            ) : (
              <a className="vlp-back-btn" href="/" data-anim>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path
                    d="M13.5 7.5H1.5M1.5 7.5L6.5 2.5M1.5 7.5L6.5 12.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Back To Home
              </a>
            )}

            <span className="vlp-eyebrow" data-anim>
              Motion Archive
            </span>
            <h1 className="vlp-title" data-anim>
              Video <em>Library</em>
            </h1>
            <p className="vlp-sub" data-anim>
              Browse cinematic cuts by category and open any card to watch the
              full piece.
            </p>
          </div>

          <div className="vlp-stats" data-anim>
            <div className="vlp-stat-card" data-anim>
              <span className="vlp-stat-label">Total Videos</span>
              <span className="vlp-stat-value">{VIDEO_LIBRARY.length}</span>
            </div>
            <div className="vlp-stat-card" data-anim>
              <span className="vlp-stat-label">Categories</span>
              <span className="vlp-stat-value">
                {VIDEO_CATEGORIES.length - 1}
              </span>
            </div>
          </div>
        </header>

        <div className="vlp-cats-bar" data-anim>
          {VIDEO_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              className={`vlp-cat-btn${activeCategory === category ? " active" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
              <span className="vlp-cat-count">{categoryCounts[category]}</span>
            </button>
          ))}
        </div>

        <section className="vlp-grid" aria-label="Video gallery" data-anim>
          {filteredVideos.map((video, index) => {
            const variant = `vlp-card--v${(index % 6) + 1}`;

            return (
              <button
                key={video.id}
                type="button"
                className={`vlp-card ${variant}`}
                onClick={() => setActiveVideo(video)}
              >
                <video
                  className="vlp-card-video"
                  src={video.src}
                  poster={video.poster}
                  autoPlay={canPlayGridVideos}
                  muted
                  loop
                  playsInline
                  preload={canPlayGridVideos ? "metadata" : "none"}
                />
                <div className="vlp-card-overlay" />

                <span className="vlp-play-chip">Play Video</span>

                <div className="vlp-card-meta">
                  <span className="vlp-card-cat">{video.category}</span>
                  <h3 className="vlp-card-title">{video.title}</h3>
                  <span className="vlp-card-duration">{video.duration}</span>
                </div>
              </button>
            );
          })}
        </section>
      </div>

      {activeVideo && (
        <div className="vlp-modal" onClick={() => setActiveVideo(null)}>
          <button
            className="vlp-modal-close"
            type="button"
            onClick={() => setActiveVideo(null)}
            aria-label="Close video"
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

          <div
            className="vlp-modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            <video
              src={activeVideo.src}
              poster={activeVideo.poster}
              controls
              autoPlay
              playsInline
              preload="metadata"
            />

            <div className="vlp-modal-meta">
              <span className="vlp-card-cat">{activeVideo.category}</span>
              <h3>{activeVideo.title}</h3>
              <p>{activeVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default VideoLibraryPage;
