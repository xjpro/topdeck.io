app.factory("Deck", ["$resource", "$location", "User", "CardLookup", function($resource, $location, User, CardLookup) {

    var DeckResource = $resource("/api/decks/:guid", {guid: "@guid"}, {
        update: { method: 'PUT' }
    });

    var Deck = new DeckResource();
    window.debug_deck = Deck;

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
    }

    return Deck;
}]);