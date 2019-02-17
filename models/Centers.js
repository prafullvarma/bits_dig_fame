const mongoose = require("mongoose");

const CenterSchema = new mongoose.Schema({
  eLoc: {
    type: String
  },

  daysOpen: {
    type: [Number]
  },
  openingTime: {
    type: String
  },
  closingTime: {
    type: String
  },

  lat: {
    type: String
  },
  lng: {
    type: String
  },

  centerName: {
    type: String
  },
  centerAddress: {
    type: String
  },
  number: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },

  inventory: [
    {
      bloodGroup: {
        type: String
      },
      quantity: {
        type: Number,
        default: 0
      }
    }
  ]
});

const Center = mongoose.model("centers", CenterSchema);

module.exports = Center;
