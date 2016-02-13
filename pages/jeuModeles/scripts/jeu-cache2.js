/*
	Ludwik et Gaëtan Langhade - Interfacteur
	avril 2015
*/


;"use strict";

;var parametres = {

	largeur: 1900,
	hauteur: 1080,
	projoLargeur: 120,

	accessons: "audio/chants/",

	collection: window.sujets, //cf. jeu-fiches.sujets.js

	t: ["* ", "<br>(", ")"],

	re: [/path/i]
}
delete window.sujets;


$(function () {
	"use strict";

	var $w = $(window),
		$caption = $("#hasCaption"),
		$stage = $("#hasCargo"),
		stage = $stage.get(0),
		svgRef = $("#stage").find("image:eq(0)").get(0),
		$lamp = $("#lamp"),
		$bolge = $("#bolge"),
		sounds = {},
		game = {
			booster: 1,
			// gHeight: null,
			// displayRatio: null,
			// gPos: null,
			// touchPoint: null
		};

	$caption.data("active", false);

	$("path").each(function () {
		"use strict";
		var k = $(this).attr("id");
		sounds[k] = parametres.accessons + k;
	});
	commonLg.Sound.init(sounds);


	$w.on({
		resize: function () {
			"use strict";
			$stage.attr("style", "");
			var infoDim = svgRef.getBoundingClientRect(); //cf. svg width() on Google Chrome
			$stage.css("width", Math.floor(infoDim.width));
			game.gHeight = infoDim.height;
			game.displayRatio = parametres.hauteur / game.gHeight;
			game.gPos = $stage.offset();
	}	})
	.trigger("resize");

	function toInform (active) {
		"use strict";
		if ($caption.data("active") === active)
			return;

		(	active
			&& commonLg.sounds[active].turnon()
			&& $caption.html(
				parametres.t[0]
				+ parametres.collection[active].Nom
				+ parametres.t[1]
				+ parametres.collection[active].Groupe
				+ parametres.t[2]
			)
			.addClass("active")	)
		|| commonLg.sounds[$caption.data("active")].turnoff()
		&& $caption.html("")
		.removeClass("active");

		$caption.data("active", active);
	}
	toInform.viaMouse = function () {
		"use strict";
		toInform(this.tagName.search(parametres.re[0]) > -1 ? $(this).attr("id") : false);
	}


	$stage.on({
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

	commonLg.touch
	&& ($stage.stroking = function (ze) {
		"use strict";
		ze.preventDefault();

		var ore = ze,
			tactTouch = typeof ze.pageX == "number" && (ze.pageX > 0 || ze.pageY > 0) ? ze
			: typeof ze.touches[0].pageX == "number" && (ze.touches[0].pageX > 0 || ze.touches[0].pageY > 0) ? ze.touches[0]
			: typeof ze.changedTouches[0].pageX == "number" && (ze.changedTouches[0].pageX > 0 || ze.changedTouches[0].pageY > 0) ? ze.changedTouches[0] : null,
			active;

		if (tactTouch === null) //to do: check on a lot of tactile devices (touchanged ? touchtarget ?)
			return;

		$stage.stroking.init = $stage.stroking.init || (toInform.viaMouse = commonLg.doNothing);

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
		stage.addEventListener(val, $stage.stroking, false); //http://stackoverflow.com/questions/16110124/can-you-get-svg-on-mobile-browser-accept-mouse-touch-events-i-cant
	});

});




