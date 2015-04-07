/*
	par Ludwik : Parc naturel des Alpilles, jeu du puzzle
	Gaëtan Langhade - Interfacteur
	avril 2015
*/



/* Paramètres */
;var parametres = {

	messages: {},

	largeur: 1372,
	hauteur: 1200,

	index: 10, //réglage minimal en z-index d'un élément droppé

	filtres: "css/filtres/filtres.svg",

	sons: {
		ok: "audio/confirmation/correct", //drop valide
		nok: "audio/confirmation/error" //drop invalide
	},

	delai0: 750,
	delai1: 100,
	delai2: 250
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
		$targetGroups,
		$drawer = $("#figures"),
		$walking = $(".walking"),
		$wlkg = $walking.eq(0),
		$figures = $(".figure"),
		$piecesGroups = $(".figure g"),

		game = {
			total: $drawer.html().split("</figure>").length - 1,
			ratio: parametres.largeur / parametres.hauteur,
			width: $puzzle.width(),
			height: $puzzle.height(),
			delays: [],
			//displayW: null,
			//displayH: null
		}


	instancie.init = (function ii () {
		"use strict";

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

		this.SVGgroup = this.$dom.find("g")
		.attr("data-instance", ind)
		.get(0); //for this.calculate()

		this.$cloneGroup = this.establish("toClone", "g"); //duplicate <g to create drop zone
		this.$cloneImage = this.establish("toClone", "image"); //duplicate <image to play final
	}


/* Class methods */

	Piece.reset = function () {
		"use strict";
		var w, h;
		$walking.add($figures).add($pieces).removeAttr("style");
		w = $wlkg.width();
		h = $wlkg.height();
		$walking.css(
			w / game.width < h / game.height ?
			{
				"height": Math.round(w / game.ratio),
				"margin-top": Math.round((game.height - (w / game.ratio) * 3) / 4)
			}
			:
			{
				"width": Math.round(h * game.ratio),
				"margin-left": Math.round((game.width - (h * game.ratio) * 3) / 4)
		});
		game.displayW = $wlkg.width();
		game.displayH = $wlkg.height();
	}

	Piece.calculate = function () {
		"use strict";
		game.width = $puzzle.width();
		game.height = $puzzle.height();
		Piece.reset();
		pieces.forEach(function (val) {
			"use strict";
			val.calculate();
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
		clearTimeout(piece.tmt);
		game.drag = instance;
		return $t.addClass("drag");
	}















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

		if (new Date().getTime() % 12 != 0)
			return;

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
		pieces[$(this).data("instance")].place();
	}

	Piece.toCheck = function (ev, ui) { //drop: drop (coming before toFix)
		"use strict";
		var indDrop = $stage.data("aera"),
			indDrag = ui.draggable.data("instance");
		switch (indDrop) {
			case -1:
				break;
			case indDrag:
				pieces[indDrag].queue = Piece.prototype.finish;
				break;
			default:
				pieces[indDrag].queue = Piece.prototype.restart;
	}	}




/* Provisional prototype */

	Piece.establish = { }
	Piece.establish.toClone = function (tag) {
		"use strict";
		return this.$dom.find(tag)
			.clone()
			.appendTo($puzzle)
	}
	Piece.prototype.establish = function (meth, sup) {
		"use strict";
		return Piece.establish[meth].call(this, sup);
	}

/* Prototype */

	Piece.prototype.calculate = function () {
		"use strict";

		var infoGroup, ratioW, ratioH, ratio, infoSVG;

		this.$dom.css({
			"width": game.width,
			"height": game.height
		});

		infoGroup = this.SVGgroup.getBoundingClientRect();

		ratioW = game.displayW / infoGroup.width;
		ratioH = game.displayH / infoGroup.height;

		ratio = ratioH < ratioW ? ratioH : ratioW;

		this.$dom.css({
			"width": Math.round(game.width * ratio),
			"height": Math.round(game.height * ratio)
		});

		infoSVG = this.$dom.offset();
		infoGroup = this.SVGgroup.getBoundingClientRect();

		this.$figure.css({
			"width": Math.round(infoGroup.width),
			"height": Math.round(infoGroup.height)
		});
		this.$dom.css({
			"margin": - Math.round(infoGroup.y - infoSVG.top) + "px 0 0 -" + Math.round(infoGroup.x - infoSVG.left) + "px"
		});

		this.$walking.removeClass("resizing");
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

	Piece.prototype.place = function () {
		"use strict";

		game.drag = null;

		this.$figure.removeClass("drag")
		.css({
			"z-index": ++parametres.index //last dropped on the "top" of pieces
		});

		this.queue(game.delays[0]);
	}

	Piece.prototype.finish = function () {
		"use strict";
		var $f = this.$figure;
		this.queue = commonLAg.doNothing;
		Piece.appreciate("ok");
		$f.css(commonLAg.transition(game.delays[0], "opacity"))
		.addClass("dragDropped");
		setTimeout(function () {
			"use strict";
			$f.css("z-index", -1);
		}, game.delays[0]);
		this.$cloneGroup.attr("class", "g");
		this.$cloneImage.css(commonLAg.transition(game.delays[0], "opacity"))
		.attr("class", "image");
	}

	Piece.prototype.restart = function () {
		"use strict";
		this.queue = commonLAg.doNothing;
		Piece.appreciate("nok");
		this.$figure.removeAttr("style");
	}





//Classical events ----------------------------------------------------------------------------
	instancie.classicalEvents = function () {
		"use strict";

		$w.on({
			resize: function () {
				"use strict";
				$walking.addClass("resizing");
				clearTimeout(game.timt);
				game.timt = setTimeout(Piece.calculate, game.delays[2]);
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
				filigree =
					game.drag == $t.data("instance") ? pieces[game.drag].$cloneImage
					: game.drag ==  $t.data("duel") ? pieces[pieces[game.drag].duel[0]].$cloneDuel
					: false;
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
	function instancie (e) { //can not be called a second time without Piece.establish cf. delete Piece.establish
		"use strict";

		$pieces.each(function (ind) {
			"use strict";
			pieces.push(new Piece(ind));
		});

		Piece.calculate();
		delete Piece.establish;

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
	instancie(true); //can not be called a second time without Piece.establish cf. delete Piece.establish




/*
CONFORMITE DU SVG GENERE
<g data-instance="n"
	n'est pas conforme
	mais comme il s'agit d'éléments clonables, il est plus difficile de passer par $element.data()
*/

});
