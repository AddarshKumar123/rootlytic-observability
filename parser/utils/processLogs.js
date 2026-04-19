const Log = require("../models/Log");
const ErrorSignature = require("../models/ErrorSignature");
const generateHash = require("../utils/hash");

async function processLogs() {
  const logs = await Log.find({ parsedHash: { $exists: false } }).limit(500);

  for (let log of logs) {
    const hash = generateHash(log);

    await ErrorSignature.findOneAndUpdate(
      { parsedHash: hash },
      {
        $setOnInsert: {
          parsedHash: hash,
          exceptionType: log.exceptionType,
          message: log.message,

          className: log.className,
          methodName: log.methodName,
          fileName: log.fileName,
          line: log.line,

          stackSample: log.stack,
          firstSeen: Date.now()
        },
        $set: {
          lastSeen: Date.now()
        },
        $inc: { count: 1 }
      },
      { upsert: true }
    );

    log.parsedHash = hash;
    await log.save();
  }

  console.log(`Processed ${logs.length} logs`);
}

module.exports = processLogs;
