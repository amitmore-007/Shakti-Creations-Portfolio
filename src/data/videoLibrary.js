import heroVideo from "../assets/hero-video.mp4";
import cubeVideo1 from "../assets/cube-video-1.mp4";
import cubeVideo2 from "../assets/cube-video-2.mp4";

import gallery1 from "../assets/gallery-1.webp";
import gallery2 from "../assets/gallery-2.webp";
import gallery3 from "../assets/gallery-3.webp";
import gallery4 from "../assets/gallery-4.webp";
import gallery5 from "../assets/gallery-5.webp";
import gallery6 from "../assets/gallery-6.webp";
import aboutPortrait from "../assets/about-portrait.webp";
import serviceModel from "../assets/service-model.webp";
import serviceTravel from "../assets/service-travel.webp";

export const VIDEO_LIBRARY = [
  {
    id: 1,
    title: "Midnight Campaign Cut",
    category: "Brand Films",
    src: heroVideo,
    poster: gallery1,
    duration: "00:32",
    description: "Fashion-led campaign storytelling with cinematic pacing.",
  },
  {
    id: 2,
    title: "Atlas Street Diary",
    category: "Travel Stories",
    src: cubeVideo1,
    poster: gallery4,
    duration: "00:24",
    description: "Fast travel montage crafted for short-form social platforms.",
  },
  {
    id: 3,
    title: "Pulse Launch Reel",
    category: "Event Reels",
    src: cubeVideo2,
    poster: gallery6,
    duration: "00:28",
    description: "High-energy product launch recap with rhythmic transitions.",
  },
  {
    id: 4,
    title: "Monsoon Portrait Motion",
    category: "Lifestyle",
    src: heroVideo,
    poster: aboutPortrait,
    duration: "00:30",
    description: "Intimate portrait film with natural light and soft textures.",
  },
  {
    id: 5,
    title: "Rooftop Runway Cut",
    category: "Brand Films",
    src: cubeVideo2,
    poster: serviceModel,
    duration: "00:22",
    description: "Editorial-style fashion motion built for campaign ads.",
  },
  {
    id: 6,
    title: "Backwater Transit",
    category: "Travel Stories",
    src: cubeVideo1,
    poster: serviceTravel,
    duration: "00:26",
    description: "Atmospheric travel sequence with dynamic aerial transitions.",
  },
  {
    id: 7,
    title: "Aftermovie: Neon Gala",
    category: "Event Reels",
    src: heroVideo,
    poster: gallery5,
    duration: "00:36",
    description: "Luxury event highlights featuring kinetic typography moments.",
  },
  {
    id: 8,
    title: "Food Story: Spice Night",
    category: "Lifestyle",
    src: cubeVideo1,
    poster: gallery3,
    duration: "00:20",
    description: "Texture-rich culinary storytelling with macro-driven visuals.",
  },
  {
    id: 9,
    title: "Architecture Drift",
    category: "Documentary Cuts",
    src: cubeVideo2,
    poster: gallery2,
    duration: "00:29",
    description: "Modern architecture study built around geometric movement.",
  },
];

export const VIDEO_CATEGORIES = [
  "All",
  ...Array.from(new Set(VIDEO_LIBRARY.map((video) => video.category))),
];
