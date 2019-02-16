const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = require("../models/Users");
const Center = require("../models/Centers");
const keys = require("./keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      Users.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          Center.findById(jwt_payload.id)
            .then(center => {
              if (center) {
                return done(null, center);
              }
              return done(null, false);
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    })
  );
};
