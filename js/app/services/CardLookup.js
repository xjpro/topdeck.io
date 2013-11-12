app.service("CardLookup", [function() {
    this.lookup = function(name) {
        return _.find(hearthstoneCards, function(card) { return card.name == name; });
    };
    this.all = function() {
        return _.sortBy(hearthstoneCards, function(card) { return card.name; });
    };
}]);