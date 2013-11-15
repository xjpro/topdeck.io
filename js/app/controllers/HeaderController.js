
app.controller("HeaderController", ["$scope", function($scope) {

    $scope.saveDeck = function() {
        console.log('save');
    };
    $scope.forkDeck = function() {
        console.log('fork');
    };
}]);