const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  number: {
    type: Number
  },
  name: {
    type: String
  },
  dob: {
    type: String
  },
  bloodGroup: {
    type: String
  },
  email: {
    type: String
  },
  address: {
    type: String
  },
  bmi: {
    type: Number
  },
  location: {
    lat: {
      type: String
    },
    lng: {
      type: String
    }
  },
  password: {
    type: String
  },
  donor: {
    type: Boolean,
    default: false
  },
  registeredEvents: [
    {
      eventID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "events"
      }
    }
  ],
  donation: [
    {
      date: {
        type: String
      },
      centerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "centers"
      }
    }
  ]
});

const User = mongoose.model("users", UserSchema);

module.exports = User;
