const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');
const songsController = require('../controllers/songs-controller');
console.log("Router Loaded");

router.get('/',homeController.home);
router.use('/users',require('./users'));
router.use('/songs', require('./songs'));


module.exports= router;

