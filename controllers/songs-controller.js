const LikedSong = require('../models/likedSongs');  // Adjust path as needed
const songsData = require('../models/songs');

module.exports.likedSong = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const userId = req.user._id;
      // Parse songId to number and validate
      const songId = parseInt(req.params.songId, 10);
      if (isNaN(songId)) {
        return res.status(400).json({ success: false, message: "Invalid song ID" });
      }

      // Use parsed number songId in queries
      let liked = await LikedSong.findOne({ user: userId, songId });

      let likedStatus;
      if (!liked) {
        await LikedSong.create({ user: userId, songId });
        likedStatus = true;
      } else {
        await LikedSong.deleteOne({ user: userId, songId });
        likedStatus = false;
      }

      return res.json({ success: true, liked: likedStatus });
    } else {
      return res.status(401).json({ success: false, message: "Login required" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error liking song" });
  }
};

module.exports.getLikedSongs = async (req, res) => {
  try {
    const likedEntries = await LikedSong.find({ user: req.user._id });
    
    // Compare IDs safely by casting both sides to Number
    const likedSongs = likedEntries.map(entry => {
      return songsData.find(song => Number(song.id) === Number(entry.songId));
    }).filter(Boolean);

    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.json(likedSongs);
    } else {
      return res.render('liked_songs', { title: "Liked Songs", songs: likedSongs });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error getting liked songs" });
  }
};



const mongoose = require('mongoose');


module.exports.unlikeSong = async (req, res) => {
  try {
    const songIdParam = req.params.songId;

    // Attempt to match both string and number for safety
    await LikedSong.findOneAndDelete({
      user: req.user._id,
      $or: [
        { songId: songIdParam },
        { songId: Number(songIdParam) }
      ]
    });

    return res.redirect('/songs/likedSongs');
  } catch (err) {
    console.error('Error removing liked song:', err);
    return res.status(500).send('Error removing liked song');
  }
};


module.exports.getHistory = async (req,res) => {
  try {
    return res.render('history',
      { title: "History Songs", 
        songs: songsData
    });
    
  } catch (err) {
     console.error(err);
    return res.status(500).json({ success: false, message: "Error getting History" });
  }
  
}





