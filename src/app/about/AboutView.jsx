"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const capabilitiesData = {
  brand: [
    {
      name: "Brand Architecture",
      desc: "Structuring parent, sub-brand, and product hierarchies to maximize market clarity and long-term equity.",
      standard: "Comprehensive portfolio audit, naming taxonomy, and governance frameworks designed for multi-market expansion.",
    },
    {
      name: "Typographic Systems",
      desc: "Custom font pairing, optical sizing, and rigorous hierarchical scales engineered for cross-platform legibility.",
      standard: "Strict typographic proportion scales adhering to responsive viewport clamps, optical alignment, and accessible contrast.",
    },
    {
      name: "Visual Identity Design",
      desc: "Monolithic marks, bespoke palettes, and dynamic design motifs derived directly from brand origin and materials.",
      standard: "Zero generic templates. Every identity system is authored with bespoke geometry, motion rules, and usage constraints.",
    },
    {
      name: "Design Systems & Tokens",
      desc: "Scalable component libraries, semantic CSS custom properties, and multi-brand design tokens synced to code.",
      standard: "W3C-compliant token architecture bridging Figma variables directly to modern frontend pipelines.",
    },
    {
      name: "Art & Editorial Direction",
      desc: "Cinematic art direction, authentic photography curation, and layout choreography for high-end digital publications.",
      standard: "Every visual asset is commissioned, produced, or curated with real physical depth and uncompromising aesthetic discipline.",
    },
    {
      name: "Packaging & Spatial Media",
      desc: "Tactile packaging, material finishes, and spatial environmental graphics translating digital brands into the physical realm.",
      standard: "Production-ready print engineering, debossing specs, and material sourcing aligned with sustainable studio benchmarks.",
    },
  ],
  engineering: [
    {
      name: "Bespoke Web Platforms",
      desc: "Custom web applications built on Next.js, React, and modular headless architectures engineered for high throughput.",
      standard: "Sub-second initial paint, flawless semantic markup, zero bundle bloat, and enterprise-grade uptime resilience.",
    },
    {
      name: "Interactive 3D & WebGL",
      desc: "Hardware-accelerated shaders, Three.js/OGL scene graphs, and real-time GPU graphics that enrich narrative storytelling.",
      standard: "Graceful 60fps execution on mobile and desktop with automated fallback states for lower-powered devices.",
    },
    {
      name: "Headless E-Commerce",
      desc: "Bespoke storefront experiences with decoupled checkouts, high-conversion merchandising, and unified catalog APIs.",
      standard: "Instantaneous page transitions, edge-cached inventory lookups, and compliant payment gateway integrations.",
    },
    {
      name: "Kinetic Motion Engineering",
      desc: "Scroll-linked timelines, choreographies with GSAP and CSS scroll timelines, and tactile feedback under the cursor.",
      standard: "Transform and opacity properties only. Strict adherence to prefers-reduced-motion media queries.",
    },
    {
      name: "Performance & SEO Infrastructure",
      desc: "Deep technical search engine optimization, JSON-LD knowledge graphs, core web vitals tuning, and edge caching.",
      standard: "Targeting 95+ Google Lighthouse scores across Performance, Accessibility, Best Practices, and SEO.",
    },
    {
      name: "Accessible UI Architecture",
      desc: "WCAG 2.1 AA compliance, full keyboard navigation workflows, ARIA landmarks, and high-contrast screen reader support.",
      standard: "Every interactive control is verified for visual focus indicators, accessible naming, and logical focus flow.",
    },
  ],
  principles: [
    {
      name: "Relentless Craft",
      desc: "We reject the mediocre median. Every typographic scale, transition curve, and line of code is held to museum standard.",
      standard: "Nothing ships by accident. Every detail is authored with intention and measured against real gallery benchmarks.",
    },
    {
      name: "Measurable Commercial Impact",
      desc: "Extraordinary aesthetics exist to drive clear commercial advantage, audience trust, and measurable enterprise valuation.",
      standard: "We benchmark quantitative conversion data, engagement dwell times, and brand affinity metrics across all launches.",
    },
    {
      name: "Direct Senior Partnership",
      desc: "Our clients work directly with the practitioners who design and code their platforms, eliminating junior agency overhead.",
      standard: "Zero account manager proxies. Direct Slack/briefing channels with creative directors and lead architects.",
    },
    {
      name: "Radical Simplicity",
      desc: "Removing artificial ornamentation to reveal the essential idea, confident typography, and structural truth of the subject.",
      standard: "No decorative blobs, no hairline clutter, and no artificial gradients. Form follows substance.",
    },
    {
      name: "Zero Synthetic Filler",
      desc: "We refuse to publish fake testimonials, placeholder numbers, stock templates, or synthetic copy generated without thought.",
      standard: "Every claim on our platforms is substantiated by real case records, transparent data, and verified outcomes.",
    },
    {
      name: "Longevity Over Trends",
      desc: "We engineer systems and brand identities designed to remain fresh and authoritative five years post-deployment.",
      standard: "Built upon classic typographic discipline, resilient web standards, and timeless architectural foundations.",
    },
  ],
};

const leadership = [
  {
    name: "Aiden Vance",
    role: "Founder & Creative Director",
    discipline: "Brand Architecture & Direction",
    bio: "Guiding brand transformations for international enterprises and creative scale-ups over the past twelve years.",
    image: "/images/services/branding.jpg",
  },
  {
    name: "Elena Rostova",
    role: "Head of Product & Design",
    discipline: "Design Systems & UI Architecture",
    bio: "Pioneering tactile design systems, typographic discipline, and human-centered digital product interfaces.",
    image: "/images/services/uiux.jpg",
  },
  {
    name: "Marcus Chen",
    role: "Lead Systems Architect",
    discipline: "3D Web & Frontend Infrastructure",
    bio: "Engineering high-performance Next.js applications, custom WebGL graphics, and resilient headless cloud systems.",
    image: "/images/services/video.jpg",
  },
  {
    name: "Sophia Delgado",
    role: "Director of Digital Strategy",
    discipline: "Performance & Content Architecture",
    bio: "Aligning aesthetic craft with conversion economics, multi-channel distribution, and scalable brand reach.",
    image: "/images/services/marketing.jpg",
  },
];

const stats = [
  {
    value: "100+",
    statement: "Digital platforms, brand identities, and custom products delivered across global technology and luxury sectors.",
  },
  {
    value: "50+",
    statement: "Ambitious partner brands scaled through our design systems and tailored technical infrastructure.",
  },
  {
    value: "10M+",
    statement: "Organic audience impressions generated annually across client platforms and campaign architectures.",
  },
  {
    value: "100%",
    statement: "Direct senior involvement on every commission with zero outsourced layers or junior account tiers.",
  },
];

export default function AboutView() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const wordmarkRef = useRef(null);
  const videoRef = useRef(null);

  // The Live Thing: Interactive discipline inspector in columns 10-12
  const [activeItem, setActiveItem] = useState({
    name: "Brand Architecture",
    desc: "Structuring parent, sub-brand, and product hierarchies to maximize market clarity and long-term equity.",
    standard: "Comprehensive portfolio audit, naming taxonomy, and governance frameworks designed for multi-market expansion.",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Signature Move: Scaling wordmark (taste-skill recipe)
      // As first screen leaves, the giant wordmark scales down subtly (1.0 to 0.94)
      if (wordmarkRef.current && heroRef.current) {
        gsap.to(wordmarkRef.current, {
          scale: 0.94,
          opacity: 0.85,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Section entrances: reading order, opacity and subtle translation
      const revealSections = containerRef.current?.querySelectorAll(".taste-reveal-block");
      revealSections?.forEach((sec) => {
        const title = sec.querySelector(".taste-reveal-title");
        const body = sec.querySelectorAll(".taste-reveal-item");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sec,
            start: "top 85%",
            once: true,
          },
        });

        if (title) {
          tl.from(title, {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
          });
        }

        if (body.length > 0) {
          tl.from(
            body,
            {
              y: 24,
              opacity: 0,
              stagger: 0.08,
              duration: 0.7,
              ease: "power3.out",
            },
            "-=0.4"
          );
        }
      });
    }, containerRef);

    // Video observer to pause playback offscreen
    let videoObserver = null;
    const currentVideo = videoRef.current;
    if (currentVideo) {
      currentVideo.defaultMuted = true;
      currentVideo.muted = true;
      videoObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            currentVideo.play().catch(() => {});
          } else {
            currentVideo.pause();
          }
        },
        { threshold: 0.1 }
      );
      videoObserver.observe(currentVideo);
    }

    return () => {
      ctx.revert();
      if (videoObserver && currentVideo) {
        videoObserver.unobserve(currentVideo);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* ─── Hero Section: Name Across The Middle ─── */}
      <section
        ref={heroRef}
        className="relative min-h-svh flex flex-col justify-between px-6 sm:px-10 lg:px-16 pt-32 pb-12 overflow-hidden bg-white"
      >
        {/* Top bar across the screen */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start w-full">
          <div className="md:col-span-6 lg:col-span-5">
            <p className="text-lg md:text-xl text-neutral-800 leading-snug max-w-sm">
              Independent creative studio engineering brand identities, interactive 3D, and high-performance digital platforms.
            </p>
            <div className="mt-5">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-neutral-900 text-white font-medium text-sm tracking-normal hover:bg-neutral-800 active:bg-neutral-950 transition-colors duration-200"
              >
                Initiate project
              </Link>
            </div>
          </div>

          <div className="md:col-span-6 lg:col-span-7 flex flex-col md:items-end justify-start text-left md:text-right">
            <span className="text-sm font-medium text-neutral-900">
              Mumbai, India
            </span>
            <span className="text-sm text-neutral-500 mt-1">
              19°04&apos;N 72°52&apos;E
            </span>
            <span className="text-sm text-neutral-500 mt-1">
              Design, Code &amp; Direction
            </span>
          </div>
        </div>

        {/* Center: Monolithic Wordmark across the viewport */}
        <div className="my-auto py-12 md:py-20 w-full overflow-hidden select-none">
          <div ref={wordmarkRef} className="w-full transform-gpu will-change-transform">
            <h1 className="w-full text-[14.5vw] font-display font-extrabold uppercase leading-[0.84] tracking-[-0.04em] text-neutral-900 whitespace-nowrap text-center">
              LAVE DIGITAL
            </h1>
          </div>
        </div>

        {/* Bottom bar across the screen */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end w-full text-sm text-neutral-600">
          <div className="md:col-span-6">
            <span>Studio Founded 2021 · Selective Worldwide Practice</span>
          </div>
          <div className="md:col-span-6 flex md:justify-end">
            <span>Scroll to inspect studio practice</span>
          </div>
        </div>
      </section>

      {/* ─── Section 1: Studio Biography & Drop-Cap Portrait ─── */}
      <section className="py-28 md:py-40 px-6 sm:px-10 lg:px-16 bg-neutral-50 taste-reveal-block">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Columns 1-2: Studio facts */}
          <div className="lg:col-span-3 space-y-6 text-sm taste-reveal-item">
            <div>
              <div className="text-xs text-neutral-400">Headquarters</div>
              <div className="font-medium text-neutral-900 mt-1">Mumbai, Maharashtra</div>
            </div>
            <div>
              <div className="text-xs text-neutral-400">Commissions</div>
              <div className="font-medium text-neutral-900 mt-1">Selective Global Roster</div>
            </div>
            <div>
              <div className="text-xs text-neutral-400">Discipline</div>
              <div className="font-medium text-neutral-900 mt-1">Identity &amp; Systems</div>
            </div>
          </div>

          {/* Columns 3-12: Biography statement with Drop-Cap Image */}
          <div className="lg:col-span-9 taste-reveal-item">
            <div className="text-2xl sm:text-3xl lg:text-4xl text-neutral-900 leading-[1.28] font-normal tracking-[-0.015em]">
              <div className="float-left mr-5 mb-2 w-24 h-24 sm:w-28 sm:h-28 relative overflow-hidden bg-neutral-200">
                <Image
                  src="/images/services/branding.jpg"
                  alt="Studio print sample showing typography and brand craft"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-neutral-900">Lave Digital</span> was founded to eliminate the compromise between high-level brand strategy and tactile digital craft. We believe extraordinary digital products are engineered at the exact point where graphic clarity meets creative courage.
            </div>

            <p className="mt-8 text-xl sm:text-2xl text-neutral-600 leading-[1.38] font-normal">
              From our studio in Mumbai, our collective operates at the convergence of brand architecture, custom web engineering, interactive 3D, and performance strategy. We do not maintain bloated account tiers or generic templates; every commission is directed by senior practitioners focused on permanent impact.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Section 2: Practice & Principles (One-size name columns + Live Inspector) ─── */}
      <section className="py-28 md:py-44 px-6 sm:px-10 lg:px-16 bg-white taste-reveal-block">
        <div className="max-w-7xl mx-auto">
          {/* Modest heading alone on column 1 */}
          <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-16 md:mb-24 taste-reveal-title">
            Practice &amp; Principles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Column 1: Brand & Identity (Cols 1-3) */}
            <div className="md:col-span-4 lg:col-span-3 taste-reveal-item">
              <h3 className="text-base font-semibold text-neutral-900 mb-6">
                Brand &amp; Identity
              </h3>
              <ul className="space-y-3.5 text-[15px] sm:text-[16px]">
                {capabilitiesData.brand.map((item) => {
                  const isSelected = activeItem.name === item.name;
                  return (
                    <li key={item.name}>
                      <button
                        type="button"
                        onClick={() => setActiveItem(item)}
                        onMouseEnter={() => setActiveItem(item)}
                        onFocus={() => setActiveItem(item)}
                        className={`text-left block w-full py-0.5 cursor-pointer transition-colors duration-150 ${
                          isSelected
                            ? "text-neutral-950 font-semibold"
                            : "text-neutral-500 hover:text-neutral-900"
                        }`}
                      >
                        <span className="inline-block mr-2 w-1.5 h-1.5 rounded-none bg-current opacity-60" />
                        {item.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Column 2: Digital Systems & Code (Cols 4-6) */}
            <div className="md:col-span-4 lg:col-span-3 taste-reveal-item">
              <h3 className="text-base font-semibold text-neutral-900 mb-6">
                Digital Systems &amp; Code
              </h3>
              <ul className="space-y-3.5 text-[15px] sm:text-[16px]">
                {capabilitiesData.engineering.map((item) => {
                  const isSelected = activeItem.name === item.name;
                  return (
                    <li key={item.name}>
                      <button
                        type="button"
                        onClick={() => setActiveItem(item)}
                        onMouseEnter={() => setActiveItem(item)}
                        onFocus={() => setActiveItem(item)}
                        className={`text-left block w-full py-0.5 cursor-pointer transition-colors duration-150 ${
                          isSelected
                            ? "text-neutral-950 font-semibold"
                            : "text-neutral-500 hover:text-neutral-900"
                        }`}
                      >
                        <span className="inline-block mr-2 w-1.5 h-1.5 rounded-none bg-current opacity-60" />
                        {item.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Column 3: Studio Principles (Cols 7-9) */}
            <div className="md:col-span-4 lg:col-span-3 taste-reveal-item">
              <h3 className="text-base font-semibold text-neutral-900 mb-6">
                Studio Principles
              </h3>
              <ul className="space-y-3.5 text-[15px] sm:text-[16px]">
                {capabilitiesData.principles.map((item) => {
                  const isSelected = activeItem.name === item.name;
                  return (
                    <li key={item.name}>
                      <button
                        type="button"
                        onClick={() => setActiveItem(item)}
                        onMouseEnter={() => setActiveItem(item)}
                        onFocus={() => setActiveItem(item)}
                        className={`text-left block w-full py-0.5 cursor-pointer transition-colors duration-150 ${
                          isSelected
                            ? "text-neutral-950 font-semibold"
                            : "text-neutral-500 hover:text-neutral-900"
                        }`}
                      >
                        <span className="inline-block mr-2 w-1.5 h-1.5 rounded-none bg-current opacity-60" />
                        {item.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Columns 10-12: The Live Thing (Interactive criteria inspector) */}
            <div className="md:col-span-12 lg:col-span-3 mt-8 lg:mt-0 pt-6 lg:pt-0 bg-neutral-50 lg:bg-transparent p-6 lg:p-0 taste-reveal-item">
              <div className="text-xs text-neutral-400 mb-2">Discipline Inspection</div>
              <div className="text-base font-bold text-neutral-900">
                {activeItem.name}
              </div>
              <p className="text-[15px] text-neutral-600 mt-3 leading-normal">
                {activeItem.desc}
              </p>
              <div className="mt-6 pt-4 text-sm text-neutral-800 leading-relaxed bg-neutral-100 lg:bg-neutral-50 p-4">
                <span className="block font-medium text-xs text-neutral-500 mb-1">
                  Studio Execution Standard
                </span>
                {activeItem.standard}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 3: Track Record (Quiet figure lines) ─── */}
      <section className="py-28 md:py-44 px-6 sm:px-10 lg:px-16 bg-neutral-50 taste-reveal-block">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Columns 2-7: Definition list with tabular numerals */}
            <div className="lg:col-start-2 lg:col-span-7 taste-reveal-item">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-14 taste-reveal-title">
                Track Record
              </h2>

              <dl className="space-y-8">
                {stats.map((s, idx) => (
                  <div key={idx} className="grid grid-cols-[100px_1fr] sm:grid-cols-[132px_1fr] gap-6 items-baseline">
                    <dt className="text-2xl sm:text-3xl font-medium text-neutral-900 text-right tabular-nums">
                      {s.value}
                    </dt>
                    <dd className="text-base text-neutral-600 max-w-md leading-relaxed">
                      {s.statement}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Columns 9-11: Square photograph without caption */}
            <div className="lg:col-start-9 lg:col-span-4 mt-8 lg:mt-16 taste-reveal-item">
              <div className="relative aspect-square w-full max-w-sm mx-auto overflow-hidden bg-neutral-200">
                <Image
                  src="/images/services/web-design.jpg"
                  alt="Digital web design system and engineering detail"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 4: Studio Leadership Editorial Showcase ─── */}
      <section className="py-28 md:py-40 px-6 sm:px-10 lg:px-16 bg-white taste-reveal-block">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-16 taste-reveal-title">
            Studio Direction
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {leadership.map((person, idx) => (
              <div key={idx} className="space-y-4 taste-reveal-item">
                <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
                  <Image
                    src={person.image}
                    alt={person.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">{person.name}</h3>
                  <div className="text-sm font-medium text-neutral-800 mt-0.5">{person.role}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">{person.discipline}</div>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {person.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section 5: Kinetic Practice (Moving Picture Loop) ─── */}
      <section className="py-24 md:py-36 px-6 sm:px-10 lg:px-16 bg-neutral-50 taste-reveal-block">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 taste-reveal-title">
              Kinetic Practice
            </h2>
            <p className="text-sm text-neutral-500 mt-2 md:mt-0">
              Interaction choreography recorded live in our Mumbai workspace
            </p>
          </div>

          <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] overflow-hidden bg-neutral-950 taste-reveal-item">
            <video
              ref={videoRef}
              src="/assets/Hero Section Video.mp4"
              muted
              playsInline
              loop
              autoPlay
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ─── Section 6: Inverted Field Close (The Idea Again, Inverted) ─── */}
      <section className="min-h-[85svh] flex flex-col justify-between py-24 md:py-32 px-6 sm:px-10 lg:px-16 bg-[#0a0d14] text-white">
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-[10vw] sm:text-[9vw] font-display font-extrabold uppercase leading-[0.88] tracking-[-0.035em] text-white max-w-4xl">
            Build work that endures
          </h2>
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-end pt-16">
          <div className="md:col-span-7 lg:col-span-6">
            <p className="text-lg sm:text-xl text-neutral-400 leading-relaxed max-w-xl">
              Now reviewing commissions for upcoming quarters. We collaborate with six flagship partners each year.
            </p>
          </div>

          <div className="md:col-span-5 lg:col-span-6 flex md:justify-end">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#e60000] text-white font-semibold text-base tracking-normal hover:bg-[#ff1a1a] active:bg-[#cc0000] transition-colors duration-200"
            >
              Initiate consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
