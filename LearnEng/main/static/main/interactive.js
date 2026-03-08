"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".site-header");
    const revealItems = document.querySelectorAll(".fade-in");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (revealItems.length > 0 && !prefersReducedMotion) {
        document.documentElement.classList.add("js-motion-enabled");
        revealItems.forEach((item, index) => {
            item.style.transitionDelay = `${Math.min(index * 40, 220)}ms`;
        });
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
        revealItems.forEach((item) => {
            if (item.getBoundingClientRect().top < window.innerHeight * 0.85) {
                item.classList.add("is-visible");
            }
            else {
                revealObserver.observe(item);
            }
        });
    }
    else {
        revealItems.forEach((item) => item.classList.add("is-visible"));
    }
    if (header) {
        let ticking = false;
        const updateHeaderState = () => {
            header.classList.toggle("site-header--scrolled", window.scrollY > 8);
            ticking = false;
        };
        window.addEventListener("scroll", () => {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(updateHeaderState);
            }
        }, { passive: true });
        updateHeaderState();
    }
    let usingKeyboard = false;
    window.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
            usingKeyboard = true;
            document.body.classList.add("user-is-tabbing");
        }
    });
    window.addEventListener("mousedown", () => {
        if (usingKeyboard) {
            usingKeyboard = false;
            document.body.classList.remove("user-is-tabbing");
        }
    });
});
