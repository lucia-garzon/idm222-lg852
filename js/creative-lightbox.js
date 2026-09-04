// ---------- CREATIVE GALLERY LIGHTBOX ----------
// Click (or press Enter/Space on) a gallery image to open it enlarged with a
// small "jump" pop-in. Page through the gallery with the on-screen arrows or
// the Left/Right arrow keys. Close with the X, a backdrop click, or Esc.
(function () {
    const galleries = Array.from(document.querySelectorAll(".creative-gallery"));
    if (!galleries.length) return;

    const useGsap = typeof gsap !== "undefined";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Build an items list for a single gallery. Navigation stays within the
    // gallery you opened, so filtered-out pieces never sneak into the viewer.
    function buildItems(gallery) {
        return Array.from(gallery.querySelectorAll("figure"))
            .map((fig) => {
                const img = fig.querySelector("img.creative-img");
                if (!img) return null;
                const cap = fig.querySelector("figcaption");
                // The hover-card script rewrites each figcaption into a
                // .art-title ("Title (Year)") plus a .art-tool span, so reading
                // the whole caption would tack the tool name on the end. Use
                // just the title span, falling back to the raw text.
                let caption = "";
                if (cap) {
                    const titleEl = cap.querySelector(".art-title");
                    caption = (titleEl ? titleEl.textContent : cap.textContent).trim();
                }
                return {
                    fig: fig,
                    src: img.currentSrc || img.src,
                    alt: img.alt || "",
                    caption: caption,
                };
            })
            .filter(Boolean);
    }

    // The currently active gallery's items (set when the viewer opens).
    let items = [];
    let current = 0;

    // Build the overlay once and reuse it.
    const overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-hidden", "true");
    const chevron = (d) =>
        '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">' +
        '<path d="' + d + '" stroke="currentColor" stroke-width="2.6" ' +
        'stroke-linecap="round" stroke-linejoin="round"/></svg>';

    overlay.innerHTML =
        '<button class="lightbox-close" type="button" aria-label="Close image">' +
        '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">' +
        '<path d="M7 7 L17 17 M17 7 L7 17" stroke="currentColor" stroke-width="2.6" ' +
        'stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
        '<button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous image">' +
        chevron("M15 4 L7 12 L15 20") + "</button>" +
        '<img class="lightbox-img" alt="">' +
        '<p class="lightbox-caption"></p>' +
        '<button class="lightbox-nav lightbox-next" type="button" aria-label="Next image">' +
        chevron("M9 4 L17 12 L9 20") + "</button>";
    document.body.appendChild(overlay);

    const imgEl = overlay.querySelector(".lightbox-img");
    const capEl = overlay.querySelector(".lightbox-caption");
    const closeBtn = overlay.querySelector(".lightbox-close");
    const prevBtn = overlay.querySelector(".lightbox-prev");
    const nextBtn = overlay.querySelector(".lightbox-next");
    let lastFocused = null;

    // Show item at index. dir: 0 = initial pop, 1 = next, -1 = prev.
    function showAt(index, dir) {
        current = (index + items.length) % items.length; // wrap around
        const item = items[current];
        imgEl.src = item.src;
        imgEl.alt = item.alt;
        capEl.textContent = item.caption;

        if (useGsap && !reduce) {
            gsap.killTweensOf(imgEl);
            const fromX = dir === 0 ? 0 : dir * 60; // slide in from the side
            const fromY = dir === 0 ? 40 : 0;
            const fromScale = dir === 0 ? 0.8 : 0.92;
            gsap.fromTo(
                imgEl,
                { scale: fromScale, x: fromX, y: fromY, opacity: 0 },
                { scale: 1, x: 0, y: 0, opacity: 1, duration: 0.5, ease: "back.out(2)" }
            );
        }
    }

    function open(index, trigger) {
        lastFocused = trigger || document.activeElement;
        showAt(index, 0);
        overlay.classList.add("open");
        overlay.setAttribute("aria-hidden", "false");
        closeBtn.focus();
    }

    function close() {
        overlay.classList.remove("open");
        overlay.setAttribute("aria-hidden", "true");
        if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    function next() { showAt(current + 1, 1); }
    function prev() { showAt(current - 1, -1); }

    // Wire up each gallery. Opening one makes its images the active set.
    galleries.forEach((gallery) => {
        // Open on image click (event delegation).
        gallery.addEventListener("click", (e) => {
            const img = e.target.closest("img.creative-img");
            if (!img) return;
            const fig = img.closest("figure");
            items = buildItems(gallery);
            const index = items.findIndex((it) => it.fig === fig);
            if (index >= 0) open(index, img);
        });

        // Open with keyboard (figures are focusable via tabindex="0").
        gallery.addEventListener("keydown", (e) => {
            if (e.key !== "Enter" && e.key !== " ") return;
            const fig = e.target.closest("figure");
            if (!fig) return;
            items = buildItems(gallery);
            const index = items.findIndex((it) => it.fig === fig);
            if (index < 0) return;
            e.preventDefault();
            open(index, fig);
        });
    });

    closeBtn.addEventListener("click", close);
    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close(); // click on backdrop only
    });

    document.addEventListener("keydown", (e) => {
        if (!overlay.classList.contains("open")) return;
        if (e.key === "Escape") close();
        else if (e.key === "ArrowRight") next();
        else if (e.key === "ArrowLeft") prev();
    });
})();
