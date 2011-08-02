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
	 * intro screen
	 */ 
	this.loadGameIntro = function(a_players){
		//IE iz not welcome; bleargh!
		if (navigator.appName == 'Microsoft Internet Explorer'){
			var html = "<div class=\"msg\">";
			html += "<img src=\"arts/ie-foar-real.jpg\" alt=\"Wait... Internet exlporer for real?!\" />";
			html += "<p>Owh noes you cannot start the MonorailCat wid' tihs shizt. Go get one of thoze FOC browzer:</p>";
			html += "<ul><li><a href=\"http://www.mozilla.com\">Firefox</a></li><li><a href=\"http://www.opera.com/\">Opera</a></li><li><a href=\"http://www.google.com/chrome/\">Chrome</a></li></ul>";
			html += "</div>";
			e(GAME_ID).innerHTML = html;
			return;
		}
		
		//add tmp players 
        
		return;
	};
	
	/**
	 * Game over screen
	 * allow to restart game
	 * 
	 * @param players json - contain winner and looser Player instance
	 * @param time int - time interval in milliseconds
	 */
	this.loadGameOver = function(players, time){
		// Stop all sounds and play game over sound
		GameSound.stopAll();
		GameSound.playLoop("game_over");
	    
		// Display end message
	    //UI.printMsg('GAME IZ OVER NAAOO', UI.HUGE);
	    
		this.resetGameBoard();
		
		//---------------
		// time
		var days_diff = Math.floor(time/1000/60/60/24); //in case oO
		time -= days_diff*1000*60*60*24
		var hours_diff = Math.floor(time/1000/60/60); //in case also
		time -= hours_diff*1000*60*60
		var min_diff = Math.floor(time/1000/60);
		time -= min_diff*1000*60
		var sec_diff = Math.floor(time/1000);
		//---------------
	    
	    var html = "<div class=\"msg\"><p>GAME IZ OVER NAAOO</p><p>";
	    
	    if(typeof(players.winner) != "undefined"){
			html += "zOmg <span>" + players.winner.name + "</span> has pawned " + players.looser.name + " in <span>";
			html += (days_diff > 0) ? days_diff + " day" + ((days_diff > 1) ? "s ": " ")  : ""; 
			html += (hours_diff > 0) ? hours_diff + " hour" + ((hours_diff > 1) ? "s ": " ") : "";
			html += (min_diff > 0) ? min_diff + " minute" + ((min_diff > 1) ? "s ": " ") : "";
			html += (sec_diff > 0) ? sec_diff + " second" + ((sec_diff > 1) ? "s ": " "): "";
			
			html += "</span> with its " + players.winner.getCat().nbLives + " remaining lives.";
			html += (players.winner.getCat().nbLives == NB_LIVES) ? "WAIT... this is a humiliation!!!1! Hey " + players.looser.name + " go back play to Sims <span>U noob!</span>" : "";
			html += "</p>";
		  
			html += "<button id=\"startGameButton\" onclick=\"Game.start();\">PLAY AGAIN TEH GAME</button>";
			html += "</div>";
			html += "<p>beccauze it's sooow fnu!</p>";
		}else{
			html += "You both loozers! Null score is not possible.";
			html += "</p>";
		  
			html += "<button id=\"startGameButton\" onclick=\"Game.start();\">PLAY AGAIN I SAID</button>";
			html += "</div>";
		}
		
	    e(GAME_ID).innerHTML = html;
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
					lives += '<img src="arts/life_cat1.png" alt="one up"/>';
				else
					lives += '<img src="arts/life_cat2.png" alt="one up" />';
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
	
	this.mapLoading = function(add){
		
		if(typeof(add) == "undefined"){
			add = true; //yep yep yep 
		}
		
		if(!add && typeof(this.loading_el) != "undefined" && this.loading_el){
			e(GAME_ID).removeChild(this.loading_el);
			this.loading_el = null;
		}else{
			this.loading_el = document.createElement("div");
			this.loading_el.setAttribute("class", "msg");
			this.loading_el.innerHTML = "<img src=\"arts/ajax-loader.gif\" alt=\"loading\" /> I is loading!";
			e(GAME_ID).appendChild(this.loading_el);
		}
		
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
		console.log(timeout);
		timeout = timeout || 3000;
		command = command || '';
		// préparation du texte
		text = '<p>'+text+'</p>';
		
		
		
		if(timeout <= 0) {
			text += '<p><input type="button" value="Fermer" onclick="'+command+';UI.closeMsg(); return false;" /></p>';
		}
		
		console.log(text);
		
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
	
	
	this.openMapSelection = function(){
		var html = "";
		
		html += "<label for=\"mapSelection\">Select the map U want to play :</label><br/>";
		html += "<select id=\"mapSelection\"><option value=\"default\">default</option><option value=\"Azesomap\">Azesomap</option><option value=\"bite2\">bite2</option></select><br/>";
		
		if(Game.date_game_start){
			html += "<button id=\"startGameButton\">Restart Game</button><br/>";
		}
		
		html += "Hey, You can save your own map online with <br/><a href=\"mapEditor.html\">The Map Edotir</a><br/>";
		
		this.printMsg(html, this.NORMAL, -1);
		
		e("startGameButton").addEventListener("click", function(){
			Game.map_name = e("mapSelection").value;
			
			if(Game.date_game_start){
				Game.stop();
			}
			Game.start();
			e('msg').style.display = "none";
		}, false);
	};
};

