// const menu = document.querySelector('nav');





// const menu_buttons = document.querySelectorAll('.btn_menu');

// if (menu_buttons) {
//     menu_buttons.forEach((button) => {
//     button.addEventListener('click', () => {
//         console.log('toggle menu');
//         if (menu) menu.classList.toggle('open');
//     });
//     });
// }


// ---------- GRASS ALONG THE TOP OF THE FOOTER ----------
// Injected into the footer on every page (footer markup is shared). Loaded as
// an <object> so the blades' gentle blowing (defined in graphics/grass.svg)
// runs on its own; the SVG's base fades into the footer's dark teal.
(function () {
    function addFooterGrass() {
        const footer = document.querySelector("footer");
        if (!footer || footer.querySelector(".grass-obj")) return;
        const grass = document.createElement("object");
        grass.className = "grass-obj";
        grass.type = "image/svg+xml";
        grass.data = "graphics/grass.svg";
        grass.setAttribute("aria-hidden", "true");
        grass.setAttribute("tabindex", "-1");
        footer.insertBefore(grass, footer.firstChild);
    }
    if (document.body) addFooterGrass();
    else document.addEventListener("DOMContentLoaded", addFooterGrass);
})();

// Preload the custom cursor SVGs so swapping to the grab cursor mid-drag is
// instant — otherwise the browser briefly falls back to the OS cursor while the
// image loads.
(function () {
    ["hand-open.svg", "hand-grab.svg", "figma-cursor-green.svg", "green-cursor.svg"].forEach(function (name) {
        const img = new Image();
        img.src = "images/" + name;
    });
})();


const menu = document.querySelector('nav');
const burgerX = document.querySelector('.burger-x');
const burgerOpen = document.querySelector('.burger');
const menuButtons = document.querySelectorAll('.btn_menu');

if (menuButtons) {
    menuButtons.forEach((button) => {
        button.addEventListener('click', () => {
            console.log('toggle menu');
            if (menu) {
                menu.classList.toggle('open');
                burgerX.classList.toggle('visible'); 
            }
        });
    });
}

// new card 2/1 changes
// ---------- CARD BUTTON ANIMATION + NAVIGATION ----------


function animateAndNavigate(event) {
    event.preventDefault();

    const button = event.target;
    button.classList.add('clicked');

    // Listen for the end of the animation to remove the class
    button.addEventListener('transitionend', () => {
        button.classList.remove('clicked');
    }, { once: true });

    // Navigate after animation completes
    setTimeout(() => {
        window.open(button.getAttribute('data-url'), '_blank');
    }, 300);  // Matched to animation duration
}


// having the clicked icon lead to a section or external link

document.querySelectorAll('.logo-wrapper').forEach((wrapper) => {
    wrapper.addEventListener('click', handleIconClick);
});



function handleIconClick(event) {
    const target = event.currentTarget;
    const link = target.getAttribute('data-link');
    const type = target.getAttribute('data-type');
    const logoImage = target.querySelector('.tool-logo');

    if (logoImage) {
        logoImage.classList.add('clicked-logo');
    }

    setTimeout(() => {
        if (type === 'section' || type === 'external') {
            window.open(link, '_blank');
        }

        if (logoImage) {
            logoImage.classList.remove('clicked-logo');
        }
    }, 600);
}



// ---------- CURSOR LILY PAD + HOPPING FROG ----------
// The system mouse cursor stays as normal. A lily pad drifts after the
// cursor and a little frog hops along, settling on the pad once it catches
// up. Decorative, so it's disabled on touch devices and for reduced motion.
(function () {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion) {
        return;
    }

    // The frog + lily pad now act as the cursor, so hide the OS pointer.
    // Only flagged when the follower actually runs, so touch / reduced-motion
    // visitors keep their normal system cursor.
    document.body.classList.add("frog-cursor-active");

    const LILY_W = 58;                     // lily pad width in px
    const LILY_H = LILY_W * (114 / 137);   // keep the kitbitz art's aspect ratio
    const FROG = 30;                       // frog size in px
    const PAD_FOLLOW = 0.28;               // lily pad hugs the cursor closely (leads the frog)
    const FROG_FOLLOW = 0.11;              // frog trails the cursor and hops onto the pad
    const PERCH = 9;                       // px the frog sits above the pad's center
    const HOP_SPEED = 0.045;               // hop pace
    const HOP_HEIGHT = 8;                  // hop height
    const REST_DIST = 6;                   // within this distance the frog settles
    const HOP_DECAY = 0.94;                // how fast the hop fades once it arrives

    function makeFollower(src, z, w) {
        const el = document.createElement("img");
        el.src = src;
        el.alt = "";
        el.className = "cursor-follower";
        el.setAttribute("aria-hidden", "true");
        el.style.cssText =
            "position:fixed;top:0;left:0;width:" + w + "px;height:auto;" +
            "pointer-events:none;user-select:none;will-change:transform;" +
            "opacity:0;transition:opacity .4s ease;z-index:" + z + ";";
        document.body.appendChild(el);
        return el;
    }

    const lily = makeFollower("images/lilypad-kitbitz.svg", 9997, LILY_W);
    const frog = makeFollower("images/frog-cursor.svg", 9998, FROG);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let padX = mouseX, padY = mouseY;
    let frogX = mouseX, frogY = mouseY;
    let hopPhase = 0;
    let hopEnergy = 0;
    let facing = 1;
    let started = false;
    let overInteractive = false;

    // Interactive things that show the green pointing-hand cursor. While the
    // pointer is over one of these, the lily pad + frog fade away so they
    // don't compete with the hand.
    const INTERACTIVE = "a, button, .btn_menu, .logo, .logo-wrapper, .nav-link," +
        " .link, .snapshot-image, .creative-img, [onclick]," +
        " video, .video-card, .animation-wrapper, .frog-toggle, .rz-toggle, .hero-cd, .hero-pad," +
        " .cs-minimap";

    function updateVisibility() {
        const show = started && !overInteractive;
        lily.style.opacity = show ? "1" : "0";
        frog.style.opacity = show ? "1" : "0";
    }

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!started) {
            started = true;
        }
        updateVisibility();
    });

    // Track whether the cursor is currently over an interactive element.
    document.addEventListener("pointerover", (e) => {
        if (e.target.closest && e.target.closest(INTERACTIVE)) {
            overInteractive = true;
            updateVisibility();
        }
    });
    document.addEventListener("pointerout", (e) => {
        // Only react when leaving toward a non-interactive target.
        const to = e.relatedTarget;
        if (!to || !(to.closest && to.closest(INTERACTIVE))) {
            overInteractive = false;
            updateVisibility();
        }
    });

    function tick() {
        // Lily pad eases toward the cursor.
        padX += (mouseX - padX) * PAD_FOLLOW;
        padY += (mouseY - padY) * PAD_FOLLOW;

        // Frog trails the cursor directly (single delay, not chasing the pad
        // which itself chases the cursor — that double delay felt sluggish).
        const prevX = frogX;
        frogX += (mouseX - frogX) * FROG_FOLLOW;
        frogY += (mouseY - frogY) * FROG_FOLLOW;
        if (frogX - prevX > 0.2) facing = 1;
        else if (frogX - prevX < -0.2) facing = -1;

        // Hop while chasing the pad; settle (stop) once it lands on it.
        const dist = Math.hypot(padX - frogX, padY - frogY);
        if (dist > REST_DIST) hopEnergy = 1;
        else {
            hopEnergy *= HOP_DECAY;
            if (hopEnergy < 0.02) hopEnergy = 0;
        }
        hopPhase += HOP_SPEED;
        const hop = Math.abs(Math.sin(hopPhase)) * HOP_HEIGHT * hopEnergy;

        // Lily pad centered on its position. translate3d promotes it to its
        // own GPU layer so the movement is composited (no per-frame repaint).
        lily.style.transform =
            "translate3d(" + (padX - LILY_W / 2) + "px," + (padY - LILY_H / 2) + "px,0)";

        // Frog perched on top of the pad, minus the hop lift.
        const fx = frogX - FROG / 2;
        const fy = frogY - FROG - PERCH - hop;
        frog.style.transform =
            "translate3d(" + fx + "px," + fy + "px,0) scaleX(" + facing + ")";

        requestAnimationFrame(tick);
    }
    tick();
})();


// ---------- FLOWING COLOR STREAM ----------
// A soft tapered ribbon behind the cursor. The tail chases the head, so when
// the mouse stops the whole stream glides into the cursor and vanishes.
// Drawn on one lightweight canvas. Off for touch / reduced-motion.
(function () {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion) {
        return;
    }

    const canvas = document.createElement("canvas");
    canvas.className = "cursor-follower";
    canvas.style.cssText =
        "position:fixed;top:0;left:0;width:100%;height:100%;" +
        "pointer-events:none;z-index:9996;";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const N = 26;             // number of points in the stream
    const EASE = 0.32;        // how tightly the tail follows (higher = snappier)
    const WIDTH = 8;          // px width at the head, tapering to 0 at the tail

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let seen = false;
    const pts = [];
    for (let i = 0; i < N; i++) pts.push({ x: mouseX, y: mouseY });

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        seen = true;
    });

    function draw() {
        // Head sticks to the cursor; each point eases toward the one ahead.
        // When the cursor is still, they all converge on it and the tail
        // shrinks away "into the mouse".
        pts[0].x = mouseX;
        pts[0].y = mouseY;
        for (let i = 1; i < N; i++) {
            pts[i].x += (pts[i - 1].x - pts[i].x) * EASE;
            pts[i].y += (pts[i - 1].y - pts[i].y) * EASE;
        }

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        if (seen) {
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            for (let i = 1; i < N; i++) {
                const t = i / N; // 0 at head, 1 at tail
                const a = pts[i - 1];
                const b = pts[i];
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.lineWidth = WIDTH * (1 - t);
                // light, fresh green that fades out along the tail
                ctx.strokeStyle = "rgba(133, 205, 165," + (0.5 * (1 - t)) + ")";
                ctx.stroke();
            }
        }
        requestAnimationFrame(draw);
    }
    draw();
})();


// ---------- CREATIVE PAGE FILTER BUBBLES ----------
// Filter the creative work by category (All / Digital / Motion / Sound /
// Animation). "All" shows everything. Individual gallery artworks are
// tagged by their caption title so "Digital" shows just the listed pieces.
(function () {
    const filterButtons = document.querySelectorAll(".creative-filter");
    if (!filterButtons.length) {
        return; // not on the creative page
    }
    const galleryEl = document.querySelector(".creative-gallery");

    // Gallery pieces that belong to the "Digital" category (matched by the
    // text before the "|" in each figcaption).
    const DIGITAL_TITLES = [
        "Go, Fish",
        "Moon View",
        "Fish in Pond",
        "Pixelgirl",
        "Keroppi!",
        "Julie",
        "Blue City",
        "Dragons",
        "Butterfly Wings for T-shirt",
        "Keroppi Still Life",
        "Applying Illustrated Motifs to a Building"
    ];

    // Tag every gallery item individually so it can be filtered on its own.
    // Items with an explicit data-category (e.g. the videos: motion/sound/
    // animation) keep it; the rest are digital or art based on their title.
    document.querySelectorAll(".creative-gallery > li").forEach((li) => {
        const caption = li.querySelector("figcaption");
        const title = caption ? caption.textContent.split("|")[0].trim() : "";
        li.classList.add("creative-group");
        if (!li.dataset.category) {
            li.dataset.category = DIGITAL_TITLES.includes(title) ? "digital" : "art";
        }
    });

    const groups = document.querySelectorAll(".creative-group");

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const filter = btn.dataset.filter;

            // Highlight the active bubble.
            filterButtons.forEach((b) => b.classList.toggle("is-active", b === btn));

            // Direct cut: instantly show matching items and hide the rest, with
            // no fade/scale transitions. Clear any leftover inline styles from
            // earlier animated versions and from the scroll-reveal (GSAP sets
            // opacity: 0 on items whose reveal hasn't fired yet — filtering
            // brings those into view without triggering the reveal, so they
            // would stay invisible until scrolled. Force them fully visible).
            let visibleCount = 0;
            groups.forEach((group) => {
                const show = filter === "all" || group.dataset.category === filter;
                group.style.transition = "none";
                group.style.transitionDelay = "";
                group.style.transform = "";
                group.style.pointerEvents = "";
                if (show) {
                    visibleCount++;
                    group.style.display = "";
                    group.style.opacity = "1";              // override GSAP's opacity: 0
                    group.style.visibility = "visible";
                    // Kill the pending scroll-reveal so it can't re-hide the
                    // item later when its ScrollTrigger runs.
                    if (typeof ScrollTrigger !== "undefined") {
                        ScrollTrigger.getAll().forEach((st) => {
                            if (st.trigger === group) st.kill();
                        });
                    }
                } else {
                    group.style.display = "none";
                    group.style.opacity = "";
                }
            });

            // A small result set stacks awkwardly in the masonry columns, so
            // lay just those out in a single left-aligned row at the normal
            // item width (side by side, no gaps). Larger sets (e.g. Digital)
            // keep the gapless masonry columns.
            if (galleryEl) {
                galleryEl.style.columnCount = ""; // clear any old inline value
                const maxCols = window.matchMedia("(min-width: 1100px)").matches ? 4
                    : window.matchMedia("(min-width: 700px)").matches ? 3 : 2;
                const useRow = filter !== "all" && visibleCount > 0 && visibleCount <= maxCols;
                galleryEl.classList.toggle("is-row", useRow);
            }

            // Recalc scroll positions right away (no transition to wait for).
            if (typeof ScrollTrigger !== "undefined") {
                ScrollTrigger.refresh();
            }
        });
    });
})();


// ---------- LOADING SCREEN ----------
// Shows the frog-hopping-lilypads intro, then fades to reveal the page.
(function () {
    const loader = document.getElementById("loading-screen");
    if (!loader) {
        return; // only present on the home page
    }

    document.body.classList.add("is-loading");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Split the "Hopping in…" text into per-letter spans so each letter can
    // hop in a staggered, traveling wave (see .hop-letter in the CSS).
    const textEl = loader.querySelector(".loader-text");
    if (textEl && !reducedMotion) {
        const chars = textEl.textContent.split("");
        textEl.textContent = "";
        chars.forEach((ch, i) => {
            const span = document.createElement("span");
            span.className = "hop-letter";
            span.textContent = ch === " " ? "\u00A0" : ch;
            span.style.animationDelay = (i * 0.08).toFixed(2) + "s";
            textEl.appendChild(span);
        });
    }
    // Frog lands on the last pad ~1.7s in; start the fade right after so it
    // doesn't linger. Skip the wait for visitors who prefer reduced motion.
    const MIN_DISPLAY = reducedMotion ? 500 : 1800;
    const startedAt = Date.now();

    function hideLoader() {
        const waited = Date.now() - startedAt;
        const remaining = Math.max(0, MIN_DISPLAY - waited);

        setTimeout(() => {
            document.body.classList.remove("is-loading");
            // Simple fade-out, then remove from the DOM.
            loader.classList.add("loaded");
            loader.addEventListener(
                "transitionend",
                () => loader.remove(),
                { once: true }
            );
        }, remaining);
    }

    if (document.readyState === "complete") {
        hideLoader();
    } else {
        window.addEventListener("load", hideLoader);
    }
})();


// ---------- CREATIVE GALLERY HOVER CARDS ----------
// Turns each gallery figcaption ("Title | Year") into a frosted info card
// that reveals on hover: Title (Year), the tool/method, and an optional
// description. Tool + description come from data-tool / data-desc on the
// <li>; the card omits any piece that isn't provided.
(function () {
    const captions = document.querySelectorAll(".creative-gallery figcaption");
    if (!captions.length) {
        return; // not on the creative page
    }

    // Tool / method per artwork, keyed by the caption title (text before "|").
    // CSS uppercases these for display.
    const TOOLS = {
        "Go, Fish": "procreate",
        "Moon View": "procreate",
        "Fish in Pond": "procreate",
        "Pixelgirl": "bitmap",
        "Keroppi!": "bitmap",
        "Julie": "canva",
        "Pegasus Earrings": "jewelry making",
        "Dreamy Star Earrings": "jewelry making",
        "Green Necklace": "jewelry making",
        "Blue City": "procreate",
        "Dragons": "procreate",
        "Butterfly Wings for T-shirt": "figma",
        "Keroppi Still Life": "procreate",
        "Scene from Scaredy Cat!": "procreate",
        "Scaredy Cat! Title Card": "procreate",
        "Photograph of URBN Center": "photoshop",
        "Photography showcasing scale": "photoshop",
        "Photography Showing Geometric Form": "photoshop",
        "Rotoscope of My Sister": "procreate",
        "Rotoscope of Tree": "photoshop",
        "1 Like 2": "photoshop",
        "Plush Monsters": "my hands",
        "Applying Illustrated Motifs to a Building": "photoshop, illustrator",
        "Observational Drawing of My Sister": "pencil",
        "Self Reflection, Mixed Media": "watercolor",
        "Still Life and Observational Drawing": "pencil",
        "Portrait of my Dad as a Student!": "pencil",
        "Using Photoshop to Apply Patterns": "photoshop"
    };

    captions.forEach((cap) => {
        if (cap.classList.contains("art-card")) return; // already built

        const raw = cap.textContent.trim();
        const parts = raw.split("|");
        const title = (parts[0] || "").trim();
        const year = (parts[1] || "").trim();

        const li = cap.closest("li");
        const tool = (li && li.dataset.tool ? li.dataset.tool.trim() : "") || TOOLS[title] || "";
        const desc = li && li.dataset.desc ? li.dataset.desc.trim() : "";

        let html = '<span class="art-title">' + title;
        if (year) html += " (" + year + ")";
        html += "</span>";
        if (tool) html += '<span class="art-tool">' + tool + "</span>";
        if (desc) html += '<p class="art-desc">' + desc + "</p>";

        cap.innerHTML = html;
        cap.classList.add("art-card");

        const fig = cap.closest("figure");
        if (fig) fig.classList.add("art-card-host");
    });
})();


// ---------- HOVER CARDS ON VIDEOS + CURSOR FOLLOW ----------
// Gives the Motion/Sound video cards and the animation write-ups the same
// hover card as the gallery, then makes every card follow the cursor.
(function () {
    if (!document.querySelector(".creative-gallery, .video-card, .animation-wrapper")) {
        return; // not on the creative page
    }

    // Build a hover card inside a host from a title (+ optional tool/desc).
    function buildCard(host, title, tool, desc) {
        if (!host || host.querySelector(".art-card")) return;
        const card = document.createElement("div");
        card.className = "art-card";
        let html = '<span class="art-title">' + title + "</span>";
        if (tool) html += '<span class="art-tool">' + tool + "</span>";
        if (desc) html += '<p class="art-desc">' + desc + "</p>";
        card.innerHTML = html;
        host.classList.add("art-card-host");
        host.appendChild(card);
    }

    // Tool / method per video, keyed by title (CSS uppercases these).
    const VIDEO_TOOLS = {
        "Ad for Local Nonprofit Le Cat Cafe (2023)": "after effects, premiere pro",
        "SEPTA Spanish Advertisement (2023)": "figma, after effects, premiere pro",
        "Big Hero 6 Trailer (2023)": "audition",
        "SFX Work (2023)": "audition",
        "City Life (2022)": "procreate",
        "Scaredy Cat! (2023)": "procreate"
    };

    // Motion / Sound video cards: title (already includes the year) + tool.
    document.querySelectorAll(".video-card").forEach((vc) => {
        const titleEl = vc.querySelector(".video-title");
        if (!titleEl) return;
        const title = titleEl.textContent.trim();
        const tool = (vc.dataset.tool ? vc.dataset.tool.trim() : "") || VIDEO_TOOLS[title] || "";
        buildCard(vc, title, tool, "");
        titleEl.style.display = "none";
    });

    // Animations: title + tool + the existing description.
    document.querySelectorAll(".animation-wrapper").forEach((aw) => {
        const titleEl = aw.querySelector(".animation-h4");
        if (!titleEl) return;
        const descEl = aw.querySelector(".animation-desc");
        const title = titleEl.textContent.trim();
        const tool = (aw.dataset.tool ? aw.dataset.tool.trim() : "") || VIDEO_TOOLS[title] || "";
        const desc = descEl ? descEl.textContent.trim() : "";
        buildCard(aw, title, tool, desc);
        titleEl.style.display = "none";
        if (descEl) descEl.style.display = "none";
    });

    // Every card follows the cursor (offset to its right).
    const OFFSET_X = 22;  // px to the right of the cursor
    const OFFSET_Y = -18; // px above the cursor

    document.querySelectorAll(".art-card-host").forEach((host) => {
        const card = host.querySelector(".art-card");
        if (!card) return;

        const place = (e) => {
            const rect = host.getBoundingClientRect();
            card.style.left = (e.clientX - rect.left + OFFSET_X) + "px";
            card.style.top = (e.clientY - rect.top + OFFSET_Y) + "px";
        };

        // Position immediately on enter so the card fades in at the cursor.
        host.addEventListener("mouseenter", place);
        host.addEventListener("mousemove", place);
    });
})();







// ---------- SHUFFLE CREATIVE GALLERY ORDER ----------
// Mixes up the gallery items (images + videos) so they're interspersed.
(function () {
    const gallery = document.querySelector(".creative-gallery");
    if (!gallery) return;

    // Full shuffle first.
    const items = Array.from(gallery.children);
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }

    // Pull out the "pin to top" pieces (the Web videos) and drop them back into
    // random slots within the first stretch of the gallery — near the top, but
    // never adjacent, so they stay scattered among the other work.
    const rest = items.filter((li) => !li.hasAttribute("data-pin-top"));
    const pinned = items.filter((li) => li.hasAttribute("data-pin-top"));

    if (pinned.length) {
        const TOP_LIMIT = Math.min(rest.length, 9); // keep them within the first ~9
        const positions = [];
        pinned.forEach(() => {
            let p, tries = 0;
            do {
                p = 1 + Math.floor(Math.random() * TOP_LIMIT); // not always dead-first
                tries++;
            } while (positions.some((q) => Math.abs(q - p) < 2) && tries < 25);
            positions.push(p);
        });
        positions.sort((a, b) => a - b);
        // Insert ascending; +i offsets for the items already spliced in.
        positions.forEach((pos, i) => {
            rest.splice(Math.min(pos + i, rest.length), 0, pinned[i]);
        });
    }

    rest.forEach((li) => gallery.appendChild(li));
})();


// ---------- NAV: hide on scroll (static pill, no fluid mouse effects) ----------
// The top pill marks the current page and tucks up out of view when you scroll
// down, dropping back in when you scroll up. No cursor-following goo or
// per-letter warp — the nav is a plain static pill.
(function () {
    const wrapper = document.querySelector(".nav-wrapper");
    const links = Array.from(document.querySelectorAll(".nav-link"));
    if (!wrapper || !links.length) return;

    // Solid pill on the current page's link.
    const current = location.pathname.split("/").pop() || "index.html";
    links.forEach((link) => {
        const href = (link.getAttribute("href") || "").split("/").pop();
        if (href && href === current) link.classList.add("is-current");
    });

    // The top pill only exists on desktop; the mobile nav is a burger overlay.
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    // ----- Hide on scroll down, reveal on scroll up -----
    const HIDE_Y = -140;
    let lastScroll = window.scrollY;
    let hidden = false;

    function applyHide(next) {
        if (next === hidden) return;
        hidden = next;
        wrapper.style.setProperty("--nav-hide", (hidden ? HIDE_Y : 0) + "px");
        wrapper.style.opacity = hidden ? "0" : "1";
        wrapper.style.pointerEvents = hidden ? "none" : "";
    }

    window.addEventListener("scroll", () => {
        const y = window.scrollY;
        const delta = y - lastScroll;
        if (y < 90) applyHide(false);
        else if (delta > 6) applyHide(true);
        else if (delta < -6) applyHide(false);
        lastScroll = y;
    }, { passive: true });
})();


// ---------- HERO LILY PADS: gentle float + drag to move ----------
// Each pad drifts on its own slow loop, and on desktop you can grab a pad
// and drag it anywhere on the page; it stays where you drop it.
(function () {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pads = Array.prototype.slice.call(document.querySelectorAll(".hero-pad"));
    if (!pads.length) return;

    const canDrag = window.matchMedia("(min-width: 900px) and (pointer: fine)").matches;
    // Keep the pads still on mobile + tablet — no gentle float or bob.
    const stillPads = window.matchMedia("(max-width: 899px)").matches;

    const cfg = pads.map((el, i) => {
        el.style.animation = "none";        // JS owns the transform now
        el.style.willChange = "transform";
        if (canDrag) el.style.pointerEvents = "auto"; // grabbable
        return {
            el: el,
            host: el.hasAttribute("data-host"),
            ampX: 5 + (i % 2) * 3,
            ampY: 7 + (i % 3) * 3,
            sp: 0.0006 + (i % 3) * 0.00016,
            ph: i * 1.9,
            dx: 0, dy: 0,   // drag offset from the pad's CSS home
        };
    });

    // ----- Drag a pad anywhere on the page; a click (no drag) ripples it -----
    let drag = null, startX = 0, startY = 0, baseX = 0, baseY = 0, moved = false;

    function ripplePad(el) {
        // Play the bubble sound on each lilypad tap.
        try {
            const b = new Audio("sound/bubble.mp3");
            b.volume = 0.5;
            b.play().catch(() => {});
        } catch (e) { /* ignore */ }

        for (let i = 0; i < 2; i++) {
            const r = document.createElement("div");
            r.className = "pad-click-ripple";
            r.style.animationDelay = i * 140 + "ms";
            el.appendChild(r);
            setTimeout(() => r.remove(), 850 + i * 140);
        }

        // Once any pad has been tapped, settle the hint: stop its pulse and
        // switch the invite text to a happy "awesome!".
        const hint = document.querySelector(".pad-hint");
        if (hint && !hint.classList.contains("is-tapped")) {
            hint.textContent = "awesome!";
            hint.classList.add("is-tapped");
        }
    }

    if (canDrag) {
        cfg.forEach((c) => {
            c.el.addEventListener("pointerdown", (e) => {
                // let the toggle + CD player work — don't start a drag on them
                if (e.target.closest && e.target.closest(".frog-toggle, .hero-cd")) return;
                drag = c;
                moved = false;
                startX = e.clientX;
                startY = e.clientY;
                baseX = c.dx;
                baseY = c.dy;
                c.el.classList.add("dragging");
                try { c.el.setPointerCapture(e.pointerId); } catch (err) {}
                e.preventDefault();
            });
        });
        window.addEventListener("pointermove", (e) => {
            if (!drag) return;
            drag.dx = baseX + (e.clientX - startX);
            drag.dy = baseY + (e.clientY - startY);
            if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
                moved = true;
            }
        });
        window.addEventListener("pointerup", () => {
            if (!drag) return;
            drag.el.classList.remove("dragging");
            if (!moved) ripplePad(drag.el); // a click (not a drag) → ripple the pad
            drag = null;
        });
    } else {
        // Mobile / touch: no dragging, but a tap on a pad still ripples it +
        // triggers the "awesome!" text swap on the middle pad.
        cfg.forEach((c) => {
            c.el.style.pointerEvents = "auto";
            c.el.addEventListener("click", (e) => {
                if (e.target.closest && e.target.closest(".frog-toggle, .hero-cd")) return;
                ripplePad(c.el);
            });
        });
    }

    function loop(t) {
        for (let i = 0; i < cfg.length; i++) {
            const c = cfg[i];
            const isDragging = drag === c;
            let fx = 0, fy = 0;
            if (!reducedMotion && !stillPads && !isDragging) {
                const amp = c.host ? 0.5 : 1;   // host pad (with toggle) bobs less
                fx = Math.sin(t * c.sp * 0.7 + c.ph) * c.ampX * amp;
                fy = Math.sin(t * c.sp + c.ph) * c.ampY * amp;
            }
            c.el.style.transform =
                "translate3d(" + (c.dx + fx) + "px," + (c.dy + fy) + "px,0)";
        }
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
})();


// ---------- "frog cursor" gooey on/off toggle ----------
// The switch (on a lily pad, desktop only) turns the frog-cursor follower and
// its trail on or off. The choice is remembered across visits.
(function () {
    const sw = document.getElementById("switchContainer");
    if (!sw) return;

    const KEY = "frogCursor";
    const on = localStorage.getItem(KEY) !== "off"; // default: on

    // Initial state: only add "switchOn" when on (leaving off with no class so
    // it rests at the left with no load animation).
    if (on) sw.classList.add("switchOn");
    sw.setAttribute("aria-checked", on ? "true" : "false");
    document.body.classList.toggle("frog-cursor-off", !on);

    function set(turnOn) {
        sw.classList.remove("switchOn", "switchOff");
        sw.classList.add(turnOn ? "switchOn" : "switchOff");
        sw.setAttribute("aria-checked", turnOn ? "true" : "false");
        document.body.classList.toggle("frog-cursor-off", !turnOn);
        playToggleSound(turnOn);
        try { localStorage.setItem(KEY, turnOn ? "on" : "off"); } catch (e) {}
    }

    sw.addEventListener("click", () => set(!sw.classList.contains("switchOn")));
    sw.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            set(!sw.classList.contains("switchOn"));
        }
    });

    // While the cursor is over the toggle, hide the frog follower so the
    // cursor visibly switches from the frog to the custom green pointer.
    const toggleArea = sw.closest(".frog-toggle") || sw;
    toggleArea.addEventListener("mouseenter", () =>
        document.body.classList.add("over-toggle"));
    toggleArea.addEventListener("mouseleave", () =>
        document.body.classList.remove("over-toggle"));
})();


// ---------- CLICK SOUNDS ----------
// A soft "cute-click" plays on any interactive click across the site; opening
// a case study instead plays the heavier "enter-click". Sounds live in /sound.
// Playback is triggered by a real click (a user gesture), so autoplay policies
// allow it. Each play clones the audio so rapid clicks can overlap cleanly.
(function () {
    const cute = new Audio("sound/cute-click.mp3");
    const enter = new Audio("sound/enter-click.mp3");
    cute.preload = "auto";
    enter.preload = "auto";
    cute.volume = 0.5;
    enter.volume = 0.6;

    function play(sound) {
        try {
            const a = sound.cloneNode();
            a.volume = sound.volume;
            a.play().catch(() => {});
        } catch (e) { /* ignore */ }
    }

    // Case-study pages, so links pointing at them also count as "entering".
    const CASE_PAGES = [
        "amazon.html", "zeroeyes.html", "phillyreach.html",
        "michoacana.html", "proj-3.html", "proj-4.html",
    ];
    // Elements that mean "press into a case study".
    const CASE_STUDY = ".button-card-final, .projects-card, [data-url]";
    // General interactive things that should click.
    const INTERACTIVE = "a, button, [onclick], [role='button'], input, label," +
        " .btn_menu, .logo, .logo-wrapper, .nav-link, .creative-filter," +
        " .icon, .snapshot-image, .creative-img, .creative-vid";

    function isCaseStudy(el) {
        if (el.closest && el.closest(CASE_STUDY)) return true;
        const a = el.closest && el.closest("a[href]");
        if (a) {
            const href = a.getAttribute("href") || "";
            if (CASE_PAGES.some((p) => href.indexOf(p) !== -1)) return true;
        }
        return false;
    }

    // Capture phase so the sound fires even if a handler stops propagation.
    document.addEventListener("click", (e) => {
        const t = e.target;
        if (!t || !t.closest) return;

        const caseStudy = isCaseStudy(t);
        const sound = caseStudy ? enter : (t.closest(INTERACTIVE) ? cute : null);
        if (!sound) return;
        play(sound);

        // Same-tab link navigation unloads the page before the sound is heard,
        // so briefly hold the navigation, let the click play, then follow it.
        const a = t.closest("a[href]");
        if (a && !caseStudy) {
            const href = a.getAttribute("href") || "";
            const newTab = a.target === "_blank" ||
                e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1;
            const special = /^(mailto:|tel:|#|javascript:)/i.test(href);
            if (href && !newTab && !special) {
                e.preventDefault();
                const dest = a.href;
                if (document.body.classList.contains("is-home")) {
                    // Home has no color transition (it uses the frog loading
                    // screen). Hold briefly so the click sound is audible.
                    setTimeout(() => { window.location.href = dest; }, 140);
                } else {
                    // Skip the wipe when heading to the home page — it has its
                    // own frog loading screen. Navigate cleanly instead.
                    let path = href;
                    try { path = new URL(dest).pathname; } catch (err) {}
                    const goingHome = /(^|\/)index\.html$/.test(path) || /\/$/.test(path);
                    if (goingHome) {
                        setTimeout(() => { window.location.href = dest; }, 140);
                    } else {
                        // Everywhere else: wipe the color panel over the page
                        // (.pt-leaving drives the CSS cover animation), then go.
                        // About / Archive (projects) / Creative use the brighter
                        // teal so the cover matches their arrival color.
                        const altDest = /(about|projects|creative)\.html$/i.test(path);
                        document.body.style.setProperty("--pt-color", altDest ? "#00B3A8" : "#0D96A5");
                        document.body.classList.add("pt-leaving");
                        setTimeout(() => { window.location.href = dest; }, 520);
                    }
                }
            }
        }
    }, true);
})();


// ---------- RESUME SUMMARY / FULL-DETAILS TOGGLE ----------
// Reuses the gooey switch. Off (default) = summary paragraphs;
// On = full bullet-point details.
(function () {
    const sw = document.getElementById("resumeSwitch");
    const section = document.querySelector(".resume-section");
    if (!sw || !section) return;

    function set(full) {
        sw.classList.remove("switchOn", "switchOff");
        sw.classList.add(full ? "switchOn" : "switchOff");
        sw.setAttribute("aria-checked", full ? "true" : "false");
        section.classList.toggle("rz-full", full);
        playToggleSound(full);
    }

    sw.addEventListener("click", () => set(!sw.classList.contains("switchOn")));
    sw.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            set(!sw.classList.contains("switchOn"));
        }
    });
})();


// ---------- TOGGLE SOUND ----------
// Plays the on/off sound when a gooey switch is flipped.
function playToggleSound(on) {
    try {
        const audio = new Audio(on ? "sound/on.mp3" : "sound/off.mp3");
        audio.currentTime = 0;
        audio.play().catch(function () {});
    } catch (e) {}
}


// ---------- HERO CD: spin + play a little playlist ----------
(function () {
    const dvd = document.getElementById("heroDvd");
    if (!dvd) return;

    const prevBtn = document.getElementById("cdPrev");
    const nextBtn = document.getElementById("cdNext");
    const disc = dvd.querySelector(".hero-dvd-disc");
    const label = dvd.querySelector("#cdLabel");

    // Each track gets its own disc look: a hue shift (recolours the whole disc)
    // and the label printed around the rim.
    const tracks = [
        { src: "sound/night-drive.mp3",        label: "NIGHT DRIVE", hue: 0 },
        { src: "sound/groove.mp3",             label: "GROOVE",      hue: 200 },
        { src: "sound/bossa-nova-gentle.mp3",  label: "BOSSA NOVA",  hue: 290 }
    ];
    let idx = 0;
    let audio = new Audio(tracks[idx].src);
    audio.loop = true;

    // Recolour the whole flower-disc per track via hue-rotate (instant, no fade).
    function applyLook(i) {
        if (disc) disc.style.filter = "hue-rotate(" + tracks[i].hue + "deg)";
        if (label) label.textContent = tracks[i].label + " · " + tracks[i].label + " · ";
    }
    const swapLook = applyLook;
    applyLook(idx); // initial look

    function play() {
        dvd.classList.add("spinning");
        audio.play().catch(function () {});
    }
    function pause() {
        dvd.classList.remove("spinning");
        audio.pause();
    }
    function loadTrack(i) {
        idx = (i + tracks.length) % tracks.length;
        audio.pause();
        audio = new Audio(tracks[idx].src);
        audio.loop = true;
        swapLook(idx); // smooth opacity crossfade to the new disc look
        play(); // skipping a track starts it playing
    }

    dvd.addEventListener("click", function () {
        if (dvd.classList.contains("spinning")) pause();
        else play();
    });
    if (nextBtn) nextBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        loadTrack(idx + 1);
    });
    if (prevBtn) prevBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        loadTrack(idx - 1);
    });
})();


// ---------- CASE STUDY SCROLL MINIMAP ----------
// A high-level preview of the whole case study, pinned on the right (desktop
// only). A scaled-down live clone of <main> shows the page at a glance; a
// viewport indicator tracks the scroll position and moves as you scroll, and
// clicking or dragging on the minimap jumps to that part of the page. Purely a
// navigation aid (aria-hidden) — normal scrolling/keyboard still works.
//
// ============================================================================
// HOW TO ADD THIS PREVIEW TO A NEW CASE STUDY PAGE
// ============================================================================
// Good news: there is NOTHING to wire up per page. The minimap builds itself
// on any page that has the standard case-study structure. To get it on a new
// case study, just make sure the page has all three of these (every existing
// case study already does — copy amazon.html as a starting point):
//
//   1. A single <main> element wrapping the page content (the minimap clones
//      <main> to build the preview, so the cover image + everything inside it
//      shows up in the thumbnail).
//   2. A <div class="project-wrapper"> inside <main> holding the article body.
//      Both <main> AND .project-wrapper must exist or the minimap won't build
//      (that's the guard right below this comment — it's what keeps the minimap
//      OFF non-case-study pages like index/about/creative).
//   3. This script loaded at the bottom of the page:
//         <script src="js/index.js"></script>
//      (case studies also load GSAP + case-study.js for scroll reveals, but the
//      minimap itself only needs index.js.)
//
// That's it — reload at a desktop width (>= 1200px) and the preview appears on
// the right. On phones/tablets it's hidden automatically, and it's skipped for
// visitors who prefer reduced motion.
//
// TUNING (all optional):
//   • Width of the preview: the SLIM_CAP / WIDE_CAP values in layout() below.
//     Short case studies auto-use the narrower SLIM_CAP so they don't look like
//     a fat bar; longer ones use WIDE_CAP. No per-page code needed.
//   • Appearance (border, background, position, opacity): see the ".cs-minimap"
//     rules in css/screen.css (inside the "min-width: 1200px" block).
//   • Space reserved on the right so body text clears the minimap:
//     "body.has-minimap .project-wrapper { padding-right: … }" in screen.css.
//   • Breakpoint it turns on at: the matchMedia("(min-width: 1200px)") below
//     AND the matching @media in screen.css — keep the two in sync.
// ============================================================================
(function () {
    const main = document.querySelector("main");
    const wrapper = document.querySelector(".project-wrapper");
    if (!main || !wrapper) return; // case study pages only

    const mq = window.matchMedia("(min-width: 1200px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let nav, stage, clone, viewport, scaleVal = 1, dragging = false, raf = 0, rot;

    function build() {
        if (nav) return;
        nav = document.createElement("div");
        nav.className = "cs-minimap";
        nav.setAttribute("aria-hidden", "true");

        stage = document.createElement("div");
        stage.className = "cs-minimap-stage";

        clone = main.cloneNode(true);
        clone.removeAttribute("id");
        clone.querySelectorAll("[id]").forEach(function (el) { el.removeAttribute("id"); });
        // Neutralize media so the clone doesn't autoplay or refetch.
        clone.querySelectorAll("video").forEach(function (v) {
            try { v.pause(); } catch (e) {}
            v.autoplay = false; v.removeAttribute("autoplay");
            v.muted = true; v.preload = "none";
        });
        clone.querySelectorAll("iframe").forEach(function (f) { f.removeAttribute("src"); });

        stage.appendChild(clone);
        nav.appendChild(stage);

        viewport = document.createElement("div");
        viewport.className = "cs-minimap-viewport";
        nav.appendChild(viewport);

        document.body.appendChild(nav);
        document.body.classList.add("has-minimap");

        nav.addEventListener("pointerdown", onPointerDown);
        nav.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);

        layout();
    }

    function teardown() {
        if (!nav) return;
        nav.remove();
        nav = stage = clone = viewport = null;
        document.body.classList.remove("has-minimap");
    }

    function layout() {
        if (!nav) return;
        const pageW = document.documentElement.clientWidth;
        const scrollH = document.documentElement.scrollHeight;
        const mainTop = main.getBoundingClientRect().top + window.scrollY;
        const maxH = window.innerHeight * 0.8;
        // Rule: short case studies get a narrower preview. A short page, scaled
        // to fit the available height, would still be wider than WIDE_CAP (it's
        // "width-limited") — those hit the SLIM_CAP so they don't look like a
        // fat bar. Longer pages are height-limited and scale down on their own,
        // so they keep the wider cap. This adapts to any case study's length
        // automatically (no per-page tweaks needed).
        const SLIM_CAP = 90;   // short / wide-aspect case studies (e.g. ZeroEyes)
        const WIDE_CAP = 120;  // longer case studies (Amazon, PhillyReach, …)
        const heightFitWidth = pageW * (maxH / scrollH);
        const maxW = heightFitWidth > WIDE_CAP ? SLIM_CAP : WIDE_CAP;
        scaleVal = Math.min(maxW / pageW, maxH / scrollH);

        stage.style.width = pageW + "px";
        stage.style.height = scrollH + "px";
        stage.style.transform = "scale(" + scaleVal + ")";

        clone.style.position = "absolute";
        clone.style.top = mainTop + "px";
        clone.style.left = "0";
        clone.style.width = pageW + "px";
        clone.style.margin = "0";

        nav.style.width = pageW * scaleVal + "px";
        nav.style.height = scrollH * scaleVal + "px";
        updateIndicator();
    }

    function updateIndicator() {
        if (!viewport) return;
        viewport.style.top = window.scrollY * scaleVal + "px";
        viewport.style.height = window.innerHeight * scaleVal + "px";
    }

    function jumpTo(e) {
        const rect = nav.getBoundingClientRect();
        const y = (e.clientY - rect.top) / scaleVal - window.innerHeight / 2;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo({
            top: Math.max(0, Math.min(max, y)),
            behavior: reduce.matches ? "auto" : "smooth",
        });
    }
    function onPointerDown(e) {
        dragging = true;
        try { nav.setPointerCapture(e.pointerId); } catch (err) {}
        jumpTo(e);
    }
    function onPointerMove(e) { if (dragging) jumpTo(e); }
    function onPointerUp() { dragging = false; }

    function onScroll() {
        if (raf) return;
        raf = requestAnimationFrame(function () { updateIndicator(); raf = 0; });
    }
    function apply() { if (mq.matches) build(); else teardown(); }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () { apply(); if (nav) layout(); });
    window.addEventListener("load", function () { if (nav) layout(); });
    if ("ResizeObserver" in window) {
        const ro = new ResizeObserver(function () {
            clearTimeout(rot);
            rot = setTimeout(function () { if (nav) layout(); }, 150);
        });
        ro.observe(document.body);
    }
    if (mq.addEventListener) mq.addEventListener("change", apply);
    else if (mq.addListener) mq.addListener(apply);

    apply();
})();


// ---------- CREATIVE: IMAGES / WITH-CAPTIONS GOOEY TOGGLE (mobile) ----------
// Reuses the gooey switch (like the lily-pad frog-cursor toggle). Off (default)
// = "Images" (captions hidden); On = "With captions". Flips .captions-on on the
// gallery wrapper, which the CSS uses to show/hide the static captions.
(function () {
    const sw = document.getElementById("captionSwitch");
    const wrapper = document.querySelector(".creative-wrapper");
    if (!sw || !wrapper) return; // only on the creative page

    function set(on) {
        sw.classList.remove("switchOn", "switchOff");
        sw.classList.add(on ? "switchOn" : "switchOff");
        sw.setAttribute("aria-checked", on ? "true" : "false");
        wrapper.classList.toggle("captions-on", on);
        playToggleSound(on);
    }

    sw.addEventListener("click", () => set(!sw.classList.contains("switchOn")));
    sw.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            set(!sw.classList.contains("switchOn"));
        }
    });
})();


// ---------- ABOUT PAGE: ripple the decorative lily pads on tap ----------
// The framed photo's corner lily pads (.frame-lilypad) are <img> elements, so
// the expanding ring is appended to their container (.about-frame-decor) and
// sized/placed over the tapped pad. Mirrors the hero pads' tap ripple.
(function () {
    const pads = document.querySelectorAll(".about-frame-decor .frame-lilypad");
    if (!pads.length) return;

    pads.forEach(function (pad) {
        pad.style.pointerEvents = "auto";
        pad.style.cursor = "pointer";
        pad.addEventListener("click", function () {
            const parent = pad.parentNode;
            if (!parent) return;
            for (let i = 0; i < 2; i++) {
                const r = document.createElement("div");
                r.className = "frame-pad-ripple";
                r.style.left = pad.offsetLeft + "px";
                r.style.top = pad.offsetTop + "px";
                r.style.width = pad.offsetWidth + "px";
                r.style.height = pad.offsetHeight + "px";
                r.style.animationDelay = i * 140 + "ms";
                parent.appendChild(r);
                setTimeout(function () { r.remove(); }, 850 + i * 140);
            }
            // Same soft bubble as the hero pads.
            try {
                const b = new Audio("sound/bubble.mp3");
                b.volume = 0.5;
                b.play().catch(function () {});
            } catch (e) { /* ignore */ }
        });
    });
})();
