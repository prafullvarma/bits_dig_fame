const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

var eventsCreated = [
  {
    name: "Wow",
    location: "Raipur",
    date: "20/1/2019",
    description: "lalalalala"
  },
  {
    name: "Wow",
    location: "Raipur",
    date: "20/1/2019",
    description: "lalalalala"
  }
];

// Require routes here
// const user = require('routes/api/fileName');
const center = require("./routes/api/centers");
const user = require("./routes/api/users");
const events = require("./routes/api/events");
const request = require("./routes/api/request");

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// Configure your database here.
const db = require("./config/keys").mongoURI;

// Connecting to your database
mongoose
  .connect(
    "mongodb://127.0.0.1:27017/blood-share",
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  // res.render("index", { eventsCreated });
  res.send("Hello");
});

app.post("/login", (req, res) => {
  console.log(req.body);
  res.send("");
});

app.post("/register", (req, res) => {
  console.log(req.body);
  res.send("");
});

// Using Routes Here
app.use("/api/center", center);
app.use("/api/user", user);
app.use("/api/event", events);
app.use("/api/request", request);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server started on port ${port}`));

// Note: For mongoose connection to be established. You need to enter a valid URI in config/keys. Else this will throw an error.
