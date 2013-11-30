
function webshot(deck) {
    var webshot = require("webshot");

    var options = {
        shotSize: {
            width: 625,
            height: 43 + ((30 * deck.cards.length) / 3) + 10 + 150 + 40 // todo this is fragile as hell
        },
        renderDelay: 100
    };
    webshot("http://localhost/decks/" + deck.guid + "/image", "img/decks/" + deck.guid + ".png", options, function(error) {
        if(error) {
            console.log("Error creating webshot—\n" + error);
        }
    });
}

exports.getDeck = function(db) {
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

          if(request.query.sessionId != deck.sessionId) {
              deckCollection.update({ _id: id }, { $inc: { viewed: 1 } }); // increment views
              deck.viewed++; // corrects this always being one lower due to the previous line increment
          }

          deck.guid = request.params.guid;
          deck.editable = request.query.sessionId && request.query.sessionId == deck.sessionId;
          deck.sessionId = null; // not public
          response.json(deck);
      });
  };
};

exports.saveDeck = function(db) {
    return function(request, response) {

        var requestBody = request.body;

        // Check for errors
        if(!requestBody.hero || !requestBody.cards) {
            response.send("No request body", 400);
        }
        if(!requestBody.sessionId) {
            response.send("No sessionId provided", 400);
        }

        var deckCollection = db.get("decks");

        if(request.params.guid) {
            console.log("forking " + request.params.guid);

            var forkedId = decodeGuid(request.params.guid);
            deckCollection.update({ _id: forkedId }, { $inc: { forked: 1 } }); // increment fork count
        }

        var deck = {
            hero: requestBody.hero,
            title: requestBody.title || "Untitled",
            cards: [],
            sessionId: requestBody.sessionId,
            viewed: 1,
            forked: 0,
            updated: new Date()
        };
        _.each(requestBody.cards, function(card) {
            deck.cards.push(_.pick(card, ["name", "quantity"]));
        });

        deckCollection.insert(deck, function(error, record) {
            if(error) response.send(error, 500);

            deck.guid = createGuid(record._id.toString());
            deck.editable = true; // assumption, they should not have been allowed to create otherwise
            webshot(deck); // create image file

            response.json(deck);
        });
    };
};

exports.updateDeck = function(db) {
    return function(request, response) {

        var requestBody = request.body;

        // Check for errors
        if(!request.params.guid) {
            response.send("Deck guid was not provided", 404);
        }
        if(!requestBody.hero || !requestBody.cards) {
            response.send("No request body", 400);
        }
        if(!requestBody.sessionId) {
            response.send("No session id was provided", 400);
        }

        var id = decodeGuid(request.params.guid);
        var hero = requestBody.hero;
        var title = requestBody.title || "Untitled";
        var sessionId = requestBody.sessionId;
        var cards = [];
        _.each(requestBody.cards, function(card) {
            cards.push(_.pick(card, ["name", "quantity"]));
        });

        var deckCollection = db.get("decks");
        deckCollection.update(
            {_id: id, sessionId: sessionId}, { $set: { hero: hero, title: title, cards: cards, updated: new Date() } },
            { multi: false },
            function(error, count) {
                if(error) response.send(error, 500);
                if(count == 0) response.send("Deck with guid " + request.params.guid + " not found", 404);

                deckCollection.findOne({ _id: id }, {}, function(error, deck) {
                    deck.guid = request.params.guid;
                    deck.editable = true; // assumption, they should not have been allowed to update otherwise
                    webshot(deck); // update image file

                    response.json(deck);
                });
            });
    };
};