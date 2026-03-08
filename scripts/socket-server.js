const http = require("http");
const crypto = require("crypto");
const { Server } = require("socket.io");

const socketPort = Number(process.env.SOCKET_PORT || 5050);
const corsOrigin = process.env.SOCKET_CORS_ORIGIN || "http://127.0.0.1:8000,http://localhost:8000";
const socketEventSecret = process.env.SOCKET_EVENT_SECRET || process.env.SECRET_KEY || "";

const allowedOrigins = corsOrigin
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Socket.IO server is running");
});

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origin not allowed by Socket.IO CORS policy"));
    },
    methods: ["GET", "POST"],
  },
});

function sanitizeLessonPayload(payload) {
  if (!payload || typeof payload !== "object") return null;
  if (!payload.id || !payload.title) return null;

  return {
    id: payload.id,
    title: String(payload.title).slice(0, 255),
    description: String(payload.description || "").slice(0, 2000),
    video_url: String(payload.video_url || ""),
  };
}

function canonicalPayload(payload) {
  const normalized = {
    id: payload.id,
    title: payload.title,
    description: payload.description || "",
    video_url: payload.video_url || "",
  };
  return JSON.stringify(normalized);
}

function verifySignature(payload, signature) {
  if (!socketEventSecret || !signature) return false;

  const expected = crypto.createHmac("sha256", socketEventSecret).update(canonicalPayload(payload)).digest("hex");

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(String(signature), "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

io.on("connection", (socket) => {
  io.emit("presence:update", { online: io.engine.clientsCount });

  socket.on("lesson:created", (envelope) => {
    const payload = envelope && envelope.lesson;
    const signature = envelope && envelope.signature;
    const lesson = sanitizeLessonPayload(payload);
    if (!lesson) return;
    if (!verifySignature(lesson, signature)) return;
    io.emit("lesson:created", lesson);
  });

  socket.on("disconnect", () => {
    io.emit("presence:update", { online: io.engine.clientsCount });
  });
});

server.listen(socketPort, () => {
  console.log(`Socket.IO listening on http://127.0.0.1:${socketPort}`);
  if (!socketEventSecret) {
    console.warn("Socket event secret is missing. lesson:created events will be rejected.");
  }
});
