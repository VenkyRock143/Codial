const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
require('dotenv').config();
const User = require('../models/user');
const env = require('./environment')

//tell passport to use new google strategy for login
passport.use(new googleStrategy({
        clientID: env.google_client_id,
        clientSecret:env.google_client_secret,
        callbackURL:env.google_call_back_url
},
async function(accessToken, refreshToken, profile, done) {
    try {
      const user = await User.findOne({ email: profile.emails[0].value }).exec();
      console.log(accessToken, refreshToken);
      console.log(profile);
  
      if (user) {
        // if found, set this user as req.user
        return done(null, user);
      } else {
        // if not found, create the user and set it as req.user
        const newUser = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: crypto.randomBytes(20).toString("hex"),
        });
        return done(null, newUser);
      }
    } catch (err) {
      console.log("error in google strategy-passport", err);
      return done(err, null);
    }
  }


));
module.exports = passport;
