"use client";

import { useEffect, useRef, useState } from "react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import BounceCards from "@/components/ui/BounceCards";
import { testimonials } from "@/lib/testimonials";

/* ─── Star Rating ─── */
function Stars() {
  return (
    <div className="flex gap-1 text-amber-400">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

/* ─── Quote Icon ─── */
function QuoteIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-primary/30 shrink-0"
    >
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zM15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
  );
}

export default function Testimonials() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0); // Start on first card
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);

  /* ─── Scroll Visibility Observer ─── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    section.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* ─── Auto-Switch Loop (Cycles reviews one by one, pauses on hover) ─── */
  useEffect(() => {
    if (isPaused || !isInView) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isPaused, isInView]);

  const current = testimonials[activeIndex] || testimonials[0];

  const bounceCardItems = testimonials.map((t) => ({
    src: t.avatar,
    alt: `${t.name} - ${t.company}`,
    title: t.name,
    subtitle: t.company,
  }));

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      data-theme="light"
      className="py-12 lg:py-16 bg-surface-alt relative overflow-hidden select-none"
    >
      {/* Decorative Radial Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)",
        }}
      />

      <Container className="relative z-10">
        <div className="reveal">
          <SectionHeading
            eyebrow="Testimonials"
            title="What Our Clients Say"
            highlightedWord="Clients"
            description="Real stories from ambitious founders and leadership teams who trust Lave Digital with their brand and digital platforms."
          />
        </div>

        {/* ─── Interactive BounceCards Deck (Auto-switching + Card-Only Hover Focus) ─── */}
        <div className="reveal max-w-4xl mx-auto flex flex-col items-center">
          <div className="w-full flex items-center justify-center py-6 overflow-visible">
            <BounceCards
              images={bounceCardItems}
              containerWidth={540}
              containerHeight={300}
              cardSize={185}
              spread={80}
              rotation={10}
              arc={-6}
              pushDistance={150}
              hoverScale={1.12}
              bounciness={0.65}
              animationDelay={0.2}
              animationStagger={0.07}
              borderWidth={4}
              borderColor="#ffffff"
              radius={22}
              shadow={true}
              enableHover={true}
              activeIndex={activeIndex}
              onCardClick={(index) => {
                if (typeof index === "number" && index >= 0) {
                  setActiveIndex(index);
                }
              }}
              onCardHover={(index) => {
                if (typeof index === "number" && index >= 0) {
                  setActiveIndex(index);
                  setIsPaused(true);
                } else {
                  setIsPaused(false);
                }
              }}
            />
          </div>

          {/* <p className="text-xs font-semibold tracking-wider uppercase text-neutral-400 mt-2 mb-6 flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                isPaused ? "bg-amber-400" : "bg-primary animate-pulse"
              }`}
            />
            {isPaused
              ? "Focused on client · Move off card to resume auto-play"
              : "Auto-playing stories · Hover any card image to focus"}
          </p> */}

          {/* ─── Active Testimonial Spotlight Card ─── */}
          <div className="w-full max-w-2xl bg-neutral-900/90 text-white border border-white/10 rounded-3xl p-7 sm:p-9 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-300">
            {/* Ambient accent inside card */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

            {/* Top row: Stars & Badge */}
            <div className="flex items-center justify-between mb-4">
              <Stars />
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-primary/20 text-white border border-primary/40 backdrop-blur-md">
                  Verified Partner
                </span>
                <QuoteIcon />
              </div>
            </div>

            {/* Quote content with smooth key transition */}
            <div
              key={activeIndex}
              className="my-5 transition-opacity duration-300 ease-in-out"
            >
              <blockquote className="text-base sm:text-lg lg:text-xl leading-relaxed text-neutral-100 font-medium italic min-h-[80px]">
                &ldquo;{current.quote}&rdquo;
              </blockquote>
            </div>

            {/* Bottom row: Client Details & Pagination Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-white/10">
              <div className="flex items-center gap-3.5">
                <img
                  src={current.avatar}
                  alt={current.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary shadow-md shadow-primary/30 shrink-0"
                />
                <div>
                  <div className="font-bold text-white text-base tracking-tight">
                    {current.name}
                  </div>
                  <div className="text-xs text-neutral-400">
                    {current.role} ·{" "}
                    <span className="text-primary font-semibold">
                      {current.company}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <button
                  onClick={handlePrev}
                  className="w-9 h-9 rounded-full border border-white/20 bg-white/5 text-white hover:bg-primary hover:border-primary flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                  aria-label="Previous testimonial"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                </button>

                {/* Dots with active width transition */}
                <div className="flex items-center gap-1.5 px-1">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        i === activeIndex
                          ? "bg-primary w-6"
                          : "bg-white/20 hover:bg-white/40 w-2"
                      }`}
                      aria-label={`Go to client ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="w-9 h-9 rounded-full border border-white/20 bg-white/5 text-white hover:bg-primary hover:border-primary flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                  aria-label="Next testimonial"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
