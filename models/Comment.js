const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
    content: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
