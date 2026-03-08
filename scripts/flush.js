const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const djangoDir = path.join(rootDir, "LearnEng");

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

const result = spawnSync(pythonExec, ["manage.py", "flush", "--noinput"], {
  cwd: djangoDir,
  stdio: "inherit",
  shell: false,
});

process.exit(result.status ?? 1);

