
app.controller("HeaderController", ["$scope", "$location", "Deck", "User", "CardLookup", function($scope, $location, Deck, User, CardLookup) {

    $scope.saveDeck = function() {
        if(Deck.guid) {
            Deck.$update(function() {
                CardLookup.attachData(Deck.cards);
                Deck.sessionId = User.sessionId;
            });
        }
        else {
            Deck.$save(function() {
                $location.path('/decks/' + Deck.guid);
                CardLookup.attachData(Deck.cards);
                Deck.sessionId = User.sessionId;
            });
        }
    };
    $scope.forkDeck = function() {
        console.log('fork');
    };

}]);