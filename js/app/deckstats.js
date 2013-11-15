Math.roundTo = function(num, places) {
    return +(Math.round(num + "e+" + places)  + "e-" + places);
};

window.app = angular.module("deckstats", ["ngResource"])
    .run(["$rootScope", "$window", function($rootScope, $window) {
        angular.element($window).bind("resize",function(){
            $rootScope.windowWidth = $window.outerWidth;
            $rootScope.$apply("windowWidth");
        });
    }]);