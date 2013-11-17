
exports.getDeck = function(db) {
  return function(request, response) {
      var guid = request.params.guid;
      db.get('decks').findOne({ guid: guid }, {}, function(error, deck) {
          if(error) response.send(error, 500);
          if(!deck) {
              response.send("Deck with guid " + guid + " does not exist", 404);
          }
          response.json(deck);
      });
  };
};

exports.saveDeck = function(db) {
    return function(request, response) {

        var requestBody = request.body;

        // Check for errors
        if(!requestBody.cards) {
            response.send("No request body", 400);
        }

        var deck = {
            guid: 'nJy12ad3a4', // todo generate guid,
            cards: []
        }

        _.each(requestBody.cards, function(card) {
            deck.cards.push(_.pick(card, ['name', 'quantity']));
        });

        db.get('decks').insert(deck, function(error, records) {
            if(error) response.send(error, 500);
            response.json(deck);
        });
    };
};

exports.updateDeck = function(db) {
    return function(request, response) {

        var requestBody = request.body;

        // Check for errors
        if(!requestBody.cards) {
            response.send("No request body", 400);
        }

        var cards = [];
        _.each(requestBody.cards, function(card) {
            cards.push(_.pick(card, ['name', 'quantity']));
        });

        var deckCollection = db.get('decks');
        deckCollection.update({ guid: request.params.guid }, { $set: { cards: cards } }, { multi: false }, function(error, count) {
            if(error) response.send(error, 500);

            deckCollection.findOne({ guid: request.params.guid }, {}, function(error, deck) {
                response.json(deck);
            });
        });
    };
};