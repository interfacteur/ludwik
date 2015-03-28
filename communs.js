/*
	par Ludwik : Parc naturel des Alpilles, jeu du puzzle
	Gaëtan Langhade - Interfacteur
	février-mars 2015
*/



/* to do
accès par ancre aux jeux N des tailles et cache-cache
	d'où ouverture possible dans une nouvelle fenêtre à partir des flèches dans menu ? */



"use strict";

var commonLAg = {
	re: {
		iaye: /(iphone|ipod|ipad)/,
		msie: /trident.*rv[ :]*11\./
	},
	nav: navigator.userAgent.toLowerCase(),
	doNothing: function () { },
	returnTrue: function () { //to string logical conditions
		"use strict";
		return true;
}	};






$(function () {
	"use strict";

	var $w = $(window),
		$b = $("body"),
		$head = $("#lifeAlpillesGame");







//Compatibility ----------------------------------------------------------------------------
	commonLAg.webkit = parseInt($("#webkit").css("left"), 10) < -4444;


	commonLAg.iaye = commonLAg.nav.match(commonLAg.re.iaye); //http://www.sitepoint.com/jquery-detect-mobile-devices-iphone-ipod-ipad/


	commonLAg.msie = 0 /*@cc_on + parseInt(commonLAg.nav.split("msie")[1], 10) @*/;
	(commonLAg.nav.indexOf("trident") > 0)
	&& (commonLAg.msie === 0)
	&& (commonLAg.msie = !! commonLAg.nav.match(commonLAg.re.msie) ? 11 : 0);
	commonLAg.msieLowerOrEqualAt = function (version) {
		return 1 / (commonLAg.msie - 1) > 1 / parseInt(version, 10);
	}

	commonLAg.msieUp11 = commonLAg.msieLowerOrEqualAt(11);
	commonLAg.msieUp11
	&& $b.addClass("msie");


commonLAg.debug = false;
	//http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
		/* http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
		https://github.com/Modernizr/Modernizr/issues/548 */
	commonLAg.tactile = commonLAg.doNothing;
	(commonLAg.touch = "ontouchstart" in window ? "ontouchstart"
		: "onmsgesturechange" in window ? "onmsgesturechange" : commonLAg.debug) //MSIE 10 11
	&& (commonLAg.tactile = function (clbck, trigger) { //actived at first touch event
		"use strict";
		var callback = clbck;
		if (commonLAg.tactile.init === true || trigger === true) {
			commonLAg.tactile.init = true;
			callback();
		}
		else
			window.addEventListener(commonLAg.touch.substring(2), function setHasTouch () {
				"use strict";
				commonLAg.tactile.init = true;
				callback();
				window.removeEventListener(commonLAg.touch, setHasTouch);
			}, false);
		return true;
	});







//Pseudo-class Sound ----------------------------------------------------------------------------
	commonLAg.Sound = function () {
		"use strict";
		if (! this instanceof commonLAg.Sound)
			throw new Error("Attention à l'instanciation");
		this.audio = true;
	};
	(	(commonLAg.audioCompat = (function () {
			"use strict";
			var audio = document.createElement("audio");
			return !! audio.canPlayType ?
				(	audio.canPlayType("audio/mpeg") ?
						".mp3" : audio.canPlayType('audio/ogg; codecs="vorbis"') ? ".ogg" : false	)
				: false;
		})())
		&& (commonLAg.Sound = function (srce, key) {
			"use strict";
			if (! this instanceof commonLAg.Sound)
				throw new Error("Attention à l'instanciation");
			this.key = key;
			this.srce = srce + commonLAg.Sound.audioCompat;
			this.audio = new Audio(this.srce);
			this.readable = ! commonLAg.iaye ? false : true; //loaded when playing: http://www.ibm.com/developerworks/library/wa-ioshtml5/
			this.stall = commonLAg.doNothing;
			this.readdom();
		})
		&& (commonLAg.Sound.prototype.readdom = function () {
			"use strict";
			$(this.audio).data("obj", this)
			.on({
				canplay: function () {
					"use strict";
					$(this).data("obj").readable = true;
				},
				play: function () {
					"use strict";
					var t = this,
						tob = $(t).data("obj");
					$(t).off("play");
					setTimeout(function () {
						"use strict";
						(tob.readable === true)
						&& (tob.stall = function (n) {
							"use strict";
							t.currentTime = n;
						});
					}, 750); //to do: how to adjust this duration?
				},
				error: function () {
					"use strict";
					$(this).data("obj").readable = false;
		}	});	})
		&& (commonLAg.Sound.prototype.turnon = function () {
			"use strict";
			this.readable === true
			&& this.audio.play();
			return this;
		})
		&& (commonLAg.Sound.prototype.turnoff = function () {
			"use strict";
			if (this.readable === true) {
				! this.audio.paused
				&& this.audio.pause();
				this.stall(0);
			}
			return this;
		})	)
	|| (commonLAg.Sound.prototype.turnon = function () {
		"use strict";
		return this;
	})
	&& (commonLAg.Sound.prototype.turnoff = commonLAg.Sound.prototype.turnon);

	commonLAg.Sound.audioCompat = commonLAg.audioCompat;
	delete commonLAg.audioCompat;

	commonLAg.Sound.init = function (sd) { //sd : object of sounds path without extension (mp3 and ogg)
		"use strict";
		commonLAg.sounds = commonLAg.sounds || [];
		for (var p in sd)
			commonLAg.sounds[p] = new commonLAg.Sound(sd[p], p);
	}







//CSS transitions ----------------------------------------------------------------------------
	commonLAg.transition = function (delai, prop) {
		"use strict";
		var pr = prop ? prop + " " : "";
		return {
			"-webkit-transition": pr + delai + "ms",
			"-moz-transition": pr + delai + "ms",
			"-o-transition": pr + delai + "ms",
			"transition": pr + delai + "ms"
	}	};







//Menu on resizing: without actualization of 'vh' in tactile, MSIE ----------------------------------------------------------------------------
	commonLAg.touch != false
	&& $b.addClass("likelyTactile")
//http://stackoverflow.com/questions/28139752/ios-vh-on-viewport-orientation-change
//http://stackoverflow.com/questions/20046337/css3-viewport-height-does-not-seem-to-work-on-ipad
	&& commonLAg.tactile(function () {
		"use strict";
		commonLAg.tactileResize = function () { //menu size when rotate iPad
			"use strict";
			if (commonLAg.reload === true) //jeu-cache
				return document.location.reload();
			clearTimeout(commonLAg.tmt);
			commonLAg.tmt = setTimeout(function () {
				"use strict";
				var h = $b.height(),
					h13 = h * .13,
					h78 = Math.floor(h13 * .78),
					h66 = Math.floor(h13 * .66),
					h04 = Math.floor(h * .04);
				$(".life-alpilles-games, [class*='LAg-']").css({
					height: Math.floor(h13) + "px",
					"line-height": Math.floor(h13) + "px"
				});
				$(".other, .resources").css({
					height: h78 + "px",
					"line-height": h78 + "px"
				});
				$(".slide-track").css({
					height: h66 + "px",
					"line-height": h66 + "px"
				});
				$(".lag-order").css({
					height: h04,
					"line-height": h04
				});
			}, 1250);
		}
		$w.on({
			resize:  commonLAg.tactileResize
	});	}, commonLAg.msieUp11 || commonLAg.debug)
	&& (commonLAg.reload = function () { //before first touch event
		"use strict";
		typeof commonLAg.tactile.init === "undefined"
		&& document.location.reload()
		|| $w.off("resize", commonLAg.reload);
	})
	&& $w.on({
		resize: commonLAg.reload
	});




//Displaying short or long menu ----------------------------------------------------------------------------
	$("#iconLAgMenu").on({ //responsive menu
		click: function (ze) {
			"use strict";
			ze.preventDefault();
			$head.toggleClass("active");
	}	});
	$(".other, .resources").css(commonLAg.transition(333, "color"));




});
