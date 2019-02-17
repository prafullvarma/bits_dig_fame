const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const isEmpty = require("../../validation/is-empty");

require("../../config/passport")(passport);
const User = require("../../models/Users");

router.get("/all", (req, res) => {
  User.find({})
    .then(result => res.send(result))
    .catch(err => res.send(err));
});

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

router.post("/location/update/", (req, res) => {
  const userId = req.body.userId;
  const lat = req.body.lat;
  const lng = req.body.lng;
  User.findOneAndUpdate(
    { _id: userId },
    { $set: { location: { lat: lat, lng: lng } } },
    { new: true }
  )
    .then(result => res.send(result))
    .catch(err => res.status(404).send(err));
});
//USER Location update

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      const errors = {};
      bcrypt
        .compare(req.body.password, user.password)
        .then(isMatch => {
          if (!isMatch) {
            errors.password = "Incorrect Information";
            return res.status(400).json(errors);
          } else {
            // User matched
            res.send(user._id);
          }
        })
        .catch(err => {
          errors.password = "Incorrect Information";
          return res.status(400).json(errors);
        });
    })
    .catch(err => res.status(400).send({ password: "Incorrect Information" }));
});
//LOgin Route ENDS

router.post("/register", (req, res) => {
  if (!req.body.name) {
    req.body = Object.keys(req.body)[0];
  }

  User.findOne({ number: req.body.number })
    .then(result => {
      if (result) {
        res.status(400).json({ err: "Already Registered" });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) return res.send(err);
            var bmi = req.body.weight / (req.body.height * req.body.height);
            let newUser = new User({
              number: req.body.number,
              password: hash,
              name: req.body.name,
              address: req.body.address,
              bmi: bmi.toFixed(3),
              email: req.body.email,
              location: {
                lat: req.body.lat,
                lng: req.body.lng
              },
              bloodGroup: req.body.bloodGroup,
              dob: req.body.dob,
              donor: req.body.donor,
              registeredEvents: [],
              donation: []
            });
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err =>
                res.status(404).json({ error: "User not registered properly" })
              );
          });
        });
      }
    })
    .catch(err => res.send(err));
});

router.get("/:id", (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      if (!user.number)
        return res.status(404).send({ error: "No user with this id found" });
      res.send(user);
    })
    .catch(err => res.status(404).send(err));
});

router.post("/all", (req, res) => {
  var lat = req.body.lat;
  var lng = req.body.lng;
  console.log(lat, lng);
  const usersFound = [];

  User.find({})
    .then(results => {
      results = results.filter(
        result =>
          getDistanceFromLatLonInKm(
            lat,
            lng,
            result.location.lat,
            result.location.lng
          ) < 10000
      );
      results.forEach(result => {
        usersFound.push({
          lat: result.location.lat,
          lng: result.location.lng,
          name: result.name,
          number: result.number,
          bloodGroup: result.bloodGroup,
          userId: result._id,
          distance: getDistanceFromLatLonInKm(
            lat,
            lng,
            result.location.lat,
            result.location.lng
          ).toFixed(3)
        });
      });
      // console.log(usersFound);
      // usersFound = usersFound.sort({ distance: -1 });
      // console.log(usersFound);

      usersFound.sort((a, b) => a.distance < b.distance);

      res.json(usersFound);
    })
    .catch(err => res.status(400).send(err));
});

module.exports = router;
