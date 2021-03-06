/*
	par Ludwik : Parc naturel des Alpilles, jeu du puzzle
	Gaëtan Langhade - Interfacteur
	février-mars 2015
*/




;"use strict";

var commonLAg = {
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
		$head = $("#lifeAlpillesGame"),
		$menus = $(".other"),
		$bilingual = $("#bilingual a"),
		delay1 = 1250;







//Get view from url, and bilingual hash ----------------------------------------------------------------------------
	commonLAg.goInside = function (n) {
		"use strict";
		var hash = location.hash.toLowerCase().split("#" + commonLAg.vue)[1],
			ret = false;
		! hash
		&& (location.hash = commonLAg.vue + 1)
		|| (hash.length === 1
			&& (hash = Number(hash)) //if 0 should stop
			&& hash > 1
			&& hash <= n
			&& (ret = hash - 1)	);
		return ret;
	}
	$bilingual.on({
		click: function () {
			"use strict";
			var hash = location.hash,
				href = $(this).attr("href");
			hash
			&& $(this).attr("href", href + hash);
	}	});







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
	&& (commonLAg.tactile = function (clbck, trigger) { //clbck() executed one time on first touch event, or on load if trigger
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
			//this.stall = commonLAg.doNothing; //cf. http://stackoverflow.com/questions/12183011/javascript-redefine-and-override-existing-function-body
			this.readdom();
		})
		&& (commonLAg.Sound.prototype.stall = commonLAg.doNothing) //cf. http://stackoverflow.com/questions/12183011/javascript-redefine-and-override-existing-function-body
		&& (commonLAg.Sound.first = -1)
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
					$(this).off("play");
					if (commonLAg.Sound.first === true)
						return;
					setTimeout(function () {
						"use strict";
						if (commonLAg.Sound.first === true)
							return;
						commonLAg.Sound.first = true;
						commonLAg.Sound.prototype.stall = function (n) {
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
		&& (commonLAg.Sound.prototype.turnon = function () {
			"use strict";
			this.audio.play();
			if (this.key === commonLAg.Sound.active)
				return;
			this.readable === true
			&& (commonLAg.Sound.active = this.key)
			&& this.audio.play();
			return this;
		})
		&& (commonLAg.Sound.prototype.turnoff = function () {
			"use strict";
			if (commonLAg.Sound.active !== false && this.readable === true) {
				! this.audio.paused
				&& this.audio.pause();
				commonLAg.Sound.active = false;
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

	commonLAg.Sound.active = false;





//CSS transitions ----------------------------------------------------------------------------
	commonLAg.transition = function (delai, prop) {
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







//No support or partial support of 'vh'
	//http://stackoverflow.com/questions/28139752/ios-vh-on-viewport-orientation-change
	//http://stackoverflow.com/questions/20046337/css3-viewport-height-does-not-seem-to-work-on-ipad
	commonLAg.menuResize = function () {
		"use strict";
		setTimeout(function () {
			var h = $b.height(),
				h13 = h * .13,
				h78 = Math.floor(h13 * .78),
				h04 = Math.floor(h * .04);
			$(".life-alpilles-games, [class*='LAg-']").css({
				height: Math.floor(h13) + "px",
				"line-height": Math.floor(h13) + "px"
			});
			$menus.css({
				height: h78 + "px",
				"line-height": h78 + "px"
			});
			$(".lag-order").css({
				height: h04,
				"line-height": h04
			});
		}, delay1 / 1.5);
	}

//Pb with displaying menu
	$head.height() != $(".LAg-other:eq(0)").height()
	&& (commonLAg.remenu = true)
	&& commonLAg.menuResize();

//Menu on resizing: without actualization of 'vh' in tactile, MSIE, and others ----------------------------------------------------------------------------
	(commonLAg.touch != false || commonLAg.remenu)
	&& commonLAg.tactile(function () { //menu height when resizing (or rotate iPad) on and after the first touch event
		"use strict";
		commonLAg.tactileResize = function () { //
			"use strict";
			clearTimeout(commonLAg.tmt);
			commonLAg.tmt = setTimeout(commonLAg.menuResize, delay1);
		}
		$w.on({
			resize:  commonLAg.tactileResize
	});	}, commonLAg.msieUp11 || commonLAg.remenu || commonLAg.debug)
	&& (commonLAg.menuLoading = function () { //menu height when resizing (or rotate iPad) before the first touch event
		"use strict";
		(typeof commonLAg.tactile.init === "undefined" //before the first touch event
		|| commonLAg.reload === true) //jeu-cache
		&& document.location.reload()
		|| $w.off("resize", commonLAg.menuLoading); //after the first touch event, or if commonLAg.tactile has parameter "trigger"
	})
	&& $w.on({
		resize: commonLAg.menuLoading //if resizing before first touch event
	});

//No .slide-track on Puzzle on iPad
	$(".puzzle").length
	&& setTimeout(function () {
		"use strict";
		$head.css("overflow", "visible");
	}, 1000);







//Displaying short or long menu ----------------------------------------------------------------------------
	$("#iconLAgMenu").on({ //responsive menu
		click: function (ze) {
			"use strict";
			ze.preventDefault();
			$head.toggleClass("active");
	}	});
	$menus.css(commonLAg.transition(333, "color"));







//Preload main and background picture for jeu-cache view 1
	! $b.hasClass("has")
	&& $w.on({
		load: function () {
			"use strict";
			var images = [
				$("<img>", { src: commonLAg.sourceCache[0] + 1 + commonLAg.sourceCache[1]}),
				$("<img>", { src: commonLAg.sourceCache[0] + 1 + commonLAg.sourceCache[2]})
	];	}	});



});
