// ---------- SCROLL ANIMATIONS: CASE STUDY PAGES ----------
// Shared by amazon.html, zeroeyes.html, and phillyreach.html.
// Slow, pronounced "fade up" reveal (inspired by mackaddison.online):
//   elements start fully transparent + pushed down, then float up into
//   view over a longer, clearly visible window.
//   duration 1.2s | ease "power2.out" | play once |
//   start "top bottom-=120" (waits until the element is well inside the
//   viewport so the rise is noticeable) | no delay

// Refresh behaviour: always start a case study from the top instead of
// letting the browser restore the previous scroll position. If the URL has
// a fragment (like #usertesting-amz), leave the browser's native anchor
// jump alone.
if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}
window.addEventListener("load", () => {
    if (!window.location.hash) {
        window.scrollTo(0, 0);
    }
});

(function () {
    // Bail out safely if GSAP failed to load for any reason.
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
        console.warn("GSAP or ScrollTrigger not loaded — skipping case study animations.");
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
                // hover effects keep working afterward.
                clearProps: "transform",
                scrollTrigger: {
                    trigger: el,
                    start: START,
                    toggleActions: "play none none none", // once
                },
            });
        });
    }

    // Cover image + title + overview (near the top; fire as soon as they're in view).
    revealOnScroll(".cover", Y_DISTANCE);
    revealOnScroll(".project-title", Y_DISTANCE);
    revealOnScroll(".overview-details", Y_DISTANCE);

    // Small-caps section eyebrows + their section headings — reveal together
    // so the labeled title fades up as a pair when it scrolls into view.
    revealOnScroll(".project-eyebrow", Y_DISTANCE);
    revealOnScroll(".project-header", Y_DISTANCE);

    // Body text: paragraphs and lists inside the case study content.
    revealOnScroll(".project-content p", Y_DISTANCE);
    revealOnScroll(".project-content ul, .project-content ol", Y_DISTANCE);

    // Content images.
    revealOnScroll(".project-content img", Y_DISTANCE);

    // Section dividers — fade + rise like the section pair above them.
    revealOnScroll(".section-divider", Y_DISTANCE);

    // "Next project" sign-off — reveal as it scrolls into view.
    // Uses a shorter start offset so it fires even on short pages.
    gsap.utils.toArray(".case-next").forEach((el) => {
        gsap.from(el, {
            opacity: 0,
            y: Y_DISTANCE,
            duration: DURATION,
            ease: EASE,
            clearProps: "all",
            scrollTrigger: {
                trigger: el,
                start: "top bottom",   // fire as soon as any part enters the viewport
                toggleActions: "play none none none",
                onLeaveBack: () => { gsap.set(el, { opacity: 1, y: 0 }); },
            },
        });
    });

    // Images can load late and shift layout, throwing off scroll positions.
    // Recalculate once everything (including images) has finished loading.
    window.addEventListener("load", () => ScrollTrigger.refresh());
})();
