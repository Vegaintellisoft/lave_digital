"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import "./ServicesPreview.css";
import { services } from "@/lib/services";

export default function ServicesPreview() {
  const serviceRefs = useRef([]);

  /* ── Intersection Observer for scroll-reveal animations ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("sp-visible");
            observer.unobserve(entry.target); // animate only once
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    serviceRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="services-preview" className="sp-section" data-theme="light">
      {/* ── Section Header ── */}
      <header className="sp-header">
        <span className="sp-label">Our Capabilities</span>
        <h2 className="sp-heading">
          A look at the <span className="sp-heading-accent">work</span>
        </h2>
        <p className="sp-subtitle">
          From brand strategy to video production, we bring creative vision to
          life with services tailored for impact and growth.
        </p>
      </header>

      {/* ── Service List ── */}
      <div className="sp-list">
        {services.map((service, i) => (
          <article
            key={service.id}
            ref={(el) => (serviceRefs.current[i] = el)}
            className={`sp-service ${i % 2 === 1 ? "sp-service-reverse" : ""}`}
          >
            {/* Top Row: Title + Category */}
            <div className="sp-service-top">
              <div className="sp-service-title-group">
                <span className="sp-service-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Link
                  href={`/services#${service.id}`}
                  className="sp-service-name"
                >
                  {service.title}
                  <span className="sp-service-arrow">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </span>
                </Link>
              </div>
              <span className="sp-service-category">{service.category}</span>
            </div>

            {/* Body: Image + Content */}
            <div className="sp-service-body">
              {/* Image */}
              <div className="sp-service-image">
                <img
                  src={service.image}
                  alt={service.title}
                  className="sp-service-img"
                  loading={i < 2 ? "eager" : "lazy"}
                  draggable={false}
                />
                <div className="sp-service-image-overlay" />
                <div className="sp-service-image-badge">
                  <span>LV-{String(i + 1).padStart(2, "0")}</span>
                  <span>{service.shortTitle}</span>
                </div>
              </div>

              {/* Content */}
              <div className="sp-service-content">
                <p className="sp-service-desc">{service.description}</p>

                <div className="sp-service-features">
                  {service.features.map((feat, fi) => (
                    <div key={fi} className="sp-feature-item">
                      <span className="sp-feature-dot" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/services#${service.id}`}
                  className="sp-service-link"
                >
                  <span>Learn More</span>
                  <svg
                    width="14"
                    height="14"
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
              </div>
            </div>

            {/* ── Brands We Work With & Work Delivered ── */}
            {service.featuredWork && service.featuredWork.length > 0 && (
              <div className="sp-work-showcase">
                <div className="sp-work-header">
                  <span className="sp-work-label">
                    Brands we work with &amp; work delivered
                  </span>
                  <div className="sp-work-line" />
                </div>
                <div className="sp-work-grid">
                  {service.featuredWork.map((item, wi) => (
                    <div key={wi} className="sp-work-card">
                      <div className="sp-work-logo-box">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.logo}
                          alt={item.brand}
                          className="sp-work-logo"
                          loading="lazy"
                          draggable={false}
                        />
                      </div>
                      <div className="sp-work-caption">
                        <span className="sp-work-brand-name">{item.brand}</span>
                        <span className="sp-work-tag">{item.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* ── Bottom CTA ── */}
      <div className="sp-footer">
        <Link href="/services" className="sp-cta">
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
      </div>
    </section>
  );
}
