const express = require('express');
const router = express.Router();
const songsController = require('../controllers/songs-controller');

router.post('/like/:songId',songsController.likedSong);
router.get('/likedSongs',songsController.getLikedSongs);
router.get('/unlike/:songId',songsController.unlikeSong);
router.get('/history',songsController.getHistory);

module.exports = router;