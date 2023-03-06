const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.ObjectId,
    },
    TestCaseID: {
      type: String,
    },
    Priority: {
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

module.exports = mongoose.model("testcase", userSchema);
