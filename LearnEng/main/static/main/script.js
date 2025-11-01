/* ============================================================
   Learn English — Adaptive Theme Engine
   Warm, Cinematic, Battery + FPS Aware
   ============================================================ */

document.addEventListener("DOMContentLoaded", async () => {
  const state = {
    mode: "cinematic",
    fps: 0,
    batteryLevel: 1,
  };

  let frameCount = 0;
  let startTime = performance.now();

  function measureFPS(now) {
    frameCount++;
    const elapsed = now - startTime;

    if (elapsed >= 1000) {
      state.fps = Math.round((frameCount * 1000) / elapsed);
      frameCount = 0;
      startTime = now;
      updateAdaptiveMode();
    }

    requestAnimationFrame(measureFPS);
  }
  requestAnimationFrame(measureFPS);

  if (navigator.getBattery) {
    try {
      const battery = await navigator.getBattery();
      state.batteryLevel = battery.level;
      battery.addEventListener("levelchange", () => {
        state.batteryLevel = battery.level;
        updateAdaptiveMode();
      });
    } catch {
      console.warn("Battery API not supported.");
    }
  }

  function updateAdaptiveMode() {
    const isLowFPS = state.fps < 45;
    const isLowBattery = state.batteryLevel < 0.25;
    const shouldBeMinimal = isLowFPS || isLowBattery;

    if (shouldBeMinimal && state.mode !== "minimal") {
      setMinimalMode();
    } else if (!shouldBeMinimal && state.mode !== "cinematic") {
      setCinematicMode();
    }
  }

  function setMinimalMode() {
    state.mode = "minimal";
    document.body.classList.add("minimal-mode");
    document.body.classList.remove("cinematic-mode");
    disableMotion();
  }

  function setCinematicMode() {
    state.mode = "cinematic";
    document.body.classList.add("cinematic-mode");
    document.body.classList.remove("minimal-mode");
    enableMotion();
  }

  function disableMotion() {
    document.documentElement.style.setProperty("--transition", "0s");
    document.querySelectorAll(".card, button, .btn").forEach(el => {
      el.style.transition = "none";
    });
  }

  function enableMotion() {
    document.documentElement.style.setProperty("--transition", "0.35s ease");
    document.querySelectorAll(".card, button, .btn").forEach(el => {
      el.style.transition = "";
    });
  }

  // Ripple effect
  document.body.addEventListener("click", e => {
    const target = e.target.closest("button, .btn");
    if (!target || state.mode === "minimal") return;

    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = `${e.offsetX}px`;
    ripple.style.top = `${e.offsetY}px`;
    target.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });

  // Parallax tilt
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    card.addEventListener("mousemove", e => {
      if (state.mode === "minimal") return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `rotateY(${x / 40}deg) rotateX(${-y / 40}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // Ripple CSS injection
  const rippleStyle = document.createElement("style");
  rippleStyle.textContent = `
    .ripple {
      position: absolute;
      border-radius: 50%;
      transform: scale(0);
      background: rgba(255,255,255,0.5);
      animation: ripple 0.6s linear;
      pointer-events: none;
      width: 200px;
      height: 200px;
      opacity: 0.6;
    }
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(rippleStyle);
});
