app.factory("Deck", [function() {
    var Deck = {
        cards: [],
        count: 0
    };

    Deck.findCard = function(name) {
        return _.find(Deck.cards, function(otherCard) { return otherCard.name == name; });
    };

    Deck.addCard = function(card) {

        if(Deck.count >= 30) return;

        var existingCard = Deck.findCard(card.name);
        if(existingCard) {
            if(existingCard.quantity < 2) {
                existingCard.quantity++;
            }
        } else {
            card.quantity = 1;
            Deck.cards.push(card);
        }
        Deck.count++;
    };

    Deck.removeCard = function(card) {
        var existingCard = Deck.findCard(card.name);
        if(existingCard) {
            existingCard.quantity = Math.max(0, existingCard.quantity-1);
            Deck.count--;

            if(existingCard.quantity == 0) {
                Deck.cards = _.reject(Deck.cards, function(otherCard) { return otherCard.name == card.name; });
            }
        }
    };

    Deck.filterHeroCards = function(allowed) {
        Deck.cards = _.filter(Deck.cards, function(card) { return !card.hero || card.hero == allowed});
        Deck.count = Deck.cards.count;
    };

    return Deck;
}]);