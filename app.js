//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Note = require("./toDoAppDB");


const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/toDoApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

const notesArray = [];
const workNotesArray = [];

app.get("/", async function (req, res) {
    var today = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Monterrey' };
    var day = today.toLocaleDateString("es-MX", options);

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const notesArray  = await Note.find({isWork:false});
    console.log(notesArray);

    res.render('list', { listTitle: capitalizeFirstLetter(day), elements: notesArray });
}

);

app.get("/work", async function (req, res) {

    const workNotesArray  = await Note.find({isWork:true});
    console.log(notesArray);

    res.render("list", { listTitle: "Work List", elements: workNotesArray });

});

app.post("/", async function (req, res) {

    const description = req.body.element;
    const noteList = req.body.list;


    if (noteList === "Work List") {

        const note = { description, noteList, isWork: true };

        const noteInDB = new Note({description: description, isWork: true, list: noteList});
    await noteInDB.save();

        workNotesArray.push(note);

        res.redirect("/work");
    } else {
        const note = { description, noteList, isWork: false };

        const noteInDB = new Note({description: description, isWork: false, list: noteList});
        await noteInDB.save();

        notesArray.push(note);
        res.redirect("/");
    }
});

app.get("/notes", async (req, res) => {
    const notesInDB = await Note.find();
    res.send(notesInDB);
})



app.listen(3000, function () {
    console.log("Server started on port 3000");
});

function deleteItems() {
    console.log("borrando");
}