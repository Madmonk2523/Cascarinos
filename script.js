const panels = Array.from(document.querySelectorAll(".panel"));
const storyLinks = Array.from(document.querySelectorAll(".story-link"));
const progressBar = document.querySelector(".story-progress");

if (!panels.length) {
    throw new Error("No story panels found.");
}

let activeIndex = 0;
let scrollLock = false;

function setActivePanel(index) {
    const clamped = Math.max(0, Math.min(index, panels.length - 1));
    activeIndex = clamped;

    panels.forEach((panel, panelIndex) => {
        panel.classList.toggle("is-active", panelIndex === clamped);
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

setActivePanel(0);
setupPanelObserver();
setupNavigationLinks();
setupKeyboardNavigation();
setupTouchWheelSnapAssist();
