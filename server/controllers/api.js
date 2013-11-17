
exports.getDeck = function(db) {
  return function(request, response) {
      db.get('decks').findOne({ guid: request.params.guid }, {}, function(error, deck) {
          if(!deck) {
              // 404 error
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
            return false; // todo 400 or something
        }

        var deck = {
            guid: 'nJy12ad3a4', // todo generate guid,
            cards: []
        }

        _.each(requestBody.cards, function(card) {
            deck.cards.push(_.pick(card, ['name', 'quantity']));
        });

        db.get('decks').insert(deck, function(error, doc) {
            if(error) {
                response.send(error);
            }
            else {
                response.json(deck);
            }
        });
    };
};

exports.updateDeck = function(db) {
    return function(request, response) {

        var requestBody = request.body;

        // Check for errors
        if(!requestBody.cards) {
            return false; // todo 400 or something
        }

        var cards = [];
        _.each(requestBody.cards, function(card) {
            cards.push(_.pick(card, ['name', 'quantity']));
        });

        var deckCollection = db.get('decks');
        deckCollection.update({ guid: request.params.guid }, { $set: { cards: cards } }, { multi: false }, function(error, count) {
            deckCollection.findOne({ guid: request.params.guid }, {}, function(error, deck) {
                response.json(deck);
            });
        });
    };
};