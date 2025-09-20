// fixSongIds.js
const mongoose = require('mongoose');
const LikedSong = require('./models/likedSongs'); // adjust path

async function fixSongIds() {
  try {
    await mongoose.connect('mongodb://localhost/spotify_clone', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const docs = await LikedSong.find({});

    for (const doc of docs) {
      if (typeof doc.songId === 'string') {
        doc.songId = parseInt(doc.songId, 10);
        await doc.save();
        console.log(`Updated doc ${doc._id}: songId converted to number.`);
      }
    }

    console.log('All applicable documents updated.');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error fixing songIds:', err);
  }
}

fixSongIds();
