//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const models = require("./toDoAppDB");


const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

var notesArray = [];

mongoose.connect('mongodb://127.0.0.1:27017/toDoApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

    function capitalizeFirstLetter(string) {
        const firstChar = string.charAt(0);
        const resto = string.slice(1);
        return firstChar.toUpperCase() + resto.toLowerCase();
    }

app.get("/", async function (req, res) {
    var today = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Monterrey' };
    var day = today.toLocaleDateString("es-MX", options);

    const listFounded = await models.List.findOne({ name: capitalizeFirstLetter(day) });


    if (listFounded === null) {
        notesArray = [];
    }
    else {
        notesArray = listFounded.items;
    }

    res.render('list', { listTitle: capitalizeFirstLetter(day), elements: notesArray });
}
);

app.get("/notes", async (req, res) => {
    const notesInDB = await models.Note.find();
    res.send(notesInDB);
});

app.get("/:list", async function (req, res) {
    const list = capitalizeFirstLetter(req.params.list);

    const listFounded = await models.List.findOne({ name: list });

    if (listFounded === null) {
        notesArray = [];
    }
    else {
        notesArray = listFounded.items;
    }

    res.render('list', { listTitle: list, elements: notesArray });

});

app.post("/", async function (req, res) {

    const description = req.body.element;
    const list = capitalizeFirstLetter(req.body.list);

    const note = new models.Note({ description: description });

    await note.save();

    const listFounded = await models.List.findOne({ name: list });


    if (listFounded === null) {
        const newList = new models.List({ name: list, items: note });

        await newList.save();
    }
    else {
        listFounded.items.push(note);
         await listFounded.save();
    }
    const redirectTo = "/" + list;
    
    res.redirect(redirectTo);
});


app.post("/delete", async (req, res) => {
    const checkedItemId = req.body.checkbox;
    const list = capitalizeFirstLetter(req.body.list);

    //await models.Note.deleteOne({ _id: checkedItemId });
    const listElement = await models.List.findOne({ name: list });
    const items = listElement.items;   
    const index = getIndex(items, checkedItemId);

    function getIndex(items, id){
        for(let i= 0; i<items.length; i++){
            if(id == items[i]._id.toString()){
                return i;
            }
        }
    }

    await models.Note.deleteOne({_id: checkedItemId});

    await items.splice(index, 1);

    await listElement.save();

    const redirectTo = "/" + list;
    res.redirect(redirectTo);

});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});
