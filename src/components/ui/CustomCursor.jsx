"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const ringInnerRef = useRef(null);

  const mouse = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const previous = useRef({ x: -100, y: -100 });
  const velocity = useRef({ x: 0, y: 0 });

  const frame = useRef(null);
  const lastTime = useRef(0);
  const isMoving = useRef(false);
  const visibleRef = useRef(false);
  const hoveredRef = useRef(false);
  const clickedRef = useRef(false);
  const initialized = useRef(false);

  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Avoid replacing native cursors on touch devices.
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );

    if (!finePointer.matches) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const clamp = (value, min, max) =>
      Math.min(max, Math.max(min, value));

    const setVisibility = (next) => {
      if (visibleRef.current === next) return;

      visibleRef.current = next;
      setVisible(next);
    };

    const setHover = (next) => {
      if (hoveredRef.current === next) return;

      hoveredRef.current = next;
      setIsHovered(next);
    };

    const setClick = (next) => {
      if (clickedRef.current === next) return;

      clickedRef.current = next;
      setIsClicked(next);
    };

    const onMouseMove = (event) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;

      setVisibility(true);

      // Place the dot directly at the pointer.
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      }

      // Initialize the ring without an initial jump.
      if (!initialized.current) {
        ring.current.x = event.clientX;
        ring.current.y = event.clientY;
        previous.current.x = event.clientX;
        previous.current.y = event.clientY;
        initialized.current = true;
      }

      // Update hover state only when it changes.
      const target = event.target;
      const interactive =
        target instanceof Element &&
        target.closest(
          "a, button, input, textarea, select, " +
          "[role='button'], .cursor-pointer, .interactive-hover"
        );

      setHover(Boolean(interactive));
      isMoving.current = true;

      // Schedule only one animation loop at a time.
      if (frame.current === null) {
        lastTime.current = performance.now();
        frame.current = requestAnimationFrame(animate);
      }
    };

    const animate = (time) => {
      const dt = Math.min((time - lastTime.current) / 16.667, 2);
      lastTime.current = time;

      const dx = mouse.current.x - ring.current.x;
      const dy = mouse.current.y - ring.current.y;

      // Frame-rate-independent smooth following.
      const follow = 1 - Math.pow(0.78, dt);

      ring.current.x += dx * follow;
      ring.current.y += dy * follow;

      // Measure pointer movement and smooth the velocity.
      const mx = mouse.current.x - previous.current.x;
      const my = mouse.current.y - previous.current.y;

      const velocityFollow = 1 - Math.pow(0.65, dt);

      velocity.current.x +=
        (mx - velocity.current.x) * velocityFollow;
      velocity.current.y +=
        (my - velocity.current.y) * velocityFollow;

      previous.current.x = mouse.current.x;
      previous.current.y = mouse.current.y;

      // Stretch along the movement direction.
      const speed = Math.hypot(
        velocity.current.x,
        velocity.current.y
      );

      const angle = Math.atan2(
        velocity.current.y,
        velocity.current.x
      );

      const stretch = clamp(speed / 100, 0, 0.2);

      const scaleX = 1 + stretch;
      const scaleY = 1 - stretch * 0.45;

      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
      }

      if (ringInnerRef.current) {
        ringInnerRef.current.style.transform =
          `translate(-50%, -50%) rotate(${angle}rad) ` +
          `scale(${scaleX}, ${scaleY})`;
      }

      // Stop requesting frames when the ring has settled.
      const distance = Math.hypot(dx, dy);
      const velocityMagnitude = Math.hypot(
        velocity.current.x,
        velocity.current.y
      );

      if (distance > 0.08 || velocityMagnitude > 0.08) {
        frame.current = requestAnimationFrame(animate);
      } else {
        ring.current.x = mouse.current.x;
        ring.current.y = mouse.current.y;
        velocity.current.x = 0;
        velocity.current.y = 0;

        if (ringRef.current) {
          ringRef.current.style.transform =
            `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
        }

        if (ringInnerRef.current) {
          ringInnerRef.current.style.transform =
            "translate(-50%, -50%)";
        }

        frame.current = null;
      }
    };

    const onMouseDown = () => setClick(true);
    const onMouseUp = () => setClick(false);

    const onMouseLeave = () => {
      setVisibility(false);
      setHover(false);
      setClick(false);
    };

    const onMouseEnter = () => setVisibility(true);

    const onBlur = () => {
      setVisibility(false);
    };

    const onFocus = () => {
      setVisibility(true);
    };

    const onPointerTypeChange = (event) => {
      if (!event.matches) {
        setVisibility(false);
      }
    };

    finePointer.addEventListener?.("change", onPointerTypeChange);

    window.addEventListener("mousemove", onMouseMove, {
      passive: true,
    });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      root.classList.remove("has-custom-cursor");

      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);

      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);

      finePointer.removeEventListener?.(
        "change",
        onPointerTypeChange
      );

      if (frame.current !== null) {
        cancelAnimationFrame(frame.current);
      }
    };
  }, []);

  return (
    <>
      {/* Center dot */}
      <div
        ref={dotRef}
        className={`pointer-events-none fixed left-0 top-0 z-[99999] select-none ${visible ? "opacity-100" : "opacity-0"
          }`}
        style={{
          willChange: "transform",
          transition: "opacity 150ms ease",
        }}
        aria-hidden="true"
      >
        <div
          className="rounded-full bg-[#e60000]"
          style={{
            width: isHovered ? 10 : 8,
            height: isHovered ? 10 : 8,
            transform: `translate(-50%, -50%) scale(${isClicked ? 0.7 : 1
              })`,
            transition:
              "width 200ms ease, height 200ms ease, transform 150ms ease",
          }}
        />
      </div>

      {/* Fluid outer ring */}
      <div
        ref={ringRef}
        className={`pointer-events-none fixed left-0 top-0 z-[99998] select-none ${visible ? "opacity-100" : "opacity-0"
          }`}
        style={{
          willChange: "transform, opacity",
          transition: "opacity 180ms ease",
        }}
        aria-hidden="true"
      >
        <div
          ref={ringInnerRef}
          className="absolute left-0 top-0 rounded-full"
          style={{
            width: isHovered ? 64 : isClicked ? 28 : 38,
            height: isHovered ? 64 : isClicked ? 28 : 38,
            border: `1px solid ${isClicked
                ? "rgba(230, 0, 0, 0.9)"
                : "rgba(230, 0, 0, 0.55)"
              }`,
            background: isHovered
              ? "rgba(230, 0, 0, 0.09)"
              : isClicked
                ? "rgba(230, 0, 0, 0.15)"
                : "rgba(230, 0, 0, 0.035)",
            boxShadow: isHovered
              ? "0 0 18px rgba(230, 0, 0, 0.08)"
              : "none",
            transform: "translate(-50%, -50%)",
            transition:
              "width 260ms cubic-bezier(0.22, 1, 0.36, 1), " +
              "height 260ms cubic-bezier(0.22, 1, 0.36, 1), " +
              "background 220ms ease, border-color 220ms ease, " +
              "box-shadow 220ms ease",
          }}
        />
      </div>
    </>
  );
}