/*
	par Ludwik : Parc naturel des Alpilles, jeu du classement
	Gaëtan Langhade - Interfacteur
	février 2015
*/


/* Paramètres */
;var parametres = {

	total: 4,
	total: null, //configuré par le nombre d'images d'oiseaux //to do: CSS entre 2 et n oiseaux

	serie: 1, //set initial
	jeu: "Série ",


	collection: window.oiseaux, //cf. jeu-classement-fiche.js
	infos: {},

	delai0: 400,
	delai1: 600,
	delai2: 75,
	delai3: 200,
	delai4: 1000,
	delai5: 1100,

	bgColor: "#445",

	scrollBar: 34,

	padding: 48, //.bravo .hipster dans les CSS

	sounds: {
		drop: "audio/confirmation/correct",
		win: "audio/confirmation/wrong"
	},

	details: ["<br>", "<span>", "</span>"],

	// scale: 300,

	transition: function (delai, prop) {
		var pr = prop ? prop + " " : "";
		return {
			"-webkit-transition": pr + delai + "ms",
			"-moz-transition": pr + delai + "ms",
			"-o-transition": pr + delai + "ms",
			"transition": pr + delai + "ms"
	}	},

	re: [/(src=")([^"]+)(" data-fiche=")([^"]+)(")/gi]
		// var $li = code.replace(/\r|\n|\t/g,"").match(/<li.*?>.+?<\/li>/)[0];
}
delete window.oiseaux; //to do: check "ramasse-miettes"


/*
to do au 150213 :

et entre 2 et n pièces ?

tests de compatibilité dont terminaux mobiles
IE 9 et terminaux mobiles

détection du support de
	section via Modernizr
	audio via Modernizr
	forEach
	Object.keys
=> d'où page alternative

ergo et habillage

attributs ARIA ?
surtout au clavier
*/


$(function () {
	"use strict";

	var abalities = {
		scrollBar: 34,
		sounds: {
			audio: document.createElement("audio"),
			format: function () {
				return !! abalities.sounds.audio.canPlayType ? (
						abalities.sounds.audio.canPlayType("audio/mpeg") ? ".mp3" :
						abalities.sounds.audio.canPlayType('audio/ogg; codecs="vorbis"') ? ".ogg" :
						false
					) : false;
		}	}	},
//Generic variables ----------------------------------------------------------------------------
		$w = $(window),
		$b = $("body"),
		$hipster = $("#hipster"),
		code = $hipster.html(),
		$sliding = $("#sliding"),
		$toslide = $(".sliding"),
		$order = $("#order"),
		$again = $("#again"),
		delays = [],
		sounds = [],
		games = [],
		wids = [],
		//to actualize at 'play again' and at 'play with other birds':
		$birds = $(".birds"),
		$sizes = $(".sizesB"),
		hipsterWidthX, hipsterWidthS,
		hipsterHeightX, hipsterHeightS,
		birds, sizes,
		panel, ratio;

	parametres.serie > $birds.length
	&& (parametres.serie = 1);

	for (var p in parametres)
		p.indexOf("delai") == 0 && delays.push(parametres[p]);

	for (var p in parametres.collection) { //series of birds from window.oiseaux
		for (var i = 0; i < parametres.collection[p].param.jeux.length; ++i) { //(very short Array)
			sizes = parametres.collection[p].param.jeux[i] - 1; //transcient value of sizes
			typeof games[sizes] != "undefined"
			&& games[sizes].push(p)
			|| (games[sizes] = [p]);
	}	}
	games.forEach(function (val, ind) { //not in alphabetical order
		val.sort(function (a, b) {
			return .5 - Math.random();
	});	});

	$(".order").css(parametres.transition(delays[4],"opacity"));

	instancie.init = function ii (cllbck) { //actualize variables (at loading, and 'play again' and 'play with other birds')
		"use strict";

		hipsterWidthX = $hipster.innerWidth();
		hipsterWidthS = hipsterWidthX - abalities.scrollBar;
		hipsterHeightX = $hipster.innerHeight();
		hipsterHeightS = $hipster.find("li:eq(0)").innerHeight();

		birds = [];
		sizes = [];
		$birds = $(".birds");
		$sizes = $(".sizesB");
		parametres.total = $birds.length;
		parametres.infos = {};
		panel = 0;

		$hipster.css(parametres.transition(delays[4]));

		$birds.each(function (ind) {
			"use strict";
			var brd = $(this).data("fiche");
			parametres.infos[brd] = parametres.collection[brd];
			sizes = sizes.concat(parametres.infos[brd].param.jeux); //transcient value of sizes to determin wich game
		});
		sizes.sort(function (a, b) {
			return a - b;
		});
		for (var i = 0, ln = sizes.length; i < ln; ++i) {
			if (sizes[i] == sizes[i + parametres.total - 1]) { //to determin which game from the HTML code
				birds = sizes[i]; //transcient value of birds
				break;
		}	}
		parametres.serie = typeof instancie.init != "function" ? parametres.serie : birds; //not yet a function when loading
		parametres.serie != birds
		&& (parametres.bis = true) //if difference between parameters and HTML code when at load
		|| ((games[parametres.serie - 1] = [])
			&& $birds.each(function (zi) { //from HTML code
				games[parametres.serie - 1].push($(this).data("fiche"));
			}));
		$toslide.attr("data-jeu", parametres.jeu + parametres.serie);	

		birds = [];
		sizes = [];

		for (var p in parametres.infos) {
			panel += parametres.infos[p].param.taille;
			sizes.push([parametres.infos[p].param.taille,p]); //transcient value of sizes
		}

		sizes.sort(function (a,b) { //(another use of sizes)
			"use strict";
			return a[0] - b[0];
		})
		.forEach(function (val, ind) {
			"use strict";
			$("[data-fiche='" + val[1] + "']").data("size",++ind);
		});

		ratio = (sizes[0][0] + sizes[parametres.total - 1][0]) / 2;

		sizes = [];

		cllbck && cllbck();

		return ii;
	} ();







//Pseudo-classe Bird ----------------------------------------------------------------------------
	function Bird (ind, end) {
		"use strict";
		if (! this instanceof Bird)
			throw new Error("Attention à l'instanciation");
		this.$dom = $birds.eq(ind);
		this.stateOut = false;
		this.picSrc = this.$dom.attr("src");
		this.term = Number(this.$dom.data("size"));
		this.infos = this.$dom.data("fiche");
		this.fiche = parametres.infos[this.infos];
		this.$dom.attr("alt",this.fiche.Nom);
		this.drag();
	}

	Bird.prototype.drag = function () { //jQuery UI events
		"use strict";
		this.$dom.draggable({
			addClasses: false,
			start: Bird.dragSt,
			stop: Bird.dragSt
	});	}

	Bird.manage = function (state) { //disable or enable jQuery UI events
		"use strict";
		if ($hipster.data("stop"))
			return;
		for (var p in birds)
			birds[p].$dom.draggable(state);
	}

//on start and on stop
	Bird.dragSt = function (ev, ui) { //this === draggable() jQuery UI
		"use strict";

		if ($hipster.data("stop"))
			return;

		var birdDrag = birds["b" + $(this).data("size")],
			evStart = ev.type == "dragstart";

		birdDrag.$dom[(evStart ? "add" : "remove") + "Class"]("birds-dragging");

		(	evStart //to do: to check: jQuery UI does it on Firefox but not on webkit ?
			&& birdDrag.$dom.css({
				"width": birdDrag.$dom.width(),
				"height": birdDrag.$dom.height()
		})	)
		|| 
		(	birdDrag.stateOut
			&& Size.draggedDrop.prepare().dom()
	);	}

//final win scale
	Bird.prototype.toscale = function (dimW, dimM, cllbck) {
		"use strict";

		if ($hipster.data("stop"))
			return;

		dimM + dimW < hipsterHeightS
		&& this.stateDrop.$dom.animate({ "width": dimW }, delays[0])
		|| this.stateDrop.$dom.animate({ 
			"width": dimW,
			"height": dimM + dimW
		}, delays[0], "easeInCubic");

		this.stateDrop.$figure.css({ "border-radius": 0 })
		.animate({
			"height": dimW,
			"margin-top": dimM
		}, delays[0], "easeInCubic");

		this.$dom.css({ "width": this.$dom.width()})
		.addClass("drag-result")
		.animate({
			"width": dimW,
			"height": dimW
		}, delays[0], "easeInCubic", cllbck); //to do: define ligature here ?
	}

//final win organization
	Bird.prototype.ligature = function () {
		"use strict";
		if ($hipster.data("stop"))
			return;
		var n = this.term - 1;
		this.toscale(wids[n], (wids[parametres.total - 1] - wids[n]) / 2, function () {
			"use strict";
			birds["b" + (n + 2)].ligature();
	});	}

	Bird.prototype.ligature.tie = function () {
//	Bird.tie = function () { //overload prototype 'ligature' for the last instance
		//to do: method of constuctor, like Bird.tie ? method of method of prototype ?
		"use strict";

		if ($hipster.data("stop"))
			return;

		this.toscale(wids[parametres.total - 1], 0, function () {
			"use strict";
			$b.addClass("confirmation")
			.removeClass("no-transition");
			sizes.forEach(function (val) {
				val.$figcaption.html(
					parametres.details[1]
					+ val.stateDrop.fiche.Nom
					+ parametres.details[0]
					+ val.stateDrop.fiche.Longueur
					+ parametres.details[2]
				)
				.css("top", - parseInt(val.$figure.css("margin-top")) - 44);
	});	})	}

//match final win states
	Bird.result = function () {
		"use strict";

		if ($hipster.data("stop"))
			return;

		var wid = 0;

		Size.manage("disable");
		$b.addClass("bravo");
		$hipster.css({
			"width": hipsterWidthX,
			"height": hipsterHeightX
		});

		parametres.scale = hipsterWidthS / panel * ratio;

		for (var i = 1; i <= parametres.total; ++i) {
			(	i == parametres.total
				&& wids.push(hipsterWidthS - wid))
			||
			(	wids.push(Math.floor(parametres.scale * birds["b" + i].fiche.param.taille / ratio))
				&& (wid += wids[i - 1]));
		}

		$b.addClass("no-transition");

		$hipster.animate({
			"height": wids[parametres.total - 1] + parametres.padding
		}, delays[1], "linear", function () {
			"use strict";
			birds["b1"].ligature();
		});

		return true;
	}







//Pseudo-classe Size ----------------------------------------------------------------------------
	function Size (ind) {
		"use strict";
		if (! this instanceof Size)
			throw new Error("Attention à l'instanciation");
		this.$dom = $sizes.eq(ind);
		this.$dom.css(parametres.transition(delays[1]));
		this.term = ind + 1;
		this.stateDrop = birds["b" + this.$dom.find("img").data("size")];
		this.stateOver = this.stateDrop;
		this.$figure = this.$dom.find(".nest:eq(0)");
		this.$figure.css(parametres.transition(delays[1]));
		this.$figcaption = this.$figure.find(".nest-caption:eq(0)");
		this.$figcaption.css(parametres.transition(delays[1]));
		this.position();
		this.drop();
	}

	Size.prototype.drop = function () { //jQuery UI events
		"use strict";
		this.$dom.droppable({
			addClasses: false,
			tolerance: "pointer",
			out: Size.draggedOut,
			over: Size.draggedOver,
			drop: Size.draggedDrop
	});	}

	Size.manage = function (state) { //disable or enable jQuery UI events
		"use strict";
		if ($hipster.data("stop"))
			return;
		sizes.forEach(function (val) {
			val.$dom.droppable(state);
			val.stateDrop.$dom.draggable(state);
	});	}

	Size.prototype.position = function () { //position on the page
		"use strict";
		this.max = this.$dom.width();
		this.pos = this.$figure.offset();
	}

	Size.prototype.filifree = function () { //remove filigree
		"use strict";
		if ($hipster.data("stop"))
			return;
		this.$dom.removeClass("sizesB-over").find("figcaption").css("background-image", "none");
	}

	Size.prototype.result = function (n) { //direct to final
		"use strict";

		if ($hipster.data("stop"))
			return;

		var sizeToBeDropped = this,
			birdToDrop = birds["b" + this.term],
			$birdToDrop = birdToDrop.$dom;

		Bird.manage("disable");

		$birdToDrop.stop(true)
		.animate({
			"left": sizeToBeDropped.pos.left - birdToDrop.stateOver.pos.left,
			"top": birdToDrop.stateOut ?
				sizeToBeDropped.pos.top - birdToDrop.stateOver.pos.top :
				birdToDrop.stateOver.pos.top - sizeToBeDropped.pos.top - (hipsterHeightS / 3)
		}, delays[1]);

		Size.draggedOver.call(sizeToBeDropped.$dom, null, {
			draggable : $birdToDrop 
		}, {
			callback: function () {
				"use strict";
				if ($hipster.data("stop"))
					return;
				Size.draggedDrop.call(sizeToBeDropped.$dom, null, {
					draggable : $birdToDrop
				}, function () { //cf. cllbck de draggedDrop
					"use strict";
					if ($hipster.data("stop"))
						return;
					n < parametres.total
					&& sizes[n].result(n + 1); 
	});	}	});	}

//on out
	Size.draggedOut = function (ev, ui) { //this === droppable() jQuery UI
		"use strict";

		if ($hipster.data("stop"))
			return;

		var birdDragOut = birds["b" + ui.draggable.data("size")];
		birdDragOut.stateOut = true; //set 'false' in 'drop', not in 'over'
		birdDragOut.$dom.addClass("drag-out");

		sizes[$sizes.index($(this))].filifree();
	}

//on over
	Size.draggedOver = function (ev, ui, args) { //this === droppable() jQuery UI
		"use strict";

		if ($hipster.data("stop"))
			return;

		var sizeInstance = sizes[$sizes.index($(this))], //dropped zone
			birdDropZone = sizeInstance.stateOver, //bird over the dropped zone
			birdInstance = birds["b" + ui.draggable.data("size")], //dragged bird
			sizeDragBird = birdInstance.stateOver, //origin over zone of the dragged bird
			birdStages = Math.abs(sizeDragBird.term - sizeInstance.term), //stages between sizes
			delay = delays[1],
			tocallback = false,
			callback = false,
			pathDrag, I, pathDragBis, timeout;
		if (args) {
			args.delay && (delay = args.delay);
			args.tocallback && (tocallback = args.tocallback);
			args.callback && (callback = args.callback);
		}

		ev !== null //only from mouse action
		&& sizeInstance.$dom.addClass("sizesB-over")
		&& sizeInstance.$figcaption.css("background-image", "url(" + birdInstance.picSrc + ")");
		// && (birdInstance.stateOut = false); //in 'drop' because 'over' coming before 'out' from other zone

		if (birdDropZone === birdInstance) //recursive drag
			return callback ? callback() : null; //(trigger draggedDrop from a#order)
    
		if (birdStages == 1 || birdDropZone.stateOut) { //direct drop - or no visual bird over the dropped zone
			sizeDragBird.stateOver = birdDropZone; //to modify state of the origin zone of the dragged bird
			sizeInstance.stateOver = birdInstance; //to modify state of the the dropped zone
			birdDropZone.stateOver = sizeDragBird; //to modify state of the bird of the dropped zone
			birdInstance.stateOver = sizeInstance; //to modify state of the dragged bird
			callback
			&& setTimeout(function () {
				"use strict";
				if ($hipster.data("stop"))
					return;
				callback(); //(trigger draggedDrop from a#order)
			}, delay);
		}

		else { //indirect drop from distant zone
			pathDrag = new Array();
			timeout = delays[1] - delays[2];
			var I = sizeDragBird.term < sizeInstance.term ? 1 : -1;
			for (var i = sizeDragBird.term + I; i != sizeInstance.term + I; i += I)
				pathDrag.push(i - 1);

			pathDragBis = pathDrag; //(out drop zone...)
			pathDrag.forEach(function (val, ind) {
				"use strict";
				sizes[val].stateOver.stateOut
				&& (pathDragBis = pathDrag.slice(ind));
			});
			pathDrag = pathDragBis;
			pathDragBis = pathDrag.length - 1;

			pathDrag.forEach(function (val, ind) {
				"use strict";
				timeout += delays[2];
				Size.draggedOver.call(sizes[val].$dom, null, ui, {
					delay: timeout,
					tocallback: (callback || tocallback) ? (callback || tocallback) : false,
					callback: ((callback || tocallback) && ind == pathDragBis) ? (callback || tocallback) : false
		});	});	}

		birdStages == 1 //direct drop from neighboring zone
		&& ! birdDropZone.stateOut //with a visual bird over the dropped zone
		&& birdDropZone.$dom.css({ //to move bird of the dropped zone, to the origin zone of dragged bird
			"width": sizeInstance.max/*,
			"height": sizeInstance.max */
		})
		.addClass("drag-transition")
		.stop(true,true)
		.animate({
			"width": sizeDragBird.max,
			"height": sizeDragBird.max,
			"left": "+=" + (sizeDragBird.pos.left - sizeInstance.pos.left),
			"top": "+=" + (sizeDragBird.pos.top - sizeInstance.pos.top)
		}, delay);
	}

//on drop
	/*
		cllbck : cf. Size.prototype.result
	*/
	Size.draggedDrop = function (ev, ui, cllbck) { //this === droppable() jQuery UI
		"use strict";

		if ($hipster.data("stop"))
			return;

		Bird.manage("disable");

		! cllbck
		&& sounds["drop"].play();

		var sizeInstance = sizes[$sizes.index($(this))], //dropped zone
			birdInstance = birds["b" + ui.draggable.data("size")], //dragged bird
			sizeDragBird = birdInstance.stateDrop, //origin zone of the dragged bird
			birdStages = Math.abs(sizeDragBird.term - sizeInstance.term), //stages between sizes
			dimensions, delay, callback;
		if (sizeInstance.stateDrop == birdInstance) { //recursive drop
			dimensions = [0, 0];
			delay = 3;
			callback = "check";
		} else {
			dimensions = [
				sizeInstance.pos.left - sizeDragBird.pos.left,
				sizeInstance.pos.top - sizeDragBird.pos.top];
			delay = 1;
			callback = "dom";
		}

		birdInstance.stateOut = false;

		birdInstance.$dom.removeClass("drag-out")
		.stop(true)
		.css({ //to move the dragged bird to the dropped zone
			"width": birdInstance.$dom.width() //not sizeDragBird.max because of possible stateOut with drop(s)
		})
		.addClass("drag-transition")
		.animate({
			"width": sizeInstance.max,
			"height": sizeInstance.max,
			"left": dimensions[0],
			"top": dimensions[1]
		}, delays[delay], function () {
			"use strict";
			if ($hipster.data("stop"))
				return;
			sizeInstance.filifree();
			Size.draggedDrop.prepare()[callback](cllbck); //.dom() or .check()
	});	}

	Size.draggedDrop.prepare = function () { //before .dom and .check
		if ($hipster.data("stop"))
			return;
		$hipster.addClass("drop-transition");
		$(".drag-transition").removeClass("drag-transition");
		return Size.draggedDrop;
	}

//on drop: after: to reorganize dom
	/*
		cllbck : cf. Size.prototype.result
	*/
	Size.draggedDrop.dom = function (cllbck) { //re-organize DOM
		"use strict";

		var methClass;

		if ($hipster.data("stop"))
			return;

		sizes.forEach(function (val) {
			"use strict";

			val.stateOver.$dom.stop(true,true);
			
			if (val.stateOver == val.stateDrop)
				return;

			methClass = "removeClass";

			(	val.stateOver.stateOut
				&& val.stateOver.$dom.css({
					"width": val.stateOver.$dom.width(),
					"left": "+=" + (val.stateOver.stateDrop.pos.left - val.pos.left),
					"top": "+=" + (val.stateOver.stateDrop.pos.top - val.pos.top)
				})
				&& (methClass = "addClass")
			) || val.stateOver.$dom.removeAttr("style");

			val.stateOver.$dom[methClass]("drag-out")
			.prependTo(val.$figure);

			val.stateDrop = val.stateOver;
			val.stateOver.stateOver = val;
			val.stateOver.stateDrop = val;
		});

		Size.draggedDrop.check(cllbck);
	}

//on drop: after: to check game
	/*
		cllbck : cf. Size.prototype.result
	*/
	Size.draggedDrop.check = function (cllbck) { //check if win
		"use strict";

		var bravo = 0;

		if ($hipster.data("stop"))
			return;

		$hipster.removeClass("drop-transition");

		sizes.forEach(function (val, ind) {
			! val.stateDrop.stateOut
			&& (bravo += (val.term == val.stateDrop.term));
		});

		(	
			bravo == parametres.total
			&& sounds["win"].play()
			&& Bird.result()
		)
		|| (
			cllbck
			&& cllbck() //cf. Size.prototype.result
		)
		|| Bird.manage("enable");
	}







//Pseudo-classe Sound ----------------------------------------------------------------------------
	function Sound (source) {
		"use strict";
		if (! this instanceof Sound)
			throw new Error("Attention à l'instanciation");
		this.source = source + abalities.sounds.format();
	}
	if (abalities.sounds.format()) {
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

	for (var p in parametres.sounds)
		sounds[p] = new Sound(parametres.sounds[p]);







//Events management ----------------------------------------------------------------------------
	$w.on({
		resize: function (ze) {
			"use strict";

			clearTimeout(parametres.sttmt);
			parametres.sttmt = setTimeout(function () {
				$b.removeClass("no-transition");
			}, delays[5]);
			$b.addClass("no-transition");

			hipsterWidthX = $hipster.innerWidth();
			hipsterWidthS = hipsterWidthX - abalities.scrollBar;

			sizes.forEach(function (val) {
				val.position();
	})	}	});

	$hipster.organize = function (write) {
		"use strict";

		$(":animated").stop(true,true);

		$b.addClass("stop")
		.removeClass("direct bravo confirmation");

		$hipster.data("stop",true)
		.css(parametres.transition(0))
		.css("height", hipsterHeightX)
		.addClass("init")
		.html(write)
		.removeClass("init")
		.removeAttr("style");

		setTimeout(function () {
			"use strict";
			instancie.init(instancie);
			$hipster.data("stop",false);
			$b.removeClass("stop");
		}, delays[4]);
	}

//Link direct to good order
	$order.on({
		click: function (ze) {
			"use strict";
			ze.preventDefault();
			Bird.manage("disable");
			$b.addClass("direct");
			sizes[0].result(1);
	}	});

//Link to play again
	$again.on({
		click: function (ze) {
			"use strict";

			var orderTo = [],
				orderL = parametres.total;

			ze.preventDefault();

			(function reorgGame () {
				"use strict";

				var orderFrom = [],
					orderRand,
					orderTransit;

				for (var i = 1; i <= orderL; ++i)
					orderFrom.push(i);

				while (orderL > 0) { //to do: optimize algo
					orderRand = Math.floor(Math.random() * orderL);
					orderTo.push(orderFrom[orderRand]);
					orderTransit = orderFrom.slice(0,orderRand).concat(orderFrom.slice(orderRand + 1));
					orderFrom = orderTransit;
					orderL = orderFrom.length;
				}

				for (var p in orderTo)
					if (Number(p) != orderTo[p] - 1)
						return;

				orderTo = [];
				orderL = parametres.total;
				reorgGame();
			})();

			$hipster.organize(function () {
				"use strict";
				return code.replace(parametres.re[0], function (match, p1, p2, p3, p4, p5) {
					"use strict";
					return [
						p1,
						birds["b" + orderTo[orderL]].picSrc,
						p3,
						birds["b" + orderTo[orderL++]].infos,
						p5
					].join("");
	})	});	}	});

//Link to play with other birds
	$sliding.on({
		click: function (ze) {
			"use strict";

			var orderL = 0;

			ze.preventDefault();

			parametres.serie = ! parametres.bis ?
				(parametres.serie < games.length ? parametres.serie + 1 : 1)
				:
				parametres.serie;
			parametres.bis = false;

			$hipster.organize(function () {
				"use strict";
				return code.replace(parametres.re[0], function (match, p1, p2, p3, p4, p5) {
					"use strict";
					return [
						p1,
						parametres.collection[games[parametres.serie - 1][orderL]].param.source,
						p3,
						games[parametres.serie - 1][orderL++],
						p5
					].join("");
	})	});	}	});
	parametres.bis
	&& $sliding.trigger("click");





//Game instanciation ----------------------------------------------------------------------------
	function instancie () {
		"use strict";
		$birds.each(function (ind, ele) {
			var end = $(ele).data("size");
			birds["b" + end] = new Bird(ind, end);
		});
		birds["b" + parametres.total].ligature = Bird.prototype.ligature.tie;
		//to do: method of constuctor, like Bird.tie ? method of method of prototype ?
		 /* = function () { //overload prototype 'ligature' for the last instance
			Bird.tie.call(this);
		} */
		$sizes.each(function (ind) {
			sizes.push(new Size(ind));
		});
		for (var p in birds) {
			birds[p].stateDrop = sizes[$sizes.index(birds[p].$dom.parents("li"))];
			birds[p].stateOver = birds[p].stateDrop;
	}	}
	instancie();


/* Debug * /
	window.sizes = sizes;
	window.birds = birds;
/* */

});
