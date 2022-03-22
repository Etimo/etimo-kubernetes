const indentation = parseInt(process.env["LOG_INDENTATION"] || 0);
const _log = (level, ...args) => {
  const s = args.join(" ");
  const lines = s.split("\n").map((s) => s.padStart(indentation, " "));
  console[level](lines.join("\n"));
};

const log = (...args) => _log("log", ...args);
const info = (...args) => _log("info", ...args);
const error = (...args) => _log("error", ...args);

module.exports = {
  log,
  info,
  error,
};
