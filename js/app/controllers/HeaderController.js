
app.controller("HeaderController", ["$scope", "Deck", function($scope, Deck) {

    $scope.saveDeck = function() {
        if(Deck.guid) {
            Deck.$update();
        }
        else {
            Deck.$save();
        }
    };
    $scope.forkDeck = function() {
        console.log('fork');
    };
    
}]);