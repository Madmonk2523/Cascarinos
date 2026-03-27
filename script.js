// Cascarino's one-page interactions

const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const navAnchors = document.querySelectorAll('a[href^="#"]');
const reveals = document.querySelectorAll(".reveal");
const reviewsCarousel = document.getElementById("reviewsCarousel");

function onScrollHeaderState() {
    if (window.scrollY > 24) {
        header.classList.add("is-solid");
    } else {
        header.classList.remove("is-solid");
    }
}

function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.toggle("open");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
}

function closeMobileMenu() {
    mobileMenu.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
}

// Smooth-scroll with fixed-header offset
function setupAnchorScrolling() {
    navAnchors.forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const href = anchor.getAttribute("href");
            if (!href || href === "#") return;

            const target = document.querySelector(href);
            if (!target) return;

            event.preventDefault();
            const offset = header.offsetHeight + 12;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

            window.scrollTo({ top, behavior: "smooth" });
            closeMobileMenu();
        });
    });
}

// IntersectionObserver reveal system for scroll-triggered fade-up
function setupReveals() {
    if (!("IntersectionObserver" in window)) {
        reveals.forEach((item) => item.classList.add("in-view"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, io) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("in-view");
                io.unobserve(entry.target);
            });
        },
        {
            threshold: 0.14,
            rootMargin: "0px 0px -10% 0px"
        }
    );

    reveals.forEach((item) => observer.observe(item));
}

// Subtle parallax movement on hero gradient backdrop
function setupParallax() {
    let ticking = false;

    function updateParallax() {
        const y = Math.min(window.scrollY, 700);
        document.documentElement.style.setProperty("--parallax-shift", `${y * -0.25}px`);
        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(updateParallax);
    });

    updateParallax();
}

function setupReviewCarousel() {
    if (!reviewsCarousel) return;

    const track = document.getElementById("reviewsTrack");
    const prevButton = document.getElementById("reviewPrev");
    const nextButton = document.getElementById("reviewNext");
    const dotsWrap = document.getElementById("reviewDots");
    const slides = track ? Array.from(track.querySelectorAll(".review-card")) : [];
    if (!track || !prevButton || !nextButton || !dotsWrap || slides.length < 2) return;

    let currentIndex = 0;
    let autoTimer = null;
    let touchStartX = 0;
    let touchEndX = 0;

    const dots = slides.map((_, index) => {
        const dot = document.createElement("button");
        dot.className = "review-dot";
        dot.type = "button";
        dot.setAttribute("aria-label", `Go to review ${index + 1}`);
        dot.addEventListener("click", () => {
            goToSlide(index);
            restartAutoPlay();
        });
        dotsWrap.appendChild(dot);
        return dot;
    });

    function render() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle("is-active", index === currentIndex);
        });
    }

    function goToSlide(index) {
        const max = slides.length - 1;
        if (index < 0) currentIndex = max;
        else if (index > max) currentIndex = 0;
        else currentIndex = index;
        render();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function startAutoPlay() {
        autoTimer = window.setInterval(nextSlide, 5500);
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
        prevSlide();
        restartAutoPlay();
    });

    nextButton.addEventListener("click", () => {
        nextSlide();
        restartAutoPlay();
    });

    reviewsCarousel.addEventListener("mouseenter", stopAutoPlay);
    reviewsCarousel.addEventListener("mouseleave", startAutoPlay);
    reviewsCarousel.addEventListener("focusin", stopAutoPlay);
    reviewsCarousel.addEventListener("focusout", startAutoPlay);

    reviewsCarousel.addEventListener(
        "touchstart",
        (event) => {
            touchStartX = event.changedTouches[0].clientX;
        },
        { passive: true }
    );

    reviewsCarousel.addEventListener(
        "touchend",
        (event) => {
            touchEndX = event.changedTouches[0].clientX;
            const delta = touchEndX - touchStartX;
            if (Math.abs(delta) < 40) return;
            if (delta < 0) nextSlide();
            else prevSlide();
            restartAutoPlay();
        },
        { passive: true }
    );

    render();
    startAutoPlay();
}

menuToggle.addEventListener("click", toggleMobileMenu);
window.addEventListener("scroll", onScrollHeaderState, { passive: true });
window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileMenu();
});

setupAnchorScrolling();
setupReveals();
setupParallax();
setupReviewCarousel();
onScrollHeaderState();
