(function () {
  function createLessonCard(lesson) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.lessonId = String(lesson.id);

    const title = document.createElement("h3");
    title.textContent = lesson.title || "Untitled Lesson";
    card.appendChild(title);

    const description = document.createElement("p");
    description.textContent = lesson.description || "";
    card.appendChild(description);

    if (lesson.video_url) {
      const video = document.createElement("video");
      video.controls = true;
      const source = document.createElement("source");
      source.src = lesson.video_url;
      source.type = "video/mp4";
      video.appendChild(source);
      card.appendChild(video);
    }

    return card;
  }

  function addLessonToFeed(lesson) {
    const feed = document.getElementById("lessons-feed");
    if (!feed) return;

    if (feed.querySelector(`[data-lesson-id="${lesson.id}"]`)) return;

    const empty = document.getElementById("lessons-empty-state");
    if (empty) empty.remove();

    feed.prepend(createLessonCard(lesson));
  }

  function addLessonToManageList(lesson) {
    const list = document.getElementById("manage-lessons-list");
    if (!list) return;

    if (list.querySelector(`[data-lesson-id="${lesson.id}"]`)) return;

    const empty = document.getElementById("manage-lessons-empty");
    if (empty) empty.remove();

    const item = document.createElement("li");
    item.dataset.lessonId = String(lesson.id);
    item.textContent = lesson.title || "Untitled Lesson";
    list.prepend(item);
  }

  function parseLatestLessonPayload() {
    const payloadEl = document.getElementById("latest-lesson-payload");
    if (!payloadEl) return null;

    try {
      return JSON.parse(payloadEl.textContent);
    } catch (_err) {
      return null;
    }
  }

  function initSocket() {
    const socketUrl = (window.APP_CONFIG && window.APP_CONFIG.socketUrl) || "http://127.0.0.1:5050";
    if (typeof window.io !== "function") return null;

    const socket = window.io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: false,
    });

    socket.on("connect_error", (err) => {
      console.warn("Socket connection failed:", err.message);
    });

    socket.on("lesson:created", (lesson) => {
      if (!lesson || !lesson.id) return;
      addLessonToFeed(lesson);
      addLessonToManageList(lesson);
    });

    return socket;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const socket = initSocket();
    if (!socket) return;

    const latestLesson = parseLatestLessonPayload();
    if (latestLesson && latestLesson.id) {
      socket.emit("lesson:created", latestLesson);
    }
  });
})();

