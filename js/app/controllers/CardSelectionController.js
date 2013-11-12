app.controller("CardSelectionController", ["$scope", "$filter", "Deck", "CardLookup", function($scope, $filter, Deck, CardLookup) {
    $scope.mode = "List";
    $scope.hasChanged = false;
    $scope.allCards = CardLookup.all();

    $scope.deck = Deck;
    $scope.addCard = $scope.deck.addCard;
    $scope.removeCard = $scope.deck.removeCard;

    $scope.classFilters = ["Warrior", "Shaman", "Rogue", "Paladin", "Hunter", "Druid", "Warlock", "Mage", "Priest"];
    $scope.classFilter = "Warrior";
    $scope.costFilters = ["All", "0", "1", "2", "3", "4", "5", "6", "7+"];
    $scope.costFilter = "All";

    $scope.currentPage;
    $scope.cardPages = [];
    $scope.cardPagesIndex = 0;
    $scope.cardPagesCount = 0;
    $scope.cardPageSize = 21;

    $scope.$watch("classFilter + costFilter", function() {
        var heroCards = _($filter("cost")(_.filter($scope.allCards, function(card) { return card.hero == $scope.classFilter; }), $scope.costFilter))
            .sortBy(function(card) { return card.cost; }).value();
        var generalCards = _($filter("cost")(_.filter($scope.allCards, function(card) { return !card.hero; }), $scope.costFilter))
            .sortBy(function(card) { return card.cost; }).value();

        $scope.cardPages = [];

        for(var i = 0; i < heroCards.length; i += $scope.cardPageSize) {
            var page = heroCards.slice(i, i + $scope.cardPageSize);
            $scope.cardPages.push(page);
        }

        for(var i = 0; i < generalCards.length; i += $scope.cardPageSize) {
            var page = generalCards.slice(i, i + $scope.cardPageSize);
            $scope.cardPages.push(page);
        }

        $scope.cardPagesCount = $scope.cardPages.length;
        $scope.cardPagesIndex = 0;
        $scope.currentPage = $scope.cardPages[$scope.cardPagesIndex];
    });
    $scope.$watch("cardPagesIndex", function() {
        $scope.currentPage = $scope.cardPages[$scope.cardPagesIndex];
    });
    $scope.$watch("classFilter", function(newClass) {
        Deck.filterHeroCards(newClass);
    });

    $scope.saveRaw = function() {
        if(!$scope.rawSelection) return;

        $scope.cards = []; // empty current

        var cardItems = $scope.rawSelection.split('\n');
        _.each(cardItems, function(item) {
            var matches = /^\s*(\d{1})[a-zA-Z]?\s(.+)/.exec(item);
            if(!matches) return true;

            var quantity = matches[1];
            var name = matches[2];
            var card = CardLookup.lookup(name);

            if(card) {
                $scope.cards.push(card);
            }
        });

        // and sort
        $scope.hasChanged = false;
    };

    $scope.$watch(function() { return $scope.deck.cards; }, function(currentCards) {
        $scope.rawSelection = "";
        _.each(currentCards, function(card) {
            $scope.rawSelection += card.quantity + " " + card.name + "\n";
        });
    }, true);
}])
.filter("cost", function() {
    return function(cards, cost) {
        if(cost == "All") return cards;
        return _.filter(cards, function(card) { return Math.min(7, card.cost) == parseInt(cost); });
    };
});