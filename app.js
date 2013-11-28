
// set environment based on inputs
if(!process.argv[2] || process.argv[2] == "-prod") {
    process.env.NODE_ENV = "production";
}
else if(process.argv[2] == "-dev") {
    process.env.NODE_ENV = "development";
}

// vendor services
GLOBAL._ = require("lodash-node"); // lo-dash in node, this is awesome
var mongo = require("mongodb");
var monk = require("monk");
var db = monk("localhost:27017/deckstats");

var express = require("express"),
    mainController = require("./server/controllers/main.js")
    apiController = require("./server/controllers/api.js");

var app = express()
    .set("views", "./server/views")
    .set("view engine", "ejs")
    .use(express.bodyParser())
    .get("/", mainController.index)
    .get("/decks/:guid", mainController.index)
    .get("/api/decks/:guid", apiController.getDeck(db))
    .post("/api/decks", apiController.saveDeck(db))
    .put("/api/decks/:guid", apiController.updateDeck(db))
    .post("/api/decks/:guid", apiController.saveDeck(db))
    .listen(8080);

console.log("Listening on port 8080 in " + process.env.NODE_ENV + " mode");

// http://cwbuecheler.com/web/tutorials/2013/node-express-mongo/