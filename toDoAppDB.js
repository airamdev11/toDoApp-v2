//jshint esversion:6
const mongoose = require("mongoose");
 const noteSchema = new mongoose.Schema({
    description: {
        type:String,
        required:true
    },
 });

 const Note = mongoose.model("Note", noteSchema);




const listSchema = new mongoose.Schema({
   name: {
       type:String
   },
   items:[noteSchema]
});

const List = mongoose.model("List", listSchema);

module.exports = {Note, List};