app.controller("CardSelectionController", ["$scope", "$filter", "Deck", "CardLookup", function($scope, $filter, Deck, CardLookup) {
    $scope.mode = "Cards";
    $scope.allCards = CardLookup.all();
    $scope.deck = Deck;
    $scope.count = function() {
        return _(Deck.cards).pluck('quantity').reduce(function(sum, num) { return sum + num; }) || 0;
    };
    $scope.max = 30;

    $scope.heroOptions = ["Warrior", "Shaman", "Rogue", "Paladin", "Hunter", "Druid", "Warlock", "Mage", "Priest"];
    $scope.costFilters = ["All", "0", "1", "2", "3", "4", "5", "6", "7+"];
    $scope.costFilter = "All";
    $scope.textFilter = "";
    $scope.viewCost = "hero";

    $scope.currentPage;
    $scope.cardPages = [];
    $scope.cardPagesIndex = 0;
    $scope.cardPagesCount = 0;

    $scope.findCard = function(name) {
        return _.find(Deck.cards, function(otherCard) { return otherCard.name == name; });
    }

    $scope.addCard = function(card) {

        if($scope.count() >= $scope.max) return;

        var existingCard = $scope.findCard(card.name);
        if(existingCard) {
            if(existingCard.quality != 5 && existingCard.quantity < 2) {
                existingCard.quantity++;
                Deck.changes = true;
            }
        } else {
            card.quantity = 1;
            Deck.cards.push(card);
            Deck.changes = true;
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
            Deck.changes = true;
        }
    };

    $scope.$watch("mode", function(newMode) {
        $scope.cardPageSize = newMode == "Cards" ? 12 : 24;
    });

    $scope.$watch(function() { return $scope.mode + $scope.costFilter + $scope.textFilter + Deck.hero; }, function() {

        var heroCards = _($filter("cost")(_.filter($scope.allCards, function(card) { return card.hero == Deck.hero; }), $scope.costFilter))
            .sortBy(function(card) { return card.cost; }).value();
        var generalCards = _($filter("cost")(_.filter($scope.allCards, function(card) { return !card.hero; }), $scope.costFilter))
            .sortBy(function(card) { return card.cost; }).value();

        // filtering!
        if($scope.textFilter) {
            var regex = new RegExp($scope.textFilter, "i");
            var filter = function(card) {
                if(card.name && regex.test(card.name)) return true;
                if(card.description && regex.test(card.descrption)) return true;
                if($scope.textFilter == "legendary" && card.quality == 5) return true;
                return false;
            };

            heroCards = _.filter(heroCards, filter);
            generalCards = _.filter(generalCards, filter);
        }

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

        var firstCard = _.first($scope.currentPage);
        if(!firstCard) return;

        if(firstCard.hero == Deck.hero) {
            $scope.viewCost = 'hero';
        }
        else {
            $scope.viewCost = firstCard.cost >= 7 ? '7+' : firstCard.cost;
        }
    });
    $scope.$watch("deck.hero", function(newHero, oldHero) {
        if(!oldHero || angular.equals(newHero, oldHero)) return;
        Deck.cards = _.filter(Deck.cards, function(card) { return !card.hero || card.hero == newHero});
        Deck.changes = true;
    });
    $scope.$watch("deck.title", function(value, oldValue) {
        if(!oldValue || angular.equals(value, oldValue)) return;
        Deck.changes = true;
    });

    $scope.$watch("rawVisible", function (value, oldValue) {
        if(angular.equals(value, oldValue)) return;
        if(!$scope.rawSelection) return;

        Deck.cards = []; // empty current

        var cardItems = $scope.rawSelection.split('\n');
        _.each(cardItems, function(item) {
            var matches = /^\s*(\d{1})[a-zA-Z]?[\s|x](.+)/.exec(item);
            if(!matches) return true;

            var quantity = parseInt(matches[1]);
            var name = matches[2];
            var card = CardLookup.find(name);

            if(card) {
                if(card.hero && card.hero != Deck.hero) {
                    Deck.hero = card.hero;
                }

                for(var i = 0; i < quantity; i++) {
                    $scope.addCard(card);
                }
            }
        });
    });

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