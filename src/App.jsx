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
import Footer from "./components/Footer";
import ScrollReveal from "./components/ScrollReveal";
import DeferredSection from "./components/DeferredSection";

gsap.registerPlugin(ScrollTrigger);

const VisualFlowSection = lazy(() => import("./components/VisualFlowSection"));
const CubeShowcase = lazy(() => import("./components/CubeShowcase"));
const CardGallery = lazy(() => import("./components/CardGallery"));
const Testimonials = lazy(() => import("./components/Testimonials"));
const Contact = lazy(() => import("./components/Contact"));

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
  const lenisRef = useRef(null);

  const handleLoaderComplete = useCallback(() => {
    setLoaded(true);
  }, []);

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
        lenis.scrollTo(target, {
          offset: -80,
          duration: 1.6,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      };

      anchor.addEventListener("click", onClick);
      listeners.push({ anchor, onClick });
    });

    return () => {
      listeners.forEach(({ anchor, onClick }) => {
        anchor.removeEventListener("click", onClick);
      });
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, [loaded]);

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

          {/* Visual Flow Story */}
          <DeferredSection minHeight={860} rootMargin="360px 0px">
            <Suspense fallback={<SectionFallback minHeight={860} />}>
              <VisualFlowSection />
            </Suspense>
          </DeferredSection>

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
          <DeferredSection id="work" minHeight={900} rootMargin="320px 0px">
            <Suspense fallback={<SectionFallback minHeight={900} />}>
              <CardGallery />
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
    </>
  );
}
