
app.controller("HeaderController", ["$scope", "$resource", "Deck", function($scope, $resource, Deck) {

    $scope.saveDeck = function() {
        Deck.$save();
    };
    $scope.forkDeck = function() {
        console.log('fork');
    };
}]);