"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Drives Lenis smooth scrolling and keeps GSAP's ScrollTrigger in sync with
 * it (Lenis owns the scroll position; ScrollTrigger just listens). Mounted
 * once near the root layout. Renders nothing — it only wires up side effects.
 *
 * Skips Lenis entirely under `prefers-reduced-motion`: the page falls back
 * to plain native scrolling with no smoothing/easing applied.
 */
export function SmoothScrollProvider() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, [reducedMotion]);

  return null;
}
