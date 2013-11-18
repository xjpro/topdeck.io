app.controller("CardSelectionController", ["$scope", "$filter", "Deck", "CardLookup", function($scope, $filter, Deck, CardLookup) {
    $scope.mode = "List";
    $scope.hasChanged = false;
    $scope.allCards = CardLookup.all();
    $scope.deck = Deck;
    $scope.count = function() {
        return _(Deck.cards).pluck('quantity').reduce(function(sum, num) { return sum + num; });
    };
    $scope.max = 30;

    $scope.classFilters = ["Warrior", "Shaman", "Rogue", "Paladin", "Hunter", "Druid", "Warlock", "Mage", "Priest"];
    $scope.classFilter = "Warrior";
    $scope.costFilters = ["All", "0", "1", "2", "3", "4", "5", "6", "7+"];
    $scope.costFilter = "All";

    $scope.currentPage;
    $scope.cardPages = [];
    $scope.cardPagesIndex = 0;
    $scope.cardPagesCount = 0;
    $scope.cardPageSize = 21;

    $scope.findCard = function(name) {
        return _.find(Deck.cards, function(otherCard) { return otherCard.name == name; });
    }

    $scope.addCard = function(card) {

        if($scope.count() >= $scope.max) return;

        var existingCard = $scope.findCard(card.name);
        if(existingCard) {
            if(existingCard.quantity < 2) {
                existingCard.quantity++;
            }
        } else {
            card.quantity = 1;
            Deck.cards.push(card);
            Deck.cards = _.sortBy(Deck.cards, "cost");
        }
    };

    $scope.removeCard = function(card) {
        var existingCard = $scope.findCard(card.name);
        if(existingCard) {
            existingCard.quantity = Math.max(0, existingCard.quantity-1);
            if(existingCard.quantity == 0) {
                Deck.cards = _.reject(Deck.cards, function(otherCard) { return otherCard.name == card.name; });
            }
        }
    };

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
        Deck.cards = _.filter(Deck.cards, function(card) { return !card.hero || card.hero == newClass});
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
            var card = CardLookup.find(name);

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