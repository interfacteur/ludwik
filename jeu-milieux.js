/*
	par Ludwik : Parc naturel des Alpilles, jeu du puzzle
	Gaëtan Langhade - Interfacteur
	avril 2015
*/



/* Paramètres */
;var parametres = {

	messages: {
		dropConfirmation: "BRAVO",
		dropErreur: "FAUX",
		generique: " ne vit pas dans ce milieu.",
		engoulevent: " vit dans les garrigues et les bois clairsemés.",
		fauvette: " aime les mosaïques de différents milieux\xA0: prairies, pelouses, garrigues, vignes.",
		gdduc: " niche dans les milieux rocheux." 
	},

	largeur: 1372,
	hauteur: 1200,
	captionLargeur: 120,

	index: 10, //réglage minimal en z-index d'un élément droppé

	filtres: "css/filtres/filtres.svg",

	sons: {
		ok: "audio/confirmation/correct", //drop valide
		nok: "audio/confirmation/error" //drop invalide
	},

	delai0: 750,
	delai1: 100,
	delai2: 250,
	delai3: 4500,

	nbreZones: "zones"
}




;$(function () {
	"use strict";
	
	var $w = $(window),
		$b = $("body"),

		pieces = [],

		$pieces = $(".figure svg"),

		$game = $(".natenv"),
		$stage = $("#figure"),
		$puzzle = $("#figure svg"),
		$puzzleStage = $("#stage"),
		svgRef = $puzzleStage.find("image:eq(0)").get(0),
		$targetGroups,
		$drawer = $("#figures"),
		$walking = $(".walking"),
		$wlkg = $walking.eq(0),
		$figures = $(".figure"),
		$caption = $(".bird-info"),
		$piecesGroups = $(".figure g"),

		$message, //= $("#env-info"),

		game = {
			total: $drawer.html().split("</figure>").length - 1,
			ratio: parametres.largeur / parametres.hauteur,
			delays: [],
			// gWidth: null,
			// gHeight: null,
			// gPos: null,
			// displayW: null,
			// displayH: null
		}


	instancie.init = (function ii () {
		"use strict";

		game.total = $figures.length;
		$drawer.addClass(parametres.nbreZones + game.total);

		for (var p in parametres)
			p.indexOf("delai") == 0 && game.delays.push(parametres[p]);

		commonLAg.Sound.init(parametres.sons);

/* WEBKIT
	to call SVG filters from CSS */
		commonLAg.webkit
		&& (instancie.webkit = (function wk () {
			"use strict";
			$("<div>", { class: "hr" }).appendTo($b)
			.load(parametres.filtres);
			return wk;
		}) ())
		|| (instancie.webkit = commonLAg.doNothing);


/* TACTILE - & MSIE?
	lack of resources for CSS transitions */
		commonLAg.touch
		&& (commonLAg.transition = function () {
			"use strict";
			return {}
		});


		return ii;
	}) ();







//Pseudo-class Piece ----------------------------------------------------------------------------
	function Piece (ind) {
		"use strict";
		if (! this instanceof Piece)
			throw new Error("Attention à l'instanciation");

		this.instance = ind;

		this.tmt = [];
		this.tmt["manage"] = 0;
		this.tmt["click"] = 0;
		this.queue = commonLAg.doNothing;

		this.$walking = $walking.eq(ind);
		this.$figure = $figures.eq(ind);
		this.$figure.data("instance", ind);
		this.figure = this.$figure.get(0);

		this.$dom = $pieces.eq(ind);
		this.infos = this.$dom.attr("id");
		this.$message = this.toEstablish("forCaption");
		// this.nominal = window.oiseaux[this.infos].Nom;
		// this.pronominal = window.oiseaux[this.infos].Pronominal;
		this.intoCaption();

		this.SVGgroup = this.$dom.find("g")
		.attr("data-instance", ind)
		.get(0); //for this.toCalculate()

		this.$cloneGroup = this.toEstablish("toClone", "g")
		.data("instance", ind); //duplicate <g to create drop zone
		this.$cloneImage = this.toEstablish("toClone", "image"); //duplicate <image to play final
	}


/* Class methods */

	Piece.intoCaption = function () { //content of messages (in <figcaption)
		"use strict";
		pieces.forEach(function (val) {
			"use strict";
			val.intoCaption();
	});	}

	Piece.toErase = function () { //cut displaying of messages
		"use strict";
		Piece.intoCaption();
		$message.text("");
		$(".error").attr("class", "");
		$(".over, .bad-drop").removeClass("over bad-drop");
	}

	Piece.toReset = function () { //main: to display pieces at responsive way
		"use strict";
		var landscape = window.matchMedia("(min-aspect-ratio: 1/1)").matches,
			w, h, W, H;
		$walking.add($figures).add($pieces).removeAttr("style");
		Piece.toErase();
		w = $wlkg.width();
		W = w / game.ratio;
		h = $wlkg.height();
		H = h * game.ratio;
		$walking.css(
			w / game.gWidth < h / game.gHeight ?
			{
				"height": Math.round(W),
				"line-height": Math.round(W) + "px",
				"margin-top": landscape ?
					Math.round(($drawer.height() - game.total * W) / (game.total + 1))
					:
					Math.round(($drawer.height() - W) / 2)
			}
			:
			{
				"width": Math.round(H),
				"line-height": Math.round(h) + "px",
				"margin-left": landscape ?
					Math.round(($drawer.width() - H) / 2)
					:
					Math.round(($drawer.width() - game.total * H) / (game.total + 1))
		});
		game.displayW = $wlkg.width();
		game.displayH = $wlkg.height();
	}

	Piece.toCalculate = function () {
		"use strict";
		var infoDim = svgRef.getBoundingClientRect(); //cf. svg width() on Google Chrome
		game.gWidth = infoDim.width;
		game.gHeight = infoDim.height;
		commonLAg.webkit
		&& $puzzle.css({ //Google Chrome
			"width": infoDim.width,
			"height": infoDim.height
		});
		game.gPos = {
			left: infoDim.left,
			top: infoDim.top
		};
		$message.css({
			"left": infoDim.left,
			"top": infoDim.top
		});
		$game.removeClass("resize");
		Piece.toReset();
		pieces.forEach(function (val) {
			"use strict";
			val.toCalculate();
	});	}

	Piece.appreciate = function (cl) {
		"use strict";
		commonLAg.sounds[cl].turnon();
		return true;
	}



/* Class methods for jQuery UI events manager */

	Piece.toBrand = function (ev, ui) { //drag: start
		"use strict";
		var $t = $(this),
			instance = $t.data("instance"),
			piece = pieces[instance];

		Piece.toErase();

		clearTimeout(piece.tmt);
		game.drag = instance;
		piece.$walking.addClass("empty");

		$(".dragDropped .bird-info:not(.over):not(.repositionned)").each(function () { //add later :) responsive for figcaption
			"use strict";
			var $t = $(this),
				tHeight1 = $t.data("height"),
				tHeight2 = $t.innerHeight(),
				tTop = parseInt($t.css("top"), 10);
			$t.css("top", tTop + tHeight1 - tHeight2)
			.addClass("repositionned");
		});

		return $t.addClass("drag dragged")
		.css({
			"z-index": ++parametres.index //last dropped on the "top" of pieces
	});	}

	Piece.toBrandTactileIntro = function (ze) {
		"use strict";
		Piece.toBrandTactile(ze);
	}
	Piece.toBrandTactile = commonLAg.doNothing;
	commonLAg.tactile(function () { //jQuery UI Touch Punch neutralizing mouseover event when dragging?
		"use strict";

		$targetGroups //to do: to check on tactile-mouse MSIE
		&& $targetGroups.off("mousemove"); /* pb when reddraging a piece after hybrid drop on iPad */

		game.$tactileP1 = null;
		game.$tactileP0 = null;

		Piece.toBrandTactile = function (ze) {
			"use strict";

			game.$tactileP = $(document.elementFromPoint(ze.pageX, ze.pageY)); //element pseudo hover

		//if "hover" element is a piece
			game.$tactileP.prop("tagName").toLowerCase() == "path"
			&& game.$tactileP.parents($stage).length
			&& (game.$tactileP1 = game.$tactileP.parent("g"));

		//if same "hover" piece than previous, or if neither "hover" piece nor previous
			if (game.$tactileP1 == game.$tactileP0)
				return game.$tactileP1 = null;

		//if previous piece exists, it is no more "hover"
			game.$tactileP0 !== null
			&& game.$tactileP0.trigger("mouseout")
			&& (game.$tactileP0 = null);

		//if "hover" piece exists
			game.$tactileP1 != null
			&& game.$tactileP1.trigger("mouseover")
			&& (game.$tactileP0 = game.$tactileP1)
			&& (game.$tactileP1 = null);
	}	});

	Piece.toFix = function (ev, ui) { //drag: stop (coming after toCheck)
		"use strict";
		pieces[$(this).data("instance")].toPlace();
	}

	Piece.toCheck = function (ev, ui) { //drop: drop (coming before toFix)
		"use strict";
		Piece.toBrandTactile(ev); //too much latency on iPad and possibility of shift between dropped zones
		var indDrop = $stage.data("aera"),
			indDrag = ui.draggable.data("instance");
		switch (indDrop) {
			case -1:
				break;
			case indDrag:
				pieces[indDrag].queue = Piece.prototype.toFinish;
				break;
			default:
				$stage.data("drag", indDrag);
				pieces[indDrag].queue = Piece.prototype.toRestart;
	}	}

	Piece.toZoom = function () {
		"use strict";
		var magnusGlassRadial = parametres.hauteur / 10,
			$zoom = $("#zoom"),
			displayRatio, $round, $rounds;

		$w.on({
			resize: function () {
				"use strict";
				displayRatio = parametres.hauteur / game.gHeight;
		}	})
		.trigger("resize");

		Piece.toErase();
		$game.addClass("zoom");
		$(".bird-info").css("display", "none"); //to do: better ?

		$round = $puzzleStage.clone()
		.attr("id", "round")
		.attr("class", "round")
		.attr("transform", "matrix(2 0 0 2 0 0)")
		.prependTo($zoom);

		$round.find("g").remove();
		$rounds = $round.find("image")

		$puzzle.on({
			mousemove: function (ze) {
				"use strict";
				var x = Math.round((ze.pageX - game.gPos.left) * displayRatio - magnusGlassRadial),
					y = Math.round((ze.pageY - game.gPos.top) * displayRatio - magnusGlassRadial);
				$zoom.attr("transform", "translate(" + x + "," + y + ")");
// 				$round.attr("style", "left: " + (- 2 * x - magnusGlassRadial) + "; top: " + (- 2 * y - magnusGlassRadial))
// return;
// 				$round.attr("x", - 2 * x - magnusGlassRadial);
// 				$round.attr("y", - 2 * y - magnusGlassRadial);
// return;
				$rounds.attr("x", - 2 * x - magnusGlassRadial);
				$rounds.attr("y", - 2 * y - magnusGlassRadial);

	}	});	}

/*

	var svgLargeurAbs = 400,
		rayonLoupe = 40,
		zoom = document.getElementById("zoom"),
		rond = document.getElementById("rond"),
		svgRef = document.getElementById("ref"),
		svgCoord, svgRatio;

	function toMeasure() {
		"use strict";
		svgCoord = svgRef.getBoundingClientRect();
		svgRatio = svgLargeurAbs / svgCoord.width;
	}
	$(window).on({
		resize: toMeasure
	})
	.trigger("resize");

	$("svg").on({
		mousemove: function (ze) {
			"use strict";
			var x = (ze.clientX - svgCoord.left) * svgRatio - rayonLoupe,
				y = (ze.clientY - svgCoord.top) * svgRatio - rayonLoupe;

			zoom.setAttribute("transform", "translate(" + x + "," + y + ")");
			rond.setAttribute("x", - 2 * x - rayonLoupe);
			rond.setAttribute("y", - 2 * y - rayonLoupe);
	}	});




		<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
			viewBox="0 0 1372 1200">
			<defs>
				<clipPath id="magnusGlass">
					<circle cx="120" cy="120" r="120">
				</clipPath>
			</defs>
			<g class="stage" id="stage">
				<image xlink:href="img/jeu-milieux1/milieu1.jpg" width="100%" height="100%" class="levels" />
			</g>
			<g id="zoom" clip-path="url(#magnusGlass)" clip-rule="evenodd" transform="translate(-120,-120)">
				<circle cx="120" cy="120" r="120" /> 
			</g>
		</svg>

*/







/* Provisional prototype */

	Piece.toEstablish = { }
	Piece.toEstablish.toClone = function (tag) {
		"use strict";
		return this.$dom.find(tag)
			.clone()
			.appendTo($puzzleStage)
	}
	Piece.toEstablish.forCaption = function () {
		"use strict";
		var infos = window.oiseaux[this.infos];
		this.nominal = infos.Nom;
		this.pronominal = infos.Pronominal.substring(0,1).toUpperCase() + infos.Pronominal.substring(1);
		this.$walking.attr("data-infos", this.nominal);
		this.$dom.attr("title", this.nominal);
		this.$dom.attr("alt", this.nominal);
		return $("<figcaption>", {
			"class": "caption-info bird-info"
		}).appendTo(this.$figure);
	}
	Piece.prototype.toEstablish = function (meth, sup) {
		"use strict";
		return Piece.toEstablish[meth].call(this, sup);
	}


/* Prototype */

	Piece.prototype.toCalculate = function () {
		"use strict";

		var harvest = this.$cloneGroup.offset(),
			left = harvest.left - parametres.captionLargeur * 2 / 3,
			iHeight = this.$message.innerHeight(),
			top = harvest.top - iHeight - 6,
			infoGroup, infoSVG;
		left = Math.round(left > 0 ? left : 0);
		top =  Math.round(top > 0 ? top : 0);

		this.$dom.css({
			"width": game.gWidth,
			"height": game.gHeight
		});

		infoSVG = this.$dom.offset();
		infoGroup = this.SVGgroup.getBoundingClientRect();

		this.$figure.css({
			"width": Math.round(infoGroup.width + 6),
			"height": Math.round(infoGroup.height + 6)
		});
		this.$dom.css({
			"margin": - Math.round(-3 + infoGroup.top - infoSVG.top) + "px 0 0 -" + Math.round(-3 + infoGroup.left - infoSVG.left) + "px"
		});
		this.$message.data("height", iHeight)
		.css({
			"left": left,
			"top": top
		});

		this.$walking.removeClass("resizing");
	}

	Piece.prototype.intoCaption = function () {
		"use strict";
		this.$message.text(this.nominal);
	}

	Piece.prototype.manageDrag = function (state) {
		"use strict";
		try {
			this.$figure.draggable(state);
		} catch(e) {
			console.log("Same error than :\
			 'Error: cannot call methods on draggable prior to initialization;\
			 attempted to call method 'disable' jquery-....min.js (ligne 2, col. 1808)' ??");
	}	}

	Piece.prototype.getFromGroups = function () {
		"use strict";
		clearTimeout(this.tmt["manage"]);
		return this;
	}

	Piece.prototype.toPlace = function () {
		"use strict";

		game.drag = null;

		this.$figure.removeClass("drag");

		this.queue(game.delays[0]);
	}

	Piece.prototype.toFinish = function () {
		"use strict";
		var $f = this.$figure;
		this.queue = commonLAg.doNothing;

		Piece.appreciate("ok");

		$f.css(commonLAg.transition(game.delays[0], "opacity"))
		.addClass("dragDropped");

		this.$cloneGroup.attr("class", "g");

		this.$cloneImage.css(commonLAg.transition(game.delays[0], "opacity"))
		.attr("class", "image");

		$message.text(this.pronominal + parametres.messages[this.infos])
		.addClass("over");

		this.$message.text(parametres.messages.dropConfirmation)
		.addClass("over");

		$(".dragDropped").length == game.total
		&& setTimeout(Piece.toZoom, game.delays[3]);
	}

	Piece.prototype.toRestart = function () {
		"use strict";
		var zone = pieces[$stage.data("aera")];

		this.queue = commonLAg.doNothing;

		Piece.appreciate("nok");

		this.$figure.addClass("bad-drop");

		zone.$cloneGroup.attr("class", "error");

		$message.text(pieces[Number($stage.data("drag"))].pronominal + parametres.messages.generique)
		.addClass("over");

		zone.$message.text(parametres.messages.dropErreur)
		.addClass("over bad-drop");
	}







//Polyfills ----------------------------------------------------------------------------
	/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

	window.matchMedia || (window.matchMedia = function() {
		"use strict";

		// For browsers that support matchMedium api such as IE 9 and webkit
		var styleMedia = (window.styleMedia || window.media);

		// For those that don't support matchMedium
		if (!styleMedia) {
			var style	   = document.createElement('style'),
				script	  = document.getElementsByTagName('script')[0],
				info		= null;

			style.type  = 'text/css';
			style.id	= 'matchmediajs-test';

			script.parentNode.insertBefore(style, script);

			// 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
			info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

			styleMedia = {
				matchMedium: function(media) {
					var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

					// 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
					if (style.styleSheet) {
						style.styleSheet.cssText = text;
					} else {
						style.textContent = text;
					}

					// Test if media query is true or false
					return info.width === '1px';
				}
			};
		}

		return function(media) {
			return {
				matches: styleMedia.matchMedium(media || 'all'),
				media: media || 'all'
			};
		};
	}());







//Classical events ----------------------------------------------------------------------------
	instancie.classicalEvents = function () {
		"use strict";

		$w.on({
			resize: function () {
				"use strict";
				commonLAg.webkit
				&& $puzzle.removeAttr("style");
				$game.addClass("resize");
				$walking.addClass("resizing");
				clearTimeout(game.timt);
				game.timt = setTimeout(Piece.toCalculate, game.delays[2]);
		}	});

		$piecesGroups.on({
			mouseover: function () {
				"use strict";
				pieces[$(this).data("instance")].getFromGroups()
				.manageDrag("enable");
			},
			touchstart: function () {
				"use strict";
				$(this).trigger("mouseover");
			},
			mouseout: function () {
				"use strict";
				var piece = pieces[$(this).data("instance")].getFromGroups();
				piece.tmt["manage"] = setTimeout(function () {
					"use strict";
					piece.manageDrag("disable");
				}, game.delays[1]);
			},
			touchend: function () {
				"use strict";
				$(this).trigger("mouseout");
		}	});

		$targetGroups.on({
			mouseover: function (ze) {
				"use strict";

				var $t = $(this),
					cl,
					filigree;

				if ($t.data("full"))
					return $stage.data("aera", -1);

				$stage.data("aera", $t.data("instance"));

				//filigree :
				cl = $t.attr("class");
				if (game.drag == null || cl == "mig" || cl == "g")
					return;
				clearTimeout($t.data("timet"));
				filigree = game.drag == $t.data("instance") ? pieces[game.drag].$cloneImage : false;
				filigree
				&& filigree.attr("class", "mimage")
				&& $t.attr("class", "mig")
				&& $t.data("filigree", filigree);
			},
			mousemove: function () {
				"use strict";
				$(this).trigger("mouseover", true);
			},
			mouseout: function () {
				"use strict";
				var $t = $(this);
				$stage.data("aera", -1);

				//filigree :
				$t.data("filigree")
				&& $t.data("timet", setTimeout(function () {
					"use strict";1
					if (! $t.data("filigree") || $t.data("filigree").attr("class") == "image")
						return;
					$t.data("filigree").attr("class", "");
					$t.attr("class", "");
					$t.data("filigree", false);
				}, game.delays[1]));
	}	});	}







//Instancie puzzle ----------------------------------------------------------------------------
	function instancie (e) { //can not be called a second time without Piece.toEstablish cf. delete Piece.toEstablish
		"use strict";

		$pieces.each(function (ind) {
			"use strict";
			pieces.push(new Piece(ind));
		});

		$message = $("<figcaption>", {
			"id": "envInfo",
			"class": "caption-info env-info"
		}).appendTo($stage);

		Piece.toCalculate();
		delete Piece.toEstablish;

		$targetGroups = $stage.find("g");

//Drag and drop events
		instancie.uiEvents
		&& instancie.uiEvents()
		|| (instancie.uiEvents = (function uie () {
			"use strict";

			$figures.draggable({
				addClasses: false,
				cursor: "move",
				disabled: true,
				containment: $game,
				start: Piece.toBrand,
	/* final definition of toBrandTactile() is asynchronous */
				drag: Piece.toBrandTactileIntro, //jQuery UI Touch Punch neutralizing mouseover event when dragging?
				stop: Piece.toFix
			});

			$stage.droppable({
				addClass: false,
				tolerance: "pointer",
				drop: Piece.toCheck
			});

			return uie;
		}) ());

		$stage.data("aera", -1);

		$drawer.removeClass("establishing");

		e && instancie.classicalEvents();
	}
	instancie(true); //can not be called a second time without Piece.toEstablish cf. delete Piece.toEstablish




/*
CONFORMITE DU SVG GENERE
<g data-instance="n"
	n'est pas conforme
	mais comme il s'agit d'éléments clonables, il est plus difficile de passer par $element.data()
*/

});
