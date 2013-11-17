
exports.getDeck = function(db) {
  return function(request, response) {
      var deck = db.get('decks').findOne({ guid: request.params.guid }, {}, function(e, docs) {
          console.log(docs);
          response.json(docs);
      });
  };
};

exports.saveDeck = function(db) {
    return function(request, response) {

        var requestBody = request.body;

        // Check for errors
        if(!requestBody.cards || requestBody.cards.length == 0) {
            return false;
        }

        var deck = {
            guid: 'nJy12ad3a4', // todo generate guid,
            cards: []
        }

        _.each(requestBody.cards, function(card) {
            deck.cards.push(_.pick(card, ['name', 'quantity']));
        });
        console.log(deck);

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