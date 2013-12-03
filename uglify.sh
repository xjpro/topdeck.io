uglifyjs /root/topdeck.io/js/vendor/jquery.min.js ^
		/root/topdeck.io/js/vendor/lodash.min.js ^
		/root/topdeck.io/js/vendor/jstat.min.js ^
		/root/topdeck.io/js/vendor/snap.svg-min.js ^
		/root/topdeck.io/js/vendor/cookies.min.js ^
		/root/topdeck.io/js/vendor/ZeroClipboard.min.js ^
		/root/topdeck.io/js/vendor/bootstrap.min.js ^
		/root/topdeck.io/js/vendor/angular.js ^
		/root/topdeck.io/js/vendor/angular-resource.min.js ^
		-o /root/topdeck.io/js/topdeck-vendor.min.js ^
		-m -c
uglifyjs /root/topdeck.io/js/app/all-cards.js ^
		/root/topdeck.io/js/app/deckstats.js ^
		/root/topdeck.io/js/app/deckstats-graphing.js ^
		/root/topdeck.io/js/app/services/CardLookup.js ^
		/root/topdeck.io/js/app/services/Deck.js ^
		/root/topdeck.io/js/app/services/User.js ^
		/root/topdeck.io/js/app/controllers/CardSelectionController.js ^
		/root/topdeck.io/js/app/controllers/ChartController.js ^
		/root/topdeck.io/js/app/controllers/HeaderController.js ^
		-o js/topdeck.min.js ^
		-m -c