//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

const notesArray = [];
const workNotesArray = [];
const allNotesArray = [];

app.get("/", function (req, res) {
    var today = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Monterrey' };
    var day = today.toLocaleDateString("es-MX", options);

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    res.render('list', { listTitle: capitalizeFirstLetter(day), elements: notesArray });
}

);

app.get("/work", function (req, res) {

    res.render("list", { listTitle: "Work List", elements: workNotesArray });

});

app.post("/", function (req, res) {

    const noteDescription = req.body.element;
    const noteList = req.body.list;

    const note = { noteDescription, noteList};

    if (noteList === "Work List") {

        const note = { noteDescription, noteList, isWork: true};
        workNotesArray.push(note);
        allNotesArray.push(note);

        res.redirect("/work");
    } else {
        const note = { noteDescription, noteList, isWork: false};
        notesArray.push(note);
        allNotesArray.push(note);
        res.redirect("/");
    }
});

app.get("/notes", (req, res) => {
            
            

            res.send(allNotesArraytes);
})

app.listen(3000, function () {
    console.log("Server started on port 3000");
});

function deleteItems(){
    console.log("borrando");
}