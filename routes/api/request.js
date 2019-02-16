const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Request = require("../../models/Request");
const User = require("../../models/Users");
const Center = require("../../models/Centers");

router.get("/", (req, res) => res.send("it works"));

router.post("/center/create/:eLoc", (req, res) => {
  Center.findOne({ eLoc: req.params.eLoc }).then(result => {
    if (!result) return res.send("Center not Registered");
    let newRequest = new Request({
      eLoc: req.params.eLoc,
      senderId: req.body.senderId,
      bloodGroup: req.body.bloodGroup,
      deadline: req.body.deadline,
      bloodUnits: req.body.bloodUnits
    });
    newRequest.save().then(request => {
      res.json(request);
    });
  });
});

router.post("/user/create/:receiverId", (req, res) => {
  User.findOne({
    receiverId: mongoose.Schema.Types.ObjectId(req.params.receiverId)
  })
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
          res.send(request);
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

router.post("/user/accept/:requestId", (req, res) => {
  const receiverId = req.body.receiverId;
  const requestId = req.params.requestId;

  User.findById(receiverId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: "Invalid User Request" });
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

router.delete("/center/reject/:requestId", (req, res) => {
  const eLoc = req.body.eLoc;
  const requestId = req.params.requestId;

  Center.findOne({ eLoc: eLoc })
    .then(center => {
      if (!center.eLoc) {
        return res.status(404).json({ error: "Invalid Center Request" });
      }
      Request.findOneAndDelete({ _id: mongoose.Types.ObjectId(requestId) })
        .then(() => res.send({ success: "Request deleted" }))
        .catch(err => res.status(400).send(err));
    })
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
      Request.find({ senderId: req.params.userId })
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
      Request.find({ receiverId: req.params.userId })
        .then(requests => {
          res.send(requests);
        })
        .catch(err => res.status(400).send(err));
    })
    .catch(err => res.status(404).send(err));
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
