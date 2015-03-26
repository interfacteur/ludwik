/*
	pour Ludwik : Parc naturel des Alpilles, jeu du cache cache
	Gaëtan Langhade - Interfacteur
	février-mars 2015
*/


;var parametres = {

	delai1: 1000,
	delai2: 150,
	delai3: 240,

	parent: "../jeu-cache.html",

	accessons: "audio/chants/",

	pictureClear: 3,

	t: ["* ", "<br>(", ")"]

}


/* 150318
zones sensibles ? sans doute via SVG
	avec un setTimeout

sons : soit mp3 et ogg, soit mp3 et soundmanager ?

iframe recursive

	proto : DnD et position ?
	au click : trigger drag ? si oui bon pour puzzle plus que pour ici

sans iframe ?
	en partant de l'iframe en question et en introduisant une zone supérieure relative...
	semble impossible à cause de background-attachment: fixed
	mais bg position fixed calculé sur body ?


*//*
IE 9 et terminaux mobiles

détection et alternative ?


OK
to do : controle de chargement des frames
to do : formulaire outils
to do : autres pages
idées : hallo
au survol : sinon au drag and drop


BUG OK
G Chrome le top de $porthole quand est relatif;
*/


$(function annm () {
	"use strict";

	var wp = window.parent,
		commonLAg = wp.commonLAg;

	if (wp === window)
		return document.location.href = parametres.parent;

	if (typeof wp.parametres == "undefined" || wp.parametres.ready !== true)
		return setTimeout(annm, 500);

	var wpI = wp.parametres.iframe,
		$w = $(window),
		$b = $("body"),
		$cargo = $("#hasCargo"),
		$mess = $("#hasMess"),
		$caption = $("#hasCaption"),
		$figurembed = $("#hasFigurembed"),
		$porthole = $("#hasPorthole"),
		$path = $("path"),
		sounds = {},
		game = {
			init: false,
			currnt: [],
			// tmt: null,
			// w: $cargo.width(),
			// h: $cargo.height(),
			// mi: $porthole.width() / 2,

			// ratio: null,
		};
	// game.ratio = game.w / game.h;

	wpI.$b = $b;
	wpI.$cargo = $cargo;
	wpI.total = parseInt($b.data("total"), 10);
	wpI.currnt = parseInt($b.data("current"), 10);
	wpI.srce = $b.data("source").split(",");
	wpI.inclass = $b.data("inclass");



/*
 	event on #hasMess: move hasPorthole

	event on #hasFigurembed: display of hasCaption
		getting $figurembed.data("active")
		setting $caption.data("active")
	event on path: define hasCaption
		setting $figurembed.data("active")


*/


	wpI.empty = function () {
		"use strict";
		var active = $caption.data("active");
		active
		&& commonLAg.sounds[active].turnoff();
		$figurembed.data("active", false);
		$caption.data("active", false)
		.html("")
		.removeClass("active");
	}
	wpI.playable = function () {
		"use strict";
		readable();
		if (game.currnt[wpI.currnt])
			return;
		game.currnt[wpI.currnt] = true;
		sounds = {};
		playable();
	}
	function readable () {
		"use strict";
		wpI.currnt == parametres.pictureClear
		&& $b.addClass("picture-clear")
		|| $b.removeClass("picture-clear");
	}
	function playable () {
		"use strict";
		$(".path-map" + wpI.currnt + " path").each(function () {
			"use strict";
			var k = $(this).attr("id");
			sounds[k] = parametres.accessons + k;
		});
		commonLAg.Sound.init(sounds);
	}

	$porthole.data("pos-percent", 1);

	function toPoint (ze) { //light on picture: mouse devices
		"use strict";
		if ($b.hasClass("transit"))
			return;



		// (	! toPoint.yet


		// 	&& delete commonLAg.tactile
		// 	&&	((	$porthole.draggable("instance")
		// 			&& $porthole.draggable("disable")	)
		// 		|| true	)
		// 	&& (toPoint.yet = true)	);


		$porthole.data("pos-percent", 0)
		.position({
			of: ze,
			within: $mess
	});	}

/*
	toPoint.init = function () { //light on picture: between mouse devices and tactile devices
		"use strict";
		$mess.off("mouseover")
		.on({
			mousemove: toPoint
	});	}
	commonLAg.tactile
	&& commonLAg.tactile(function () { //light on picture: tactile devices
		"use strict";
		$porthole.draggable({
			addClasses: false,
			cursorAt: {
				bottom: 0,
				left: game.mi
	}	});	});

*/

	function sway () { //position of light on picture when resizing
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

	$path.on({ //information (text, sound) about hover birds
		touchmove: function () {
			"use strict";
			clearTimeout(game.tmt);
			$figurembed.data("active", $(this).attr("id"));
		},
		mousemove: function () {
			"use strict";
			clearTimeout(game.tmt);
			$figurembed.data("active", $(this).attr("id"));
		},
		// touchend: function () {
		// 	"use strict";
		// 	game.tmt = setTimeout(function () {
		// 		"use strict";
		// 		$figurembed.data("active", false);
		// },
		// touchleave: function () {
		// 	"use strict";
		// 	game.tmt = setTimeout(function () {
		// 		"use strict";
		// 		$figurembed.data("active", false);
		// },
		mouseout: function () {
			"use strict";
			game.tmt = setTimeout(function () {
				"use strict";
				$figurembed.data("active", false);
	});	}	});

	$figurembed.on({
		touchmove: function () {
			"use strict";
			$figurembed.trigger("mousemove");
		},
		mousemove: function () {
			"use strict";
			var active = $figurembed.data("active");
			if ($caption.data("active") === active)
				return;
			(	active
				&& commonLAg.sounds[active].turnon()
				&& $caption.html(
					parametres.t[0]
					+ oiseaux[active].Nom
					+ parametres.t[1]
					+ oiseaux[active].Groupe
					+ parametres.t[2]
				)
				.addClass("active")	)
			|| commonLAg.sounds[$caption.data("active")].turnoff()
			&& $caption.html("")
			.removeClass("active");
			$caption.data("active", active);
	}	});



	$cargo.on({ //init at first loading
		load: function () {
			"use strict";

			if (game.init === true)
				return;

			var demi = $b.width() / 2;

			game.init = true;
			game.currnt[wpI.currnt] = true;

			$cargo.off("load"); //cf. jeu-cache.js

			$("#hasWaterline").css(commonLAg.transition(parametres.delai1, "opacity"));
			$b.addClass("init");

			game.w = $cargo.width();
			game.h = $cargo.height();
			game.mi = $porthole.width() / 2;

			commonLAg.msie = 9
			&& $b.addClass("msie9");

			playable(); //load sounds

			readable(); //added later: only one clear picture is the specification, and no time for other solutions :)

			// ! commonLAg.tactile
			// && (toPoint.yet = true)
			// && 
			$mess.on({
				mouseover: toPoint,
				mousemove: toPoint,
				touchstart: toPoint,
				touchmove: toPoint
			});
/*			|| $mess.on({
				mouseover: toPoint.init //any versions of Chrome with commonLAg.tactile AND some iPhones with mouseover ?
			}); */

			$w.on({
				resize: sway,
			});

			wpI.ready = true;

	}	}).get(0).complete && $cargo.trigger("load");

});



