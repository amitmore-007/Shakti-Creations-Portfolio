import React from "react";
import "./VideoShowcase.css";
import GridBackground from "./GridBackground";
import { VIDEO_LIBRARY } from "../data/videoLibrary";

const FEATURED_VIDEOS = VIDEO_LIBRARY.slice(0, 3);

export default function VideoShowcase({ onViewAll }) {
  return (
    <section className="video-showcase grid-host" id="videos">
      <GridBackground
        direction="left"
        className="grid-background--front video-showcase-grid"
      />
      <div className="video-showcase-header">
        <span className="section-label">Motion Archive</span>
        <h2 className="video-showcase-title">
          Featured <em>Video Cuts</em>
        </h2>
        <p className="video-showcase-sub">
          Crafted for campaigns, events, and stories that demand attention in
          under ten seconds.
        </p>
      </div>

      <div className="video-showcase-grid">
        {FEATURED_VIDEOS.map((video, index) => (
          <article
            key={video.id}
            className={`video-teaser-card video-teaser-card--${index + 1}`}
          >
            <video
              className="video-teaser-media"
              src={video.src}
              poster={video.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
            <div className="video-teaser-overlay" />
            <div className="video-teaser-meta">
              <span className="video-teaser-cat">{video.category}</span>
              <h3 className="video-teaser-title">{video.title}</h3>
              <span className="video-teaser-duration">{video.duration}</span>
            </div>
          </article>
        ))}
      </div>

      {onViewAll ? (
        <button
          className="video-showcase-cta"
          type="button"
          onClick={onViewAll}
        >
          <span>View Full Video Library</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8H13M13 8L8 3M13 8L8 13"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ) : (
        <a className="video-showcase-cta" href="/videos">
          <span>View Full Video Library</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8H13M13 8L8 3M13 8L8 13"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      )}
    </section>
  );
}
