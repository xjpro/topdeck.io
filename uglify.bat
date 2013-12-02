call uglifyjs ^
		js/vendor/jquery.min.js ^
		js/vendor/lodash.min.js ^
		js/vendor/jstat.min.js ^
		js/vendor/snap.svg-min.js ^
		js/vendor/cookies.min.js ^
		js/vendor/ZeroClipboard.min.js ^
		js/vendor/bootstrap.min.js ^
		js/vendor/angular.js ^
		js/vendor/angular-resource.min.js ^
		-o js/topdeck-vendor.min.js ^
		-m -c
		
call uglifyjs ^
		js/app/all-cards.js ^
		js/app/deckstats.js ^
		js/app/deckstats-graphing.js ^
		js/app/services/CardLookup.js ^
		js/app/services/Deck.js ^
		js/app/services/User.js ^
		js/app/controllers/CardSelectionController.js ^
		js/app/controllers/ChartController.js ^
		js/app/controllers/HeaderController.js ^
		-o js/topdeck.min.js ^
		-m -c