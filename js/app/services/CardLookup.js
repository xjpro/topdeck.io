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
            card.cost = cardData.cost;
        });
    };

    return CardLookup;
}]);