
app.controller("HeaderController", ["$scope", "$location", "Deck", function($scope, $location, Deck) {

    $scope.saveDeck = function() {
        if(Deck.guid) {
            Deck.$update();
        }
        else {
            Deck.$save(function() {
                $location.path('/decks/' + Deck.guid);
            });
        }
    };
    $scope.forkDeck = function() {
        console.log('fork');
    };

}]);