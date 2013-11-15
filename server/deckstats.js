
var express = require("express"),
    mainController = require("./controllers/main.js");

var app = express()
    .set("views", "./views")
    .set("view engine", "ejs")
    .use("/css", express.static("../css"))
    .use("/fonts", express.static("../fonts"))
    .use("/img", express.static("../img"))
    .use("/js", express.static("../js"))
    .get("/", mainController.index)
    .post("/decks", mainController.saveDeck)
    .listen(8080);

console.log("Listening on port 8080");