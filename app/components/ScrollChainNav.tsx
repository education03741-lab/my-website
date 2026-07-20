"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

const PAGE_ORDER = ["/", "/blog", "/ingredients", "/skin-concerns", "/contact"];

const EDGE_THRESHOLD = 4;      // px tolerance for "at top/bottom"
const TRIGGER_DELTA = 40;      // wheel overscroll needed to count as intent
const COOLDOWN_MS = 1000;      // prevents double-navigation
const TOUCH_TRIGGER_DISTANCE = 60; // swipe distance on mobile

export default function ScrollChainNav() {
  const router = useRouter();
  const pathname = usePathname();

  const lockedRef = useRef(false);
  const pendingDeltaRef = useRef(0);
  const directionRef = useRef<"next" | "prev" | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchEdgeRef = useRef<"top" | "bottom" | null>(null);

  // Landing on a page via "scroll up" should drop you at its bottom,
  // so it feels like one continuous upward scroll.
  useEffect(() => {
    if (directionRef.current === "prev") {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "auto" });
        });
      });
    }
    directionRef.current = null;
    pendingDeltaRef.current = 0;

    const unlock = setTimeout(() => {
      lockedRef.current = false;
    }, COOLDOWN_MS);
    return () => clearTimeout(unlock);
  }, [pathname]);

  useEffect(() => {
    const isAtBottom = () =>
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - EDGE_THRESHOLD;
    const isAtTop = () => window.scrollY <= EDGE_THRESHOLD;

    function goTo(direction: "next" | "prev") {
      if (lockedRef.current) return;
      const currentIndex = PAGE_ORDER.indexOf(pathname);
      if (currentIndex === -1) return; // dynamic/unlisted routes don't chain

      const nextIndex =
        direction === "next"
          ? (currentIndex + 1) % PAGE_ORDER.length
          : (currentIndex - 1 + PAGE_ORDER.length) % PAGE_ORDER.length;

      lockedRef.current = true;
      directionRef.current = direction;
      router.push(PAGE_ORDER[nextIndex]);
    }

    function handleWheel(e: WheelEvent) {
      if (lockedRef.current) return;
      const scrollable = document.documentElement.scrollHeight > window.innerHeight + EDGE_THRESHOLD;

      if (e.deltaY > 0 && (!scrollable || isAtBottom())) {
        pendingDeltaRef.current += e.deltaY;
        if (pendingDeltaRef.current >= TRIGGER_DELTA) goTo("next");
      } else if (e.deltaY < 0 && (!scrollable || isAtTop())) {
        pendingDeltaRef.current += Math.abs(e.deltaY);
        if (pendingDeltaRef.current >= TRIGGER_DELTA) goTo("prev");
      } else {
        pendingDeltaRef.current = 0;
      }
    }

    function handleTouchStart(e: TouchEvent) {
      if (lockedRef.current) return;
      touchStartYRef.current = e.touches[0].clientY;
      const scrollable = document.documentElement.scrollHeight > window.innerHeight + EDGE_THRESHOLD;
      if (!scrollable) touchEdgeRef.current = "bottom";
      else if (isAtBottom()) touchEdgeRef.current = "bottom";
      else if (isAtTop()) touchEdgeRef.current = "top";
      else touchEdgeRef.current = null;
    }

    function handleTouchMove(e: TouchEvent) {
      if (lockedRef.current || touchStartYRef.current === null || touchEdgeRef.current === null) return;
      const distance = touchStartYRef.current - e.touches[0].clientY;
      if (touchEdgeRef.current === "bottom" && distance > TOUCH_TRIGGER_DISTANCE) goTo("next");
      else if (touchEdgeRef.current === "top" && distance < -TOUCH_TRIGGER_DISTANCE) goTo("prev");
    }

    function handleTouchEnd() {
      touchStartYRef.current = null;
      touchEdgeRef.current = null;
    }

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pathname, router]);

  return null;
}