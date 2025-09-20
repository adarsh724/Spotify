const express = require('express');
const router = express.Router();
const passport = require('passport');

const UserController = require('../controllers/user_controller');

// Sign-in page
router.get('/sign-in', UserController.signIn);

// Sign-up page
router.get('/sign-up', UserController.signUp);

// Create a new user
router.post('/create', UserController.create);
 
// Create session (login user) 
router.post(
  '/create-session',
  passport.authenticate('local', {
    failureRedirect: '/users/sign-in',
  }),
  UserController.createSession
);


router.get('/destroy-session',UserController.destroySession);
router.get('/auth/google',passport.authenticate('google',{
  scope:['profile','email']

}));

router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/sign-in'}),UserController.createSession);
router.get('/verify-email',UserController.verifyEmail);
router.get('/update-pass',UserController.updatePassPage);
router.post('/change-pass',UserController.changePass);
module.exports = router;
