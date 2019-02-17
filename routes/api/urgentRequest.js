const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const User = require("../../models/User");
const UrgentRequest = require("../../models/UrgentRequest");

//LAT LONG DISTANCE
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

router.post("/create", (req, res) => {
  User.findById(req.body.senderId)
    .then(sender => {
      if (sender) {
        var newUrgentRequest = new UrgentRequest({
          senderId: req.body.senderId,
          bloodGroup: req.body.bloodGroup,
          bloodUnits: req.body.bloodUnits,
          deadline: req.body.deadline,
          number: req.body.number
        });
        newUrgentRequest
          .save()
          .then(urgentRequest => res.send(urgentRequest))
          .catch(err => res.status(400).send(err));

        // Send nearby users and centers a sms.
        var dist;
        if (deadline <= 2) dist = 2;
        else if (deadline <= 5) dist = 6;
        else if (deadline <= 12) dist = 10;
        else if (deadline <= 24) dist = 15;
        else dist = 20;
        Center.find({})
          .then(centers => {
            centers.filter(center => {
              getDistanceFromLatLonInKm(
                sender.location.lat,
                sender.location.lng,
                center.lat,
                center.lng
              ) < dist;
            });
          })
          .catch(err => console.log(err));
      } else {
        return res.status(404).send({ error: "Try logging out" });
      }
    })
    .catch(err => res.send(err));
});
