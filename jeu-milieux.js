/*
	par Ludwik : Parc naturel des Alpilles, jeu du puzzle
	Gaëtan Langhade - Interfacteur
	avril 2015
*/



;"use strict";

/* Paramètres */
;var parametres = {

	messages: {
		dropConfirmation: "BRAVO",
		dropErreur: "FAUX",
		generique: " ne niche pas dans ce milieu.",

		aigle: "guette ses proies depuis un point haut, nichant dans les reliefs rocheux.",
		alouette: "aime les mosaïques de différents milieux\xA0: prairies, pelouses, garrigues, vignes.",
		bruant: "aime les mosaïques de différents milieux\xA0: prairies, pelouses, garrigues, vignes.",
		circaete: "niche au sommet des arbres (souvent des pins), d'où il part pour chasser les reptiles dans les zones ouvertes (garrigues, pelouses, etc.).",
		engoulevent: "vit dans les garrigues et les bois clairsemés.",
		faucon: "a comme lieux favoris pour nicher\xA0: les anciennes bergeries, les ruines, les toits de maisons (cavités dans ces bâtiments ou nichoirs aménagés).",
		fauvette: "aime les mosaïques de différents milieux\xA0: prairies, pelouses, garrigues, vignes.",
		gdduc: "niche dans les milieux rocheux.",
		outarde: "mâle occupe les plaines cultivées à la végétation rase, pour rester visible et parader. La femelle s'installe dans les prairies aux herbes hautes.",
		pipit: "aime les mosaïques de différents milieux\xA0: prairies, pelouses, garrigues, vignes.",
		ptduc: "niche dans des arbres creux et des bâtiments avec des cavités en ruines.",
		rollier: "s'installe dans des cavités naturelles ou d'anciens nids de pics creusés dans les arbres, par exemple les peupliers blancs.",
		vautour: "niche dans les falaises.",

		grimpeur: "Il est important d'aménager les pratiques de loisirs en fonction des besoins de la nature.\
			Les couloirs d'escalade doivent être créés loin des sites de nidification des rapaces par exemple.",
		pylone: "Le pylône électrique\xA0: en raison des risques d'électrocution et de collision pour les grands rapaces,\
			les câbles électriques devraient être soit enterrés, soit sécurisés, dans les zones où ces oiseaux nichent ou chassent.",
		faucheuse: "L'intensification de l'agriculture (agrandissement des parcelles, disparition des haies et des friches,\
			passage accru d'engins mécaniques, engrais et pesticides) induit généralement une pression sur les espèces.\
			Par exemple, la fauche mécanique peut être dangereuse pour l'outarde qui s'installe et pond dans les prairies.\
			Les périodes de fauche sont alors réglementées\xA0: elles sont ainsi interdites pendant la nidification de début mai à début août.\
			Le pâturage s'avère être une bonne alternative.",
		maison: "Il est tentant de vouloir s'installer dans ce beau paysage, cependant la construction de maisons et de routes\
			réduit peu à peu l'habitat des oiseaux.",
		benneEquarissage: "L'équarrissage systématique du bétail mort par l'homme entraîne la perte de nourriture pour les rapaces nécrophages,\
			comme le Vautour percnoptère. Des dérogations sont accordées pour créer des \"placettes de nourrissage\",\
			où les cadavres sont à la disposition des \"équarrisseurs naturels\" que sont les vautours.",
		futPesticides: "L'usage de pesticides dans l'agriculture doit être limité car de nombreux oiseaux perdent leurs ressources en nourriture\
			en raison de l'empoisonnement de leurs proies.",
		embroussaillement: "La prolifération de certaines végétations se fait parfois au détriment des oiseaux. Il est important de préserver\
			la diversité des milieux\xA0: garrigues, prairies, forêts\u2026 sans que l'un n'empiète sur l'autre.",
		coupeArbreIsole: "L'intervention humaine dans la nature doit tenir compte des besoins écologiques des différentes espèces présentes.\
			Un arbre creux, une ruine, peuvent être le refuge de nombreuses espèces, comme le Petit-duc scops.",

		threat1: "Menaces identifiées\xA0: ",
		threat2: "\xA0/\xA0"
	},

	collection: window.oiseaux, //cf. jeu-fiches.oiseaux.js

	largeur: 1372,
	hauteur: 1200,
	// captionLargeur: 120, cf. game.magnusGlassRadial

	index: 10, //réglage minimal en z-index d'un élément droppé

	filtres: "css/filtres/filtres.svg",

	sons: {
		thr: "audio/confirmation/wrong", //menaces
		ok: "audio/confirmation/correct", //drop valide
		nok: "audio/confirmation/error" //drop invalide
	},

	delai0: 750,
	delai1: 100,
	delai2: 250,
	delai3: 3900,
	delai4: 3000,
	delai5: 1000,

	nbreZones: "zones",

	re: [/circle|ellipse/i] /* voir côté HTML les balises dans #threats */
}
delete window.oiseaux;







;$(function () {
	"use strict";
	
	var $w = $(window),
		$d = $(document),
		$b = $("body"),

		$zoom = $("#zoom"),
		$threats = $(".threat"),
		threats = document.querySelector(".threat"),
		$bolge = $("#bolge"),

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
		$piecesGroups = $(".figure g"),
		$caption, // = $(".bird-info"),

		$message, //= $("#env-info"),

		game = {
			booster: 1,
			threats: $threats.length,
			threatsId: "",
			// $thrts: null,
			// $message: null,
			total: $drawer.html().split("</figure>").length - 1,
			ratio: parametres.largeur / parametres.hauteur,
			delays: [],
			magnusGlassRadial: parametres.hauteur / 10,
			completion: 0
			// touchPoint: null,
			// gWidth: null,
			// gHeight: null,
			// displayRatio: null,
			// gPos: null,
			// displayW: null,
			// displayH: null,
			// review: null
		}


	instancie.init = (function ii () {
		"use strict";

		game.total = $figures.length;
		$drawer.addClass(parametres.nbreZones + game.total);

		for (var p in parametres)
			p.indexOf("delai") == 0 && game.delays.push(parametres[p]);

		commonLAg.Sound.init(parametres.sons);

		$threats.each(function () {
			"use strict";
			game.threatsId += $(this).attr("id");
		});

		$(".lag-order").css(commonLAg.transition(game.delays[5], ["background-color", "box-shadow"])); //game.delays[5]: cf. Piece.toTransit()


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
		// this.nominal = parametres.collection[this.infos].Nom;
		// this.pronominal = parametres.collection[this.infos].Pronominal;
		this.intoCaption();

		this.SVGgroup = this.$dom.find("g")
		.attr("data-instance", ind)
		.get(0); //for this.toCalculate()

		this.$cloneGroup = this.toEstablish("toClone", "g")
		.data("instance", ind); //duplicate <g to create drop zone
		this.$cloneImage = this.toEstablish("toClone", "image"); //duplicate <image to play final
	}


/* Class methods */

	Piece.toZoom = function () { //later: zoom in game 1 and drag and drop in game 2 (starting was the opposite)
		"use strict";

		$game.addClass("zoom zoom-first");

		commonLAg.msieUp11
		&& $zoom.attr("transform", "translate(1132, 0)");

		$zoom.movable = 
			commonLAg.msieUp11 ? commonLAg.doNothing //but ok with my prototype of magnify glass
			: function (x, y) {
				"use strict";
				$zoom.attr("transform", "translate("
					+ Math.round(x - game.magnusGlassRadial)
					+ ","
					+ Math.round(y - game.magnusGlassRadial * game.booster)
					+ ")");
	}	}

	Piece.intoCaption = function () { //content of messages (in <figcaption)
		"use strict";
		pieces.forEach(function (val) {
			"use strict";
			val.intoCaption();
	});	}

	Piece.retroCaption = commonLAg.doNothing; //third modification of storyboard

	Piece.toErase = function () { //cut displaying of messages
		"use strict";
		Piece.intoCaption();
		Piece.retroCaption();
		$(".error").attr("class", "");
		$(".over, .bad-drop").removeClass("over bad-drop");
	}

	Piece.toReset = function () { //main: to display pieces at responsive way
		"use strict";
		var landscape = window.matchMedia("(min-aspect-ratio: 1/1)").matches,
			w, h, W, H;
		$walking.add($figures).add($pieces).removeAttr("style");
		$(".empty:not(:has(.dragDropped))").removeClass("empty");
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
		game.displayRatio = parametres.hauteur / game.gHeight;
		$puzzle.css({ //Google Chrome and also Firefox 30
			"width": infoDim.width,
			"height": infoDim.height
		});
		game.gPos = $puzzle.offset();
		$message.css({
			"left": game.gPos.left,
			"top": game.gPos.top
		});
		$game.removeClass("resize");
		Piece.toReset();
		pieces.forEach(function (val) {
			"use strict";
			val.toCalculate();
	});	}

	Piece.toAppreciate = function (cl) {
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

		$targetGroups
		&& $targetGroups.off("mousemove"); /* pb when reddraging a piece after hybrid drop on iPad */

		game.$tactileP1 = null;
		game.$tactileP0 = null;

		Piece.toBrandTactile = function (ze) {
			"use strict";

			$stage.data("aera", -1);

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

	Piece.toRecapitulate = function () { //added later
		"use strict";

		$stage.data("aera", -1)
		.droppable("disable");

		$game.removeClass("dad");

		$piecesGroups.off();

		$targetGroups.off()
		.attr("class", "");

		setTimeout(function () {
			"use strict";

			Piece.toErase = function () {
				"use strict";
				$message[$message.offset().top + $message.innerHeight() > $b.height() ?
					"addClass" : "removeClass"]("big");
			}
			$message.addClass("over")
			.text("");

			$(".bird-info.over:not(repositionned)").each(function () {
				"use strict";
				var $t = $(this);
				pieces[Number($t.parents(".figure").data("instance"))].intoCaption();
				$t.removeClass("over")
				.css("top", parseInt($t.css("top"), 10) + $t.data("height") - $t.innerHeight());
			});
			$caption.addClass("last-view");

			Piece.toTransit(instancie.events3review);

		}, game.delays[3]);
	}

	Piece.toTransit = function (clbck) { //added later
		"use strict";
		$game.addClass("phases-transit");
		setTimeout(function () {
			"use strict";
			clbck();
			$game.removeClass("phases-transit");
		}, game.delays[5]); //game.delays[5]: cf. $(".lag-order").css(commonLAg.transition()
	}

/* Provisional class methods and prototype */

	Piece.toEstablish = { }
	Piece.toEstablish.intoMessage = function () {
		"use strict";
		return $("<figcaption>", {
			"id": "envInfo",
			"class": "caption-info env-info para-drop",
			"html":
				$("<p>", {
					"class": "output",
					"text": "",
					"html":
						$(document.createTextNode(parametres.messages.threat1))
						.add($("<output>", {
							"name": "okThreats",
							"id": "okThreats",
							"for": game.threatsId,
							"text": 0
						}))
						.add($(document.createTextNode(parametres.messages.threat2)))
						.add($("<span>", {
							"id": "totalThreats",
							"text": game.threats
				}))	})	
				.add(game.$message =
					$("<p>", {
						"id": "intoMessage",
						"class": "into-message"
	})	)	})	}
	Piece.toEstablish.toClone = function (tag) {
		"use strict";
		return this.$dom.find(tag)
			.clone()
			.appendTo($puzzleStage)
	}
	Piece.toEstablish.forCaption = function () {
		"use strict";
		var infos = parametres.collection[this.infos];
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
			// left = harvest.left - parametres.captionLargeur * 2 / 3,
			left = harvest.left - game.magnusGlassRadial * 2 / 3,
			iHeight = this.$message.innerHeight(),
			top = harvest.top - iHeight - 6,
			dsl = $d.scrollLeft(),
			dst = $d.scrollTop(),
			infoGroup, infoSVG;

		left = Math.round(left > 0 ? left : 0) - dsl;
		top =  Math.round(top > 0 ? top : 0) - dst;

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
			"margin": - Math.round(-3 + infoGroup.top - infoSVG.top + dst) + "px 0 0 -" + Math.round(-3 + infoGroup.left - infoSVG.left + dsl) + "px"
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

		Piece.toAppreciate("ok");

		$f.css(commonLAg.transition(game.delays[0], "opacity"))
		.addClass("dragDropped");

		this.$cloneGroup.attr("class", "g");

		this.$cloneImage.css(commonLAg.transition(game.delays[0], "opacity"))
		.attr("class", "image");

		$message.text(this.pronominal + " " + parametres.messages[this.infos])
		.addClass("over");

		this.$message.text(parametres.messages.dropConfirmation)
		.addClass("over");

		++game.completion === game.total
		&& Piece.toRecapitulate();
	}

	Piece.prototype.toRestart = function () {
		"use strict";
		var zone = pieces[$stage.data("aera")];

		this.queue = commonLAg.doNothing;

		Piece.toAppreciate("nok");

		this.$figure.addClass("bad-drop");

		zone.$cloneGroup.attr("class", "error");

		$message.text(pieces[Number($stage.data("drag"))].pronominal + parametres.messages.generique)
		.addClass("over");

		zone.$message.text(parametres.messages.dropErreur)
		.addClass("over bad-drop");
	}







//Events ----------------------------------------------------------------------------
	instancie.events1zoom = function () { //classical events for the interface
		"use strict";

		$w.on({
			resize: function () {
				"use strict";
				$puzzle.removeAttr("style");
				$game.addClass("resize");
				$walking.addClass("resizing");
				clearTimeout(game.timt);
				game.timt = setTimeout(Piece.toCalculate, game.delays[2]);
			},
			scroll: function () {
				$w.trigger("resize")
		}	});

		$puzzle.on({
			mousemove: function (ze, ev) {
				"use strict";
				ze.preventDefault();
				var x, y;
				ze = ev || ze;
				x = (ze.pageX - game.gPos.left) * game.displayRatio;
				y = (ze.pageY - game.gPos.top) * game.displayRatio;
				$zoom.movable(x, y);
				$bolge.attr({
					"x": Math.round(- x + game.magnusGlassRadial / game.displayRatio),
					"y": Math.round(- y + game.magnusGlassRadial * game.booster / game.displayRatio)
		});	}	})

		$threats.on({
			mousemove: function () {
				"use strict";
				var $t = $(this),
					id = $t.attr("id"),
					total = Number(game.$thrts.html());

				clearTimeout($t.tmt);
				if ($stage.data("aera") === id)
					return;
				$stage.data("aera", id);

				! $t.data("already")
				&& $t.data("already", true)
				&& game.$thrts.html(++total)
				&& (total == game.threats)
				&& Piece.toTransit(instancie.events2dnd);

				commonLAg.sounds["thr"].turnoff()
				.turnon();

				game.$message.text(parametres.messages[$(this).attr("id")]);
				game.$message.offset().top + $message.innerHeight() > $b.height()
				&& $message.addClass("big");
			},
			mouseout: function () {
				"use strict";
				var id = $(this).attr("id");
				$(this).tmt = setTimeout(function () {
					"use strict";

					if ($stage.data("aera") !== id)
						return;
					$stage.data("aera", -2);

					game.$message.text("");
					$message.removeClass("big");

					commonLAg.sounds["thr"].turnoff();
				}, game.delays[2]);
		}	});

		commonLAg.touch
		&& ($puzzle.stroking = function (ze) {
			"use strict";
			ze.preventDefault();
			var ore = ze,
				tactTouch = typeof ze.pageX == "number" && (ze.pageX > 0 || ze.pageY > 0) ? ze
				: typeof ze.touches[0].pageX == "number" && (ze.touches[0].pageX > 0 || ze.touches[0].pageY > 0) ? ze.touches[0]
				: typeof ze.changedTouches[0].pageX == "number" && (ze.changedTouches[0].pageX > 0 || ze.changedTouches[0].pageY > 0) ? ze.changedTouches[0] : null;

			if (tactTouch === null)
				return;

			if (tactTouch !== ze) {
				ore = {};
				for (var p in ze)
					ore[p] = ze[p];
				ore.pageX = tactTouch.pageX;
				ore.pageY = tactTouch.pageY;
			}

			game.booster = 2; /* MSIE 1000 years later */

			$puzzle.trigger("mousemove", [ore]);

			game.touchPoint = document.elementFromPoint(ore.pageX, ore.pageY - game.magnusGlassRadial / 2);
			game.touchPoint.tagName.search(parametres.re[0]) > - 1
			&& $(game.touchPoint).trigger("mousemove", [ore])
			|| $stage.data("aera") != -2
			&& $("#" + $stage.data("aera")).trigger("mouseout");
		})
		&& $puzzle.get(0) //http://stackoverflow.com/questions/16110124/can-you-get-svg-on-mobile-browser-accept-mouse-touch-events-i-cant
		.addEventListener("touchmove", $puzzle.stroking, false);
	}

	instancie.events2dnd = function () { //drag and drop events and classical events for drag and drop elements
		"use strict";

		delete Piece.toZoom;
		delete instancie.events1zoom;

		$game.removeClass("zoom-first")
		.addClass("dad");

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

		$drawer.on({
			mousemove: function () {
				"use strict";

				$drawer.off();

				$puzzle.off();
				$threats.off();
				commonLAg.touch
				&& $puzzle.get(0).removeEventListener("touchmove", $puzzle.stroking);

				delete game.$message;
				delete game.$thrts;

				$stage.data("aera", -1)
				.droppable({
					addClass: false,
					tolerance: "pointer",
					drop: Piece.toCheck
				});

				$targetGroups.on({
					mouseover: function () { //tactile: cf. toBrandTactile()
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
						$(this).trigger("mouseover");
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
				}	});

				$game.removeClass("zoom");

				Piece.retroCaption = function () {
					"use strict";
					$message.text("");
				}
				Piece.toErase();
			},
			touchstart: function () {
				"use strict";
				$drawer.trigger("mousedown");
	}	});	}

	instancie.events3review = function () { //classical events for last review
		"use strict";

		var $setpoint = $(".lag-order:eq(1)");
		$setpoint.text($setpoint.data("review"));

		delete instancie.events2dnd;
		delete Piece.intoCaption;
		delete Piece.retroCaption;
		delete Piece.toAppreciate;
		delete Piece.toBrand;
		delete Piece.toBrandTactileIntro;
		delete Piece.toBrandTactile;
		delete Piece.toFix;
		delete Piece.toCheck;

		Piece.toInform = function (which, message) {
			"use strict";
			$stage.data("aera", which);
			$caption.addClass("last-view");
			$message.text(message);
			Piece.toErase();
		}

		$targetGroups.on({
			mousemove: whyTargetGroupsMousemoveImpossibleToTriggerOnAndroidInFactWithoutDebugConsoleAndProbablyIPad
		});

		function whyTargetGroupsMousemoveImpossibleToTriggerOnAndroidInFactWithoutDebugConsoleAndProbablyIPad () {
			"use strict";
			var instance = $(this).data("instance"),
				piece = pieces[instance];
			if ($stage.data("aera") == instance)
				return;
			Piece.toInform(instance, piece.pronominal + " " + parametres.messages[piece.infos]);
			piece.$message.removeClass("last-view");
			return true;
		}

		$threats.on({
			mousemove: function () {
				"use strict";
				var id = $(this).attr("id");
				if ($stage.data("aera") == id)
					return;
				Piece.toInform(id, parametres.messages[id]);
		}	});

		commonLAg.touch
		&& ($puzzle.stroking = function (ze) {
			"use strict";
			ze.preventDefault();

			var tactTouch = typeof ze.pageX == "number" && (ze.pageX > 0 || ze.pageY > 0) ? ze
				: typeof ze.touches[0].pageX == "number" && (ze.touches[0].pageX > 0 || ze.touches[0].pageY > 0) ? ze.touches[0]
				: typeof ze.changedTouches[0].pageX == "number" && (ze.changedTouches[0].pageX > 0 || ze.changedTouches[0].pageY > 0) ? ze.changedTouches[0] : null;

			if (tactTouch === null)
				return;

			game.touchPoint = document.elementFromPoint(tactTouch.pageX, tactTouch.pageY);

			game.touchPoint.tagName.toLowerCase() == "path" //birds
			&& $(game.touchPoint).parents($stage).length
			&& whyTargetGroupsMousemoveImpossibleToTriggerOnAndroidInFactWithoutDebugConsoleAndProbablyIPad.call($(game.touchPoint).parent("g"))
			|| game.touchPoint.tagName.search(parametres.re[0]) > - 1 //threats
			&& $(game.touchPoint).trigger("mousemove");
			})
		&& $puzzle.get(0) //http://stackoverflow.com/questions/16110124/can-you-get-svg-on-mobile-browser-accept-mouse-touch-events-i-cant
		.addEventListener("touchmove", $puzzle.stroking, false);

		$drawer.on({
			mouseover: function () {
				"use strict";
				$stage.data("aera", -1);
				$caption.addClass("last-view");
				$message.text("");
			},
			touchstart: function () {
				"use strict";
				$drawer.trigger("mouseover");
		}	});

		$game.addClass("review");
	}







//Instancie puzzle ----------------------------------------------------------------------------
	function instancie () { //can not be called a second time without Piece.toEstablish cf. delete Piece.toEstablish
		"use strict";

		delete instancie.init;

		$message = Piece.toEstablish.intoMessage()
		.appendTo($stage);
		game.$thrts = $("#okThreats");

		Piece.toZoom();

		$pieces.each(function (ind) {
			"use strict";
			pieces.push(new Piece(ind));
		});
		Piece.toCalculate();
		delete Piece.toEstablish;
		delete Piece.prototype.toEstablish;
		$targetGroups = $puzzleStage.find("g");
		$caption = $(".bird-info");
		$stage.data("aera", -2);

		$drawer.removeClass("establishing");

		instancie.events1zoom();
	}
	instancie();

});
