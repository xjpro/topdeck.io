
exports.index = function(db) {
    return function(request, response) {

        var deckCollection = db.get("decks");
        deckCollection.find({}, { limit: 6 }, function(error, decks) {
            response.render("index", {
                recentDecks: decks
            });
        });
    };
}

exports.deck = function(request, response) {
    response.render("deck");
};

exports.deckImage = function(db) {
    return function(request, response) {

        if(!request.params.guid) {
            response.send("Deck guid was not provided", 404);
        }

        var deckCollection = db.get("decks");
        var id = decodeGuid(request.params.guid);

        deckCollection.findOne({ _id: id }, {}, function(error, deck) {
            if(error) response.send(error, 500);
            if(!deck) {
                response.send("Deck with guid " + request.params.guid + " not found", 404);
            }

            deck.guid = request.params.guid;
            response.render("deckImage", { deck: deck });
        });
    };
};