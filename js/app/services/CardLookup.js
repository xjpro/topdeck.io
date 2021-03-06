app.factory("CardLookup", [function() {

    var CardLookup = {};

    CardLookup.find = function(name) {

        var match = _.find(hearthstoneCards, function(card) { return card.name == name; });
        if(!match) {
            console.error("Could not find " + name);
        }
        return match;
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

        card.imageName = card.name.replace(":", "").replace(".", "");

        switch(card.type) {
            case "Minion":
                card.title = card.attack + "/" + card.health + " minion for " + card.cost;
                if(card.description) {
                    card.title += ".<br/>" + card.description;
                }
                break;
            case "Weapon":
                card.title = card.attack + "/" + card.durability + " weapon for " + card.cost;
                break;
            case "Spell":
                card.title = card.description;
                break;
        }
    });

    return CardLookup;
}]);