/*
	pour Ludwik : Parc naturel des Alpilles, jeu du cache cache
	Gaëtan Langhade - Interfacteur
	février-mars 2015
*/


;var parametres = {

	delai1: 1000,
	delai2: 150,

	parent: "../accueil.html"

}


/* 150311

au survol : sinon au drag and drop
	proto : DnD et position ?
	au click : trigger drag ? si oui bon pour puzzle plus que pour ici


zones sensibles ? sans doute via SVG
	avec un setTimeout

sons : soit mp3 et ogg, soit mp3 et soundmanager ?


idées : comment fondu ?


*//*
IE 9 et terminaux mobiles

détection et alternative ?




to do : sans iframe ?
	en partant de l'iframe en question et en introduisant une zone supérieure relative...
semble impossible à cause de background-attachment: fixed


OK
to do : controle de chargement des frames
to do : formulaire outils
to do : autres pages
idées : hallo

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
		$porthole = $("#hasPorthole"),
		toPoint,
		game = {
			init: false,
			// tmt: null,
			// w: $cargo.width(),
			// mi: $porthole.width() / 2

			// h: $cargo.height()
			// ratio: null,
		};
	// game.ratio = game.w / game.h;

	wpI.$b = $b;
	wpI.$cargo = $cargo;
	wpI.total = parseInt($b.data("total"), 10);
	wpI.currnt = parseInt($b.data("current"), 10);
	wpI.srce = $b.data("source").split(",");
	wpI.inclass = $b.data("inclass");

	$porthole.data("pos-percent", 1);

	(	! commonLAg.tactile
		&& (toPoint = function (ze) { //light on picture
			"use strict";
			if ($b.hasClass("transit"))
				return;
			$porthole.data("pos-percent", 0)
			.position({
				of: ze,
				collision: "fit",
				within: $mess
	});	})	)
	|| ((toPoint = function () {})
		&& 	commonLAg.tactile(function () {
				"use strict";
				$porthole.draggable({
					addClasses: false,
					cursorAt: {
						bottom: 0,
						left: game.mi
	}	});	})	)

	$cargo.on({
		load: function () {
			"use strict";
			if (game.init === true)
				return;
			game.init = true;

			$cargo.off("load");

			$("#hasWaterline").css(commonLAg.transition(parametres.delai1, "opacity"));
			$b.addClass("init");
			game.w = $cargo.width();
			game.mi = $porthole.width() / 2;

			$mess.on({
				mouseover: toPoint,
				mousemove: toPoint
			});

			$w.on({
				resize: sway
			});

			wpI.ready = true;
	}	}).get(0).complete && $cargo.trigger("load");


	function sway () { //position of light on picture when resizing
		"use strict";
		if ($b.hasClass("transit")) {
			return $b.addClass("resize")
			&& (game.tmt = setTimeout(function () {
				"use strict";
				$b.removeClass("resize");
			}, parametres.delai2));
		}
		game.w = $cargo.width();
		game.mi = $porthole.width() / 2;
		clearTimeout(game.tmt);
		sway.swing = sway.swing || {
			routine: function (n, method) {
				"use strict";
				game.tmt = setTimeout(function () {
					"use strict";
					$b.removeClass("resize");
					if (! sway.memo)
						return;
					sway.swing.treat(0, "adapt");
					delete sway.memo;
				}, parametres.delai2);
				$b.addClass("resize");
				sway.swing.treat(n, method);
			},
			treat: function (n, method) {
				"use strict";
				$porthole.data("pos-percent") !== n
				&& $porthole.data("pos-percent", n)
				.css(sway.swing[method]());
			},
			leftRatio: function () {
				"use strict";
				return parseInt($porthole.css("left"), 10) / game.w;
			},
			topRatio: function () {
				"use strict";
				return parseInt($porthole.css("top"), 10) / $cargo.height();
			},
			react: function () {
				"use strict";
				return {
					"left": sway.swing.leftRatio() * 100 + "%",
					"top":  sway.swing.topRatio() * 100 + "%"
			}	},
			prepare: function () {
				"use strict";
				sway.memo = [sway.swing.leftRatio(), sway.swing.topRatio()];
				return { }
			},
			adapt: function () {
				"use strict";
				return {
					"left": game.w * sway.memo[0],
					"top":  $cargo.height() * sway.memo[1]
			}	},
			adjust:
				wp.commonLAg.webkit ? function () {
					"use strict";
					sway.swing.routine(-1, "prepare");
				}
				: function () {
					"use strict";
					sway.swing.routine(1, "react")
		}	};
		sway.swing.adjust();
	}

});



