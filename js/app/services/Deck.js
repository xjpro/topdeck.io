app.factory("Deck", ["$resource", "$location", function($resource, $location) {

    var DeckResource = $resource("/api/decks/:guid", {guid: "@guid"});
    var Deck = new DeckResource();

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