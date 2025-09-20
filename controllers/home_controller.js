
const songs = require('../models/songs');

module.exports.home = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/users/sign-in');
  }

  // ✅ Handle AJAX requests
  if (req.xhr) {
    return res.status(200).json(songs); // Send JSON to fetch()
  }

  // ✅ Render full home page for normal request
  res.render('home', {
    title: 'Spotify Clone | Home',
    songs: songs
  });
};



