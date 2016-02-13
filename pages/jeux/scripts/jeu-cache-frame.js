/*
	pour Ludwik : Parc naturel des Alpilles, jeu du cache cache
	Gaëtan Langhade - Interfacteur
	février-mars 2015
*/


;"use strict";

var parametres = {

	delai1: 1000,

	parent: "jeu-cache.html",

	accessons: "audio/chants/",

	collection: window.oiseaux, //cf. jeu-fiches.oiseaux.js

	pictureClears: [3,4],

	t: ["* ", "<br>(", ")"],

	re: [/path/i]
}
delete window.oiseaux;


//COMING AFTER jeu-cache.js
$(function annm () {
	"use strict";

/* 	event on #hasMess:

 		move #hasPorthole

 		to fix if "hover" bird :
	 		- mouse: get event.target
			- touch: get intersection of event coordinates with elements

		display (if "hover" bird) or not information on setting $caption.data("active")

*/


	var wp = window.parent;

	if (wp === window)
		return document.location.href = parametres.parent;

	if (typeof wp.parametres == "undefined" || wp.parametres.ready !== true)
		return setTimeout(annm, 500);

	var commonLAg = wp.commonLAg,
		wpI = wp.parametres.iframe,
		$w = $(window),
		$b = $("body"),
		$cargo = $("#hasCargo"),
		$mess = $("#hasMess"),
		mess = $mess.get(0),
		$caption = $("#hasCaption"),
		$figurembed = $("#hasFigurembed"),
		$porthole = $("#hasPorthole"),
		sounds = {},
		game = {
			posMy: "center",
			init: false,
			currnt: [],
			// w: $cargo.width(),
			// h: $cargo.height(),
			// mi: $porthole.width() / 2,

			// ratio: null,
		};
	// game.ratio = game.w / game.h;







//Manipulation from parent ----------------------------------------------------------------------------

	wpI.$b = $b;
	wpI.$cargo = $cargo;
	wpI.total = parseInt($b.data("total"), 10);
	wpI.currnt = parseInt($b.data("current"), 10);
	wpI.inclass = $b.data("inclass");

	wpI.empty = function () { //when sliding between views from parent: first, erase information 
		"use strict";
		var active = $caption.data("active");
		active !== -1
		&& commonLAg.sounds[active].turnoff();
		$caption.data("active", -1)
		.html("")
		.removeClass("active");
	}

	wpI.playable = function () { //when sliding between views from parent: last, adapt style and load sounds
		"use strict";
		readable();
		if (game.currnt[wpI.currnt])
			return;
		game.currnt[wpI.currnt] = true;
		sounds = {};
		playable();
	}







//Generics methods ----------------------------------------------------------------------------

	function playable () { //load sounds of each view
		"use strict";
		$(".path-map" + wpI.currnt + " path").each(function () {
			"use strict";
			var k = $(this).attr("id");
			sounds[k] = parametres.accessons + k;
		});
		commonLAg.Sound.init(sounds);
	}

	function readable () { //too clear view: modify style of text
		"use strict";
		$b.removeClass("picture-clear");
		parametres.pictureClears.forEach(function (val) {
			"use strict";
			wpI.currnt == val
			&& $b.addClass("picture-clear");
	});	}

	function toSway () { //position of light on picture when resizing - on tactile device, resizing reloads the page
		"use strict";
		game.w = $cargo.width();
		game.h = $cargo.height();
		game.mi = $porthole.width() / 2;
		$porthole.data("pos-percent") !== 1
		&& $porthole.data("pos-percent", 1)
		.css({
			"left": parseInt($porthole.css("left"), 10) / game.w * 100 + "%",
			"top":  parseInt($porthole.css("top"), 10) / $cargo.height() * 100 + "%"
	});	}

	function toShine (ze) { //move light
		"use strict";
		$porthole.data("pos-percent", 0)
		.position({
			of: ze,
			my: game.posMy,
			collision: "fit",
			within: $mess
	});	}

	function toInform (active) { //actualize information about "hover" bird
		"use strict";

		if ($caption.data("active") === active) //-1 vs false ? #9917 ($.data returns undefined for any stored false value) – jQuery Core - Bug Tracker (http://bugs.jquery.com/ticket/9917)
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

	function toRevealMouse (ze) { //MOUSE: manage moving light and actualizing information about "hover" bird
		"use strict";
		var t = ze.target;
		if ($b.hasClass("transit"))
			return;
		game.posMy = "center";
		toShine(ze);
		toInform(t.tagName.search(parametres.re[0]) < 0 ? -1 : $(t).attr("id"));
	}

	function toRevealTouch (ze, active) { //TOUCH: manage moving light and actualizing information about "hover" bird
		"use strict";
		if ($b.hasClass("transit"))
			return;
		game.posMy = "bottom";
		toShine(ze);
		toInform(active);
	}







//At first loading ----------------------------------------------------------------------------

	$cargo.on({
		load: function () {
			"use strict";
			$cargo.off("load"); //cf. jeu-cache.js

			if (game.init === true)
				return;


		/* init */

			game.init = true;
			game.currnt[wpI.currnt] = true;

			commonLAg.msie == 9
			&& $b.addClass("msie9");

			$("#hasWaterline").css(commonLAg.transition(parametres.delai1, "opacity"));
			$b.removeClass("transit")
			.addClass("init");

			$porthole.data("pos-percent", 0);
			$figurembed.add($caption).data("active", -1);

			game.w = $cargo.width();
			game.h = $cargo.height();
			game.mi = $porthole.width() / 2;


		/* prepare */

			playable(); //load sounds
			readable(); //added later: only one clear picture is the specification, and no time for other solutions :)


		/* events */

			$mess.on({ //MOUSE: move light and display "hover" bird information
				mouseover: toRevealMouse,
				mousemove: toRevealMouse,
			});

			commonLAg.touch != false //TOUCH
			&& (commonLAg.stroking = function (ze) {//replace $mess.on()
				"use strict";
				ze.preventDefault();
				var ore = ze,
					tactTouch = typeof ze.pageX == "number" && (ze.pageX > 0 || ze.pageY > 0) ? ze
					: typeof ze.touches[0].pageX == "number" && (ze.touches[0].pageX > 0 || ze.touches[0].pageY > 0) ? ze.touches[0]
					: typeof ze.changedTouches[0].pageX == "number" && (ze.changedTouches[0].pageX > 0 || ze.changedTouches[0].pageY > 0) ? ze.changedTouches[0] : null,
					active;

				if (tactTouch === null)
					return;

			/* mixt of events objects - because position() doesn't work with ze.touches[0] */
				if (tactTouch !== ze) {
					ore = {};
					for (var p in ze)
						ore[p] = ze[p];
					ore.pageX = tactTouch.pageX;
					ore.pageY = tactTouch.pageY;
				}

			// if (new Date().getTime() % 12 != 0) //to do: optimization?
			// 	return;

			/* fix information (text, sound) from "hover" bird
				with element pseudo hover - because event.target is without this precision on my tests on iPad */
				game.touchPoint = document.elementFromPoint(ore.pageX, ore.pageY - game.mi);
				active = game.touchPoint.tagName.search(parametres.re[0]) > -1 ? game.touchPoint.id : -1;

			/* move light and display "hover" bird information */
				toRevealTouch(ore, active);
			})
			&& ("touchstart touchmove".split(" ")).forEach(function (val) {
				"use strict";
				document.addEventListener(val, commonLAg.stroking, false);
			});

			$w.on({
				resize: toSway,
			});

			wpI.ready = true;

			wpI.goInside(); //adapt view from url or preload main picture for previous and next set

	}	}).get(0).complete && $cargo.trigger("load");


});

