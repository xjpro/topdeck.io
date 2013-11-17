
// vendor services
GLOBAL._ = require('lodash-node'); // lo-dash in node, this is awesome
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/deckstats');

var express = require("express"),
    mainController = require("./controllers/main.js")
    apiController = require('./controllers/api.js');

var app = express()
    .set("views", "./views")
    .set("view engine", "ejs")
    .use("/css", express.static("../css"))
    .use("/fonts", express.static("../fonts"))
    .use("/img", express.static("../img"))
    .use("/js", express.static("../js"))
    .use(express.bodyParser())
    .get("/", mainController.index)
    .get("/decks/:guid", mainController.index)
    .get("/api/decks/:guid", apiController.getDeck(db))
    .post("/api/decks", apiController.saveDeck(db))
    .listen(8080);

console.log("Listening on port 8080");