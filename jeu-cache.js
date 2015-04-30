/*
	pour Ludwik : Parc naturel des Alpilles, jeu du cache cache
	Gaëtan Langhade - Interfacteur
	février-mars 2015
*/


;"use strict";

var parametres = {
	delai1: 150,
	iframe: {},
	fallback : "jeu-cache-fallback.html"
}




//COMING BEFORE jeu-cache-frame.js
;$(function () {
	"use strict";

	var $b = $("body"),
		pI = parametres.iframe,
		$slidePrev = $("#slidePrev"),
		$slideNext = $("#slideNext"),
		// $hasBath = $("#hasBath"),
		$LAgTitle = $("#LAgTitle"),
		LAgTitle = $LAgTitle.html(),
		game = {
			locInit: [],
			init: -1,
			hash: null,
			// $iframe: $hasBath.contents() //no ability to get width of elements via contents nor via contentDocument / contentWindow.document
			fallback: {
				def: $b.css("background-attachment")
		}	};

/*		commonLAg.msie == 9
		|| (true && true)
		&& (location.href = parametres.fallback); //doesn't work on MSIE 9 - virtual */
		if (	commonLAg.msie == 9
				|| (	$b.css("background-attachment", "fixed") //http://stackoverflow.com/questions/14115080/detect-support-for-background-attachment-fixed
						&& (game.fallback.test = $b.css("background-attachment"))
						&& $b.css("background-attachment", game.fallback.def)
						&& game.fallback.test != "fixed"	)	)
			location.href = parametres.fallback;
		delete game.fallback;







	(function nt () { //title of the page
		"use strict";
		if (pI.ready !== true)
			return setTimeout(nt, parametres.delai1);
		$LAgTitle.html(LAgTitle + " (" + pI.currnt + "/" + pI.total + ")");
		toSlide.hlink();
	})();







//Manipulation from iframe ----------------------------------------------------------------------------
	pI.preload = function () { //to preload main picture for previous and next view
		"use strict";
		var images = [
			$("<img>", { src: commonLAg.sourceCache[0] + linkup(-1) + commonLAg.sourceCache[1]}),
			$("<img>", { src: commonLAg.sourceCache[0] + linkup(1) + commonLAg.sourceCache[1]})
	];	}

	pI.goInside = function () { //get view from url
/* if correct location.hash in url:
	first, get view from hash
else, if data-current > 1 in jeu-cache-frame.html:
	after, get view from data-current
else:
	endly, get the first view */
		"use strict";
		(location.hash.indexOf("#" + commonLAg.vue) == -1)
		&& (pI.currnt > 1)
		&& (pI.currnt <= pI.total)
		&& (location.hash = "#" + commonLAg.vue + pI.currnt);
		var hash = commonLAg.goInside(pI.total);
		(	hash
			&& (pI.currnt = hash)
			&& $slideNext.trigger("click")	)
		|| pI.preload();
	}







	function linkup (n) { //to target the index of previous or next view (n is direction: -1 for previous, 1 for next)
		"use strict";
		return n == 1 ?
			(pI.currnt == pI.total ? 1 : pI.currnt + 1) //next
			:
			(pI.currnt == 1 ? pI.total : pI.currnt - 1); //previous
	}

	function toSlide (dir) { //to slide to previous or next view
		"use strict";

		pI.empty();

		++game.init; //care to several clicks
		game.locInit[game.init] = [0, 0];

		pI.$b.removeClass(pI.inclass + pI.currnt)
		.addClass("transit");
		pI.currnt = linkup(dir);
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
				location.hash = commonLAg.vue + pic;
				toSlide.hlink();
		}	}).get(0).complete
		&& pI.$cargo.trigger("load");
	};
	toSlide.hlink = function () { //added later
		"use strict";
		$slidePrev.attr("href", "#" + commonLAg.vue + linkup(-1));
		$slideNext.attr("href", "#" + commonLAg.vue + linkup(1));
	}
	$slidePrev.on({ //link to previous view
		click: function (ze, next) {
			"use strict";
			if (ze.ctrlKey || ze.shiftKey || ze.metaKey || ze.which == 2)
				return;
			ze.preventDefault();
			if (pI.ready !== true)
				return;
			toSlide(next ? 1 : -1);
	}	});
	$slideNext.on({ //link to next view
		click: function (ze) {
			"use strict";
			if (ze.ctrlKey || ze.shiftKey || ze.metaKey || ze.which == 2)
				return;
			ze.preventDefault();
			$slidePrev.trigger("click", [true]);
	}	});

	parametres.ready = true;

	commonLAg.msieUp11 === false
	&& (commonLAg.reload = true); //on resize: behaviour of the menu on tactile devices


});

