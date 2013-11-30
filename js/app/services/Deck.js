app.factory("Deck", ["$resource", "$location", "User", "CardLookup", function($resource, $location, User, CardLookup) {

    if(!window.deckData) {
        var DeckResource = $resource("/api/decks/:guid", {guid: "@guid"}, {
            update: { method: 'PUT' }
        });
        var Deck = new DeckResource();

        // retrieve existing if guid provided
        var guidMatches = /\/decks\/(.+)/i.exec($location.path());
        if(guidMatches) {
            Deck.$get({ guid: guidMatches[1], sessionId: User.sessionId }, function() {
                CardLookup.attachData(Deck.cards);
                Deck.sessionId = User.sessionId;
            });
        }
        else {
            Deck.hero = "Warrior";
            Deck.cards = [];
            Deck.sessionId = User.sessionId;
            Deck.editable = true;
            Deck.viewed = 0;
            Deck.forked = 0;
        }
    }
    else {
        var Deck = window.deckData;
        CardLookup.attachData(Deck.cards);
    }

    window.debug_deck = Deck;

    return Deck;
}]);