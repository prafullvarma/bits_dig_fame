const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  startDate: {
    type: String
  },
  endDate: {
    type: String
  },
  openingTime: {
    type: String
  },
  closingTime: {
    type: String
  },

  organisedBy: {
    centerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "events"
    },
    lat: {
      type: String
    },
    lng: {
      type: String
    }
  },
  sponsoredBy: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    }
  }
});

const Event = mongoose.model("events", EventSchema);

module.exports = Event;
