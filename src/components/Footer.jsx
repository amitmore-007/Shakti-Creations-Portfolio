import React from "react";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <span className="footer-logo">
            SHAKTI<span className="footer-logo-accent">•CREATIONS</span>
          </span>
          <p className="footer-tagline">
            Visual stories that
            <br />
            <em>leave a mark.</em>
          </p>
        </div>

        <nav className="footer-nav">
          <div className="footer-nav-col">
            <span className="footer-nav-title">Pages</span>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#work">Work</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-nav-col">
            <span className="footer-nav-title">Services</span>
            <a href="#services">Model Shoots</a>
            <a href="#services">Brand Content</a>
            <a href="#services">Travel Films</a>
            <a href="#contact">Collaborations</a>
          </div>
          <div className="footer-nav-col">
            <span className="footer-nav-title">Social</span>
            <a href="#" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="#" target="_blank" rel="noreferrer">
              YouTube
            </a>
            <a href="#" target="_blank" rel="noreferrer">
              Behance
            </a>
            <a href="#" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </nav>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        <span className="footer-copy">
          © {year} Shakti Creations. All rights reserved.
        </span>
        <span className="footer-location">Pune · India · Worldwide</span>
        <span className="footer-credit">Crafted with obsession</span>
      </div>

      {/* Big background word */}
      <div className="footer-bg-word" aria-hidden="true">
        VISUAL
      </div>
    </footer>
  );
}
