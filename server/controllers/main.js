
exports.index = function(db) {
    return function(request, response) {

        var deckCollection = db.get('decks');

        deckCollection.find({}, {}, function(error, decks) {
            response.render("index", {
                recentDecks: decks
            })
        });
    };
}

exports.deck = function(request, response) {
    response.render("deck");
};