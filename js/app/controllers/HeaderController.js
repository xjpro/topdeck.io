
app.controller("HeaderController", ["$scope", "$location", "Deck", "CardLookup", function($scope, $location, Deck, CardLookup) {

    $scope.saveDeck = function() {
        if(Deck.guid) {
            Deck.$update(function() {
                CardLookup.attachData(Deck.cards);
            });
        }
        else {
            Deck.$save(function() {
                $location.path('/decks/' + Deck.guid);
                CardLookup.attachData(Deck.cards);
            });
        }
    };
    $scope.forkDeck = function() {
        console.log('fork');
    };

}]);