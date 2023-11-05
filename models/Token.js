const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema(
  {
    token: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);
