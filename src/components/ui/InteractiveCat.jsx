"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";

/**
 * InteractiveCat — LAVE Digital Interactive Mascot
 *
 * Dark glossy 3D sphere with expressive googly eyes that track the cursor,
 * realistic organic eye blinks (and occasional double blinks),
 * subtle 3D sphere perspective tilt with shifting specular light reflections,
 * pulsing crimson neon ring, and a playful squash-and-stretch wobble on click.
 */
export default function InteractiveCat({ className = "" }) {
  const containerRef = useRef(null);
  const sphereBodyRef = useRef(null);
  const shineRef = useRef(null);
  const leftEyeGroupRef = useRef(null);
  const rightEyeGroupRef = useRef(null);
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);
  const textGroupRef = useRef(null);
  const redRingRef = useRef(null);
  const rafRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const currentRef = useRef({ x: 0.5, y: 0.5 });
  const [isWobbling, setIsWobbling] = useState(false);
  const isVisibleRef = useRef(false);
  const ringTweenRef = useRef(null);
  const blinkTimeoutRef = useRef(null);
  const isLoopingRef = useRef(false);

  const lerp = (a, b, t) => a + (b - a) * t;

  // ── Render transforms once ──
  const applyCatTransforms = useCallback((dx, dy) => {
    // 1. Pupils responsive tracking within eye sockets
    const pupilX = dx * 11;
    const pupilY = dy * 9;
    if (leftPupilRef.current) {
      leftPupilRef.current.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
    }
    if (rightPupilRef.current) {
      rightPupilRef.current.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
    }

    // 2. 3D Perspective Tilt on the sphere container
    if (containerRef.current) {
      const tiltX = -dy * 10;
      const tiltY = dx * 12;
      containerRef.current.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }

    // 3. Shifting specular gloss highlight
    if (shineRef.current) {
      const shineShiftX = dx * 10;
      const shineShiftY = dy * 8;
      shineRef.current.style.transform = `translate(${shineShiftX}px, ${shineShiftY}px)`;
    }

    // 4. Parallax counter-shift on branding text
    if (textGroupRef.current) {
      const textX = dx * 3.5;
      const textY = dy * 2.5;
      textGroupRef.current.style.transform = `translate(${textX}px, ${textY}px)`;
    }
  }, []);

  // ── Mouse & Saccade Tracking Loop (stops when settled or off-screen) ──
  const animate = useCallback(() => {
    if (!isVisibleRef.current) {
      isLoopingRef.current = false;
      rafRef.current = null;
      return;
    }

    const cur = currentRef.current;
    const target = mouseRef.current;

    const dxDiff = target.x - cur.x;
    const dyDiff = target.y - cur.y;

    if (Math.abs(dxDiff) < 0.0008 && Math.abs(dyDiff) < 0.0008) {
      cur.x = target.x;
      cur.y = target.y;
      applyCatTransforms((cur.x - 0.5) * 2, (cur.y - 0.5) * 2);
      isLoopingRef.current = false;
      rafRef.current = null;
      return;
    }

    cur.x = lerp(cur.x, target.x, 0.12);
    cur.y = lerp(cur.y, target.y, 0.12);

    applyCatTransforms((cur.x - 0.5) * 2, (cur.y - 0.5) * 2);

    rafRef.current = requestAnimationFrame(animate);
  }, [applyCatTransforms]);

  const wakeLoop = useCallback(() => {
    if (!isVisibleRef.current) return;
    if (!isLoopingRef.current) {
      isLoopingRef.current = true;
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  // ── Natural Blinking Animation Cycle (runs only when visible) ──
  const scheduleBlink = useCallback(() => {
    if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
    if (!isVisibleRef.current) return;

    const triggerBlink = () => {
      if (!isVisibleRef.current) return;
      const leftEye = leftEyeGroupRef.current;
      const rightEye = rightEyeGroupRef.current;
      if (!leftEye || !rightEye) return;

      const isDoubleBlink = Math.random() < 0.25;

      const blinkTl = gsap.timeline({
        onComplete: () => {
          const nextDelay = 2800 + Math.random() * 3200;
          blinkTimeoutRef.current = setTimeout(triggerBlink, nextDelay);
        },
      });

      blinkTl.to([leftEye, rightEye], {
        scaleY: 0.06,
        duration: 0.09,
        ease: "power2.in",
        transformOrigin: "center center",
      });

      blinkTl.to([leftEye, rightEye], {
        scaleY: 1,
        duration: 0.12,
        ease: "power2.out",
      });

      if (isDoubleBlink) {
        blinkTl.to(
          [leftEye, rightEye],
          {
            scaleY: 0.06,
            duration: 0.08,
            ease: "power2.in",
          },
          "+=0.12"
        );
        blinkTl.to([leftEye, rightEye], {
          scaleY: 1,
          duration: 0.12,
          ease: "power2.out",
        });
      }
    };

    blinkTimeoutRef.current = setTimeout(triggerBlink, 2000);
  }, []);

  // ── Neon Ring Ambient Breathing Glow ──
  useEffect(() => {
    if (!redRingRef.current) return;

    const ringTween = gsap.to(redRingRef.current, {
      opacity: 0.95,
      strokeWidth: 3.5,
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      paused: true,
    });
    ringTweenRef.current = ringTween;

    return () => ringTween.kill();
  }, []);

  // ── Intersection Observer: stop everything when off-screen ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        isVisibleRef.current = inView;

        if (inView) {
          ringTweenRef.current?.play();
          scheduleBlink();
          wakeLoop();
        } else {
          ringTweenRef.current?.pause();
          if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
          }
          isLoopingRef.current = false;
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [scheduleBlink, wakeLoop]);

  // ── Mouse & Touch Tracking Listeners ──
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const hasHover = window.matchMedia("(hover: hover)").matches;

    if (hasHover) {
      const onMouseMove = (e) => {
        if (!isVisibleRef.current) return;
        mouseRef.current.x = e.clientX / window.innerWidth;
        mouseRef.current.y = e.clientY / window.innerHeight;
        wakeLoop();
      };

      window.addEventListener("mousemove", onMouseMove, { passive: true });
      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }

    // Touch devices: gentle organic sway ONLY when in view
    let t = 0;
    const idleAnimate = () => {
      if (!isVisibleRef.current) {
        rafRef.current = null;
        return;
      }
      t += 0.025;
      const swayX = Math.sin(t) * 0.45;
      const swayY = Math.cos(t * 0.75) * 0.3;

      if (leftPupilRef.current)
        leftPupilRef.current.style.transform = `translate(${swayX * 10}px, ${swayY * 8}px)`;
      if (rightPupilRef.current)
        rightPupilRef.current.style.transform = `translate(${swayX * 10}px, ${swayY * 8}px)`;

      rafRef.current = requestAnimationFrame(idleAnimate);
    };

    if (isVisibleRef.current) {
      rafRef.current = requestAnimationFrame(idleAnimate);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [wakeLoop]);

  // ── Playful Squash & Stretch Bounce on Click ──
  const handleClick = () => {
    if (isWobbling || !sphereBodyRef.current) return;
    setIsWobbling(true);

    const tl = gsap.timeline({
      onComplete: () => setIsWobbling(false),
    });

    // Squash down
    tl.to(sphereBodyRef.current, {
      scaleX: 1.15,
      scaleY: 0.85,
      duration: 0.14,
      ease: "power2.in",
      transformOrigin: "center 70%",
    });

    // Stretch up with surprise pupils dilation
    tl.to(
      sphereBodyRef.current,
      {
        scaleX: 0.9,
        scaleY: 1.12,
        duration: 0.18,
        ease: "power2.out",
      },
      "-=0.02"
    );

    // Pupil surprise scale
    tl.to(
      [leftPupilRef.current, rightPupilRef.current],
      {
        scale: 1.3,
        duration: 0.15,
        transformOrigin: "center center",
      },
      0.1
    );

    // Settle with bouncy gelatin overshoot
    tl.to(sphereBodyRef.current, {
      scaleX: 1.04,
      scaleY: 0.96,
      duration: 0.2,
      ease: "power2.inOut",
    });

    tl.to(sphereBodyRef.current, {
      scaleX: 1,
      scaleY: 1,
      duration: 0.35,
      ease: "elastic.out(1.2, 0.4)",
    });

    tl.to(
      [leftPupilRef.current, rightPupilRef.current],
      {
        scale: 1,
        duration: 0.25,
        ease: "power2.out",
      },
      "-=0.3"
    );
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`interactive-cat select-none cursor-pointer will-change-transform ${className}`}
      title="Click me!"
      style={{
        transformStyle: "preserve-3d",
        transition: "transform 0.08s ease-out",
      }}
      aria-label="Interactive Lave Mascot"
      role="button"
      tabIndex={0}
    >
      <svg
        viewBox="0 0 300 300"
        width="300"
        height="300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Radial gradient for the glossy dark sphere body */}
          <radialGradient id="blobBody" cx="42%" cy="38%" r="58%">
            <stop offset="0%" stopColor="#484848" />
            <stop offset="35%" stopColor="#242424" />
            <stop offset="70%" stopColor="#121212" />
            <stop offset="100%" stopColor="#040404" />
          </radialGradient>

          {/* Eye sphere gradient - gives 3D ball look */}
          <radialGradient id="eyeball3D" cx="38%" cy="32%" r="55%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f5f5f5" />
            <stop offset="85%" stopColor="#dddddd" />
            <stop offset="100%" stopColor="#b5b5b5" />
          </radialGradient>

          {/* Eye shadow gradient */}
          <radialGradient id="eyeShadow" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <stop offset="70%" stopColor="rgba(0,0,0,0.06)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.22)" />
          </radialGradient>

          {/* Pupil gradient for 3D look */}
          <radialGradient id="pupilGrad" cx="38%" cy="32%" r="55%">
            <stop offset="0%" stopColor="#282828" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>

          {/* Glossy highlight on sphere top */}
          <linearGradient id="sphereShine" x1="50%" y1="0%" x2="50%" y2="60%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.07)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>

          {/* Drop shadow filter for eyes */}
          <filter id="eyeDropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#000000" floodOpacity="0.55" />
          </filter>

          {/* Outer glow filter for the neon ring */}
          <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── Main Sphere Wrapper (Squash & Stretch on click) ── */}
        <g ref={sphereBodyRef} className="will-change-transform">
          {/* ── Outer Crimson Neon Aura Rings ── */}
          <circle
            cx="150"
            cy="150"
            r="144"
            fill="none"
            stroke="#e60000"
            strokeWidth="0.8"
            opacity="0.25"
          />
          <circle
            ref={redRingRef}
            cx="150"
            cy="150"
            r="140"
            fill="none"
            stroke="#e60000"
            strokeWidth="2.5"
            opacity="0.75"
            filter="url(#neonGlow)"
          />

          {/* ── Main Dark Glossy Sphere Body ── */}
          <circle cx="150" cy="150" r="138" fill="url(#blobBody)" />

          {/* ── Glossy Highlight on Upper Sphere (Shifts with light angle) ── */}
          <ellipse
            ref={shineRef}
            cx="135"
            cy="95"
            rx="75"
            ry="48"
            fill="url(#sphereShine)"
            className="will-change-transform"
          />

          {/* ── Subtle Rim Light along Bottom-Right ── */}
          <circle
            cx="150"
            cy="150"
            r="137"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1.5"
          />

          {/* ── Left Eye Group (Scales for blinking) ── */}
          <g
            ref={leftEyeGroupRef}
            filter="url(#eyeDropShadow)"
            className="will-change-transform"
            style={{ transformOrigin: "118px 128px" }}
          >
            {/* White Eyeball */}
            <circle cx="118" cy="128" r="30" fill="url(#eyeball3D)" />
            <circle cx="118" cy="128" r="30" fill="url(#eyeShadow)" />

            {/* Pupil Group — Smoothly Tracks Cursor */}
            <g ref={leftPupilRef} className="will-change-transform">
              <circle cx="118" cy="132" r="14" fill="url(#pupilGrad)" />
              {/* Primary catchlight */}
              <circle cx="111" cy="124" r="5" fill="rgba(255,255,255,0.95)" />
              {/* Secondary micro-reflection */}
              <circle cx="123" cy="137" r="2.2" fill="rgba(255,255,255,0.45)" />
            </g>
          </g>

          {/* ── Right Eye Group (Scales for blinking) ── */}
          <g
            ref={rightEyeGroupRef}
            filter="url(#eyeDropShadow)"
            className="will-change-transform"
            style={{ transformOrigin: "182px 128px" }}
          >
            {/* White Eyeball */}
            <circle cx="182" cy="128" r="30" fill="url(#eyeball3D)" />
            <circle cx="182" cy="128" r="30" fill="url(#eyeShadow)" />

            {/* Pupil Group — Smoothly Tracks Cursor */}
            <g ref={rightPupilRef} className="will-change-transform">
              <circle cx="182" cy="132" r="14" fill="url(#pupilGrad)" />
              {/* Primary catchlight */}
              <circle cx="175" cy="124" r="5" fill="rgba(255,255,255,0.95)" />
              {/* Secondary micro-reflection */}
              <circle cx="187" cy="137" r="2.2" fill="rgba(255,255,255,0.45)" />
            </g>
          </g>

          {/* ── LAVE DIGITAL Typography Layer (Parallax Offset) ── */}
          <g ref={textGroupRef} className="will-change-transform">
            <text
              x="150"
              y="205"
              textAnchor="middle"
              fill="#e60000"
              fontFamily="'Outfit', 'Inter', 'Helvetica Neue', Arial, sans-serif"
              fontWeight="900"
              fontSize="40"
              letterSpacing="4"
              style={{
                filter: "drop-shadow(0 0 12px rgba(230,0,0,0.35))",
              }}
            >
              LAVE
            </text>

            <text
              x="150"
              y="228"
              textAnchor="middle"
              fill="#ffffff"
              fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
              fontWeight="600"
              fontSize="16"
              letterSpacing="7"
              opacity="0.95"
            >
              DIGITAL
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
