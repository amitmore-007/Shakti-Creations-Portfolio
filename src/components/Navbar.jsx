import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const WaveLabel = React.memo(function WaveLabel({ label }) {
  return (
    <span className="nav-link-text" aria-hidden="true">
      {label.split("").map((char, i) => {
        const displayChar = char === " " ? "\u00A0" : char;
        return (
          <span
            className="nav-wave-char"
            style={{ "--i": i }}
            key={`${label}-${i}`}
          >
            <span className="nav-wave-top">{displayChar}</span>
            <span className="nav-wave-bottom">{displayChar}</span>
          </span>
        );
      })}
    </span>
  );
});

export default function Navbar() {
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuLinksRef = useRef([]);
  const scrollRafRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (scrollRafRef.current) return;

      scrollRafRef.current = window.requestAnimationFrame(() => {
        const next = window.scrollY > 60;
        setScrolled((prev) => (prev === next ? prev : next));
        scrollRafRef.current = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    gsap.fromTo(
      navRef.current,
      { y: -28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.15 },
    );

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollRafRef.current) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      gsap.to(menuRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.7,
        ease: "power3.inOut",
      });
      gsap.fromTo(
        menuLinksRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.07,
          delay: 0.3,
          duration: 0.6,
          ease: "power3.out",
        },
      );
    } else {
      document.body.style.overflow = "";
      gsap.to(menuRef.current, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.6,
        ease: "power3.inOut",
      });
    }
  }, [menuOpen]);

  // Magnetic links
  const handleMouseMove = (e, el) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: "power2.out" });
  };
  const handleMouseLeave = (el) => {
    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.5)" });
  };

  return (
    <>
      <nav ref={navRef} className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <a href="#home" className="nav-logo">
          <span className="logo-first">SHAKTI</span>
          <span className="logo-dot">•</span>
          <span className="logo-last">CREATIONS</span>
        </a>

        <ul className="nav-links">
          {NAV_LINKS.map((link, i) => (
            <li key={i}>
              <a
                href={link.href}
                className="nav-link"
                aria-label={link.label}
                style={{ "--wave-total": link.label.length }}
                onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
              >
                <WaveLabel label={link.label} />
                <span className="sr-only">{link.label}</span>
                <span className="nav-link-line" />
              </a>
            </li>
          ))}
        </ul>

        <a href="#contact" className="nav-cta">
          <span>Lets Talk</span>
        </a>

        <button
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Full screen mobile menu */}
      <div
        ref={menuRef}
        className="mobile-menu"
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      >
        <ul className="mobile-menu-links">
          {NAV_LINKS.map((link, i) => (
            <li key={i}>
              <a
                href={link.href}
                ref={(el) => (menuLinksRef.current[i] = el)}
                onClick={() => setMenuOpen(false)}
                className="mobile-link"
              >
                <span className="mobile-link-num">0{i + 1}</span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mobile-menu-footer">
          <p>© 2025 Shakti Creations</p>
          <div className="mobile-socials">
            <a href="#">IG</a>
            <a href="#">YT</a>
            <a href="#">BE</a>
          </div>
        </div>
      </div>
    </>
  );
}
