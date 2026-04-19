const mongoose = require("mongoose");

const errorSignatureSchema = new mongoose.Schema({
  parsedHash: {
    type: String,
    unique: true,
    index: true
  },

  exceptionType: String,
  message: String,

  className: String,
  methodName: String,
  fileName: String,
  line: Number,

  stackSample: String,

  count: {
    type: Number,
    default: 1
  },

  firstSeen: Number,
  lastSeen: Number,

  issueType: String,     
  clusterId: String,  
  spikeDetected: {
    type: Boolean,
    default: false
  },
  lastSpikeAt: Number
});

module.exports = mongoose.model("ErrorSignature", errorSignatureSchema);
