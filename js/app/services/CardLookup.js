app.factory("CardLookup", [function() {

    var CardLookup = {};

    CardLookup.find = function(name) {
        return _.find(hearthstoneCards, function(card) { return card.name == name; });
    };
    CardLookup.all = function() {
        return _.sortBy(hearthstoneCards, function(card) { return card.name; });
    };
    CardLookup.attachData = function(deckCards) {
        _.each(deckCards, function(card) {
            var cardData = CardLookup.find(card.name);

            if(cardData) {
                _.assign(card, cardData);
            }
        });
    };

    _.each(hearthstoneCards, function(card) {
        if(card.cost > 0 && card.type == "Minion") {
            card.value = Math.roundTo(( (card.attack || 0) + (card.health || 0) ) / card.cost, 1);
        }
    });

    return CardLookup;
}]);