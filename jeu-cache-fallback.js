/*
	par Ludwik : Parc naturel des Alpilles, jeu du puzzle
	Gaëtan Langhade - Interfacteur
	avril 2015
*/


;"use strict";

var parametres = {

	largeur: 1900,
	hauteur: 1080,
	projoLargeur: 120,

	accessons: "audio/chants/",

	delai1: 1000,

	pictureClears: [3,4],

	collection: window.oiseaux, //cf. jeu-fiches.oiseaux.js

	t: ["* ", "<br>(", ")"],

	re: [/path/i]
}
delete window.oiseaux;







$(function () {
	"use strict";

	var $w = $(window),
		$b = $("body"),
		$slidePrev = $("#slidePrev"),
		$slideNext = $("#slideNext"),
		$LAgTitle = $("#LAgTitle"),
		LAgTitle = $LAgTitle.html(),
		$caption = $("#hasCaption"),
		$cargo = $("#hasCargo"),
		cargo = $cargo.get(0),
		$stage = $("#stage"),
		stage = $stage.get(0),

		$lamp = $("#lamp"),
		$bolge = $("#bolge"),

		sounds = {},
		game = {
			total: parseInt($b.data("total"), 10),
			currnt: parseInt($b.data("current"), 10),
			inclass: $b.data("inclass"),
			locInit: [],
			init: -1,
			hash: null,
			booster: 1,
			first: false,
			already: []
			// gHeight: null,
			// displayRatio: null,
			// gPos: null,
			// touchPoint: null,
			// $load: null
		};

	$caption.data("active", -1);

	commonLAg.msieUp11 === false
	&& (commonLAg.reload = true); //on resize: behaviour of the menu on tactile devices

	commonLAg.msie == 9
	&& $b.addClass("msie9");

	$w.on({
		resize: function () {
			"use strict";
			$cargo.attr("style", "");
			var infoDim = stage.getBoundingClientRect(); //cf. svg width() on Google Chrome
			$cargo.css("width", Math.round(infoDim.width));
			game.gHeight = infoDim.height;
			game.displayRatio = parametres.hauteur / game.gHeight;
			game.gPos = $cargo.offset();
	}	})
	.trigger("resize");







//Generics methods for loading and sliding ----------------------------------------------------------------------------
	game.linkup = function (n) { //to target the index of previous or next view (n is direction: -1 for previous, 1 for next)
		"use strict";
		return n == 1 ?
			(game.currnt == game.total ? 1 : game.currnt + 1) //next
			:
			(game.currnt == 1 ? game.total : game.currnt - 1); //previous
	}

	game.preload = function () { //to preload main picture for previous and next view
		"use strict";
		var images = [
			$("<img>", { src: commonLAg.sourceCache[0] + game.linkup(-1) + commonLAg.sourceCache[1]}),
			$("<img>", { src: commonLAg.sourceCache[0] + game.linkup(1) + commonLAg.sourceCache[1]})
	];	}

	game.playable = function () { //load sounds of each view
		"use strict";
		$(".path-map" + game.currnt + " path").each(function () {
			"use strict";
			var k = $(this).attr("id");
			sounds[k] = parametres.accessons + k;
		});
		commonLAg.Sound.init(sounds);
	}

	game.readable = function () { //too clear view: modify style of text
		"use strict";
		$b.removeClass("picture-clear");
		parametres.pictureClears.forEach(function (val) {
			"use strict";
			game.currnt == val
			&& $b.addClass("picture-clear");
	});	}

	game.toForeshadow = function () { //when sliding between views: last, adapt style and load sounds
		"use strict";
		game.readable();
		if (game.already[game.currnt])
			return;
		game.already[game.currnt] = true;
		sounds = {};
		game.playable();
	}







//Load and slide ----------------------------------------------------------------------------
	function goInside () { //get view from url
/* if correct location.hash in url:
	first, get view from hash
else, if data-current > 1 in jeu-cache-frame.html:
	after, get view from data-current
else:
	endly, get the first view */
		"use strict";
		(location.hash.indexOf("#" + commonLAg.vue) == -1)
		&& (game.currnt > 1)
		&& (game.currnt <= game.total)
		&& (location.hash = "#" + commonLAg.vue + game.currnt);
		var hash = commonLAg.goInside(game.total);
		(	hash
			&& (game.currnt = hash)
			&& $b.removeClass("has-lading1") //not same synchonization than with frame
			&& $slideNext.trigger("click")	)
		|| game.preload();
	}

	function toSlide (dir) { //to slide to previous or next view
		"use strict";

		empty();

		++game.init; //care to several clicks
		game.locInit[game.init] = [0, 0];
		$b.removeClass(game.inclass + game.currnt)
		.addClass("transit");
		game.currnt = game.linkup(dir);
		toSlide.inload(game.init, game.currnt, { //load main picture of the view
			comp: [0, 1],
			srce: [0, 1]
		});
		toSlide.inload(game.init, game.currnt, { //load background picture of the view
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
		$bolge.attr("xlink:href", commonLAg.sourceCache[0] + pic + commonLAg.sourceCache[2]);
		$stage.attr("xlink:href", commonLAg.sourceCache[0] + pic + commonLAg.sourceCache[1]);
		/* addEventListener for svg <image>
		http://stackoverflow.com/questions/11390830/is-it-possible-to-listen-image-load-event-in-svg
		but complete for svg <image> ?
		.on({
			load: function nit () {
				"use strict";

		}	}).get(0).complete
		&& $stage.trigger("load"); */
		if (gin < game.init)
			return;
		$b.removeClass("transit")
		.addClass(game.inclass + pic);
		$LAgTitle.html(LAgTitle + " (" + pic + "/" + game.total + ")");
		game.toForeshadow();
		game.preload(); //preload main picture for previous and next view
		location.hash = commonLAg.vue + pic;
		toSlide.hlink();
	};
	toSlide.hlink = function () { //added later
		"use strict";
		$slidePrev.attr("href", "#" + commonLAg.vue + game.linkup(-1));
		$slideNext.attr("href", "#" + commonLAg.vue + game.linkup(1));
	}

	function empty () { //when sliding between views: first, erase information 
		"use strict";
		var active = $caption.data("active");
		active !== -1
		&& commonLAg.sounds[active].turnoff();
		$caption.data("active", -1)
		.html("")
		.removeClass("active");
	}







//To play ----------------------------------------------------------------------------
	function toInform (active) {
		"use strict";
		if ($caption.data("active") === active)
			return;

		(	active !== -1
			&& commonLAg.sounds[active].turnon()
			&& $caption.html(
				parametres.t[0]
				+ parametres.collection[active].Nom
				+ parametres.t[1]
				+ parametres.collection[active].Groupe
				+ parametres.t[2]
			)
			.addClass("active")	)
		|| commonLAg.sounds[$caption.data("active")].turnoff()
		&& $caption.html("")
		.removeClass("active");

		$caption.data("active", active);
	}
	toInform.viaMouse = function () {
		"use strict";
		toInform(this.tagName.search(parametres.re[0]) > -1 ? $(this).attr("id") : -1);
	}






//When picture is loading : init, prepare, events ----------------------------------------------------------------------------
	game.$load = $("<img>").on({
		/* addEventListener for svg <image>
		http://stackoverflow.com/questions/11390830/is-it-possible-to-listen-image-load-event-in-svg
		but complete for svg <image> ? */
		load: function () {
			"use strict";
			game.$load.off("load");

			if (game.first === true)
				return;


		/* init */

			game.first = true;
			game.already[game.currnt] = true;

			$("#hasBathpool").css(commonLAg.transition(parametres.delai1, "opacity"));
			$b.removeClass("transit")
			.addClass("init");


		/* prepare */

			game.playable(); //load sounds
			game.readable(); //added later: only one clear picture is the specification, and no time for other solutions :)


		/* events */

			$slidePrev.on({ //link to previous view
				click: function (ze, next) {
					"use strict";
					if (ze.ctrlKey || ze.shiftKey || ze.metaKey || ze.which == 2)
						return;
					ze.preventDefault();
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

			$cargo.on({
				mousemove: function (ze, ev) {
					"use strict";
					ze.preventDefault();
					ze = ev || ze;
					var x = Math.round((ze.pageX - game.gPos.left) * game.displayRatio - parametres.projoLargeur),
						y = Math.round((ze.pageY - game.gPos.top) * game.displayRatio - parametres.projoLargeur * game.booster);

					$lamp.attr("transform", "translate(" + x + "," + y + ")");
					$bolge.attr("transform", "translate(" + (-x) + "," + (-y) + ")");

					! ev
					&& toInform.viaMouse.call(ze.target);
			}	});

			commonLAg.touch
			&& ($cargo.stroking = function (ze) {
				"use strict";
				ze.preventDefault();

				var ore = ze,
					tactTouch = typeof ze.pageX == "number" && (ze.pageX > 0 || ze.pageY > 0) ? ze
					: typeof ze.touches[0].pageX == "number" && (ze.touches[0].pageX > 0 || ze.touches[0].pageY > 0) ? ze.touches[0]
					: typeof ze.changedTouches[0].pageX == "number" && (ze.changedTouches[0].pageX > 0 || ze.changedTouches[0].pageY > 0) ? ze.changedTouches[0] : null,
					active;

				if (tactTouch === null) //to do: check on a lot of tactile devices (touchanged ? touchtarget ?)
					return;

				$cargo.stroking.init = $cargo.stroking.init || (toInform.viaMouse = commonLAg.doNothing);

				/* mixt of events objects - because position() doesn't work with ze.touches[0] */
				if (tactTouch !== ze) {
					ore = {};
					for (var p in ze)
						ore[p] = ze[p];
					ore.pageX = tactTouch.pageX;
					ore.pageY = tactTouch.pageY;
				}

				game.booster = 2;
				$(this).trigger("mousemove", [ore]);

				game.touchPoint = document.elementFromPoint(ore.pageX, ore.pageY - parametres.projoLargeur / 2);
				toInform(game.touchPoint.tagName.search(parametres.re[0]) > -1 ? game.touchPoint.id : false);
			})
			&& ["touchstart", "touchmove"].forEach(function (val) {
				"use strict";
				cargo.addEventListener(val, $cargo.stroking, false); //http://stackoverflow.com/questions/16110124/can-you-get-svg-on-mobile-browser-accept-mouse-touch-events-i-cant
			});


		/* endly */

			goInside(); //adapt view from url or preload main picture for previous and next set

			$LAgTitle.html(LAgTitle + " (" + game.currnt + "/" + game.total + ")");
			toSlide.hlink();

	}	})
	.attr("src", commonLAg.sourceCache[0] + game.currnt + commonLAg.sourceCache[1]);
	game.$load.get(0).complete
	&& game.$load.trigger("load");

});
