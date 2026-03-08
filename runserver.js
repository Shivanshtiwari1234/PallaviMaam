const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const rootDir = __dirname;
const djangoDir = path.join(rootDir, "LearnEng");
const port = process.env.PORT || "8000";
const host = process.env.HOST || "127.0.0.1";
const socketPort = process.env.SOCKET_PORT || "5050";
const subdomain = process.env.LT_SUBDOMAIN;

const pythonCandidates = [
  path.join(rootDir, ".venv", "Scripts", "python.exe"),
  path.join(rootDir, ".venv", "bin", "python"),
  "python",
  "python3",
];

const pythonExec = pythonCandidates.find((candidate) => {
  if (candidate.includes(path.sep)) {
    return fs.existsSync(candidate);
  }
  return true;
});

if (!pythonExec) {
  console.error("No Python executable found. Create/activate .venv first.");
  process.exit(1);
}

const children = [];
let tunnelStarted = false;

function pipeOutput(child, tag) {
  child.stdout.on("data", (chunk) => process.stdout.write(`[${tag}] ${chunk}`));
  child.stderr.on("data", (chunk) => process.stderr.write(`[${tag}] ${chunk}`));
}

function stopAll(exitCode = 0) {
  for (const proc of children) {
    if (!proc.killed) {
      proc.kill("SIGINT");
    }
  }
  setTimeout(() => process.exit(exitCode), 250);
}

function startTunnel() {
  if (tunnelStarted) return;
  tunnelStarted = true;

  const ltArgs = ["--port", String(port)];
  if (subdomain) {
    ltArgs.push("--subdomain", subdomain);
  }

  const tunnel = spawn("lt", ltArgs, {
    cwd: rootDir,
    shell: true,
    windowsHide: true,
  });
  children.push(tunnel);
  pipeOutput(tunnel, "lt");

  tunnel.on("error", (err) => {
    console.error(`[lt] Failed to start: ${err.message}`);
    console.error("[lt] Install with: npm i -g localtunnel");
    stopAll(1);
  });

  tunnel.on("exit", (code) => {
    if (code !== 0) {
      console.error(`[lt] Exited with code ${code}`);
      stopAll(code || 1);
    }
  });
}

const socketServer = spawn("node", ["socket-server.js"], {
  cwd: rootDir,
  shell: true,
  windowsHide: true,
  env: { ...process.env, SOCKET_PORT: String(socketPort) },
});
children.push(socketServer);
pipeOutput(socketServer, "socket");

socketServer.on("error", (err) => {
  console.error(`[socket] Failed to start: ${err.message}`);
  stopAll(1);
});

socketServer.on("exit", (code) => {
  if (code !== 0) {
    console.error(`[socket] Exited with code ${code}`);
    stopAll(code || 1);
  }
});

console.log(`[config] Django: http://${host}:${port}`);
console.log(`[config] Socket.IO: http://${host}:${socketPort}`);

const djangoArgs = ["manage.py", "runserver", `${host}:${port}`];
const server = spawn(pythonExec, djangoArgs, {
  cwd: djangoDir,
  shell: false,
  windowsHide: true,
});
children.push(server);
pipeOutput(server, "django");

server.stdout.on("data", (chunk) => {
  const text = chunk.toString();
  if (text.includes("Starting development server at")) {
    startTunnel();
  }
});

server.on("error", (err) => {
  console.error(`[django] Failed to start: ${err.message}`);
  stopAll(1);
});

server.on("exit", (code) => {
  if (code !== 0) {
    console.error(`[django] Exited with code ${code}`);
    stopAll(code || 1);
  } else {
    stopAll(0);
  }
});

process.on("SIGINT", () => stopAll(0));
process.on("SIGTERM", () => stopAll(0));
