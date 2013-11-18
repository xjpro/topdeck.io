app.factory("Deck", ["$resource", "$location", function($resource, $location) {

    var DeckResource = $resource("/api/decks/:guid", {guid: "@guid"}, {
        update: { method: 'PUT' }
    });
    var Deck = new DeckResource();
    window.debug_deck = Deck;

    // retrieve existing if guid provided
    var guidMatches = /\/decks\/(.+)/i.exec($location.path());
    if(guidMatches) {
        Deck.$get({ guid: guidMatches[1]}, function() {
            window.d = Deck;
        });
    }
    else {
        Deck.cards = [];
    }

    return Deck;
}]);