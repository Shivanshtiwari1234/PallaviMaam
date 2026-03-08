type Lesson = {
  id: number | string;
  title: string;
  description?: string;
  video_url?: string;
};

type LessonEnvelope = {
  lesson: Lesson;
  signature: string;
};

type SocketClient = {
  on: (event: string, handler: (payload: any) => void) => void;
  emit: (event: string, payload: any) => void;
};

type AppConfig = {
  socketUrl?: string;
};

interface Window {
  APP_CONFIG?: AppConfig;
  io?: (url: string, options: Record<string, unknown>) => SocketClient;
}

(() => {
  function createLessonCard(lesson: Lesson): HTMLDivElement {
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

  function addLessonToFeed(lesson: Lesson): void {
    const feed = document.getElementById("lessons-feed");
    if (!feed) return;

    if (feed.querySelector(`[data-lesson-id="${lesson.id}"]`)) return;

    const empty = document.getElementById("lessons-empty-state");
    if (empty) empty.remove();

    feed.prepend(createLessonCard(lesson));
  }

  function addLessonToManageList(lesson: Lesson): void {
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

  function parseLatestLessonPayload(): Lesson | null {
    const payloadEl = document.getElementById("latest-lesson-payload");
    if (!payloadEl) return null;

    try {
      return JSON.parse(payloadEl.textContent || "null") as Lesson | null;
    } catch (_err) {
      return null;
    }
  }

  function parseLatestLessonSignature(): string | null {
    const signatureEl = document.getElementById("latest-lesson-signature");
    if (!signatureEl) return null;

    try {
      return JSON.parse(signatureEl.textContent || "null") as string | null;
    } catch (_err) {
      return null;
    }
  }

  function initSocket(): SocketClient | null {
    const socketUrl = window.APP_CONFIG?.socketUrl || window.location.origin;
    if (typeof window.io !== "function") return null;

    const socket = window.io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: false,
    });

    socket.on("connect_error", (err: Error) => {
      console.warn("Socket connection failed:", err.message);
    });

    socket.on("lesson:created", (lesson: Lesson) => {
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
    const latestSignature = parseLatestLessonSignature();
    if (latestLesson && latestLesson.id && latestSignature) {
      const envelope: LessonEnvelope = { lesson: latestLesson, signature: latestSignature };
      socket.emit("lesson:created", envelope);
    }
  });
})();
