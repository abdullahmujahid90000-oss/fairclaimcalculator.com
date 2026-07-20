"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: ReactNode;
  className?: string;
  /**
   * Stagger (seconds) applied across the container's *direct children*.
   * Set to 0 to animate the container as a single block instead.
   */
  stagger?: number;
  /** Starting vertical offset in px. */
  y?: number;
  delay?: number;
  /** ScrollTrigger `start` position. */
  start?: string;
}

/**
 * Fades + slides content in once it scrolls into view, via GSAP
 * ScrollTrigger. When `stagger` is set, each direct child animates in with
 * a slight delay after the previous one — used for card grids, nav-like
 * lists, feature rows, etc. No-ops entirely under `prefers-reduced-motion`.
 */
export function Reveal({
  children,
  className,
  stagger = 0.08,
  y = 24,
  delay = 0,
  start = "top 85%",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (reducedMotion || !el) return;

    const targets = stagger > 0 && el.children.length > 0 ? Array.from(el.children) : el;

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y });
      ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        onEnter: () =>
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay,
            stagger: stagger > 0 ? stagger : 0,
            ease: "power3.out",
          }),
      });
    }, el);

    return () => ctx.revert();
  }, [reducedMotion, stagger, y, delay, start]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
