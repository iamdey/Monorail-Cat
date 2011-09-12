//  Monorail Cat - The Game
//  Copyright (C) 2011  Didjor, esion, Fred_o, Macha__, speedyop, zouip
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.




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
			html += "<p>Owh noes you cannot start the MonorailCat famous game wid' tihs shizt. Go get one of thoze FOC browzer:</p>";
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
	
	/**
	 * This is the definition ov what plyer's really is : player without lives is not a plyer that's all
	 * 
	 * (it's a noooob)
	 */
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

	/**
	 * Define the player bonux?
	 */
	this.setPlayerBonus = function(player, bonusName) {
		if(player == 1 || player == 2) {
			if(this.bonusImages[bonusName] != undefined) {
				e('player'+player+'bonus').src = 'arts/'+this.bonusImages[bonusName];
			} else {
				e('player'+player+'bonus').src = 'arts/blank.png';
			}
		}
	};
	
	
	/**
	 * Reset the whole gameboard w/ the awesomest manner
	 */
	this.resetGameBoard = function(){
		e(GAME_ID).innerHTML = "";
	};
	
	
	/**
	 * Do things I can't remember right nao
	 * Believe that 's used to display a spinner while loading a map
	 */
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
	
	
	/**
	 * Open a new window, add a close button
	 * 
	 * @param str - window content
	 * return the openned element
	 */ 
	this.openWindow = function(html, id){
		var div_window = document.createElement("div");
		
		if(id){
			div_window.id = id;
		}
		
		div_window.setAttribute("class", "window");
		div_window.innerHTML = html;
		
		a_close = document.createElement("a");
		a_close.href = "#";
		a_close.innerHTML = "Back";
		a_close.setAttribute("class", "close");
		
		div_window.appendChild(a_close);
		
		a_close.addEventListener("click", function(event){
			event.preventDefault();
			e(GAME_ID).removeChild(div_window);
			
		}, false);
		
		
		e(GAME_ID).appendChild(div_window);
	};
	
	
	/**
	 * Open a window w/ the map selection
	 * 
	 * return void
	 */
	this.openMapSelection = function(){
		var id = "map_selector";
		if(e(id)){
			return; // window already open
		}
		
		if(Game.isOffline()){
			var html = "<p>This Feature is not available offline.</p> <p>U must play at <a href=\"" + MONORAIL_ONLINE_URI + "\">" + MONORAIL_ONLINE_URI + "</a></p>";
			this.openWindow(html);
			return;
		}
		
		//--------------------
		// get list via xhr
		var xhr;
		xhr = getXHR();
		xhr.onreadystatechange  = function() {
		  if(xhr.readyState  == 4) {
			if(xhr.status  == 200) {
			  list = xhr.responseText;
			} else {
			  list = 'default';
			}
		  }
		};
		xhr.open("GET", 'map.php?GET=',  false);
		xhr.send(null); 
		
		var maps = list.split("\n");
		//--------------------
		//--------------------
		// generate html
		var html = "";
		
		html += "<p><label for=\"mapSelection\">Select the map U want to play :</label><br/>";
		html += "<select id=\"mapSelection\">";
		
		for(var i=0; i < maps.length; i++) {
			var mapname = trim(maps[i]);
			if(mapname != '') {
				var selected = (mapname == "default")? "selected=\"selected\"" : "";
				html += "<option value=\"" + mapname + "\" " + selected + " \">" + mapname + "</option>";
			}
		}
		
		html += "</select></p>";
		
		if(Game.date_game_start){
			html += "<p><button id=\"RestartGameButton\">Restart Game</button></p>";
		}
		
		html += "<p>Hey, You can save your own map online with <br/><a href=\"mapEditor.html\">The Map Editor</a></p>";
		//--------------------
		
		this.openWindow(html, id);
		
        //--------------------
        // Event listeners
        if(Game.date_game_start){
            e("RestartGameButton").addEventListener("click", function(){
                Game.map_name = e("mapSelection").value;
                
                if(Game.date_game_start){
                    Game.stop();
                }
                Game.start();
            }, false);
        }
        
        e("mapSelection").addEventListener("change", function(){
            Game.map_name = this.value;
        }, false);
        //--------------------
	};
	
	/**
	 * check the current button design (on / off)
	 * @param boolean - state of the sound
	 */
	this.checkAudioButton = function(){
		if(!GameSound.is_mute) { 
			e("audio_button").src = 'arts/sound_on.png';
		} else { 
			e("audio_button").src = 'arts/sound_off.png' 
		};
	};
    
    /**
     * On game intro screen, player 2 can be played instead of weak ai
     * TODO: refactor
     */
    this.togglePlayer2CPU = function(){
        if(AI){
            html = '';
            html += '<img src="arts/cat2-down-1.png" alt="player model" />';
			html += '<input type="text" id="name_player2" name="name[player2]" value="Player 2" />';
			html += '<table class="bindings">';
			html += '	<tr>';
			html += '		<td>&nbsp;</td>';
			html += '		<td class="up">E</td>';
			html += '		<td>&nbsp;</td>';
			html += '	</tr>';
			html += '	<tr>';
			html += '		<td class="left">S</td>';
			html += '		<td class="down">D</td>';                                            
			html += '		<td class="right">F</td>';
			html += '	</tr>';
			html += '	<tr>';
			html += '		<td colspan="3" class="action">SPACE</td>';
			html += '	</tr>';
			html += '</table>';
            AI = false;
        }else{
            html = 'nothing';
            AI = true;
        }
        
        el = e("player2bindings");
        el.innerHTML = html;
        
        console.log(AI, el);
    };
};

