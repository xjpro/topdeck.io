
app.controller("HeaderController", ["$scope", "$location", "Deck", "User", "CardLookup", function($scope, $location, Deck, User, CardLookup) {

    $scope.deck = Deck;

    $scope.newDeck = function() {
        $location.path("/decks");
        Deck.guid = null;
        Deck.cards = [];
        Deck.title = "";
        Deck.sessionId = User.sessionId;
        Deck.editable = true;
        Deck.viewed = 0;
        Deck.forked = 0;
    };
    $scope.saveDeck = function() {
        if(Deck.guid) {
            Deck.$update(function() {
                CardLookup.attachData(Deck.cards);
                Deck.sessionId = User.sessionId;
            });
        }
        else {
            Deck.$save(function() {
                $location.path("/decks/" + Deck.guid);
                CardLookup.attachData(Deck.cards);
                Deck.sessionId = User.sessionId;
            });
        }
    };
    $scope.forkDeck = function() {
        if(!Deck.guid) return;
        
        Deck.$save(function() {
            $location.path("/decks/" + Deck.guid);
            CardLookup.attachData(Deck.cards);
            Deck.sessionId = User.sessionId;
        })
    };

}]);