const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  eLoc: {
    type: String
  },
  bloodGroup: {
    type: String
  },
  deadline: {
    type: String
  },
  state: {
    type: Number,
    default: 0
  },
  bloodUnits: {
    type: Number,
    default: 1
  },
  time: {
    type: Date,
    default: Date.now
  }
});

const Request = mongoose.model("requests", RequestSchema);

module.exports = Request;
