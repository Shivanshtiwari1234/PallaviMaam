document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const cards = document.querySelectorAll(".card, .centered-box");

  /* ---------- Super Smooth Cinematic Fade-in ---------- */
  document.querySelectorAll(".fade-in").forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    setTimeout(() => {
      el.style.transition =
        "opacity 2.4s cubic-bezier(.19,1,.22,1), " +
        "transform 2.4s cubic-bezier(.19,1,.22,1)";
      el.style.opacity = "1";
    }, 400 + i * 350); // slower stagger
    setTimeout(() => {
      el.style.transform = "translateY(0)";
    }, 450 + i * 350);
  });

  /* ---------- Extremely Smooth Parallax Depth ---------- */
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // Header cinematic animation
        header.style.transition = "padding 1.8s ease, backdrop-filter 2s ease";
        header.style.backdropFilter = scrollY > 10 ? "blur(14px)" : "blur(0px)";
        header.style.padding = scrollY > 40 ? "1.3rem 2rem" : "2.6rem 3.4rem";

        // Addictive slow parallax effect on cards
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const offset = (rect.top / window.innerHeight - 0.5) * 2;
          const depth = Math.max(-1, Math.min(1, offset));

          card.style.transition = "transform 2.6s cubic-bezier(.19,1,.22,1)";
          card.style.transform =
            `scale(${1 + depth * 0.01}) rotateX(${depth * 2}deg)`;
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
