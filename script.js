// Cascarino's one-page interactions

const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const navAnchors = document.querySelectorAll('a[href^="#"]');
const reveals = document.querySelectorAll(".reveal");

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

menuToggle.addEventListener("click", toggleMobileMenu);
window.addEventListener("scroll", onScrollHeaderState, { passive: true });
window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileMenu();
});

setupAnchorScrolling();
setupReveals();
setupParallax();
onScrollHeaderState();
