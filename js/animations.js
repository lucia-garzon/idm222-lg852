// ---------- SCROLL ANIMATIONS: HOME PAGE ----------
// Slow, pronounced "fade up" reveal (inspired by mackaddison.online):
//   elements start fully transparent + pushed down, then float up into
//   view over a longer, clearly visible window. Matches the case study pages.
//   duration 1.2s | ease "power2.out" | play once |
//   start "top bottom-=120" (waits until the element is well inside the
//   viewport so the rise is noticeable) | no delay

(function () {
    // Bail out safely if GSAP failed to load for any reason.
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
        console.warn("GSAP or ScrollTrigger not loaded — skipping scroll animations.");
        return;
    }

    // Accessibility: respect users who prefer reduced motion.
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Timing values — slower + more pronounced so the reveal is obvious.
    // Kept in sync with js/case-study.js.
    const DURATION = 1.2;              // 1200ms (was 600ms)
    const EASE = "power2.out";         // smooth, gradual settle
    const START = "top bottom-=120";   // wait until element is well in view
    const Y_DISTANCE = 70;             // larger upward drift so the rise reads

    // Reveal a set of elements with the shared "fade-up" timing.
    // once = true: play a single time and never reverse.
    function revealOnScroll(selector, yDistance) {
        gsap.utils.toArray(selector).forEach((el) => {
            gsap.from(el, {
                opacity: 0,
                y: yDistance,
                duration: DURATION,
                ease: EASE,
                // Remove the inline transform GSAP leaves behind, so CSS
                // hover effects (e.g. card scale-up) keep working afterward.
                clearProps: "transform",
                scrollTrigger: {
                    trigger: el,
                    start: START,
                    toggleActions: "play none none none", // once
                },
            });
        });
    }

    // Hero frog + statement (fire on load; they're above the fold).
    revealOnScroll(".hero-frog", Y_DISTANCE);
    revealOnScroll(".hero-statement", Y_DISTANCE);

    // "Projects" heading — no scroll reveal; it stays static on all screens.

    // Recalculate positions once images have finished loading.
    window.addEventListener("load", () => ScrollTrigger.refresh());
})();
