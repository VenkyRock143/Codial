const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/user')

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey:'Codeial'
}

// passport.use(new JWTStrategy(opts, function(jwtPayLoad, done){
//     User.findById(jwtPayLoad._id, function(err,user){
//         if(err){
//             console.log("error in jwt",err);
//             return;
//         }
//         if(user){
//             return done(null,user);
//         }
//         else{
//             return done(null,false);
//         }
//     });

// }));
passport.use(new JWTStrategy(opts, async (jwtPayload, done) => {
  try {
    const user = await User.findById(jwtPayload._id);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    console.log('error in jwt', err);
    return done(err);
  }
}));

module.exports = passport;