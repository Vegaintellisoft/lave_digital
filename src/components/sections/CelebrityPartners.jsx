"use client";

import { useEffect, useRef, useState } from "react";
import "./CelebrityPartners.css";

/* ── Celebrity data (Unsplash high-res portrait placeholders) ── */
const ROW_1_CELEBS = [
  {
    name: "Aishwarya Menon",
    role: "Actress",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80&auto=format&fit=crop",
  },
  {
    name: "Vikram Raj",
    role: "Actor",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80&auto=format&fit=crop",
  },
  {
    name: "Priya Sharma",
    role: "Model & Influencer",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80&auto=format&fit=crop",
  },
  {
    name: "Arjun Kapoor",
    role: "Actor",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&auto=format&fit=crop",
  },
  {
    name: "Deepika Nair",
    role: "Creator",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80&auto=format&fit=crop",
  },
  {
    name: "Karthik Subramanian",
    role: "Director",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80&auto=format&fit=crop",
  },
];

const ROW_2_CELEBS = [
  {
    name: "Meera Jasmine",
    role: "Actress",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80&auto=format&fit=crop",
  },
  {
    name: "Suriya Prakash",
    role: "Producer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80&auto=format&fit=crop",
  },
  {
    name: "Ananya Sen",
    role: "Artist",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80&auto=format&fit=crop",
  },
  {
    name: "Siddharth Varma",
    role: "Actor & Creator",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=80&auto=format&fit=crop",
  },
  {
    name: "Pooja Hegde",
    role: "Actress",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80&auto=format&fit=crop",
  },
  {
    name: "Rohan Joshi",
    role: "Musician",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80&auto=format&fit=crop",
  },
];

function CelebRow({ celebs, direction = "left", speed = 35, isVisible = true }) {
  const animClass = direction === "left" ? "celeb-track-left" : "celeb-track-right";
  // Double for seamless infinite loop (-50% translateX)
  const doubled = [...celebs, ...celebs];

  return (
    <div className="celeb-row">
      <div
        className={`celeb-track ${animClass}`}
        style={{
          animationDuration: `${speed}s`,
          animationPlayState: isVisible ? "running" : "paused",
        }}
      >
        {doubled.map((celeb, i) => (
          <div
            key={`${celeb.name}-${i}`}
            className="celeb-card"
            aria-hidden={i >= celebs.length ? "true" : undefined}
          >
            <div className="celeb-card-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={celeb.image}
                alt={i >= celebs.length ? "" : celeb.name}
                loading="lazy"
                draggable={false}
              />
              <div className="celeb-card-overlay">
                <span className="celeb-card-name">{celeb.name}</span>
                <span className="celeb-card-role">{celeb.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CelebrityPartners() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  /* ── Visibility Observer for scroll-reveal & CPU saving ── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-theme="light"
      className={`celeb-section ${isVisible ? "celeb-visible" : ""}`}
    >
      {/* ── Section Heading ── */}
      <h2 className="celeb-heading">
        People we <span className="celeb-heading-accent">work</span> with
      </h2>

      {/* ── Dual Auto-Scroll Carousel (Left & Right) ── */}
      <div className="celeb-carousel-container">
        {/* Left and Right Edge Fade Gradients */}
        <div className="celeb-fade celeb-fade-left" />
        <div className="celeb-fade celeb-fade-right" />

        <div className="celeb-rows">
          <CelebRow
            celebs={ROW_1_CELEBS}
            direction="left"
            speed={32}
            isVisible={isVisible}
          />
          {/* <CelebRow
            celebs={ROW_2_CELEBS}
            direction="right"
            speed={38}
            isVisible={isVisible}
          /> */}
        </div>
      </div>
    </section>
  );
}
