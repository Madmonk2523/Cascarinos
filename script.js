/**
 * CASCARINO'S PIZZERIA - JAVASCRIPT
 * Interactive functionality and enhancements
 */

// ========================================
// DOM Elements
// ========================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const heroSection = document.getElementById('hero');

// ========================================
// Navigation Toggle (Mobile)
// ========================================
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ========================================
// Navbar Scroll Effect
// ========================================
let lastScrollTop = 0;
const scrollThreshold = 100;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add shadow when scrolled
    if (scrollTop > scrollThreshold) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            const offsetTop = target.offsetTop - navbar.offsetHeight;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// Intersection Observer for Animations
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe menu cards, review cards, etc.
document.querySelectorAll('.menu-card, .review-card, .featured-image').forEach(element => {
    element.style.opacity = '0';
    observer.observe(element);
});

// ========================================
// Image Lazy Loading
// ========================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// Performance: Throttle Scroll Events
// ========================================
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================================
// Enhanced Hover Effects for Cards
// ========================================
document.querySelectorAll('.menu-card, .review-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// ========================================
// Performance Monitoring
// ========================================
window.addEventListener('load', () => {
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    }
});

// ========================================
// Accessibility: Keyboard Navigation
// ========================================
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ========================================
// Dynamic Year in Footer
// ========================================
function updateYear() {
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = `© ${currentYear} Cascarino's Pizzeria. All rights reserved.`;
    }
}

updateYear();

// ========================================
// Form Validation (for future contact forms)
// ========================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// ========================================
// Share Functionality (Social Media)
// ========================================
function shareOnSocial(platform) {
    const url = window.location.href;
    const title = 'Check out Cascarino\'s Pizzeria - Authentic New York Pizza';

    let shareUrl = '';
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
    }

    if (shareUrl) {
        window.open(shareUrl, 'Share', 'width=600,height=400');
    }
}

// ========================================
// Tracking & Analytics Ready
// ========================================
// Add your analytics tracking here (Google Analytics, Hotjar, etc.)
// Example:
/*
function trackEvent(eventName, eventData) {
    if (window.gtag) {
        gtag('event', eventName, eventData);
    }
}

// Track button clicks
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        trackEvent('button_click', {
            button_text: button.textContent
        });
    });
});
*/

// ========================================
// Cookie Consent Banner (Optional)
// ========================================
function showCookieBanner() {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
        // Add cookie banner HTML here
        console.log('User cookie preference not set');
    }
}

// ========================================
// Rich Snippets / Structured Data Validation
// ========================================
function validateStructuredData() {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    console.log(`Found ${scripts.length} structured data scripts`);
}

validateStructuredData();

// ========================================
// Utility: Debounce Function
// ========================================
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// ========================================
// Viewport Height Fix (Mobile)
// ========================================
function fixViewportHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

fixViewportHeight();
window.addEventListener('resize', debounce(fixViewportHeight, 100));

// ========================================
// Ready State
// ========================================
function init() {
    console.log('Cascarino\'s Pizzeria website loaded successfully');
    
    // Initialize all features
    updateYear();
    validateStructuredData();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ========================================
// Service Worker Registration (Progressive Web App)
// ========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to register service worker
        // navigator.serviceWorker.register('/sw.js').then(registration => {
        //     console.log('ServiceWorker registration successful');
        // }).catch(err => {
        //     console.log('ServiceWorker registration failed: ', err);
        // });
    });
}

// ========================================
// Dark Mode Support (Optional)
// ========================================
function initDarkMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
        document.body.classList.add('dark-mode');
    }
}

// Uncomment to enable dark mode detection
// initDarkMode();

// ========================================
// Newsletter Signup (Example)
// ========================================
function handleNewsletterSignup(email) {
    if (!validateEmail(email)) {
        console.error('Invalid email address');
        return false;
    }
    
    // Send to backend or email service
    console.log('Newsletter signup:', email);
    return true;
}

// ========================================
// Call Tracking
// ========================================
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
        if (window.gtag) {
            gtag('event', 'phone_call', {
                phone_number: link.getAttribute('href')
            });
        }
    });
});

// ========================================
// CTA Button Tracking
// ========================================
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        if (window.gtag) {
            gtag('event', 'cta_click', {
                button_text: button.textContent.trim(),
                button_class: button.className
            });
        }
    });
});

// ========================================
// View Transition API (Modern Browsers)
// ========================================
if (document.startViewTransition) {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            document.startViewTransition(() => {
                // Transition will happen automatically
            });
        });
    });
}

// ========================================
// Preload Critical Resources
// ========================================
function preloadResources() {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=1920&h=1080&fit=crop';
    document.head.appendChild(link);
}

preloadResources();

// ========================================
// Export Functions for External Use
// ========================================
window.cascarinos = {
    validateEmail,
    validatePhone,
    shareOnSocial,
    handleNewsletterSignup
};

console.log('Cascarino\'s Pizzeria - All interactive features loaded');
