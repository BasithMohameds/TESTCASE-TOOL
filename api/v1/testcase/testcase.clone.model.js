const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.ObjectId,
    },
    testcasedataid: {
      type: mongoose.Schema.ObjectId,
    },
    TestCaseID: {
      type: String,
    },
    status: {
      type: String,
      default: "Not-verified",
    },
    Priority: {
      type: String,
    },
    cloneKey: {
      type: String,
    },
    TestcaseDescription: {
      type: String,
    },
    Steps: [
      {
        type: String,
      },
    ],
    featuresName: {
      type: String,
    },
    version: {
      type: String,
    },
    module: {
      type: String,
    },
    videolink: [
      {
        RecordVideolink: {
          type: String,
        },
      },
    ],
    executionReason: {
      reason: {
        type: String,
      },
      executed: {
        type: String,
      },
    },
    ExpectedResult: [
      {
        type: String,
      },
    ],
    ActualResult: [
      {
        type: String,
      },
    ],
    created_at: { type: Date },
    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("clonetestcase", testCaseSchema);
