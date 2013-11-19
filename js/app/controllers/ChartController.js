app.controller("ChartController", ["$scope", "Deck", function($scope, Deck) {

    $scope.count = function() {
        return _(Deck.cards).pluck('quantity').reduce(function(sum, num) { return sum + num; }) || 0;
    };
    $scope.showDrawChance = true;
    $scope.showLineAttack = true;
    $scope.showLineHealth = true;
    var turns = 10;
    var startingHand = 3;
    var deckSize = 30;

    $scope.$watch(function() { return $scope.count() + $scope.showDrawChance + $scope.showLineAttack + $scope.showLineHealth; }, function() {

        //console.log(Deck.cards);

        var minionCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var cardCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        _.each(Deck.cards, function(card) {
            cardCounts[Math.min(turns, card.cost)] += card.quantity;
            if(card.type == "Minion") {
                minionCounts[Math.min(turns, card.cost)] += card.quantity;
            }
        });

        $scope.graphData = {
            cardCounts: {
                all: cardCounts,
                minions: minionCounts,
                turnDrawPercentages: []
            },
            lines: []
        };

        if($scope.showDrawChance) { // Calculate curve smoothness
            var points = [];
            for(var i = 0; i <= turns; i++) {
                //jStat.hypgeom.pdf(0, 60, 4, 7) chance of drawing a 4/60 card on turn one (opening hand being 7 cards)
                // http://www.kibble.net/magic/magic10.php
                var cardsDrawn = startingHand + i;
                var chanceCardNotDrawn = jStat.hypgeom.pdf(0, deckSize, cardCounts[i], cardsDrawn);
                points.push(Math.round(Math.roundTo(1 - chanceCardNotDrawn, 2) * 100));
            }
            $scope.graphData.cardCounts.turnDrawPercentages = points;
        }

        if($scope.showLineAttack) {
            var points = [];
            for(var i = 0; i <= turns; i++) {

                var attack = 0;
                var minionCards = _.filter(Deck.cards, function(card) { return card.cost == i && card.type == "Minion" && card.attack; });
                _.each(minionCards, function(card) {
                    attack += card.attack * card.quantity;
                });
                points.push(attack);
            }
            $scope.graphData.lines.push({
                label: "Attack",
                type: "number",
                data: points,
                color: "red"
            });
        }

        if($scope.showLineHealth) {
            var points = [];
            for(var i = 0; i <= turns; i++) {

                var health = 0;
                var minionCards = _.filter(Deck.cards, function(card) { return card.cost == i && card.type == "Minion" && card.health; });
                _.each(minionCards, function(card) {
                    health += card.health * card.quantity;
                });
                points.push(health);
            }
            $scope.graphData.lines.push({
                label: "Minion health",
                type: "number",
                data: points,
                color: "green"
            });
        }

    }, true);
}]);