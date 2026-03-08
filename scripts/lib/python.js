const fs = require("fs");
const path = require("path");

function resolvePythonExecutable(rootDir) {
  const pythonCandidates = [
    path.join(rootDir, ".venv", "Scripts", "python.exe"),
    path.join(rootDir, ".venv", "bin", "python"),
    "python",
    "python3",
  ];

  return pythonCandidates.find((candidate) => {
    if (candidate.includes(path.sep)) {
      return fs.existsSync(candidate);
    }
    return true;
  });
}

module.exports = {
  resolvePythonExecutable,
};

