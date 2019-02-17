const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Request = require("../../models/Request");
const User = require("../../models/Users");
const Center = require("../../models/Centers");

router.get("/", (req, res) => res.send("it works"));

router.post("/center/create/:eLoc", (req, res) => {
  console.log(req.body);
  req.body = JSON.parse(Object.keys(req.body)[0]);
  console.log(req.body);
  Center.findOne({ eLoc: req.params.eLoc })
    .then(result => {
      if (!result) return res.send("Center not Registered");
      let newRequest = new Request({
        eLoc: req.params.eLoc,
        senderId: req.body.senderId,
        bloodGroup: req.body.bloodGroup,
        deadline: req.body.deadline,
        bloodUnits: req.body.bloodUnits
      });
      newRequest
        .save()
        .then(request => {
          res.json(request);
        })
        .catch(err => res.send(err));
    })
    .catch(err => res.send(err));
});

router.post("/user/create/:receiverId", (req, res) => {
  console.log(req.body);

  User.findById(req.params.receiverId)
    .then(user => {
      if (!user) {
        return res.status(400).send({ error: "Receiver doesn't exist" });
      }
      let newRequest = new Request({
        senderId: req.body.senderId,
        receiverId: req.params.receiverId,
        bloodGroup: req.body.bloodGroup,
        deadline: req.body.deadline,
        bloodUnits: req.body.bloodUnits
      });

      newRequest
        .save()
        .then(request => {
          User.findById(req.body.senderId)
            .then(sender => {
              console.log("SENDER", sender);
              if (!sender._id) {
                return res.status(404).json({ error: "Sender not found" });
              }
              const msg = `You have received a request for blood donation from ${
                sender.name
              } You can contact them either thorugh the app or at this number -> ${
                sender.number
              }`;
              res.send(request);
            })
            .catch(err => res.send(err));
        })
        .catch(err => res.status(400).send(err));
    })
    .catch(err => res.status(400).send(err));
});

router.post("/center/accept/:requestId", (req, res) => {
  const eLoc = req.body.eLoc;
  const requestId = req.params.requestId;

  Center.findOne({ eLoc: eLoc })
    .then(center => {
      console.log(center);
      if (!center.eLoc) {
        return res.status(404).json({ error: "Invalid Center Request" });
      }
      Request.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(requestId) },
        { $set: { state: 1 } },
        { new: true }
      )
        .then(request => {
          res.send(request);
        })
        .catch(err => res.status(400).send(err));
    })
    .catch(err => res.status(400).send(err));
});

router.get("/accept/:requestId", (req, res) => {
  const requestId = req.params.requestId;
  Request.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(requestId) },
    { $set: { state: 1 } },
    { new: true }
  )
    .then(request => {
      res.send(request);
    })
    .catch(err => res.status(400).send(err));
});

router.get("/reject/:requestId", (req, res) => {
  const requestId = req.params.requestId;
  Request.findOneAndDelete({ _id: mongoose.Types.ObjectId(requestId) })
    .then(() => res.send({ success: "Request deleted" }))
    .catch(err => res.status(400).send(err));
});

router.get("/center/:eLoc", (req, res) => {
  Center.findOne({ eLoc: req.params.eLoc })
    .then(center => {
      if (!center.eLoc) {
        return res.status(404).json({ error: "Invalid Center Request" });
      }
      Request.find({ eLoc: req.params.eLoc })
        .then(requests => {
          res.send(requests);
        })
        .catch(err => res.status(400).send(err));
    })
    .catch(err => res.status(404).send(err));
});

router.get("/user/sent/:userId", (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      if (!user.number) {
        return res.status(404).json({ error: "Invalid User Request" });
      }
      Request.find({ senderId: req.params.userId, state: 0 })
        .then(requests => {
          res.send(requests);
        })
        .catch(err => res.status(400).send(err));
    })
    .catch(err => res.status(404).send(err));
});

router.get("/user/received/:userId", (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      if (!user.number) {
        return res.status(404).json({ error: "Invalid User Request" });
      }
      Request.find({ receiverId: req.params.userId, state: 1 })
        .then(requests => {
          res.send(requests);
        })
        .catch(err => res.status(400).send(err));
    })
    .catch(err => res.status(404).send(err));
});

router.get("/user/done/:userId", (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      if (!user.number) {
        return res.status(404).json({ error: "Invalid User Request" });
      }
      var done = [];
      Request.find({ senderId: req.params.userId, state: 2 })
        .then(requests => {
          requests.map(request => done.push(request));
        })
        .catch(err => console.log(err));
      Request.find({ receiverId: req.params.userId, state: 2 })
        .then(requests => {
          requests.map(request => done.push(request));
        })
        .catch(err => console.log(err));

      res.send(done);
    })
    .catch(err => res.status(400).send(err));
});

router.get("/all", (req, res) => {
  Request.find({})
    .sort("time", -1)
    .limit(20)
    .then(requests => {
      res.json(requests);
    });
});

module.exports = router;
