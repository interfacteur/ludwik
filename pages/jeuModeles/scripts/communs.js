/*
	Ludwik et Gaëtan Langhade - Interfacteur
	février-avril 2015
*/





;"use strict";

var commonLg = {
	vue: "vue",
	sourceCache: [
		"img/jeu-cache/vue","a.jpg","b.jpg" /* see also HTML code and CSS */
	],
	nav: navigator.userAgent.toLowerCase(),
	re: {
		iaye: /(iphone|ipod|ipad)/,
		msie: /trident.*rv[ :]*11\./
	},
	doNothing: function () { },
	returnTrue: function () { //to string logical conditions
		"use strict";
		return true;
}	};






$(function () {
	"use strict";

	var $w = $(window),
		$b = $("body"),
		$head = $("#allGames"),
		$menus = $(".other"),
		delay1 = 1250;







//Compatibility ----------------------------------------------------------------------------
	commonLg.webkit = parseInt($("#webkit").css("left"), 10) < -4444;


	commonLg.iaye = commonLg.nav.match(commonLg.re.iaye); //http://www.sitepoint.com/jquery-detect-mobile-devices-iphone-ipod-ipad/


	commonLg.msie = 0 /*@cc_on + parseInt(commonLg.nav.split("msie")[1], 10) @*/;
	(commonLg.nav.indexOf("trident") > 0)
	&& (commonLg.msie === 0)
	&& (commonLg.msie = !! commonLg.nav.match(commonLg.re.msie) ? 11 : 0);
	commonLg.msieLowerOrEqualAt = function (version) {
		return 1 / (commonLg.msie - 1) > 1 / parseInt(version, 10);
	}

	commonLg.msieUp11 = commonLg.msieLowerOrEqualAt(11);
	commonLg.msieUp11
	&& $b.addClass("msie");


commonLg.debug = false;
	//http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
		/* http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
		https://github.com/Modernizr/Modernizr/issues/548 */
	commonLg.tactile = commonLg.doNothing;
	(commonLg.touch = "ontouchstart" in window ? "ontouchstart"
		: "onmsgesturechange" in window ? "onmsgesturechange" : commonLg.debug) //MSIE 10 11
	&& (commonLg.tactile = function (clbck, trigger) { //clbck() executed one time on first touch event, or on load if trigger
		"use strict";
		var callback = clbck;
		if (commonLg.tactile.init === true || trigger === true) {
			commonLg.tactile.init = true;
			callback();
		}
		else
			window.addEventListener(commonLg.touch.substring(2), function setHasTouch () {
				"use strict";
				commonLg.tactile.init = true;
				callback();
				window.removeEventListener(commonLg.touch, setHasTouch);
			}, false);
		return true;
	});







//Pseudo-class Sound ----------------------------------------------------------------------------
	commonLg.Sound = function () {
		"use strict";
		if (! this instanceof commonLg.Sound)
			throw new Error("Attention à l'instanciation");
		this.audio = true;
	};
	(	(commonLg.audioCompat = (function () {
			"use strict";
			var audio = document.createElement("audio");
			return !! audio.canPlayType ?
				(	audio.canPlayType("audio/mpeg") ?
						".mp3" : audio.canPlayType('audio/ogg; codecs="vorbis"') ? ".ogg" : false	)
				: false;
		})())
		&& (commonLg.Sound = function (srce, key) {
			"use strict";
			if (! this instanceof commonLg.Sound)
				throw new Error("Attention à l'instanciation");
			this.key = key;
			this.srce = srce + commonLg.Sound.audioCompat;
			this.audio = new Audio(this.srce);
			this.readable = ! commonLg.iaye ? false : true; //loaded when playing: http://www.ibm.com/developerworks/library/wa-ioshtml5/
			//this.stall = commonLg.doNothing; //cf. http://stackoverflow.com/questions/12183011/javascript-redefine-and-override-existing-function-body
			this.readdom();
		})
		&& (commonLg.Sound.prototype.stall = commonLg.doNothing) //cf. http://stackoverflow.com/questions/12183011/javascript-redefine-and-override-existing-function-body
		&& (commonLg.Sound.first = -1)
		&& (commonLg.Sound.prototype.readdom = function () {
			"use strict";
			$(this.audio).data("obj", this)
			.on({
				canplay: function () {
					"use strict";
					$(this).data("obj").readable = true;
				},
				play: function () {
					"use strict";
					$(this).off("play");
					if (commonLg.Sound.first === true)
						return;
					setTimeout(function () {
						"use strict";
						if (commonLg.Sound.first === true)
							return;
						commonLg.Sound.first = true;
						commonLg.Sound.prototype.stall = function (n) {
							"use strict";
							this.readable === true
							&& (this.audio.currentTime = n);
						};
					}, 50); //to do: how to adjust this duration?
				},
				error: function () {
					"use strict";
					$(this).data("obj").readable = false;
		}	});	})
		&& (commonLg.Sound.prototype.turnon = function () {
			"use strict";
			this.audio.play();
			if (this.key === commonLg.Sound.active)
				return;
			this.readable === true
			&& (commonLg.Sound.active = this.key)
			&& this.audio.play();
			return this;
		})
		&& (commonLg.Sound.prototype.turnoff = function () {
			"use strict";
			if (commonLg.Sound.active !== false && this.readable === true) {
				! this.audio.paused
				&& this.audio.pause();
				commonLg.Sound.active = false;
				this.stall(0);
			}
			return this;
		})	)
	|| (commonLg.Sound.prototype.turnon = function () {
		"use strict";
		return this;
	})
	&& (commonLg.Sound.prototype.turnoff = commonLg.Sound.prototype.turnon);

	commonLg.Sound.audioCompat = commonLg.audioCompat;
	delete commonLg.audioCompat;

	commonLg.Sound.init = function (sd) { //sd : object of sounds path without extension (mp3 and ogg)
		"use strict";
		commonLg.sounds = commonLg.sounds || [];
		for (var p in sd)
			commonLg.sounds[p] = new commonLg.Sound(sd[p], p);
	}

	commonLg.Sound.active = false;





//CSS transitions ----------------------------------------------------------------------------
	commonLg.transition = function (delai, prop) {
		"use strict";
		var pr = "";
		switch (typeof prop) {
			case "string":
				pr = prop + " " + delai + "ms";
				break;
			case "object": //array
				prop.forEach(function (val) {
					"use strict";
					pr += val + " " + delai + "ms, "
				});
				pr = pr.substring(0, pr.length - 2);
				break;
			default:
				pr = delai + "ms";
		}
		return {
			"-webkit-transition": pr,
			"-moz-transition": pr,
			"-o-transition": pr,
			"transition": pr
	}	};







//Displaying short or long menu ----------------------------------------------------------------------------
	$("#iconLgMenu").on({ //responsive menu
		click: function (ze) {
			"use strict";
			ze.preventDefault();
			$head.toggleClass("active");
	}	});
	$menus.css(commonLg.transition(333, "color"));







//Preload main and background picture for jeu-cache
	! $b.hasClass("has")
	&& $w.on({
		load: function () {
			"use strict";
			var images = [
				$("<img>", { src: commonLg.sourceCache[0] + commonLg.sourceCache[1]}),
				$("<img>", { src: commonLg.sourceCache[0] + commonLg.sourceCache[2]})
	];	}	});



});
