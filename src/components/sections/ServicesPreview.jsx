"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useLenis } from "lenis/react";
import "./ServicesPreview.css";
import { services } from "@/lib/services";

export default function ServicesPreview() {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const metricsRef = useRef({ top: 0, scrollable: 1 });
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const activeIndexRef = useRef(0);
  const isRunningRef = useRef(true);

  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const lenis = useLenis();

  /* ── 1. Cache layout metrics on resize & mount (Zero layout thrashing) ── */
  const updateMetrics = useCallback(() => {
    if (!containerRef.current) return;
    const top = containerRef.current.offsetTop;
    const height = containerRef.current.offsetHeight;
    const scrollable = Math.max(1, height - window.innerHeight);
    metricsRef.current = { top, scrollable };
  }, []);

  useEffect(() => {
    updateMetrics();
    window.addEventListener("resize", updateMetrics, { passive: true });
    // Re-check after font/images load
    const timer = setTimeout(updateMetrics, 500);
    return () => {
      window.removeEventListener("resize", updateMetrics);
      clearTimeout(timer);
    };
  }, [updateMetrics]);

  /* ── 2. Track smooth scroll position (Lenis sync with window fallback) ── */
  const updateProgressFromScroll = useCallback((scrollY) => {
    const { top, scrollable } = metricsRef.current;
    const scrolled = scrollY - top;
    const raw = Math.min(Math.max(scrolled / scrollable, 0), 1);
    targetProgressRef.current = raw;
  }, []);

  // Listen via Lenis if available
  useLenis((lenisInstance) => {
    if (lenisInstance) {
      updateProgressFromScroll(lenisInstance.scroll);
    }
  });

  // Native scroll fallback
  useEffect(() => {
    const onScroll = () => {
      if (!window.__lenis) {
        updateProgressFromScroll(window.scrollY);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [updateProgressFromScroll]);

  /* ── 3. High-Performance Direct-DOM RAF Loop (120 FPS, 0 React re-renders) ── */
  useEffect(() => {
    isRunningRef.current = true;
    let animId;
    const total = services.length;
    const lerpFactor = 0.16; // Perfectly responsive, buttery momentum

    // Initialize initial card positions immediately
    const applyTransforms = (progressVal) => {
      const floatIndex = progressVal * (total - 1);
      const cards = cardRefs.current;

      for (let i = 0; i < total; i++) {
        const el = cards[i];
        if (!el) continue;

        const delta = i - floatIndex;
        const absDelta = Math.abs(delta);

        // 3D Helix spatial geometry
        const yPos = delta * 245;
        const xPos = Math.sin(delta * 0.88) * 215;
        const zPos = -absDelta * 145;
        const rotateY = Math.sin(delta * 0.88) * -22;
        const rotateX = delta * -3.2;
        const rotateZ = delta * -1.8;
        const scale = Math.max(0.44, 1 - absDelta * 0.14);
        const opacity = Math.max(0.12, 1 - absDelta * 0.32);
        const zIndex = Math.round(50 - absDelta * 10);

        el.style.transform = `translate3d(calc(-50% + ${xPos}px), calc(-50% + ${yPos}px), ${zPos}px) scale(${scale}) rotateY(${rotateY}deg) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`;
        el.style.opacity = opacity;
        el.style.zIndex = zIndex;

        // Toggle active border styling directly on DOM for zero-delay feedback
        if (absDelta < 0.5) {
          el.classList.add("active");
        } else {
          el.classList.remove("active");
        }
      }

      // Only trigger React state update when the integer index actually changes
      const newActive = Math.min(
        total - 1,
        Math.max(0, Math.round(floatIndex))
      );
      if (newActive !== activeIndexRef.current) {
        activeIndexRef.current = newActive;
        setActiveIndex(newActive);
      }
    };

    const renderLoop = () => {
      if (!isRunningRef.current) return;

      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * lerpFactor;
        applyTransforms(currentProgressRef.current);
      } else if (current !== target) {
        currentProgressRef.current = target;
        applyTransforms(target);
      }

      animId = requestAnimationFrame(renderLoop);
    };

    // Initial render
    applyTransforms(0);
    animId = requestAnimationFrame(renderLoop);

    return () => {
      isRunningRef.current = false;
      cancelAnimationFrame(animId);
    };
  }, []);

  /* ── 4. Smooth jump using Lenis or window scroll ── */
  const jumpToIndex = useCallback(
    (index) => {
      updateMetrics();
      const { top, scrollable } = metricsRef.current;
      const targetY = top + (index / (services.length - 1)) * scrollable;

      const activeLenis = lenis || window.__lenis;
      if (activeLenis) {
        activeLenis.scrollTo(targetY, {
          duration: 1.1,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        window.scrollTo({
          top: targetY,
          behavior: "smooth",
        });
      }
    },
    [lenis, updateMetrics]
  );

  /* ── 5. Fullscreen modal expand / collapse ── */
  const toggleExpand = useCallback((index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  }, []);

  /* ── 6. Keyboard navigation (Arrow keys + Escape) ── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setExpandedIndex(null);
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        if (expandedIndex === null) {
          jumpToIndex(Math.min(services.length - 1, activeIndexRef.current + 1));
        }
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        if (expandedIndex === null) {
          jumpToIndex(Math.max(0, activeIndexRef.current - 1));
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expandedIndex, jumpToIndex]);

  const active = services[activeIndex] || services[0];

  return (
    <section
      ref={containerRef}
      id="services-preview"
      className="runway-container"
      data-theme="dark"
    >
      {/* ── Sticky Fullscreen Viewport (100vh) ── */}
      <div className="runway-sticky">
        {/* Background ambient lighting */}
        <div className="runway-bg-glow" />

        {/* ── Top Bar Header ── */}
        <header className="runway-header">
          <div className="runway-header-left">
            <span className="runway-badge">CAPABILITIES</span>
            <h2 className="runway-title">OUR SERVICES</h2>
            <p className="runway-subtitle-text">
              SCROLL TO WALK THE SHOW • CLICK IMAGE TO EXPAND
            </p>
          </div>
          <div className="runway-header-right">
            <span className="runway-header-counter">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(services.length).padStart(2, "0")}
            </span>
          </div>
        </header>

        {/* ── LEFT PANEL: Index Navigation ── */}
        <aside className="runway-left-panel">
          <nav className="runway-index-nav" aria-label="Services List">
            {services.map((service, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={service.id}
                  type="button"
                  className={`runway-index-row ${isActive ? "active" : ""}`}
                  onClick={() => jumpToIndex(i)}
                  aria-label={`Jump to ${service.title}`}
                >
                  <span className="runway-row-num">
                    {String(i).padStart(2, "0")}
                  </span>
                  <span className="runway-row-name">
                    {service.shortTitle.toUpperCase()}
                  </span>
                  <span className="runway-row-cat">{service.category}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ── CENTER: Fullscreen 3D Helix Stage ── */}
        <div className="runway-helix-viewport">
          <div className="runway-helix-stage">
            {services.map((service, i) => {
              return (
                <div
                  key={service.id}
                  ref={(el) => (cardRefs.current[i] = el)}
                  className="runway-card"
                  onClick={() => toggleExpand(i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") toggleExpand(i);
                  }}
                  aria-label={`View ${service.title} in full screen`}
                >
                  <div className="runway-card-inner">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="runway-card-img"
                      loading={i < 2 ? "eager" : "lazy"}
                      draggable={false}
                    />
                    <div className="runway-card-gradient" />

                    {/* Index watermark */}
                    <div className="runway-card-tag">
                      <span className="runway-card-index">
                        {String(i).padStart(2, "0")}
                      </span>
                      <span className="runway-card-name">
                        {service.shortTitle}
                      </span>
                    </div>

                    {/* Expand icon on hover */}
                    <div className="runway-card-action">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="15 3 21 3 21 9" />
                        <polyline points="9 21 3 21 3 15" />
                        <line x1="21" y1="3" x2="14" y2="10" />
                        <line x1="3" y1="21" x2="10" y2="14" />
                      </svg>
                      <span>EXPAND</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT PANEL: Active Service Details ── */}
        <aside className="runway-right-panel" key={active.id}>
          <div className="runway-meta-header">
            <span className="runway-code">
              LV-{String(activeIndex).padStart(2, "0")}
            </span>
            <span className="runway-fraction">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(services.length).padStart(2, "0")}
            </span>
          </div>

          <h3 className="runway-panel-title">{active.title}</h3>

          <div className="runway-divider" />

          <dl className="runway-specs">
            <div className="runway-spec-item">
              <dt>CATEGORY</dt>
              <dd>{active.category}</dd>
            </div>
            <div className="runway-spec-item">
              <dt>TYPE</dt>
              <dd>{active.shortTitle.toUpperCase()}</dd>
            </div>
            <div className="runway-spec-item">
              <dt>SCOPE</dt>
              <dd>{active.features.length} CAPABILITIES</dd>
            </div>
          </dl>

          <p className="runway-panel-desc">{active.description}</p>

          <ul className="runway-features-list">
            {active.features.map((feat, fi) => (
              <li key={fi}>
                <span className="runway-feature-dot" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>

          <div className="runway-actions">
            <Link
              href={`/services#${active.id}`}
              className="runway-explore-btn"
            >
              <span>Explore Service</span>
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
            </Link>

            <button
              type="button"
              className="runway-expand-trigger"
              onClick={() => toggleExpand(activeIndex)}
              aria-label="View full screen"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
              <span>Full Screen</span>
            </button>
          </div>
        </aside>

        {/* ── Bottom Controls ── */}
        <footer className="runway-bottom-bar">
          <div className="runway-bottom-dots">
            {services.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`runway-dot ${i === activeIndex ? "active" : ""}`}
                onClick={() => jumpToIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <Link href="/services" className="runway-all-link">
            <span>Explore All Capabilities</span>
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
          </Link>
        </footer>
      </div>

      {/* ── FULL SCREEN MODAL / LIGHTBOX ── */}
      {expandedIndex !== null && (
        <div
          className="runway-fullscreen-modal"
          onClick={() => setExpandedIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="runway-modal-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="runway-modal-close"
              onClick={() => setExpandedIndex(null)}
              aria-label="Close full screen view"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="runway-modal-hero">
              <img
                src={services[expandedIndex].image}
                alt={services[expandedIndex].title}
                className="runway-modal-img"
              />
              <div className="runway-modal-hero-gradient" />
              <div className="runway-modal-hero-badge">
                <span>LV-{String(expandedIndex).padStart(2, "0")}</span>
                <span>{services[expandedIndex].category}</span>
              </div>
            </div>

            <div className="runway-modal-body">
              <span className="runway-modal-subtitle">
                {services[expandedIndex].shortTitle.toUpperCase()}
              </span>
              <h2 className="runway-modal-title">
                {services[expandedIndex].title}
              </h2>
              <p className="runway-modal-desc">
                {services[expandedIndex].description}
              </p>

              <div className="runway-modal-features">
                <h4 className="runway-modal-features-heading">
                  KEY DELIVERABLES & CAPABILITIES
                </h4>
                <ul>
                  {services[expandedIndex].features.map((feat, fi) => (
                    <li key={fi}>
                      <span className="runway-feature-dot" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="runway-modal-actions">
                <Link
                  href={`/services#${services[expandedIndex].id}`}
                  className="runway-modal-cta"
                  onClick={() => setExpandedIndex(null)}
                >
                  <span>View Complete Case Studies & Scope</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
