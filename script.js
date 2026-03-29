const panels = Array.from(document.querySelectorAll(".panel"));
const storyLinks = Array.from(document.querySelectorAll(".story-link"));
const progressBar = document.querySelector(".story-progress");

let activeIndex = 0;
let scrollLock = false;

function setActivePanel(index) {
    const previousIndex = activeIndex;
    const clamped = Math.max(0, Math.min(index, panels.length - 1));
    activeIndex = clamped;

    panels.forEach((panel, panelIndex) => {
        panel.classList.toggle("is-active", panelIndex === clamped);

        if (panelIndex !== clamped) return;
        if (clamped > previousIndex) {
            panel.dataset.motion = "down";
        } else if (clamped < previousIndex) {
            panel.dataset.motion = "up";
        } else {
            panel.dataset.motion = "down";
        }
    });

    storyLinks.forEach((link, linkIndex) => {
        const isActive = linkIndex === clamped;
        link.classList.toggle("is-active", isActive);
        link.setAttribute("aria-current", isActive ? "page" : "false");
    });

    const panelName = panels[clamped].dataset.panel || "home";
    document.body.setAttribute("data-theme", panelName);

    if (progressBar) {
        const progress = (clamped / (panels.length - 1 || 1)) * 100;
        progressBar.style.background = `linear-gradient(to bottom, rgba(255,255,255,0.65) ${progress}%, rgba(255,255,255,0.12) ${progress}%)`;
    }
}

function scrollToPanel(index) {
    const target = panels[Math.max(0, Math.min(index, panels.length - 1))];
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setupPanelObserver() {
    if (!("IntersectionObserver" in window)) {
        setActivePanel(0);
        return;
    }

    const panelObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting || entry.intersectionRatio < 0.62) return;

                const index = panels.indexOf(entry.target);
                if (index >= 0) {
                    setActivePanel(index);
                }
            });
        },
        {
            threshold: [0.62, 0.8],
            rootMargin: "0px"
        }
    );

    panels.forEach((panel) => panelObserver.observe(panel));
}

function setupNavigationLinks() {
    storyLinks.forEach((link, index) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            scrollToPanel(index);
        });
    });
}

function setupKeyboardNavigation() {
    window.addEventListener("keydown", (event) => {
        const key = event.key;
        const nextKeys = ["ArrowDown", "PageDown", " "];
        const prevKeys = ["ArrowUp", "PageUp"];

        if (nextKeys.includes(key)) {
            event.preventDefault();
            scrollToPanel(activeIndex + 1);
            return;
        }

        if (prevKeys.includes(key)) {
            event.preventDefault();
            scrollToPanel(activeIndex - 1);
        }
    });
}

function setupTouchWheelSnapAssist() {
    window.addEventListener(
        "wheel",
        (event) => {
            if (window.innerWidth > 900) return;
            if (Math.abs(event.deltaY) < 8) return;
            if (scrollLock) return;

            scrollLock = true;
            window.setTimeout(() => {
                scrollLock = false;
            }, 260);
        },
        { passive: true }
    );
}

function setupReviewsCarousel() {
    const carousel = document.getElementById("reviewsCarousel");
    const track = document.getElementById("reviewsTrack");
    const prevButton = document.getElementById("reviewsPrev");
    const nextButton = document.getElementById("reviewsNext");
    const dotsWrap = document.getElementById("reviewDots");
    const progress = document.getElementById("reviewProgressBar");

    if (!carousel || !track || !prevButton || !nextButton || !dotsWrap) return;

    const slides = Array.from(track.querySelectorAll(".review-slide"));
    if (slides.length < 2) return;

    let current = 0;
    let autoTimer = null;
    let touchStartX = 0;
    let touchDeltaX = 0;

    const dots = slides.map((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "review-dot";
        dot.setAttribute("aria-label", `Show review ${index + 1}`);
        dot.addEventListener("click", () => {
            goTo(index);
            restartAutoPlay();
        });
        dotsWrap.appendChild(dot);
        return dot;
    });

    function render() {
        const offset = current * 100;
        track.style.transform = `translate3d(-${offset}%, 0, 0)`;

        slides.forEach((slide, index) => {
            slide.classList.toggle("is-active", index === current);
            slide.setAttribute("aria-hidden", index === current ? "false" : "true");
        });

        dots.forEach((dot, index) => {
            dot.classList.toggle("is-active", index === current);
        });

        if (progress) {
            progress.style.width = `${((current + 1) / slides.length) * 100}%`;
        }
    }

    function goTo(index) {
        const max = slides.length - 1;
        if (index < 0) current = max;
        else if (index > max) current = 0;
        else current = index;
        render();
    }

    function next() {
        goTo(current + 1);
    }

    function prev() {
        goTo(current - 1);
    }

    function startAutoPlay() {
        autoTimer = window.setInterval(next, 4200);
    }

    function stopAutoPlay() {
        if (!autoTimer) return;
        window.clearInterval(autoTimer);
        autoTimer = null;
    }

    function restartAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    prevButton.addEventListener("click", () => {
        prev();
        restartAutoPlay();
    });

    nextButton.addEventListener("click", () => {
        next();
        restartAutoPlay();
    });

    carousel.addEventListener("mouseenter", stopAutoPlay);
    carousel.addEventListener("mouseleave", startAutoPlay);
    carousel.addEventListener("focusin", stopAutoPlay);
    carousel.addEventListener("focusout", startAutoPlay);

    window.addEventListener("keydown", (event) => {
        const reviewsPanel = document.getElementById("reviews");
        if (!reviewsPanel || !reviewsPanel.classList.contains("is-active")) return;

        if (event.key === "ArrowLeft") {
            event.preventDefault();
            prev();
            restartAutoPlay();
        }

        if (event.key === "ArrowRight") {
            event.preventDefault();
            next();
            restartAutoPlay();
        }
    });

    carousel.addEventListener(
        "touchstart",
        (event) => {
            touchStartX = event.changedTouches[0].clientX;
            touchDeltaX = 0;
            stopAutoPlay();
        },
        { passive: true }
    );

    carousel.addEventListener(
        "touchmove",
        (event) => {
            touchDeltaX = event.changedTouches[0].clientX - touchStartX;
        },
        { passive: true }
    );

    carousel.addEventListener(
        "touchend",
        () => {
            if (Math.abs(touchDeltaX) > 40) {
                if (touchDeltaX < 0) next();
                else prev();
            }
            startAutoPlay();
        },
        { passive: true }
    );

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) stopAutoPlay();
        else startAutoPlay();
    });

    render();
    startAutoPlay();
}

if (panels.length) {
    setActivePanel(0);
    setupPanelObserver();
    setupNavigationLinks();
    setupKeyboardNavigation();
    setupTouchWheelSnapAssist();
}

setupReviewsCarousel();
