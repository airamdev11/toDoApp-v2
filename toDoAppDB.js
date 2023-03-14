//jshint esversion:6
const mongoose = require("mongoose");
 const noteSchema = new mongoose.Schema({
    description: {
        type:String,
        required:true
    },
    isWork:{
        type:Boolean,
        required:true
    },
    list:{
        type:String,
        required:true
    }
 });

 const Note = mongoose.model("Note", noteSchema);

 module.exports = Note;