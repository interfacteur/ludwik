/*
	par Ludwik : Parc naturel des Alpilles, jeu du puzzle
	Gaëtan Langhade - Interfacteur
	février-mars 2015
*/



/* Paramètres */
;var parametres = {

	message1 : "BRAVO !!",
	message2 : " mais les deux oiseaux sont encore mélangés",
	message3 : "<br>Puzzle effectué en ",
	message4 : " secondes",

	hauteur: .63 + .13 + .04, //cf. #figure dans jeu-puzzle.css et [.life-alpilles-games, .lag-order] dans communs.css
	index: 10, //réglage minimal en z-index d'un élément droppé

	delai0: 750,
	delai1: 25,
	delai2: 1500,
	delai3: 100,
	delai4: 10,
	delai5: 333,

	clockLargeur: 300, /* .clock dans jeu-puzzle.css */

	regex: [/dragDropped|dragSimili/],

	dropCourt: 24, //(pixels)
	adjustMoment: 125, //pb of click on original <g> after a short drag (milliseconds)

	filtres: "css/filtres/filtres.svg",

	sons: {
		ok: "audio/confirmation/correct", //drop valide
		almost: "audio/confirmation/correct", //drop almost valide
		nok: "audio/confirmation/error", //drop invalide
		win: "audio/confirmation/wrong" //puzzle terminé
	},

	formul: {
		hybridHelp: $("#hybridHelp").length ? $("#hybridHelp").val() : false,
		melting: $("#melting").length ? $("#melting").val() : false
	},
}







;$(function () {
	"use strict";

	var $w = $(window),
		$b = $("body"),

		pieces = [],

		$pieces, //$(".figure svg")

		$game = $(".puzzle"),
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

		game = {
			// timt: null,
			// clock: null,
			// ratio: null,
			// toEnd: null,
			duality: false,
			hybrid: 0,
			deshybr: [commonLAg.doNothing],
			windW: $w.width(),
			windH: $w.height(),
			referWAbs: refer.getAttribute("width"),
			referWRel: refer.getBoundingClientRect().width,
			win: 0,
			play: null,
			drag: null,
			delays: [],
		}







	instancie.init = (function ii () {
		"use strict";

		for (var p in parametres)
			p.indexOf("delai") == 0 && game.delays.push(parametres[p]);

		parametres.hauteurInf = 1 - parametres.hauteur;

		commonLAg.Sound.init(parametres.sons);

		game.ratio = game.referWRel / game.referWAbs;

		$(".clock").get(0).getBoundingClientRect().width != parametres.clockLargeur //old devices
		&& $(".clock").removeClass("extra");

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

		game.duality = $("[data-dueljectif]").length;
		game.duality = game.duality > 0 && game.duality % 2 == 0 ? [] : false;

		$(".form").css(commonLAg.transition(game.delays[0], "opacity"));


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
		//this.state = null; /* null: starting; -1: invalid; 0: neutral; .5: almost; 1: valid */
		this.queue = commonLAg.doNothing;

		this.$dom = $pieces.eq(ind);
		this.$figure = $figures.eq(ind);
		this.$figure.data("instance", ind);

		this.$pos = this.$dom.find("path"); //first: with several path
		this.establish("toGrade"); //for this.calculate()

		this.SVGgroup = this.$dom.find("g")
		.attr("data-instance", ind)
		.get(0); //for this.calculate()

		this.$cloneGroup = this.establish("toClone", "g"); //duplicate <g to create drop zone
		this.$cloneImage = this.establish("toClone", "image"); //duplicate <image to play final

		this.dualize();
	/*	this.duel = null; //cf. Piece.prototype.armor */
	/*	this.$cloneDuel = null; //cf. Piece.prototype.armor */
	/*	this.$againClone = null; //cf. Piece.prototype.againHelper */
	}







/* Class methods */

	Piece.calculate = function () {
		"use strict";
		pieces.forEach(function (val) {
			"use strict";
			val.calculate();
	});	}

	Piece.repos = function () { //added later
		"use strict";
		game.windW = $w.width();
		pieces.forEach(function (val) {
			"use strict";
			val.$figure.hasClass("dragDragged")
			&& val.repos(val.$figure.offset().left, false);
			val.calculate();
	});	}

	Piece.playable = function (which) {
		"use strict";
		game.play = which;
		$(".dragClick").removeClass("dragClick");
		$b.removeClass("dragOver");
		// game.hover = null;
		which != null
		&& pieces[which].$figure.addClass("dragClick")
		.css("z-index", ++parametres.index)
		&& $b.addClass("dragOver")
		&& (game.drag = which);
		// && (game.drag = game.hover = which);
	}

	Piece.appreciate = function (cl) {
		"use strict";
		$stage.addClass(cl);
		setTimeout(function () {
			$svgBg[cl].css(commonLAg.transition(game.delays[0]));
			$stage.removeClass(cl);
			setTimeout(function () {
				$svgBg[cl].removeAttr("style");
			}, game.delays[0] + 100);
		}, game.delays[1]);
		commonLAg.sounds[cl].turnon();
		return true;
	}

	Piece.manageDrop = function (state) {
		"use strict";
		this.data("full", ! state);
	}

	Piece.win = function (del) {
		"use strict";

		if ($(".dragSimili").length)
			return setTimeout(function () {
				"use strict";
				Piece.hybrid();
			}, game.delays[0] + 50);

		var time = game.clock.getTime() - 1; //less 1 bad id.
		game.clock.stop();
		pieces.forEach(function (val) {
			"use strict";
			val.$cloneGroup.draggable("disable");
		});

		$game.addClass("bravo");
		$drawer.html(
			parametres.message1
			+ parametres.message3
			+ time
			+ parametres.message4
	);	}


/* Class methods for jQuery UI events manager */

	Piece.toBrand = function (ev, ui) { //drag: start
		"use strict";
		var $t = $(this),
			instance = $t.data("instance"),
			piece = pieces[instance],
			harvest = $t.offset();
		clearTimeout(piece.tmt);
		clearTimeout(game.toEnd);
		game.drag = instance;
		Piece.playable(null);
		piece.playLeft = harvest.left;
		piece.playTop = harvest.top;
		game.time();
		$t.addClass("dragOriginal justAMoment");
		return ui.helper.addClass("dragClone");
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

		var piece = pieces[$(this).data("instance")],
			harvest = ui.helper.offset(),
			left = harvest.left - game.windW * .5; //added later

		harvest.top < 10
		&& (harvest.top = 10);
		game.deshybr[game.hybrid](ui.draggable); //serve to final Piece.hybrid()
		// game.drag = null;

		piece.place({
			left: piece.repos(game.windW / 2 + left, left),
			top: (harvest.top - (game.windH * parametres.hauteur)) / (game.windH * parametres.hauteurInf) * 100 + "%",
			replayable: harvest
	});	}

	Piece.toCheck = function (ev, ui) { //drop: drop (coming before toFix)
		"use strict";
		var indDrop = $stage.data("aera")[0],
			indDrag = ! $(this).has(ui.draggable).length ? //via #figure g equals recursive drag and drop
				ui.draggable.data("instance")
				:
				ui.helper.data("instance"); //a placed piece is drag and drop again (via #figure g - cf. this.$cloneGroup.draggable in finish())

		switch (indDrop) {
			case -1:
				break;
			case indDrag:
				pieces[indDrop].queue = Piece.prototype.finish;
				break;
			default:
				(indDrag != $stage.data("aera")[1])
				&& Piece.appreciate("nok")
				|| (pieces[indDrag].queue = Piece.prototype.stay);
	}	}

	Piece.toCheckClick = function () { //click: drag, and can drop
		"use strict";
		var $t = $(this),
			instance = $t.data("instance"),
			duel = $t.data("duel");

		if ($t.data("full"))
			return $stage.data("aera", [-1, undefined]);

		switch (game.play) {
			case null:
				break;
			case instance:
				pieces[game.play].finish(0);
				break;
			case duel:
				pieces[game.play].stay(0);
				break;
			default:
				Piece.appreciate("nok")
	}	}


/* Provisional prototype */

	Piece.establish = { }
	// Piece.establish.sort = function (a, b) {
	// 	"use strict";
	// 	return a[1] - b[1];
	// }
	Piece.establish.toGrade = function () {
		"use strict";
/*
first: with several path

		this.$posX = this.$posY = this.$dom.find("path");
*/
		// var $p = this.$dom.find("path"),
		// 	X = [],
		// 	Y = [],
		// 	harvest,
		// 	x, y;
		// $p.each(function (ind) {
		// 	"use strict";
		// 	harvest = $(this).offset();
		// 	X.push([ind, harvest.left]);
		// 	Y.push([ind, harvest.top]);
		// });
		// X.sort(Piece.establish.sort);
		// Y.sort(Piece.establish.sort);
		// this.$posX = $p.eq(X[0][0]);
		// this.$posY = $p.eq(Y[0][0]);

		this.reset();
		parseInt(this.$figure.width(), 10) === 0 //Google Chrome 34 Mac OS X 10.8.5: and apparently iPad
		&& this.$dom.css("width", this.$dom.css("height"));
			//http://stackoverflow.com/questions/27169534/in-google-chrome-getboundingclientrect-x-is-undefined
			//http://stackoverflow.com/questions/22894461/getboundingclientrect-doesnt-work-outside-the-window
		//http://stackoverflow.com/questions/tagged/getboundingclientrect
	}
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

	Piece.prototype.reset = function () {
		"use strict";
		this.$figure.css("height", "100%");
		this.$dom.css({
			"margin": 0,
			"height": "200%"
		});
		this.wixer();
	}
	Piece.prototype.wixer = commonLAg.msieUp11 ?
		function () { //MSIE: dimensions of svg
			"use strict";
			this.$dom.css({
				"width": this.$dom.css("height")
		});	}
		:
		commonLAg.doNothing;

	Piece.prototype.calculate = function () {
		"use strict";
		var dimension, harvest1, harvest2, x, y, w;

		this.reset();

		dimension = this.SVGgroup.getBoundingClientRect();
		harvest1 = this.$figure.offset();
		harvest2 = this.$pos.offset();

		x = harvest2.left - harvest1.left - 3; //- 3 : padding for usability and filter
		x < 0
		&& (x = 0);
		y = harvest2.top - harvest1.top;
		w = dimension.width + 6;
		this.$dom.css({
			"margin": - y + "px 0 0 -" + x + "px",
			"height": this.$dom.height()
		});
		this.$figure.css({
			"width": w,
			"height": Math.floor(dimension.height)
	});	}

	Piece.prototype.repos = function (pos, back) { //added later (no drop piece out of body, and no piece out of body after resizing window)
		"use strict";
		var miw = game.windW / 2,
			marge = Math.ceil(game.windW * .04),
			dim, action;
		marge = marge > 10 ? 10 : marge;
		(	(miw == marge)
			&& (action = true)
			&& (pos = 0)	)
		||
		(	pos < marge
			&& (action = true)
			&& (pos = marge - miw)	)
		||
		(	(dim = this.$figure.width())
			&& (pos > game.windW - dim - marge)
			&& (action = true)
			&& (pos = miw - dim - marge)	)
		return action ?
			(	back ?
					pos
					:
					this.$figure.css("left", pos)	)
			:
			back;
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

	Piece.prototype.place = function (args) {
		"use strict";

		var piece = this; //setTimeout...

		game.drag = null;

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
			|| commonLAg.touch //added later
			|| Math.sqrt(
				Math.pow(Math.abs(piece.playLeft - args.replayable.left), 2)
				+ Math.pow(Math.abs(piece.playTop - args.replayable.top), 2)
			) > parametres.dropCourt ?
			null : piece.instance
		);

		piece.queue(game.delays[0]);
	}

	Piece.prototype.finish = function (del, app, stop) {
		"use strict";
		var $f = this.$figure,
			delay = typeof del != "undefined" ? del : game.delays[0];

		// this.state = 1;

		this.queue = commonLAg.doNothing;
		Piece.appreciate(app || "ok");
		game.win ++;
		$f.css(commonLAg.transition(delay, "opacity"))
		.addClass("dragDropped");
		setTimeout(function () {
			"use strict";
			$f.css("z-index", -1);
		}, delay);

		if (! stop) { //cf. Piece.prototype.stay()
			this.$cloneGroup.attr("class", "g");
			this.$cloneImage.css(commonLAg.transition(delay, "opacity"))
			.attr("class", "image");

			this.finishToDragAgain($f, false);
		}

		game.win == game.total
		&& Piece.win(delay);
	}

	Piece.prototype.finishToDragAgain = function (fig, duel) {
		"use strict";
		var that = this;

		Piece.manageDrop.call(this.$cloneGroup, false);

		this.$cloneGroup.draggable("instance")
		&& this.$cloneGroup.draggable("enable");

		this.$cloneGroup.draggable({
			addClasses: false,
			cursorAt: {
				left: fig.width() / 2,
				top: fig.height() / 2
			},
			helper: function (ev) {
				"use strict";
				return that.againHelper(ev, fig);
			},
			start: function () {
				"use strict";
				that.againStart(duel);
			},
			drag: Piece.toBrandTactile,
			stop: function () {
				"use strict";
				that.againStop(fig);
	}	});	}

	Piece.prototype.againHelper = function (ev, fig) {
		"use strict";

		fig.css(commonLAg.transition(0, "opacity"))
		.css("z-index", -1)
		.removeClass("dragDropped dragSimili");

		this.$againClone = fig.clone()
		.data("instance", fig.data("instance"))
		.css("z-index", ++parametres.index)
		.addClass("dragAgain")
		.position({
			of: ev
		})
		.appendTo($drawer);

		return Piece.toBrand.call(fig, null, { helper: this.$againClone });
	}

	Piece.prototype.againStart = function (duel) {
		"use strict";

		Piece.manageDrop.call(this.$cloneGroup, true);

		game.win --;

		this[! duel ? "$cloneImage" : "$cloneDuel"].css(commonLAg.transition(0, "opacity"))
		.attr("class", "")
		this.$cloneGroup.attr("class", "");
	}

	Piece.prototype.againStop = function (fig) {
		"use strict";

		this.$cloneGroup.draggable("disable")

		Piece.toFix.call(fig, null, { helper: this.$againClone });
	}


/* Conditionnal methods: puzzle with possible "hybridation" cf. data-dueljectif */

	! game.duality
	&& (Piece.prototype.dualize = Piece.armor = Piece.prototype.armor = Piece.hybrid = commonLAg.doNothing)

	|| ((Piece.prototype.dualize = function () {
			"use strict";
			var duel = this.$figure.data("dueljectif");
			duel
			&& game.duality.push(duel);
		})

		&& (Piece.armor = function () {
			"use strict";
			var p;
			game.duality.sort();
			for (var i = 0, lg = game.duality.length; i < lg; i += 2) {
				p = $("[data-dueljectif='" + game.duality[i] + "']");
				pieces[p.eq(0).data("instance")].armor(p.eq(1).data("instance"), game.duality[i], true);
		}	})

		&& (Piece.prototype.armor = function (comp, duel, first) {
			"use strict";

			var harvestObj = this.$cloneGroup.offset(),
				pieceComp = pieces[comp],
				harvestComp = pieceComp.$cloneGroup.offset();

			this.duel = [comp, duel]; //duel: if personnalized message to user
			this.$cloneGroup.data("duel", comp);
			this.$cloneDuel = pieceComp.establish("toClone", "image"); //duplicate duel <image to play final
			this.$cloneDuel.attr({
				"x": (harvestObj.left - harvestComp.left) / game.ratio,
				"y": (harvestObj.top - harvestComp.top) / game.ratio
			});

			first
			&& pieceComp.armor(this.instance, duel);
		})

		&& (Piece.prototype.stay = function (del) {
			"use strict";
			var $f = this.$figure,
				delay = typeof del != "undefined" ? del : game.delays[0],
				piece = pieces[this.duel[0]];

			// this.state = .5;

			this.finish(null, "almost", true);

			$f.addClass("dragSimili");

			piece.$cloneGroup.attr("class", "g");
			piece.$cloneDuel.css(commonLAg.transition(delay, "opacity"))
			.attr("class", "image");

			piece.finishToDragAgain($f, true);
		})

		&& (Piece.hybrid = function (del) {
			"use strict";

			var $simili = $(".dragSimili");

			game.deshybr[1] = function (uid) {
				"use strict";
				uid
				&& uid.removeClass("dropHybrid"); //to erase shadow of .dragOriginal
				$("#message").remove();
				! $(".dropHybrid").length
				&& (game.hybrid = 0);
			}
			game.hybrid = 1;

			(parametres.formul.hybridHelp === "true") //to indicate which pieces are 'hybrids':
			&& $simili.removeClass("dragDropped dragSimili")
			.css({
				"z-index": ++parametres.index
			})
			.each(function () {
				"use strict";
				var $t = $(this),
					piece = pieces[pieces[$t.data("instance")].duel[0]];
				piece.$figure.addClass("dropHybrid");
				piece.$cloneDuel.attr("class", "");
				piece.$cloneGroup.attr("class", "");
				Piece.manageDrop.call(piece.$cloneGroup, true);
			})
			&& (game.win -= $simili.length); //done by againStart() without indication of which pieces are 'hybrids'

			$("<div>", { id: "message", html: parametres.message1 + parametres.message2 })
			.prependTo($drawer);
	})	);







//Classical events ----------------------------------------------------------------------------
	instancie.classicalEvents = function () {
		"use strict";

		var clickToMove = ! commonLAg.touch ? //added later
			[
				function (ze) { //MOUSE: click on $piecesGroups
					"use strict";
					ze.preventDefault();
					game.time();
					var ind = $(this).data("instance");
					! pieces[ind].$figure.hasClass("justAMoment") //by clicked with short drag: vs Piece.playable
					&& Piece.playable(game.play == ind ? null : ind);
				},
				function (ze) { //MOUSE: click on body
					"use strict";
					var ind = game.play,
						left, h, pY;
					if (ind == null || pieces[ind].$figure.has($(ze.target)).length)
						return;
					left = ze.pageX - (pieces[ind].$figure.width() / 2) - game.windW * .5; //added later
					h = pieces[ind].$figure.height() / 2;
					pY = ze.pageY;
					pY = pY < h + 10 ? h + 10 : pY;
					Piece.playable(null);
					pieces[ind].place({
						left: pieces[ind].repos(game.windW / 2 + left, left),
						top: (pY - h - (game.windH * parametres.hauteur)) / (game.windH * parametres.hauteurInf) * 100 + "%",
						replayable: false
				});	}
			]
			:
			[commonLAg.doNothing, commonLAg.doNothing]; //TACTILE (nor MSIE): no pseudo drag and drop on click

		$w.on({
			resize: function () {
				"use strict";
				clearTimeout(game.timt);
				game.windW = $w.width();
				game.windH = $w.height();
				game.timt = setTimeout(Piece.repos, game.delays[3]);

				game.referWRel = refer.getBoundingClientRect().width;
				game.ratio = game.referWRel / game.referWAbs;
		}	});

		$b.on({
			click: clickToMove[1]
		});

		$levels.on({
			change: function () {
				"use strict";
				$stage.removeClass("lev1 lev2 lev3").addClass($(this).val());
		}	})
		.eq(1).prop("checked", true);

		$piecesGroups.on({
			click: clickToMove[0],
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
				}, game.delays[3]);
			},
			touchend: function () {
				"use strict";
				$(this).trigger("mouseout");
		}	});

		$targetGroups.on({
			click: Piece.toCheckClick,
			mouseover: function (ze) {
				"use strict";

				var $t = $(this),
					cl,
					filigree;
				// if ($t.data("over")) //to do: pb of <path no contigous ?
				// 	return;
				// $t.data("over", true);

				if ($t.data("full"))
					return $stage.data("aera", [-1, undefined]);

				$stage.data("aera", [$t.data("instance"), $t.data("duel")]);

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
				// $t.data("over", false);
				$stage.data("aera", [-1, undefined]);

				//filigree :
				$t.data("filigree")
				&& $t.data("timet", setTimeout(function () {
					"use strict";1
					if (! $t.data("filigree") || $t.data("filigree").attr("class") == "image")
						return;
					$t.data("filigree").attr("class", "");
					$t.attr("class", "");
					$t.data("filigree", false);
				}, game.delays[3]));
		}	});

		$see.on({ //nothing by default
			click: function (ze, next, follow) {
				"use strict";

				var ind = typeof next != "undefined" ? next : 0,
					$f, //to do: randomize ?
					$g,
					$gTarget;

				ze.preventDefault();

				if (ind < game.total && parametres.regex[0].test($(".figure:eq(" + ind + ")").attr("class")))
					return $see.trigger("click", [++ind, follow]);

				$f = $(".figure:eq(" + ind + ")");
				$g = $f.find("g");
				$g.trigger("click");
				$gTarget = $("#figure [data-instance='" + $g.data("instance") + "']");//or pieces[$g.data("instance")].$cloneGroup ?
				$gTarget.attr("class") == "g"
				&& ($gTarget = $("#figure [data-instance='" + $gTarget.data("duel") + "']"))
				&& $f.addClass("dragSimili").
				css({
					"left": $gTarget.offset().left + ($f.width() / 2) - game.windW * .5,
					"top": ($gTarget.offset().top + ($f.height() / 2) - (game.windH * parametres.hauteur)) / (game.windH * parametres.hauteurInf) * 100 + "%",
				});
				$gTarget.trigger("click");

				follow
				&& game.total > ind
				&& (game.toEnd = setTimeout(function () {
					"use strict";
					$see.trigger("click", [++ind, true]);
				}, game.delays[5]));
		}	});

		$("#see2").on({ //nothing by default
			click: function (ze) {
				"use strict";
				$see.trigger("click", [0, true]); //to do: déshybridation
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
		if (parametres.formul.melting === "true") {
			while (0 !== currentIndex) {
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;
				temporaryValue = shuffle[currentIndex];
				shuffle[currentIndex] = shuffle[randomIndex];
				shuffle[randomIndex] = temporaryValue;
			}
			$drawer.html(shuffle.join("</figure>"));
		}

		$figures = $(".figure");
		$pieces = $(".figure svg");
		$piecesGroups = $(".figure g");

		$pieces.each(function (ind) {
			"use strict";
			pieces.push(new Piece(ind));
		});

		Piece.calculate();
		Piece.armor();
		delete Piece.establish;
		delete Piece.prototype.establish;

		$targetGroups = $stage.find("g");

//Drag and drop events
		instancie.uiEvents
		&& instancie.uiEvents()
		|| (instancie.uiEvents = (function uie () {
			"use strict";

			$figures.draggable({
				addClasses: false,
				helper: "clone",
				cursor: "move",
				disabled: true,
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

		$stage.data("aera", [-1, undefined]);

		$drawer.removeClass("establishing");

		e && instancie.classicalEvents();
	}
	instancie(true); //can not be called a second time without Piece.establish cf. delete Piece.establish




/*
TO DO
<!-- to do: labels, champ de soumission ? -->
au click trigger le drag plutôt que passer par le curseur ?
	position() ne semble plus possible après draggable
laisser le deuxième click désactiver le drop au click ????
	le deuxième click fonctionne partout sauf sur une autre pièce
		car c'est alors l'autre pièce qui devient déplaçable au click suivant
	?? suffisamment intuitif ?
quid du bouton aller au résultat ? si oui, avec effets ?


QUESTIONS
Error: cannot call methods on draggable prior to initialization; attempted to call method 'disable'
	jquery-....min.js (ligne 2, col. 1808)

pointer-events "Does not work on SVG elements in Safari 5.1 or Android <= 4.1"
constat ancien : compat Safari oiseau unique tête indropable ?


SVG
"empreinte" partie supérieure (et inféfieure) du svg "stage"
<!-- to do : better way fonds ok nok...-->
	GC fond blanc via les CSS, sans <rect sup ?
	<!-- enable-background="new 0 0 726 726" -->


CONFORMITE DU SVG GENERE
<g data-instance="n"
	n'est pas conforme
	mais comme il s'agit d'éléments clonables, il est plus difficile de passer par $element.data()
*/



});
