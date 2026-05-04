import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  lazy,
  Suspense,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import CustomCursor from "./components/CustomCursor";
import PageLoader from "./components/PageLoader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import CardGallery from "./components/CardGallery";
import Footer from "./components/Footer";
import ScrollReveal from "./components/ScrollReveal";
import DeferredSection from "./components/DeferredSection";

gsap.registerPlugin(ScrollTrigger);

const VisualFlowSection = lazy(() => import("./components/VisualFlowSection"));
const CubeShowcase = lazy(() => import("./components/CubeShowcase"));
const VideoShowcase = lazy(() => import("./components/VideoShowcase"));
const Testimonials = lazy(() => import("./components/Testimonials"));
const Contact = lazy(() => import("./components/Contact"));
const GalleryPage = lazy(() => import("./components/GalleryPage"));
const VideoLibraryPage = lazy(() => import("./components/VideoLibraryPage"));

const getOverlayFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const overlay = params.get("overlay");
  if (overlay === "gallery" || overlay === "videos") return overlay;
  return null;
};

function SectionFallback({ minHeight }) {
  return (
    <div
      className="deferred-section-placeholder"
      style={{ minHeight }}
      aria-hidden="true"
    />
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState(() => getOverlayFromUrl());
  const lenisRef = useRef(null);
  const galleryRef = useRef(null);
  const videoLibraryRef = useRef(null);
  const overlayClosingRef = useRef(false);
  const pendingScrollRef = useRef(null);

  const handleLoaderComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  const scrollToHash = useCallback((hash) => {
    if (!hash || hash === "#") return;
    const target = document.querySelector(hash);
    if (!target) return;

    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, {
        offset: -80,
        duration: 1.6,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const finalizeOverlayClose = useCallback(() => {
    overlayClosingRef.current = false;
    setActiveOverlay(null);

    const url = new URL(window.location.href);
    if (url.searchParams.has("overlay")) {
      url.searchParams.delete("overlay");
      window.history.replaceState({ overlay: null }, "", url);
    }
  }, []);

  const closeActiveOverlay = useCallback(() => {
    if (!activeOverlay || overlayClosingRef.current) return;

    const ref =
      activeOverlay === "gallery"
        ? galleryRef.current
        : videoLibraryRef.current;

    if (ref?.close) {
      overlayClosingRef.current = true;
      ref.close();
      return;
    }

    finalizeOverlayClose();
  }, [activeOverlay, finalizeOverlayClose]);

  const openOverlay = useCallback(
    (overlay) => {
      if (!overlay || activeOverlay === overlay) return;

      setActiveOverlay(overlay);

      const url = new URL(window.location.href);
      url.searchParams.set("overlay", overlay);
      window.history.pushState({ overlay }, "", url);
    },
    [activeOverlay],
  );

  useEffect(() => {
    const handlePopState = () => {
      const overlay = getOverlayFromUrl();

      if (!overlay && activeOverlay) {
        closeActiveOverlay();
        return;
      }

      if (overlay && overlay !== activeOverlay) {
        setActiveOverlay(overlay);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [activeOverlay, closeActiveOverlay]);

  useEffect(() => {
    if (activeOverlay !== null) return;

    const pendingTarget = pendingScrollRef.current;
    if (!pendingTarget) return;

    pendingScrollRef.current = null;
    window.requestAnimationFrame(() => {
      scrollToHash(pendingTarget);
    });
  }, [activeOverlay, scrollToHash]);

  useEffect(() => {
    if (!loaded) return;

    // ── Lenis smooth scroll ──────────────────────────────
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    // Connect Lenis to GSAP ticker
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Connect Lenis to ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;

    // Smooth anchor links
    const anchors = document.querySelectorAll('a[href^="#"]');
    const listeners = [];

    anchors.forEach((anchor) => {
      const onClick = (e) => {
        const href = anchor.getAttribute("href");
        if (!href || href === "#") return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        if (activeOverlay) {
          pendingScrollRef.current = href;
          closeActiveOverlay();
          return;
        }

        scrollToHash(href);
      };

      anchor.addEventListener("click", onClick);
      listeners.push({ anchor, onClick });
    });

    return () => {
      listeners.forEach(({ anchor, onClick }) => {
        anchor.removeEventListener("click", onClick);
      });
    };
  }, [activeOverlay, closeActiveOverlay, loaded, scrollToHash]);

  return (
    <>
      {/* Grain noise overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Subtle cursor-follow aura — desktop only */}
      <CustomCursor />

      {/* Page loader */}
      {!loaded && <PageLoader onComplete={handleLoaderComplete} />}

      {/* Main site */}
      {loaded && (
        <main>
          <Navbar />

          {/* Hero — no scroll reveal, it's the first section */}
          <Hero />

          {/* About — rises over hero */}
          <ScrollReveal insetTop={0}>
            <About />
          </ScrollReveal>

          {/* Cube Showcase */}
          <DeferredSection minHeight={860} rootMargin="360px 0px">
            <Suspense fallback={<SectionFallback minHeight={860} />}>
              <ScrollReveal>
                <CubeShowcase />
              </ScrollReveal>
            </Suspense>
          </DeferredSection>

          {/* Services */}
          <ScrollReveal>
            <Services />
          </ScrollReveal>

          {/* Card Gallery / Featured Work */}
          <div id="work">
            <CardGallery onViewAll={() => openOverlay("gallery")} />
          </div>

          {/* Video Showcase */}
          <DeferredSection minHeight={720} rootMargin="320px 0px">
            <Suspense fallback={<SectionFallback minHeight={720} />}>
              <ScrollReveal>
                <VideoShowcase onViewAll={() => openOverlay("videos")} />
              </ScrollReveal>
            </Suspense>
          </DeferredSection>

          {/* Testimonials */}
          <DeferredSection minHeight={640} rootMargin="320px 0px">
            <Suspense fallback={<SectionFallback minHeight={640} />}>
              <ScrollReveal>
                <Testimonials />
              </ScrollReveal>
            </Suspense>
          </DeferredSection>

          {/* Visual Flow Story */}
          <DeferredSection minHeight={860} rootMargin="360px 0px">
            <Suspense fallback={<SectionFallback minHeight={860} />}>
              <VisualFlowSection />
            </Suspense>
          </DeferredSection>

          {/* Contact */}
          <DeferredSection id="contact" minHeight={780} rootMargin="320px 0px">
            <Suspense fallback={<SectionFallback minHeight={780} />}>
              <ScrollReveal>
                <Contact />
              </ScrollReveal>
            </Suspense>
          </DeferredSection>

          {/* Footer */}
          <Footer />
        </main>
      )}

      {/* Full-screen Photography Gallery */}
      {activeOverlay === "gallery" && (
        <Suspense fallback={null}>
          <GalleryPage
            ref={galleryRef}
            isOpen={activeOverlay === "gallery"}
            onClose={finalizeOverlayClose}
          />
        </Suspense>
      )}

      {/* Full-screen Video Library */}
      {activeOverlay === "videos" && (
        <Suspense fallback={null}>
          <VideoLibraryPage
            ref={videoLibraryRef}
            isOpen={activeOverlay === "videos"}
            onClose={finalizeOverlayClose}
          />
        </Suspense>
      )}
    </>
  );
}
