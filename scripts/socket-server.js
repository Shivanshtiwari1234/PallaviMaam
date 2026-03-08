const http = require("http");
const crypto = require("crypto");
const httpProxy = require("http-proxy");
const { Server } = require("socket.io");

const socketPort = Number(process.env.SOCKET_PORT || 8000);
const djangoTarget = process.env.DJANGO_TARGET || "http://127.0.0.1:8001";
const socketEventSecret = process.env.SOCKET_EVENT_SECRET || process.env.SECRET_KEY || "";
const proxy = httpProxy.createProxyServer({
  target: djangoTarget,
  changeOrigin: false,
  ws: true,
});

proxy.on("error", (err, req, res) => {
  if (res && !res.headersSent) {
    res.writeHead(502, { "Content-Type": "text/plain" });
  }
  if (res && !res.writableEnded) {
    res.end("Upstream Django server is unavailable");
  }
  console.error(`[proxy] ${req && req.url ? req.url : "request"}: ${err.message}`);
});

const server = http.createServer((req, res) => {
  if (req.url && req.url.startsWith("/socket.io/")) {
    return;
  }
  proxy.web(req, res);
});

const io = new Server(server, {
  path: "/socket.io",
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

server.on("upgrade", (req, socket, head) => {
  if (req.url && req.url.startsWith("/socket.io/")) {
    return;
  }
  proxy.ws(req, socket, head);
});

server.listen(socketPort, () => {
  console.log(`Gateway listening on http://127.0.0.1:${socketPort} -> ${djangoTarget}`);
  if (!socketEventSecret) {
    console.warn("Socket event secret is missing. lesson:created events will be rejected.");
  }
});
