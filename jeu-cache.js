/*
	pour Ludwik : Parc naturel des Alpilles, jeu du cache cache
	Gaëtan Langhade - Interfacteur
	février-mars 2015
*/

var parametres = {
	delai1: 150,
	iframe: {}
}




//COMING BEFORE jeu-cache-frame.js
;$(function () {
	"use strict";

	var pI = parametres.iframe,
		$w = $(window),
		$slidePrev = $("#slidePrev"),
		$slideNext = $("#slideNext"),
		$hasBath = $("#hasBath"),
		$LAgTitle = $("#LAgTitle"),
		LAgTitle = $LAgTitle.html(),
		game = {
			locInit: [],
			init: -1
			// $iframe: $hasBath.contents() //no ability to get width of elements via contents nor via contentDocument / contentWindow.document
		};

	(function nt () { //title of the page
		"use strict";
		if (pI.ready !== true)
			return setTimeout(nt, parametres.delai1);
		$LAgTitle.html(LAgTitle + " (" + pI.currnt + "/" + pI.total + ")");
	})();

	pI.linkup = function (n) { //to target the index of previous or next view (n is direction: -1 for previous, 1 for next)
		"use strict";
		return n == 1 ?
			(pI.currnt == pI.total ? 1 : pI.currnt + 1) //next
			:
			(pI.currnt == 1 ? pI.total : pI.currnt - 1); //previous
	}

	pI.preload = function () { //to preload main picture for previous and next view
		"use strict";
		var images = [
			$("<img>", { src: commonLAg.sourceCache[0] + pI.linkup(-1) + commonLAg.sourceCache[1]}),
			$("<img>", { src: commonLAg.sourceCache[0] + pI.linkup(1) + commonLAg.sourceCache[1]})
	];	}

	function toSlide (dir) { //to slide to previous or next view
		"use strict";

		pI.empty();

		++game.init; //care to several clicks
		game.locInit[game.init] = [0, 0];

		pI.$b.removeClass(pI.inclass + pI.currnt)
		.addClass("transit");
		pI.currnt = pI.linkup(dir);
		toSlide.inload(game.init, pI.currnt, { //load main picture of the view
			comp: [0, 1],
			srce: [0, 1]
		});
		toSlide.inload(game.init, pI.currnt, { //load background picture of the view
			comp: [1, 0],
			srce: [0, 2]
	});	}
	toSlide.inload = function (gin, pic, args) { //load the 2 pictures before displaying view
		"use strict";
		if (gin < game.init)
			return;
		var image = $("<img>", { src: commonLAg.sourceCache[args.srce[0]] + pic + commonLAg.sourceCache[args.srce[1]]}),
			nit = game.locInit[gin];
		image.on({
			load: function () {
				"use strict";
				if (gin < game.init)
					return;
				++nit[args.comp[0]] === 1 //be sure that twice main and background pictures are loaded
				&& nit[args.comp[1]] > 0
				&& toSlide.transit(gin, pic);
		}	}).get(0).complete
		&& image.trigger("load");
	}
	toSlide.transit = function (gin, pic) { //to display previous / next view
		"use strict";
		pI.$cargo.attr("src", commonLAg.sourceCache[0] + pic + commonLAg.sourceCache[1])
		.on({
			load: function nit () {
				"use strict";
				if (gin < game.init || nit.init)
					return;
				nit.init = true;
				pI.$b.removeClass("transit")
				.addClass(pI.inclass + pic);
				$LAgTitle.html(LAgTitle + " (" + pic + "/" + pI.total + ")");
				pI.playable();
				pI.preload(); //preload main picture for previous and next view
		}	}).get(0).complete
		&& pI.$cargo.trigger("load");
	};
	$slidePrev.on({ //link to previous view
		click: function (ze, next) {
			"use strict";
			ze.preventDefault();
			if (pI.ready !== true)
				return;
			toSlide(next ? 1 : -1);
	}	});
	$slideNext.on({ //link to next view
		click: function (ze) {
			"use strict";
			ze.preventDefault();
			$slidePrev.trigger("click", [true]);
	}	});

	parametres.ready = true;

	commonLAg.reload = true; //on resize: behaviour of the menu on tactile devices

});

