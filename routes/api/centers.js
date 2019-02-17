const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const JsonCircular = require("json-circular");

require("../../config/passport")(passport);

const Center = require("../../models/Centers");
const Request = require("../../models/Request");

const secretKey = require("../../config/keys").secretKey;
router.get("/", (req, res) => res.send("it works"));

router.post("/register", (req, res) => {
  Center.findOne({ eLoc: req.body.eLoc })
    .then(center => {
      if (center) {
        return res.send({ error: "Center is already registered" });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) return res.send(err);
            var newCenter = new Center();
            for (var k in req.body) {
              newCenter[k] = req.body[k];
            }
            newCenter.password = hash;
            newCenter
              .save()
              .then(centerNew => res.json(centerNew))
              .catch(err =>
                res
                  .status(404)
                  .json({ error: "Center not registered properly" })
              );
          });
        });
      }
    })
    .catch(err => res.status(400).send(err));
});

router.post("/login", (req, res) => {
  console.log(req.body);
  Center.findOne({ email: req.body.email })
    .then(center => {
      if (!center) {
        return res.status(404).send(center);
      }
      bcrypt
        .compare(req.body.password, center.password)
        .then(isMatch => {
          if (!isMatch) {
            errors.password = "Incorrect Information";
            return res.status(400).json(errors);
          } else {
            // User matched
            console.log(center.eLoc);
            res.json(center.eLoc);
          }
        })
        .catch(err => {
          errors.password = "Incorrect Information";
          return res.status(400).json(errors);
        });
    })
    .catch(err => res.status(400).send(err));
});

router.post("/updateInventory", (req, res) => {
  const eLoc = req.body.eLoc;
  const newInventory = req.body.inventory;
  Center.findOneAndUpdate(
    { eLoc: eLoc },
    { $set: { inventory: newInventory } },
    { new: true }
  )
    .then(center => res.send(center))
    .catch(err => res.send(err));
});

router.get("/bloodBank/:eLoc", (req, res) => {
  const eLoc = req.params.eLoc;

  Center.findOne({ eLoc: eLoc })
    .then(center => {
      if (!center) {
        return res.send({ error: "This center is not registered. :(" });
      }
      return res.send(center);
    })
    .catch(err => res.status(404).send(err));
});

//Returns all the available centers around the current location given the post request
router.post("/all/bloodBank", (req, res) => {
  res.send([
    {
      lat: 21.2408580000001,
      lng: 81.6206470000001,
      eLoc: "VZQB4A",
      placeName: "City Blood Bank",
      placeAddress: "Ramakrishna Ashram, GE Road, Raipur, Chhattisgarh, 492001"
    },
    {
      lat: 21.2512560000001,
      lng: 81.629579,
      eLoc: "FP72CE",
      placeName: "Chhattisgarh Blood Bank",
      placeAddress: "Gandhi Para, Raipur, Chhattisgarh, 492001"
    },
    {
      lat: 21.24488,
      lng: 81.63003,
      eLoc: "HEYGIY",
      placeName: "Rajdhani Blood Bank",
      placeAddress: "Main Road, Badhaipara, Raipur, Chhattisgarh, 492001"
    },
    {
      lat: 21.246344,
      lng: 81.631086,
      eLoc: "Q8O541",
      placeName: "Shrishti Blood Bank",
      placeAddress:
        "Dhilion Complex, Jawahar Nagar, Raipur, Chhattisgarh, 492001"
    },
    {
      lat: 21.24704,
      lng: 81.6332200000001,
      eLoc: "X1U9I8",
      placeName: "Thabait Blood Bank",
      placeAddress: "Jawahar Nagar, Raipur, Chhattisgarh, 492001"
    },
    {
      lat: 21.249583,
      lng: 81.6405090000001,
      eLoc: "1SZSD1",
      placeName: "Blood Bank",
      placeAddress: "Modapra, Raipur, Chhattisgarh, 492001"
    },
    {
      lat: 21.246856,
      lng: 81.6413460000001,
      eLoc: "3FG7XY",
      placeName: "Thawaet Blood Bank",
      placeAddress:
        "Rajiv Gandhi Complex, Kuchery Chowk, Raipur, Chhattisgarh, 492001"
    },
    {
      lat: 21.2481500000001,
      lng: 81.6419280000001,
      eLoc: "L83XB4",
      placeName: "Sai Sahara Blood Bank",
      placeAddress: "Garcha Complex, Jail Road, Raipur, Chhattisgarh, 492001"
    },
    {
      lat: 21.2634640000001,
      lng: 81.6497000000001,
      eLoc: "F9GD66",
      placeName: "Blood Bank",
      placeAddress:
        "Shree Narayana Hospital, Devendra Nagar, Raipur, Chhattisgarh, 492001"
    },
    {
      lat: 21.258358,
      lng: 81.6603370000001,
      eLoc: "3O6NV5",
      placeName: "Ashirwad Blood Bank",
      placeAddress:
        "Rajeev Nagar, Shankar Nagar Road, Raipur, Chhattisgarh, 492001"
    },
    {
      lat: 21.254107,
      lng: 81.6634490000001,
      eLoc: "NAAEWH",
      placeName: "Bilasa Blood Bank",
      placeAddress:
        "Shankar Nagar Road, Shakti Nagar, Raipur, Chhattisgarh, 492001"
    },
    {
      lat: 21.2131600000001,
      lng: 81.6580300000001,
      eLoc: "DDW44C",
      placeName: "Blood Bank",
      placeAddress:
        "Mmi Narayana Multispecialty Hospital, Dhamtari Road, Lalpur, Raipur, Chhattisgarh, 492001"
    }
  ]);

  var wow = {};
  if (!req.body.lat) {
    for (var k in req.body) {
      wow = k;
    }
  } else {
    wow = req.body;
  }
  var lat = wow.lat;
  var lng = wow.lng;
  const centersFound = [];

  const token = "b46a3249-92f5-4fe3-901a-3c21e5881690"; // This needs to be generated regularly.

  // axios({
  //   method: "GET",
  //   url: `https://atlas.mapmyindia.com/api/places/nearby/json?keywords=blood bank&refLocation=${lat},${lng}`,
  //   headers: {
  //     Authorization: `bearer ${token}`
  //   }
  // })
  //   .then(result => {
  //     result.data.suggestedLocations.forEach(data => centersFound.push(data));
  //     if (result.data.pageInfo.totalPages > 1) {
  //       axios({
  //         method: "GET",
  //         url: `https://atlas.mapmyindia.com/api/places/nearby/json?keywords=blood bank&refLocation=${lat},${lng}&page=2`,
  //         headers: {
  //           Authorization: `bearer ${token}`
  //         }
  //       })
  //         .then(result2 => {
  //           result2.data.suggestedLocations.forEach(data =>
  //             centersFound.push(data)
  //           );
  //           console.log(req.body.lat);
  //           console.log(req.body.lng);
  //           var centersLimitedField = [];
  //           centersFound.map(center => {
  //             centersLimitedField.push({
  //               lat: center.latitude,
  //               lng: center.longitude,
  //               eLoc: center.eLoc,
  //               placeName: center.placeName,
  //               placeAddress: center.placeAddress
  //             });
  //           });
  //           console.log(centersLimitedField);
  //           res.json(centersLimitedField);
  //         })
  //         .catch(err => res.status(404).send(err));
  //     }
  //   })
  //   .catch(err => res.status(404).send(err));
});
//POST /all/bloodBnks ends

router.get("/findDist/:l11/:l12/:l21/:l22", (req, res) => {
  var lat1 = req.params.l11;
  var lng1 = req.params.l12;
  var lat2 = req.params.l21;
  var lng2 = req.params.l22;

  const token = "b46a3249-92f5-4fe3-901a-3c21e5881690"; // This needs to be generated regularly.

  // const res1 = {
  //   responseCode: 200,
  //   version: "191.16",
  //   results: {
  //     alternatives: [],
  //     status: 0,
  //     trips: [
  //       {
  //         advices: [
  //           {
  //             exit_nr: 0,
  //             icon_id: 56,
  //             meters: 0,
  //             pt: {
  //               lat: 21.240857444902,
  //               lng: 81.620647609234
  //             },
  //             seconds: 0,
  //             text: "<b>Head</b> west on <em>GE Road.</em>"
  //           },
  //           {
  //             exit_nr: 0,
  //             icon_id: 41,
  //             meters: 178,
  //             pt: {
  //               lat: 21.241512442136,
  //               lng: 81.61905169487
  //             },
  //             seconds: 21,
  //             text: "Make a <b>u-turn</b> at <em>Main Road.</em>"
  //           },
  //           {
  //             exit_nr: 0,
  //             icon_id: 0,
  //             meters: 831,
  //             pt: {
  //               lat: 21.24001244417,
  //               lng: 81.625081300735
  //             },
  //             seconds: 94,
  //             text: "Turn <b>left</b> towards <em>Samta Colony.</em>"
  //           },
  //           {
  //             exit_nr: 4,
  //             icon_id: 71,
  //             meters: 2235,
  //             pt: {
  //               lat: 21.251742021175,
  //               lng: 81.628847122192
  //             },
  //             seconds: 363,
  //             text: "Enter the roundabout, then take the <b>4th</b> exit."
  //           },
  //           {
  //             exit_nr: 0,
  //             icon_id: 8,
  //             meters: 2369,
  //             pt: {
  //               lat: 21.251255807259,
  //               lng: 81.629579365253
  //             },
  //             seconds: 386,
  //             text: "<b>You will arrive at your destination.</b>"
  //           }
  //         ],
  //         duration: 383,
  //         length: 2369,
  //         pts:
  //           "}lmog@ylvtzCmDrUcVloAkCi@j\\siBzJ}o@zJis@vLsv@f^_oBgc@aKckBmToUuG_v@kJ{aAaE{JkDkHuCon@aOsXuAkCUco@uG_DUg_BmL_tAaM{JkF{EoZsDwM{TcWgr@o^wL_C{@tAgETcBuAg@uAf@uC~CuArDtAfJaG|Y}R",
  //         status: 6
  //       }
  //     ]
  //   }
  // };

  axios({
    method: "GET",
    url: `https://apis.mapmyindia.com/advancedmaps/v1/pdjc76p98ie9f6t21ppivfu6qhha8t19/route?start=${lat1},${lng1}&destination=${lat2},${lng2}&with_advices=1`
  })
    .then(res1 => {
      console.log(res1);
      const ans = [];

      res1.data.results.trips[0].advices.map(trip => {
        ans.push([trip.pt.lat, trip.pt.lng]);
      });

      res.send(ans);
    })
    .catch(err => res.status(400).send(err));
});

router.get("/inventory/:eLoc", (req, res) => {
  Center.findOne({ eLoc: req.params.eLoc })
    .then(center => {
      console.log(center);
      if (center.eLoc) {
        return res.send({
          success: "Center is registered",
          inventory: center.inventory
        });
      } else {
        return res.send({
          failure: "Center is not registered through our platform."
        });
      }
    })
    .catch(err =>
      res.send({
        failure: err
      })
    );
});

//POPST all Hospitals
router.post("/all/hospital", (req, res) => {
  var lat = req.body.lat;
  var lng = req.body.lng;
  const centersFound = [];

  const token = "b46a3249-92f5-4fe3-901a-3c21e5881690"; // This needs to be generated regularly.

  axios({
    method: "GET",
    url: `https://atlas.mapmyindia.com/api/places/nearby/json?keywords=hospital&refLocation=${lat},${lng}`,
    headers: {
      Authorization: `bearer ${token}`
    }
  })
    .then(result => {
      result.data.suggestedLocations.forEach(data => centersFound.push(data));
      if (result.data.pageInfo.totalPages > 1) {
        axios({
          method: "GET",
          url: `https://atlas.mapmyindia.com/api/places/nearby/json?keywords=hospital&refLocation=${lat},${lng}&page=2`,
          headers: {
            Authorization: `bearer ${token}`
          }
        })
          .then(result2 => {
            result2.data.suggestedLocations.forEach(data =>
              centersFound.push(data)
            );
            res.json(centersFound);
          })
          .catch(err => console.log(err));
      }
    })
    .catch(err => res.status(404).send(err));
});
module.exports = router;
