
function createGuid(hexId) {
    return new Buffer(hexId, 'hex').toString('base64')
        .replace('+', '-')
        .replace('/', '_');
}
function decodeGuid(guid) {
    return new Buffer(guid
        .replace('-','+')
        .replace('_','/'), 'base64').toString('hex');
}

exports.getDeck = function(db) {
  return function(request, response) {

      if(!request.params.guid) {
          response.send("Deck guid was not provided", 404);
      }

      var id = decodeGuid(request.params.guid);

      db.get('decks').findOne({ _id: id }, {}, function(error, deck) {
          if(error) response.send(error, 500);
          if(!deck) {
              response.send("Deck with guid " + guid + " not found", 404);
          }
          deck.guid = request.params.guid;
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

        var deck = { hero: requestBody.hero, cards: [] };
        _.each(requestBody.cards, function(card) {
            deck.cards.push(_.pick(card, ['name', 'quantity']));
        });

        db.get('decks').insert(deck, function(error, record) {
            if(error) response.send(error, 500);

            deck.guid = createGuid(record._id.toString());

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

        var id = decodeGuid(request.params.guid);
        var hero = requestBody.hero;
        var cards = [];
        _.each(requestBody.cards, function(card) {
            cards.push(_.pick(card, ['name', 'quantity']));
        });

        var deckCollection = db.get('decks');
        deckCollection.update({ _id: id }, { $set: { hero: hero, cards: cards } }, { multi: false }, function(error, count) {
            if(error) response.send(error, 500);
            if(count == 0) response.send("Deck with guid " + request.params.guid + " not found", 404);

            deckCollection.findOne({ _id: id }, {}, function(error, deck) {
                response.json(deck);
            });
        });
    };
};