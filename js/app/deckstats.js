Math.roundTo = function(num, places) {
    return +(Math.round(num + "e+" + places)  + "e-" + places);
};

// source: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
window.guid = function() {
    function _p8(s) {
        var p = (Math.random().toString(16)+"000000000").substr(2,8);
        return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p;
    }
    var dashedGuid = _p8() + _p8(true) + _p8(true) + _p8();
    //return dashedGuid.replace("-", "");
    console.log(dashedGuid);
    return dashedGuid;
}

window.app = angular.module("deckstats", ["ngResource"])
    .config(["$locationProvider", function($locationProvider) {
        $locationProvider.html5Mode(true);
    }])
    .run(["$rootScope", "$window", function($rootScope, $window) {
        angular.element($window).bind("resize",function(){
            $rootScope.windowWidth = $window.outerWidth;
            $rootScope.$apply("windowWidth");
        });
    }]);