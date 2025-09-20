const mongoose= require('mongoose');
// const User = require('./user');


const likedSongSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    songId:{
        type:Number,
        required:true,
        set: v => Number(v)
    } 
},{
    timestamps:true
})
module.exports=mongoose.model('LikedSong',likedSongSchema);