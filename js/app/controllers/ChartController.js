app.controller("ChartController", ["$scope", "Deck", function($scope, Deck) {
    $scope.cards = Deck.cards;

    $scope.$watch(function() { return Deck.cards; }, function() {

        var turns = 10;
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
            },
            lines: []
        };

        var startingHand = 3;

        // Calculate curve smoothness
        var curveSmoothnessPoints = [];
        for(var i = 0; i <= turns; i++) {
            //jStat.hypgeom.pdf(0, 60, 4, 7) chance of drawing a 4/60 card one turn one (opening hand being 7 cards)
            var cardsDrawn = 3+i;
            var chanceCardWillNotInHand = jStat.hypgeom.pdf(0, 30, cardCounts[i], cardsDrawn);
            curveSmoothnessPoints.push(Math.max(0, chanceCardWillNotInHand));
        }

        $scope.graphData.lines.push({
            label: "Curve Smoothness",
            type: "percentage",
            data: curveSmoothnessPoints
        });

        // Calculate something else

    }, true);
}]);