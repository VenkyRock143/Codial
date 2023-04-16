const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');


// authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback:'true'
    },
    async function(req, email, password, done){
        // find a user and establish the identity
        try {
            let user = await User.findOne({email: email});  
            if (!user || user.password != password){
                req.flash('error','Invalid Username/Password')
                return done(null, false);
            }

            return done(null, user);
            
        } catch (error) {
            console.log('error');
            return done(error);
        }
      
        
    }


));


// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});



// deserializing the user from the key in the cookies
passport.deserializeUser( async function(id, done){
   try {
    let user = await User.findById(id);
        return done(null, user);
   } catch (error) {
        console.log('error');
        return done (error);
   }
    
    
});

//check if user is authenticated
passport.checkAuthentication = function(req,res,next){
    //if user is Authenticated then we can pass it to next to controller,Action
    if(req.isAuthenticated()){
        return next();
    }
}
 
passport.setAuthenticatedUser = function(req, res , next){
    if(req.isAuthenticated()){
        //we will take the user which is already stored in the cookies to views 
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;