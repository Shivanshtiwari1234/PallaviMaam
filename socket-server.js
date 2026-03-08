const http = require("http");
const { Server } = require("socket.io");

const socketPort = Number(process.env.SOCKET_PORT || 5050);
const corsOrigin = process.env.SOCKET_CORS_ORIGIN || "*";

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
    origin: corsOrigin,
    methods: ["GET", "POST"],
  },
});

function sanitizeLessonPayload(payload) {
  if (!payload || typeof payload !== "object") return null;
  if (!payload.id || !payload.title) return null;

  return {
    id: payload.id,
    title: String(payload.title).trim().slice(0, 255),
    description: String(payload.description || "").trim().slice(0, 2000),
    video_url: String(payload.video_url || "").trim(),
  };
}

io.on("connection", (socket) => {
  io.emit("presence:update", { online: io.engine.clientsCount });

  socket.on("lesson:created", (payload) => {
    const lesson = sanitizeLessonPayload(payload);
    if (!lesson) return;
    io.emit("lesson:created", lesson);
  });

  socket.on("disconnect", () => {
    io.emit("presence:update", { online: io.engine.clientsCount });
  });
});

server.listen(socketPort, () => {
  console.log(`Socket.IO listening on http://127.0.0.1:${socketPort}`);
});

