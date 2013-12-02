
// set environment based on inputs
if(!process.argv[2] || process.argv[2] == "-prod") {
    process.env.NODE_ENV = "production";
    // todo use uglify-js to minify and deploy js files
}
else if(process.argv[2] == "-dev") {
    process.env.NODE_ENV = "development";
}

GLOBAL.createGuid = function(hexId) {
    return new Buffer(hexId, 'hex').toString('base64')
        .replace('+', '-')
        .replace('/', '_');
}
GLOBAL.decodeGuid = function (guid) {
    return new Buffer(guid
        .replace('-','+')
        .replace('_','/'), 'base64').toString('hex');
}

// vendor services
GLOBAL._ = require("lodash-node"); // lo-dash in node, this is awesome
var mongo = require("mongodb");
var monk = require("monk");
var db = monk("localhost:27017/topdeck");

// setup via http://cwbuecheler.com/web/tutorials/2013/node-express-mongo/
// todo use sails.js?
var express = require("express"),
    mainController = require("./server/controllers/main.js")
    apiController = require("./server/controllers/api.js");

var app = express()
    .set("views", "./server/views")
    .set("view engine", "ejs")
    .use(express.bodyParser())
    .get("/", mainController.index(db))
    .get("/decks", mainController.deck)
    .get("/decks/:guid", mainController.deck)
    .get("/decks/:guid/image", mainController.deckImage(db))
    .get("/api/decks/:guid", apiController.getDeck(db))
    .post("/api/decks", apiController.saveDeck(db))
    .put("/api/decks/:guid", apiController.updateDeck(db))
    .post("/api/decks/:guid", apiController.saveDeck(db))
    .listen(8080);

console.log("Listening on port 8080 in " + process.env.NODE_ENV + " mode");