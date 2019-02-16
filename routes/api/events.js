const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");

require("../../config/passport")(passport);
const Event = require("../../models/Events");

router.get("/", (req, res) => res.send("it works"));

module.exports = router;
