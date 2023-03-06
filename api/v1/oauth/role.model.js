const mongoose = require("mongoose");

const roleData = new mongoose.Schema({
  role: {
    type: String,
    required: true,
  },
  id: {
    type: String,
  },
});

module.exports = mongoose.model("userrole", roleData);
