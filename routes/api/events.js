const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");

require("../../config/passport")(passport);
const Event = require("../../models/Events");

router.get("/", (req, res) => res.send("it works"));

router.get("/all", (req, res) => {
  Event.find({})
    .then(events => res.send(events))
    .catch(err => console.log(err));
});

router.post("/create", (req, res) => {
  let event = new Event({
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    openingTime: req.body.openingTime,
    closingTime: req.body.closingTime,
    organisedBy: {
      eLoc: req.body.eLoc,
      lat: req.body.lat,
      lng: req.body.lng,
      centerName: req.body.centerName
    }
  });

  event
    .save()
    .then(eve => res.send(eve))
    .catch(err => console.log(err));
});

module.exports = router;
