const crypto = require("crypto");

function normalize(text = "") {
  return text.toLowerCase().trim();
}

module.exports = function generateHash(log) {
  const base = `
    ${normalize(log.exceptionType)}
    ${normalize(log.className)}
    ${normalize(log.methodName)}
    ${normalize(log.fileName)}
    ${normalize(log.message)}
  `;

  return crypto
    .createHash("sha256")
    .update(base)
    .digest("hex");
};
