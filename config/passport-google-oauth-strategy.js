const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
require('dotenv').config();
const User = require('../models/user');

//tell passport to use new google strategy for login
passport.use(new googleStrategy({
        clientID:process.env.clientID,
        clientSecret:process.env.clientSecret,
        callbackURL:process.env.callbackURL
        // clientID:"1098500760309-37br3u6c2pcc9ni7969uf8q8cvna40mp.apps.googleusercontent.com",
        // clientSecret:"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",
        // callbackURL:"http://localhost:9000/users/auth/google/callback"

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
