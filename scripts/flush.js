const { spawnSync } = require("child_process");
const path = require("path");
const { resolvePythonExecutable } = require("./lib/python");

const rootDir = path.resolve(__dirname, "..");
const djangoDir = path.join(rootDir, "LearnEng");
const pythonExec = resolvePythonExecutable(rootDir);

if (!pythonExec) {
  console.error("No Python executable found. Create/activate .venv first.");
  process.exit(1);
}

const result = spawnSync(pythonExec, ["manage.py", "flush", "--noinput"], {
  cwd: djangoDir,
  stdio: "inherit",
  shell: false,
});

process.exit(result.status ?? 1);
