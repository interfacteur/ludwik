/*
	par Ludwik : Parc naturel des Alpilles, jeu du puzzle
	Gaëtan Langhade - Interfacteur
	février 2015
*/

/* Paramètres */
;var parametres = {

	message1 : "BRAVO !!",
	message2 : " mais il y a des hybridations",
	message3 : "<br>Puzzle effectué en ",
	message4 : " secondes",

	hauteur: .79, //cf. CSS #figure
	index: 10, //réglage minimal en z-index d'un élément droppé

	delai0: 750,
	delai1: 25,
	delai2: 1500,
	delai3: 100,
	delai4: 10,
	delai5: 333,

	dropCourt: 14, //(pixels)
	adjustMoment: 125, //pb of click on original <g> after a short drag (milliseconds)

	sons: {
		ok: "audio/confirmation/correct", //drop valide
		almost: "audio/confirmation/correct", //drop almost valide
		nok: "audio/confirmation/error", //drop invalide
		win: "audio/confirmation/wrong" //puzzle terminé
	},

	transition: function (delai, prop) {
		var pr = prop ? prop + " " : "";
		return {
			"-webkit-transition": pr + delai + "ms",
			"-moz-transition": pr + delai + "ms",
			"-o-transition": pr + delai + "ms",
			"transition": pr + delai + "ms"
	}	}


}






/*
<!-- to do: labels, submit button? -->



to do :
pointer-events
js
pour MSIE 10 ?
http://caniuse.com/#feat=pointer-events

http://caniuse.com/#feat=pointer
	càd
	http://www.w3.org/TR/pointerevents/

	MAIS QUOI ?



to do: without ghost pieces?




to do : filtres alt ??


to do : effets avec voir ?

to do : couleur d'appréciation avec une image paysage ?

to do : laisser le deuxième click désactiver le drop au click ????
le deuxième click fonctionne partout sauf sur une autre pièce
	car c'est alors l'autre pièce qui devient déplaçable au click suivant
?? suffisamment intuitif ?




<!--
to do
noter contrainte pas de pièces d'une hauteur supérieure à la moitié ?
-->

<!-- to do : better way fonds ok nok...-->

	GC fond blanc via les CSS, sans <rect sup ?

<!-- enable-background="new 0 0 726 726" -->




MAC webkit

taille du chrono
"empreinte" partie supérieure (et inféfieure) du svg "stage"

Safari
	oiseau unique : tête indropable ?

GC 34
	les pièces n'apparaissent pas

Canary



Error: cannot call methods on draggable prior to initialization; attempted to call method 'disable'
jquery-....min.js (ligne 2, col. 1808)



*/


;$(function () {
	"use strict";

	var $w = $(window),

		pieces = [],

		$pieces, //$(".figure svg")

		$stage = $("#figure"),
		$puzzle = $("#figure svg"),
		refer = document.getElementById("referencial"),
		$svgBg = [],
		$targetGroups,
		$drawer = $("#figures"),
		$figures, //$(".figure")
		$piecesGroups, //$(".figure g")

		$clock = $("#clock"),

		$levels = $("[name='lev']"),
		$see = $("#see1"),

		sounds = [],

		game = {
			// timt: null,
			// clock: null,
			//ratio: null,
			//simili: null,
			windW: $w.width(),
			windH: $w.height(),
			referWAbs: refer.getAttribute("width"),
			referWRel: refer.getBoundingClientRect().width,
			win: 0,
			play: null,
			delays : [],
			sounds: {
				audio: document.createElement("audio"),
				format: function () {
					"use strict";
					return !! game.sounds.audio.canPlayType ?
						(	game.sounds.audio.canPlayType("audio/mpeg") ?
								".mp3" : game.sounds.audio.canPlayType('audio/ogg; codecs="vorbis"') ? ".ogg" : false	)
						: false;
		}	}	}

	instancie.init = (function ii () {
		"use strict";

		for (var p in parametres)
			p.indexOf("delai") == 0 && game.delays.push(parametres[p]);

		parametres.hauteurInf = .99 - parametres.hauteur;

		for (var p in parametres.sons)
			sounds[p] = new Sound(parametres.sons[p]);

		game.ratio = game.referWRel / game.referWAbs;

		game.clock = $clock.FlipClock({
			autoStart: false,
			clockFace: "MinuteCounter",
			language: "fr"
		});
		game.time = function () {
			"use strict";
			game.clock.start();
			game.time = function () {
				"use strict";
		}	}

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
		//this.state = null; /* null: starting; -1: invalid; 0: neutral; .5: almost; 1: valid */
		this.queue = function () { "use strict"; }
	/*		this.simili = undefined; //cf. topple() */

		this.$dom = $pieces.eq(ind);
		this.$figure = $figures.eq(ind);
		this.$figure.data("instance", ind);

	/*		this.$posX = null; //cf. toGrade() */
	/*		this.$posY = null; //cf. toGrade() */
		this.establish("toGrade");

		this.SVGgroup = this.$dom.find("g").attr("data-instance", this.instance).get(0);

		this.$cloneGroup = this.establish("toClone", "g");
	/*	this.SVGcloneGroup = this.$cloneGroup.get(0);
			this.dimension = null; //cf. calculate() */

		this.$cloneImage = this.establish("toClone", "image");
	}


/* Class methods */

	Piece.calculate = function () {
		"use strict";
		pieces.forEach(function (val) {
			"use strict";
			val.calculate();
	});	}

	Piece.playable = function (which) {
		"use strict";
		game.play = which;
		$(".dragClick").removeClass("dragClick");
		which != null
		&& pieces[which].$figure.addClass("dragClick");
	}

	Piece.topple = function (dro, dra, sim) {
		"use strict";

		var harvestDrop = pieces[dro].$cloneGroup.offset(),
			harvestDrag = pieces[dra].$cloneGroup.offset();

		typeof pieces[dro].simili == "undefined"
		&& (game.simili = {
			dr: [dro, dra],
			x: (harvestDrag.left - harvestDrop.left) / game.ratio,
			y: (harvestDrag.top - harvestDrop.top) / game.ratio,
			sim: sim
		})
		&& (! game.topple
			&& (game.topple = (function tp (args) {
				"use strict";
				pieces[args.dr[0]].$cloneImage.attr({
					"x": args.x,
					"y": args.y
				});
				pieces[args.dr[0]].$cloneGroup.attr({
					"data-instance": args.dr[1],
					"data-simili": args.sim //for later: messages to user ?
				});
				pieces[args.dr[0]].simili = args.dr[1];
				return tp;
			}) (game.simili))
			|| game.topple(game.simili)
		)
		({
			dr: [dra, dro],
			x: (harvestDrop.left - harvestDrag.left) / game.ratio,
			y: (harvestDrop.top - harvestDrag.top) / game.ratio,
			sim: sim
		});

		game.simili = true;
		$stage.data("aera", [dra, $stage.data("aera")[1]]);
		Piece.toCheck(null, { draggable: pieces[dra].$figure });
	}

	Piece.appreciate = function (cl) {
		"use strict";
		$stage.addClass(cl);
		setTimeout(function () {
			$svgBg[cl].css(parametres.transition(game.delays[0]));
			$stage.removeClass(cl);
			setTimeout(function () {
				$svgBg[cl].removeAttr("style");
			}, game.delays[0] + 100);
		}, game.delays[1]);
		sounds[cl].play();
		return true;
	}

	Piece.win = function () {
		"use strict";
		if ($(".dragSimili").length)
			return Piece.hybrid();
		var time = game.clock.getTime();
		game.clock.stop();
		$drawer.addClass("bravo")
		.html(
			parametres.message1
			+ ((game.simili && parametres.message2) || "")
			+ parametres.message3
			+ (time - 1) + "-" + time
			+ parametres.message4
		);
		// return true;
	}

	Piece.hybrid = function () {
		"use strict";
		$(".dragSimili").css(parametres.transition(0)) /* QOUI ? */
		.addClass("dragAgain")
		.removeClass("dragSimili")
		.css("opacity", 1);






































	}


/* Class methods for jQuery UI events manager */

	Piece.toBrand = function (ev, ui) { //drag: start
		"use strict";
		var $t = $(this),
			piece = pieces[$t.data("instance")],
			harvest = $t.offset();
		clearTimeout(piece.tmt);
		Piece.playable(null);
		piece.playLeft = harvest.left;
		piece.playTop = harvest.top;
		game.time();
		$t.addClass("dragOriginal justAMoment");
		ui.helper.addClass("dragClone");
	}

	Piece.toFix = function (ev, ui) { //drag: stop (coming after toCheck)
		"use strict";
		var harvest = ui.helper.offset();
		pieces[$(this).data("instance")].place({
			left: harvest.left - game.windW * .5,
			top: (harvest.top - (game.windH * parametres.hauteur)) / (game.windH * parametres.hauteurInf) * 100 + "%",
			replayable: harvest
	});	}

	Piece.toCheck = function (ev, ui) { //drop: drop (coming before toFix)
		"use strict";
		var indDrop = $stage.data("aera")[0],
			indDrag = ui.draggable.data("instance"),
			simili = ui.draggable.data("simili");
		switch (indDrop) {
			case -1:
				break;
			case indDrag:
				pieces[indDrop].queue = Piece.prototype.finish;
				break;
			default:
				(typeof simili == "undefined" || simili != $stage.data("aera")[1])
				&& Piece.appreciate("nok")
				|| Piece.topple(indDrop, indDrag, simili);
	}	}

	Piece.toCheckClick = function () { //click: drag, and can drop
		"use strict";
		var $t = $(this),
			instance = $t.data("instance"),
			simili = pieces[instance].$figure.data("simili");
		switch (game.play) {
			case null:
				break;
			case instance:
				pieces[game.play].finish(0);
				break;
			default:
				(typeof simili == "undefined" || simili != pieces[game.play].$figure.data("simili"))
				&& Piece.appreciate("nok")
				|| Piece.topple(instance, game.play, simili);
	}	}


/* Provisional prototype */

	Piece.establish = { }
	Piece.establish.sort = function (a, b) {
		"use strict";
		return a[1] - b[1];
	}
	Piece.establish.toGrade = function () {
		"use strict";
		var $p = this.$dom.find("path"),
			X = [],
			Y = [],
			harvest,
			x, y;
		$p.each(function (ind) {
			"use strict";
			harvest = $(this).offset();
			X.push([ind, harvest.left]);
			Y.push([ind, harvest.top]);
		});
		X.sort(Piece.establish.sort);
		Y.sort(Piece.establish.sort);
		this.$posX = $p.eq(X[0][0]);
		this.$posY = $p.eq(Y[0][0]);
	}
	Piece.establish.toClone = function (tag) {
		"use strict";
		return this.$dom.find(tag).length ?
			this.$dom.find(tag)
			.clone()
			.appendTo($puzzle)
			:
			(	this.$figure.addClass("dragPseudo") //to do: without ghost pieces?
				&& -- game.total
				&& $("no")	);
	}
	Piece.prototype.establish = function (meth, sup) {
		"use strict";
		return Piece.establish[meth].call(this, sup);
	}


/* Prototype */

	Piece.prototype.calculate = function () {
		"use strict";
		var dimension = this.SVGgroup.getBoundingClientRect(),
			harvest, x, y, w;

		//this.dimension = this.SVGcloneGroup.getBoundingClientRect();

		this.$figure.css("height", "100%");
		this.$dom.css({
			"margin": 0,
			"height": "200%"
		});

		harvest = this.$figure.offset();
		x = this.$posX.offset().left - harvest.left - 3; //- 3 : padding for usability and filter
		x < 0
		&& (x = 0);
		y = this.$posY.offset().top - harvest.top;
		w = dimension.width + 6;
//to do: MSIE ?
		this.$dom.css({
			"margin": - y + "px 0 0 -" + x + "px",
			"height": this.$dom.height()
		});
		this.$figure.css({
			"width": w,
			"height": dimension.height
	});	}

	Piece.prototype.manage = function (state) {
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

	Piece.prototype.place = function (args) {
		"use strict";

		var piece = this; //setTimeout...

		setTimeout(function () { //piecesGroups : clicked by short drag: vs Piece.playable
			"use strict";
			piece.$figure.removeClass("justAMoment");
		}, parametres.adjustMoment);

		piece.$figure.removeClass("dragOriginal")
		.addClass("dragDragged")
		.css({
			"left": args.left,
			"top": args.top,
			"z-index": ++parametres.index //last dropped on the "top" of pieces
		});

		Piece.playable( //to conserve click moving after very short drop
			! args.replayable
			|| Math.sqrt(
				Math.pow(Math.abs(piece.playLeft - args.replayable.left), 2)
				+ Math.pow(Math.abs(piece.playTop - args.replayable.top), 2)
			) > parametres.dropCourt ?
			null : piece.instance
		);

		piece.queue(game.delays[0]);
	}

	Piece.prototype.finish = function (del) {
		"use strict";
		var $f = this.$figure,
			delay = typeof del != "undefined" ? del : game.delays[0],
			simili = typeof this.simili != "undefined";
		// this.state = 1;
		//Piece.appreciate((simili && "almost") || "ok");
		game.win ++;
		((simili && pieces[this.simili]) || this).$cloneGroup.attr("class", "g");
		this.$cloneImage.css(parametres.transition(delay, "opacity"))
		.attr("class", "image");
		$f.css(parametres.transition(delay, "opacity"))
		.css("opacity", 0);
		setTimeout(function () {
			"use strict";
			! simili
			&& $f.remove()
			|| $f.addClass("dragSimili")
			.appendTo($drawer);
			game.win == game.total
			&& Piece.win();
		}, delay);
	}
/*		return setTimeout(function () {
			"use strict";
			! simili
			&& $f.remove()
			|| $f.addClass("dragSimili");
			game.win == game.total
			&& Piece.win();
		}, delay) + .1; //setTimeout returns an integer: here returned value need to be different from 0
	} //PS: why? there is no return this.finish(n) - thinks to switch (?) */







//Pseudo-class Sound ----------------------------------------------------------------------------
	function Sound (source) {
		"use strict";
		if (! this instanceof Sound)
			throw new Error("Attention à l'instanciation");
		this.source = source + game.sounds.format();
	}
	if (game.sounds.format()) {
		Sound.prototype.confirmation = function () {
			"use strict";
			return new Audio(this.source);
		}
		Sound.prototype.play = function () {
			"use strict";
			this.confirmation().play();
			return true;
	}	}
	else
		Sound.prototype.play = function () {
			"use strict";
			return true;
		}







//Classical events ----------------------------------------------------------------------------
	instancie.classicalEvents = function () {
		"use strict";

		$w.on({
			resize: function () {
				"use strict";
				clearTimeout(game.timt);
				game.windW = $w.width();
				game.windH = $w.height();
				game.timt = setTimeout(Piece.calculate, game.delays[4]);
				game.referWRel = refer.getBoundingClientRect().width;
				game.ratio = game.referWRel / game.referWAbs;
		}	});

		$("body").on({
			click: function (ze) {
				"use strict";
				var ind = game.play;
				if (ind == null || pieces[ind].$figure.has($(ze.target)).length)
					return;
				Piece.playable(null);
				pieces[ind].place({
					left: ze.pageX - (pieces[ind].$figure.width() / 2) - game.windW * .5,
					top: (ze.pageY - (pieces[ind].$figure.height() / 2) - (game.windH * parametres.hauteur)) / (game.windH * parametres.hauteurInf) * 100 + "%",
					replayable: false
		});	}	});

		$levels.on({
			change: function () {
				"use strict";
				$stage.removeClass("lev1 lev2 lev3").addClass($(this).val());
		}	})
		.eq(1).prop("checked", true);

		$piecesGroups.on({
			click: function (ze) {
				"use strict";
				ze.preventDefault();
				game.time();
				var ind = $(this).data("instance");
				! pieces[ind].$figure.hasClass("justAMoment") //by clicked with short drag: vs Piece.playable
				&& Piece.playable(game.play == ind ? null : ind);
			},
			mouseover: function () {
				"use strict";
				pieces[$(this).data("instance")].getFromGroups()
				.manage("enable");
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
					piece.manage("disable");
				}, game.delays[3]);
			},
			touchend: function () {
				"use strict";
				$(this).trigger("mouseout");
		}	});

		$targetGroups.on({
			click: Piece.toCheckClick,
			mouseover: function () {
				"use strict";
				var instance = $(this).data("instance");
				$stage.data("aera", [instance, pieces[instance].$figure.data("simili")]);
			},
			touchstart: function () {
				"use strict";
				$(this).trigger("mouseover");
			},
			mousemove: function () {
				"use strict";
				$(this).trigger("mouseover");
			},
			touchmove: function () {
				"use strict";
				$(this).trigger("mouseover");
			},
			mouseout: function () {
				"use strict";
				$stage.data("aera", [-1, undefined]);
			},
			touchend: function () {
				"use strict";
				$(this).trigger("mouseout");
		}	});

		$see.on({
			click: function (ze) {
				"use strict";
				var $f = $(".figure:eq(0)"),  //to do: randomize ?
					$g;
				ze.preventDefault();
				if ($f.hasClass("dragSimili"))
					return;
				$g = $f.find("g");
				$g.trigger("click");
				$("#figure [data-instance='" + $g.data("instance") + "']").trigger("click");
				if (! ze.isTrigger || $(".figure").length == 0)
					return;
				setTimeout(function () {
					"use strict";
					$see.trigger("click")
				}, game.delays[5]);
		}	});

		$("#see2").on({
			click: function (ze) {
				"use strict";
				$see.trigger("click");
	}	});	}







//Instancie puzzle ----------------------------------------------------------------------------
	function instancie (e) { //can not be called a second time without Piece.establish cf. delete Piece.establish
		"use strict";

		var shuffle = $drawer.html().split("</figure>"),
			currentIndex, temporaryValue, randomIndex;

		$svgBg["ok"] = $(".svgBgOk");
		$svgBg["nok"] = $(".svgBgNok");
		$svgBg["almost"] = $(".svgBgAlmost");

		game.total = currentIndex = shuffle.length - 1;
		//http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = shuffle[currentIndex];
			shuffle[currentIndex] = shuffle[randomIndex];
			shuffle[randomIndex] = temporaryValue;
		}
		$drawer.html(shuffle.join("</figure>"));

		$figures = $(".figure");
		$pieces = $(".figure svg");
		$piecesGroups = $(".figure g");

		$pieces.each(function (ind) {
			"use strict";
			pieces.push(new Piece(ind));
		});
		delete Piece.establish;

		$targetGroups = $stage.find("g");

		Piece.calculate();

//Drag and drop events
		instancie.uiEvents
		&& instancie.uiEvents()
		|| (instancie.uiEvents = (function uie () {
			"use strict";

			$figures.draggable({
				addClasses: false,
				helper: "clone",
				disabled: true,
				start: Piece.toBrand,
				stop: Piece.toFix
			});

			$stage.droppable({
				addClass: false,
				tolerance: "pointer",
				drop: Piece.toCheck
			});

			return uie;
		}) ());

		$stage.data("aera", [-1, undefined]);

		$drawer.removeClass("establishing");

		e && instancie.classicalEvents();
	}
	instancie(true); //can not be called a second time without Piece.establish cf. delete Piece.establish


/*
*/

});