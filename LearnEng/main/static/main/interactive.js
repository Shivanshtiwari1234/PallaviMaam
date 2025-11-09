document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const cards = document.querySelectorAll(".card, .centered-box");

  /* ---------- Gentle Fade-in ---------- */
  document.querySelectorAll(".fade-in").forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    setTimeout(() => {
      el.style.transition = "opacity 1.8s ease-out, transform 1.8s ease-out";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 250 + i * 220);
  });

  /* ---------- Cinematic Depth Parallax (very smooth) ---------- */
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // Header blur and padding — slow fade
        header.style.transition = "backdrop-filter 1.2s ease, padding 1.2s ease";
        header.style.backdropFilter = scrollY > 10 ? "blur(10px)" : "none";
        header.style.padding = scrollY > 40 ? "1rem 2rem" : "1.8rem 3rem";

        // Very soft card depth — tilt and scale
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const offset = (rect.top / window.innerHeight - 0.5) * 2;
          const depth = Math.max(-1, Math.min(1, offset));
          card.style.transform = `scale(${1 + depth * 0.008}) rotateX(${depth * 1.5}deg)`;
          card.style.transition = "transform 1.5s ease-out";
        });

        ticking = false;
      });
      ticking = true;
    }
  });

  /* ---------- Accessibility Focus Ring ---------- */
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
