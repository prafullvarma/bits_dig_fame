const mongoose = require("mongoose");

const UrgentRequestSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
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
  number: {
    type: Number
  },
  time: {
    type: Date,
    default: Date.now
  },
  acceptors: [
    {
      type: {
        type: String
      },
      id: {
        type: String
      }
    }
  ]
});

const UrgentRequest = mongoose.model("urgentrequest", UrgentRequestSchema);

module.exports = UrgentRequest;
