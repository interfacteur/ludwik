/*
	par Ludwik : Parc naturel des Alpilles, jeu du puzzle
	Gaëtan Langhade - Interfacteur
	février-mars 2015
*/


"use strict";

var commonLAg = { };

$(function () {
	"use strict";

	var $b = $("body"),
		$head = $("#lifeAlpillesGame");

	commonLAg.transition = function (delai, prop) {
		"use strict";
		var pr = prop ? prop + " " : "";
		return {
			"-webkit-transition": pr + delai + "ms",
			"-moz-transition": pr + delai + "ms",
			"-o-transition": pr + delai + "ms",
			"transition": pr + delai + "ms"
	}	};

	commonLAg.webkit = parseInt($("#webkit").css("left"), 10) < -4444;

	//http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
		/* http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
		https://github.com/Modernizr/Modernizr/issues/548 */
	(commonLAg.touch = "ontouchstart" in window ? "ontouchstart"
		: "onmsgesturechange" in window ? "onmsgesturechange" : false) //MSIE 10 - ?
	&& (commonLAg.tactile = function (clbck) {
		"use strict";
		var callback = clbck;
		// commonLAg.touch = "load";
		window.addEventListener(commonLAg.touch, function setHasTouch () {
			"use strict";
			callback();
			window.removeEventListener(commonLAg.touch, setHasTouch);
		}, false);
	});
	/* //how to use:
	commonLAg.tactile &&
	commonLAg.tactile(function () {
		"use strict";
	});
	//will be actived at first screen tactile contact */


	$("#iconLAgMenu").on({
		click: function (ze) {
			"use strict";
			ze.preventDefault();
			$head.toggleClass("active");
	}	});
	$(".other, .resources").css(commonLAg.transition(333), "color");






});


