const User = require('../models/user');
const SignMailer = require('../mailers/sign_mailers');
const { sign } = require('crypto');
const crypto = require('crypto');

module.exports.signIn = async function (req, res) {
    try {
      if(req.isAuthenticated()){
          return res.redirect('/');
        }
        res.render('user_signin',{
            title:"Sign In",
            layout:false
        });
    } catch (err) {
        console.log("Error in Signing In user", err);
        return res.status(500).send("Internal Server Error");
    }
};

module.exports.signUp = async function (req,res) { 
    try {
        if(req.isAuthenticated()){
          return res.redirect('/');
        }
        res.render('user_signup',{
            title:"Sign Up",
            layout:false
        });
        
    } catch (err) {
        console.log("Error in Creating  User", err);
        return res.status(500).send("Internal Server Error");
    }
    
}
module.exports.create = async function (req, res) {
  try {
    if (req.body.password !== req.body.confirm_password) {
      return res.redirect('/');
    }

    // 👇 IMPORTANT: Add await here
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isVerified:false,
        verificationToken: verificationToken

      });
      const verifyLink = `http://localhost:8000/users/verify-email?token=${verificationToken}`;
      // console.log("Verification link:", verifyLink);
      await SignMailer.WelcomeUser(newUser, verifyLink);
      return res.redirect('/users/sign-in');
    } else {
      console.log("User already exists");
      return res.redirect('/');
    }
  } catch (err) {
    console.log("Error in user creation:", err);
    return res.redirect('/');
  }
};


module.exports.createSession = function(req,res){
      const updateLink = "http://localhost:8000/users/update-pass";

  SignMailer.userLoggedIn(req.user,updateLink);
  return res.redirect('/');
};




module.exports.destroySession = function(req, res, next) {
    req.logout(function(err) {
        if (err) {
            console.log("Logout error:", err);
            return next(err); // pass to Express error handler
        }
        return res.redirect('/');
    });
};

module.exports.verifyEmail = async (req,res)=>{
      const token = req.query.token;
      try {
        const user = await User.findOne({verificationToken:token});
        if(!user) return res.send("Invalid or expired verification link.");
        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();
        return res.send("Email verified successfully! You can now log in.");
        
      } catch (error) {
         return res.status(500).send("Server error during verification.");
      }
}

module.exports.updatePassPage = function(req,res){
  return res.render('update_pass',{
    title:'Update Password',
    layout:false
  })
}

module.exports.changePass = async (req,res) => {
  try {
    const { email, new_password, confirm_new_password } = req.body;
    if(new_password!=confirm_new_password){
      return res.redirect('/users/update-pass');
    }
    // const email = req.body.email;
    const updatedUser = await User.findOneAndUpdate({email:req.body.email},{password: req.body.new_password});
    if (!updatedUser) {
      // User not found
      return res.status(404).send('User not found');
    }
    req.logout(err => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).send('Logout failed');
      }
      return res.redirect('/users/sign-in');
    });
  } catch (error) {
     console.error('Error changing password:', error);
    return res.status(500).send('Internal Server Error');
  }
    
    
}