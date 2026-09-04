// ---------- SCROLL ANIMATIONS: NAV PAGES ----------
// Shared by projects.html, resume.html, creative.html, and about.html.
// Same slow, pronounced "fade up" reveal used on the home + case study pages
// (inspired by mackaddison.online):
//   duration 1.2s | ease "power2.out" | play once |
//   start "top bottom-=120" (waits until the element is well inside the
//   viewport so the rise is noticeable) | no delay
//
// Each page only animates the selectors that actually exist on it —
// gsap.utils.toArray() safely returns an empty list for missing selectors.

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

    // Timing values — kept in sync with js/animations.js and js/case-study.js.
    const DURATION = 1.2;              // 1200ms
    const EASE = "power2.out";         // smooth, gradual settle
    const START = "top bottom-=120";   // wait until element is well in view
    const Y_DISTANCE = 70;             // upward drift so the rise reads

    // Reveal a set of elements with the shared "fade-up" timing.
    // once = true: play a single time and never reverse.
    function revealOnScroll(selector, delay) {
        gsap.utils.toArray(selector).forEach((el) => {
            gsap.from(el, {
                opacity: 0,
                y: Y_DISTANCE,
                duration: DURATION,
                ease: EASE,
                delay: delay || 0,
                // Clear the leftover inline transform so CSS hover effects
                // (card scale/shadow, etc.) keep working after the reveal.
                clearProps: "transform",
                scrollTrigger: {
                    trigger: el,
                    start: START,
                    toggleActions: "play none none none", // once
                },
            });
        });
    }

    // --- projects.html (Archive) ---
    // Only the top "Projects" heading animates, and only on page enter — the
    // same fade-up as the About page. Cards + lower content stay static.
    const archiveTitle = document.querySelector(".archive-title");
    if (archiveTitle) {
        gsap.from(archiveTitle, {
            opacity: 0,
            y: Y_DISTANCE,
            duration: DURATION,
            ease: EASE,
            clearProps: "transform",
        });
    }

    // --- resume.html ---
    revealOnScroll(".resume-title-name");
    revealOnScroll(".resume-links");
    revealOnScroll(".resume-title");
    revealOnScroll(".resume-job-title");
    revealOnScroll(".resume-list");
    revealOnScroll(".button-resume-header");

    // --- creative.html ---
    // Only the top intro (title -> description -> filter bubbles) animates, and
    // only on page enter — the same fade-up as the About page. The gallery below
    // stays static.
    const introTimeline = gsap.timeline();
    [".creative-title", ".creative-title-desc", ".creative-filters"].forEach(
        (sel, i) => {
            const el = document.querySelector(sel);
            if (el) {
                introTimeline.from(
                    el,
                    { opacity: 0, y: Y_DISTANCE, duration: DURATION, ease: EASE, clearProps: "transform" },
                    i === 0 ? 0 : "-=0.95" // slight overlap so it flows
                );
            }
        }
    );

    // --- about.html ---
    revealOnScroll(".about-frame");
    revealOnScroll(".about-text h2");
    revealOnScroll(".about-text p");
    revealOnScroll(".rz-head");
    revealOnScroll(".rz-toggle");
    revealOnScroll(".rz-subhead");
    revealOnScroll(".rz-entry");
    revealOnScroll(".rz-tools");

    // Images/videos can load late and shift layout, throwing off scroll
    // positions. Recalculate once everything has finished loading.
    window.addEventListener("load", () => ScrollTrigger.refresh());
})();
