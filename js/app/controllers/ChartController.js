app.controller("ChartController", ["$scope", "Deck", function($scope, Deck) {
    $scope.cards = Deck.cards;

    $scope.$watch(function() { return Deck.cards; }, function() {

        var minionCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var cardCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        _.each(Deck.cards, function(card) {
            cardCounts[Math.min(10, card.cost)] += card.quantity;
            if(card.type == "Minion") {
                minionCounts[Math.min(10, card.cost)] += card.quantity;
            }
        });

        $scope.graphData = {
            cardCounts: {
                all: cardCounts,
                minions: minionCounts
            }
        };

    }, true);
}]);