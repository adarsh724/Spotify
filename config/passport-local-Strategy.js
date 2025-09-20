const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback:true
},
    
    async function (req,email,password,done) {
        try {
            const user = await User.findOne({email:email});
            if(!user || user.password!=password){
                console.log("Invalid Username/Password");
                return done(null,false);
            }
            if (!user.isVerified) {
                console.log('error', 'Email is not verified. Please check your inbox.');
                return done(null, false);
            }
            return done(null,user);

        } catch (err) {
            console.log("error in passport Authentication" , err);
            return done(err);
        }
        
    }
));



// serializing the user


passport.serializeUser(function(user,done){
    return done(null,user.id);
})




passport.deserializeUser(async function(id, done) {
    try {
        const user = await User.findById(id);
        return done(null, user);
    } catch (err) {
        console.log("Error in finding user by ID", err);
        return done(err);
    }
});




// check if the user is authenticated
passport.checkAuthentication = function(req, res,next){
    if(req.isAuthenticated()){
        return next();

    }
    // if the user is not signed int 
    return res.redirect('/users/sign-in');
};



passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        // req.user contains the current sign in user from thr cookie and we are just sending this to the locals for view
        res.locals.user=req.user;
    }
    next();
}

module.exports = passport;