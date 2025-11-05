/* ============================================================
   Learn English — Cinematic Interactions
   Smooth • Accessible • Soft Depth
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const fadeEls = document.querySelectorAll(".fade-in");
  const cards = document.querySelectorAll(".card, .centered-box");

  /* ------------------------------------------------------------
     Fade-in on load
  ------------------------------------------------------------ */
  fadeEls.forEach((el, index) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    setTimeout(() => {
      el.style.transition = "opacity 1s ease, transform 1s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 200 + index * 150);
  });

  /* ------------------------------------------------------------
     Parallax scroll depth (soft cinematic movement)
  ------------------------------------------------------------ */
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const intensity = 0.15;
    header.style.backdropFilter = scrollY > 10 ? "blur(8px)" : "none";
    header.style.padding = scrollY > 20 ? "0.9rem 2rem" : "1.4rem 2rem";

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const offset = rect.top / window.innerHeight;
      const depth = (offset - 0.5) * 20 * intensity;
      card.style.transform = `translateY(${depth}px)`;
    });
  });

  /* ------------------------------------------------------------
     Keyboard navigation focus ring (accessibility)
  ------------------------------------------------------------ */
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

  /* ------------------------------------------------------------
     Smooth in-page link scrolling
  ------------------------------------------------------------ */
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href").substring(1);
      const targetEl
