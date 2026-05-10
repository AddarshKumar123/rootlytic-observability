const crypto = require("crypto");

module.exports = function generateHash(log) {
  const baseString = `
    ${log.applicationId}
    ${log.exceptionType}
    ${log.className}
    ${log.methodName}
    ${log.line}
    `;

  return crypto
    .createHash("sha256")
    .update(baseString)
    .digest("hex");
};
