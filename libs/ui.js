/*
 * Manipulation de l'interface utilisateur autour du jeu (compteurs de vies, items, messages)
 *
 */

var UI = new function(){

	//-----------------------
	//--- tihs iz conztructor
	
	// Map Bonus => Img
	this.bonusImages = new Array();
	this.bonusImages['woolball'] = 'wool_ball1.png';
	this.bonusImages['rainbow'] = 'rainbow-right1.png';
	this.bonusImages['water'] = 'ice_pick.png';

	// Last Timeout defined for msg
	this.lastTimeout = null;

	// Message text size
	this.NORMAL = '20pt';
	this.BIG    = '35pt';
	this.HUGE   = '50pt';
	
	//players' id
	this.count_players = 0;
	
	//-----------------------
	
	/**
	 * Game over screen
	 * TODO:display winner, looser, score, time?
	 * allow to restart game
	 */
	this.loadGameOver = function(winner, looser, time, restingLives){
		// Stop all sounds and play game over sound
		GameSound.stopAll();
		GameSound.playLoop("game_over");
	    
		// Display end message
	    UI.printMsg('GAME IZ OVER NAAOO', UI.HUGE)
	    
		this.resetGameBoard();
	    
	    e(GAME_ID).innerHTML = "<p><input type=\"button\" id=\"startGameButton\" value=\"PLAY AGAIN AND AGAIN TEH GAME\" onclick=\"Game.start();\"></p>";
	};
	
	/**
	 * reset game board then load canvas
	 */
	this.loadGameView = function(){
		this.resetGameBoard();
		//loadz deh tilemap
		canvas = document.createElement("canvas");
		canvas.id = "tileMap";
		canvas.setAttribute("height", 553);
		canvas.setAttribute("width", 554);
		e(GAME_ID).appendChild(canvas);
		//loadz deh entities frame
		canvas = document.createElement("canvas");
		canvas.id = "monorail-cat";
		canvas.setAttribute("height", 553);
		canvas.setAttribute("width", 554);
		e(GAME_ID).appendChild(canvas);
	};
	
	
	/**
	 * add html to layout for new player
	 */
	this.addPlayer = function(my_player){
		var id 		= ++this.count_players;
		div_player = document.createElement("div");
		div_player.id = "player" + id;
		div_player.setAttribute("class", "player " + my_player.getCat().getColor());
		div_player.innerHTML = "<p class=\"playerName\">"+ my_player.name + "</p><p><img class=\"bonusImage\" src=\"arts/blank.png\" id=\"player" + id + "bonus\"/></p><p class=\"lives\" id=\"player" + id + "lives\"></p>";

		//add the elem before the frrist child ov deh gameboard
		e(GAME_ID).insertBefore(div_player, e(GAME_ID).firstChild);
		
		// Initalizes teh cat lives
		this.setPlayerLives(id, my_player.getCat().nbLives);
	};
	
	this.setPlayerLives = function(player, nbLives) {
		if(player == 1 || player == 2) {
			var lives = '';
			for(var i = 0; i< nbLives; i++) {
				if(player == 1)
					lives += '<img src="arts/cat1-right.png"></img><br />';
				else
					lives += '<img src="arts/cat2-left.png"></img><br />';
			}
			e('player'+player+'lives').innerHTML = lives;
		}
	};

	this.setPlayerBonus = function(player, bonusName) {
		if(player == 1 || player == 2) {
			if(this.bonusImages[bonusName] != undefined) {
				e('player'+player+'bonus').src = 'arts/'+this.bonusImages[bonusName];
			} else {
				e('player'+player+'bonus').src = 'arts/blank.png';
			}
		}
	};
	
	this.resetGameBoard = function(){
		e(GAME_ID).innerHTML = "";
	};

	// Affiche un message
	// @param text texte à afficher (HTML autorisé)
	// @param size taille du texte (UI.{NORMAL, BIG, HUGE}, ou manuel (eg. '15pt')). Defaut : UI.NORMAL
	// @param timeout durée de disparition automatique en ms, si <=0 alors fermeture manuelle par l'utilisateur. Defaut : 3s
	// @param command commande lancée à la fermeture du message. Defaut : ''
	this.printMsg = function(text, size, timeout, command) {
		var box = e('msg');
		// changement de style, positionnement
		var sw = document.body.clientWidth || window.innerWidth;
		var sh = document.body.clientHeight || window.innerHeight;
		box.style.top = /*((sh - 400) / 2)*/ 200 + 'px';
		box.style.left = ((sw - 550) / 2 -30) + 'px';
		box.style.fontSize = size || this.NORMAL;
		// si timeout précédent, on le retire
		if(this.lastTimeout != null) {
			clearTimeout(this.lastTimeout);
			this.lastTimeout = null;
		}
		timeout = timeout ||3000;
		command = command || '';
		// préparation du texte
		text = '<p>'+text+'</p>';
		if(timeout <= 0) {
			text += '<p><input type="button" value="Fermer" onclick="'+command+';UI.closeMsg(); return false;" /></p>';
		}
		box.innerHTML = text;
		// timeout si nécessaire
		if(timeout >0) {
			this.lastTimeout = setTimeout('UI.closeMsg();', timeout);
			setTimeout(command, timeout);
		}
		// affichage final :
		box.style.display = 'block';
	};

	// Ferme le message actuellemnt à l'écran
	this.closeMsg = function() {
		var box = e('msg');
		box.style.display = 'none';
		// s'il y avait un timeout en cours, on le retire
		if(this.lastTimeout != null) {
			clearTimeout(this.lastTimeout);
			this.lastTimeout = null;
		}
	};
};

