const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");

passport.use(
  new googleStrategy(
    {
      // clientID:
      //   "",
      // clientSecret: "",
      // callbackURL: "",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({ email: profile.emails[0].value }).exec();
        if (user) {
          return done(null, user);
        } else {
          let newUser = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: crypto.randomBytes(20).toString("hex"),
          });
          return done(null, newUser); 
        }
      } catch (error) {
        console.error("Error in Google Strategy Passport:", err);
        return done(err);
      }
    }
  )
);
module.exports=passport;