const panels = Array.from(document.querySelectorAll(".panel"));
const navLinks = Array.from(document.querySelectorAll("[data-panel-link]"));
const progressBar = document.querySelector(".story-progress");
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const mobileMenuBackdrop = document.getElementById("mobileMenuBackdrop");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let activeIndex = -1;

function setActivePanel(index) {
    const clamped = Math.max(0, Math.min(index, panels.length - 1));

    if (clamped === activeIndex) return;

    activeIndex = clamped;

    panels.forEach((panel, panelIndex) => {
        panel.classList.toggle("is-active", panelIndex === clamped);
    });

    const activePanelName = panels[clamped].dataset.panel || "home";

    navLinks.forEach((link) => {
        const isActive = link.dataset.panelLink === activePanelName;
        link.classList.toggle("is-active", isActive);
        link.setAttribute("aria-current", isActive ? "page" : "false");
    });

    if (window.innerWidth <= 720) {
        closeMobileMenu();
    }

    if (progressBar) {
        const progress = (clamped / (panels.length - 1 || 1)) * 100;
        progressBar.style.background = `linear-gradient(to bottom, rgba(255,255,255,0.65) ${progress}%, rgba(255,255,255,0.12) ${progress}%)`;
    }
}

function getPanelIndexFromLink(link) {
    if (!link) return -1;

    const panelName = link.dataset.panelLink;
    if (!panelName) return -1;

    return panels.findIndex((panel) => panel.dataset.panel === panelName);
}

function openMobileMenu() {
    if (!mobileMenu || !mobileMenuBackdrop || !mobileMenuToggle) return;

    document.body.classList.add("mobile-menu-open");
    mobileMenu.hidden = false;
    mobileMenuBackdrop.hidden = false;
    mobileMenuToggle.setAttribute("aria-expanded", "true");
    mobileMenuToggle.setAttribute("aria-label", "Close navigation");
}

function closeMobileMenu() {
    if (!mobileMenu || !mobileMenuBackdrop || !mobileMenuToggle) return;

    document.body.classList.remove("mobile-menu-open");
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    mobileMenuToggle.setAttribute("aria-label", "Open navigation");

    // Keep hidden in sync after the close transition so clicks cannot pass through.
    window.setTimeout(() => {
        if (document.body.classList.contains("mobile-menu-open")) return;
        mobileMenu.hidden = true;
        mobileMenuBackdrop.hidden = true;
    }, 260);
}

function scrollToPanel(index) {
    const target = panels[Math.max(0, Math.min(index, panels.length - 1))];
    if (!target) return;

    target.scrollIntoView({
        behavior: reducedMotion.matches ? "auto" : "smooth",
        block: "start"
    });
}

function setupPanelObserver() {
    if (!("IntersectionObserver" in window)) {
        setActivePanel(0);
        return;
    }

    const panelObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const index = panels.indexOf(entry.target);
                if (index >= 0) {
                    setActivePanel(index);
                }
            });
        },
        {
            threshold: 0,
            rootMargin: "-45% 0px -45% 0px"
        }
    );

    panels.forEach((panel) => panelObserver.observe(panel));
}

function setupNavigationLinks() {
    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const panelIndex = getPanelIndexFromLink(link);
            if (panelIndex >= 0) {
                scrollToPanel(panelIndex);
            }
            closeMobileMenu();
        });
    });
}

function setupMobileMenu() {
    if (!mobileMenuToggle || !mobileMenu || !mobileMenuBackdrop) return;

    mobileMenuToggle.addEventListener("click", () => {
        const isOpen = document.body.classList.contains("mobile-menu-open");
        if (isOpen) closeMobileMenu();
        else openMobileMenu();
    });

    mobileMenuBackdrop.addEventListener("click", closeMobileMenu);

    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 720) {
            closeMobileMenu();
        }
    });
}

function setupBackgroundLoading() {
    const backgrounds = Array.from(document.querySelectorAll(".panel-bg[data-bg]"));
    if (!backgrounds.length) return;

    const loadBackground = (background, priority = "auto") => {
        const source = background.dataset.bg;
        if (!source) return;

        delete background.dataset.bg;

        const image = new Image();
        image.decoding = "async";
        image.fetchPriority = priority;
        image.onload = () => {
            background.style.backgroundImage = `url("${source}")`;
            background.classList.add("is-loaded");
        };
        image.src = source;
    };

    loadBackground(backgrounds[0], "high");

    if (!("IntersectionObserver" in window)) {
        backgrounds.slice(1).forEach((background) => loadBackground(background));
        return;
    }

    const backgroundObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                loadBackground(entry.target);
                observer.unobserve(entry.target);
            });
        },
        { rootMargin: "120% 0px" }
    );

    backgrounds.slice(1).forEach((background) => backgroundObserver.observe(background));
}

function setupMobileHeaderMotion() {
    if (window.innerWidth > 720) return;

    let ticking = false;
    const updateHeader = () => {
        document.body.classList.toggle("header-condensed", window.scrollY > 36);
        ticking = false;
    };

    window.addEventListener(
        "scroll",
        () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(updateHeader);
        },
        { passive: true }
    );

    updateHeader();
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
        if (autoTimer || reducedMotion.matches || document.hidden) return;
        autoTimer = window.setInterval(next, 7000);
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
    setupBackgroundLoading();
    setupPanelObserver();
    setupNavigationLinks();
}

setupMobileMenu();
setupMobileHeaderMotion();
setupReviewsCarousel();
