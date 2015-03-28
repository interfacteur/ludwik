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



/*
 	event on #hasMess: move #hasPorthole

	event on #hasFigurembed: display of #hasCaption
		getting $figurembed.data("active")
		setting $caption.data("active")

	event on path: define #hasCaption
		setting $figurembed.data("active")

*/


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

//for manipulation from parent
	wpI.$b = $b;
	wpI.$cargo = $cargo;
	wpI.total = parseInt($b.data("total"), 10);
	wpI.currnt = parseInt($b.data("current"), 10);
	wpI.srce = $b.data("source").split(",");
	wpI.inclass = $b.data("inclass");




	wpI.empty = function () { //when sliding between views from parent: first, erase information 
		"use strict";
		var active = $caption.data("active");
		active
		&& commonLAg.sounds[active].turnoff();
		$figurembed.data("active", false);
		$caption.data("active", false)
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
		wpI.currnt == parametres.pictureClear
		&& $b.addClass("picture-clear")
		|| $b.removeClass("picture-clear");
	}

	function toBirdOver () { //fix information (text, sound) from "hover" bird
		"use strict";
		clearTimeout(game.tmt);
		$figurembed.data("active", $(this).attr("id"));
		return true;
	}

	function toBirdOut () { //erase information (text, sound) from "hover" bird
		"use strict";
		game.tmt = setTimeout(function () {
			"use strict";
			$figurembed.data("active", false);
	}, 125);	}

	function toReveal (ze) { //move light and actualize information about "hover" bird
		"use strict";

		var active = $figurembed.data("active");

		if ($b.hasClass("transit"))
			return;

		$porthole.data("pos-percent", 0)
		.position({
			of: ze,
			within: $mess
		});

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
	}

	function toSway () { //position of light on picture when resizing
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


	$cargo.on({ //init at first loading
		load: function () {
			"use strict";

			if (game.init === true)
				return;

			game.init = true;
			game.currnt[wpI.currnt] = true;

			$cargo.off("load"); //cf. jeu-cache.js

			commonLAg.msie == 9
			&& $b.addClass("msie9");

			$("#hasWaterline").css(commonLAg.transition(parametres.delai1, "opacity"));
			$b.addClass("init");
			$porthole.data("pos-percent", 0);

			game.w = $cargo.width();
			game.h = $cargo.height();
			game.mi = $porthole.width() / 2;

			playable(); //load sounds

			readable(); //added later: only one clear picture is the specification, and no time for other solutions :)

			$path.on({ //MOUSE: fix information (text, sound) from "hover" bird
				mousemove: toBirdOver,
				mouseout: toBirdOut
			});

			$mess.on({ //MOUSE: move light and display "hover" bird information
				mouseover: toReveal,
				mousemove: toReveal
			});

			commonLAg.touch != false //TACTILE
			&& (commonLAg.stroking = function (ze) {
				"use strict";
				ze.preventDefault();

				! commonLAg.stroking.init
				&& $mess.off()
				&& $path.off()
				&& (commonLAg.stroking.init = true);

				// if (new Date().getTime() % 12 != 0)
				// 	return;

			/* fix information (text, sound) from "hover" bird */
				game.tactileP = document.elementFromPoint(ze.pageX, ze.pageY); //element pseudo hover

				game.tactileP.tagName.toLowerCase() == "path"
				&& toBirdOver.call(game.tactileP)
				|| toBirdOut();

			/* move light and display "hover" bird information */
				toReveal(ze);
			})
			&& ("touchstart touchmove".split(" ")).forEach(function (val) {
				document.addEventListener(val, commonLAg.stroking, false);
			});


			$w.on({
				resize: toSway,
			});

			wpI.ready = true;


	}	}).get(0).complete && $cargo.trigger("load");


});

