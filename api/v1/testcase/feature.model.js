const mongoose = require("mongoose");

const featureSchema = new mongoose.Schema({
  featuresName: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    required: true,
  },
  module: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("feature", featureSchema);
