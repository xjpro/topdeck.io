
var async = require("async");

exports.index = function(db) {
    return function(request, response) {

        var viewModel = {};

        var deckCollection = db.get("decks");

        async.parallel([
            function(callback) {
                var lagTimeMinutesAgo = new Date(new Date().getTime() - 1.5 * 60000); // don't show for 90 seconds to ensure image has been created
                deckCollection.find({ updated: { $lt: lagTimeMinutesAgo }}, { sort: { updated: -1 }, limit: 6 }, function(error, decks) {
                    viewModel.mostRecent = decks;
                    callback();
                });
            },
            function(callback) {
                deckCollection.find({}, { sort: { viewed: -1 }, limit: 6 }, function(error, decks) {
                    viewModel.mostViewed = decks;
                    callback();
                });
            },
            function(callback) {
                deckCollection.find({}, { sort: { forked: -1 }, limit: 6 }, function(error, decks) {
                    viewModel.mostCopied = decks;
                    callback();
                });
            }
        ], function() {
            response.render("index", viewModel);
        });

    };
};

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
            if(error) {
                response.send(error, 500);
            }
            else if(!deck) {
                response.send("Deck with guid " + request.params.guid + " not found", 404);
            }
            else {
                deck.guid = request.params.guid;
                response.render("deckImage", { deck: deck });
            }
        });
    };
};