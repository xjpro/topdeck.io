window.app = angular.module("deckstats", [])
    .run(["$rootScope", "$window", function($rootScope, $window) {
        angular.element($window).bind("resize",function(){
            $rootScope.windowWidth = $window.outerWidth;
            $rootScope.$apply("windowWidth");
        });
    }]);