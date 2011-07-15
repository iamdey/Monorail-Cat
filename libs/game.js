var FRAMERATE 	= 30;
var GAME_ID		= "gameBoard";
var MUSIC 		= true;
var DEBUG 		= false;
var DOMAIN		= "boarf.net";
//var DOMAIN		= "localhost";


/**
 * The game Main class
 * 
 * create a singleton then this.start to start the game wootlol
 * 
 * Game = new _Game();
 * Game.start();
 * 
 * Game.stop(); //.... in order to stop ! what do you think It can be?!
 */
function _Game() {
	/**
	 * the canvas for entities
	 */
	this.surface = null;
	/**
	 * the canvs for tilemap
	 */
	this.tilemap = null;
	
	/**
	 * Place holder for Gamsoup Lib
	 */
	this.gs	 = null;
	
	this.map = null;
	
	/**
	 * The map to load
	 */
	this.map_name = "default";
	
	this.players = [];
	
	/**
	 * Date object that game start
	 */
	this.date_game_start = null;
	
	this.player1_cfg = {
		name : "Player 1",
		keymap : {
			up: 90,		// z
			down: 83,	// s
			left: 81, 	// q
			right: 68, 	// d
			action1: 32	// space
		}
	};

	this.player2_cfg = {
		name : "Player 2",
		keymap : {
			up: 38,		// up
			down: 40,	// down
			left: 37, 	// left
			right: 39, 	// right
			action1: 13	// enter
		}
	};
	
	this.initialize();
}

_Game.prototype = {
	initialize : function(){
		UI.loadGameIntro();
		GameSound.initialize();
		GameSound.playLoop("openning");
		
		//--------------
		//Events listener
		e("name_player1").addEventListener("blur", function(){
			Game.player1_cfg.name = this.value;	
		}, false);
		
		e("name_player2").addEventListener("blur", function(){
			Game.player2_cfg.name = this.value;	
		}, false);
		
		e("mapId").addEventListener("change", function(){
			Game.map_name = this.value;	
		}, false);
		//--------------
	},
	
	start : function() {
		//load deh canvas Cuiiiik!
		UI.loadGameView();
		UI.mapLoading();
		
		this.surface 	= e("monorail-cat");
		this.tilemap 	= new TileMap(e("tileMap"));
		
		this.loadMap();
		
		this.gs			= new JSGameSoup(this.surface, FRAMERATE);
		this.map 		= new Map(this.gs, this.tilemap);
		
		//-----------------------------
		//suppose that loads item from deh tilemap
		var itemsCoords = this.tilemap.getItemTiles();
		var mapItems = [];
		var i = 0;
		while(tmp = itemsCoords.pop()) {
			mapItems[i] = new MapItem([tmp.x, tmp.y]);
			i++;
		}
		//-----------------------------

		//-----------------------------
		//suppose that deh cat spawn
		var departChat1 = this.tilemap.getPlayerStartTile(1);
		var departChat2 = this.tilemap.getPlayerStartTile(2);
		//-----------------------------

		var cats = [
			new Cat(this.map, 1, RED, [departChat1.x, departChat1.y], this.tilemap.getAValidDirection(departChat1.x,departChat1.y, SOUTH)),
			new Cat(this.map, 2, BLUE, [departChat2.x, departChat2.y], this.tilemap.getAValidDirection(departChat2.x,departChat2.y, NORTH))
		];

		this.players = [
			new Player(this.player1_cfg, cats[0]),
			new Player(this.player2_cfg, cats[1])
		];

		this.gs.addEntity(this.players[0]);
		this.gs.addEntity(this.players[1]);

		for (var i = 0; i < mapItems.length; i++) {
			this.map.addEntity(mapItems[i]);
		}

		this.map.addEntity(cats[0]);
		this.map.addEntity(cats[1]);
		
		this.gs.launch();
		
		this.date_game_start = new Date();

		GameSound.stopAll();
		GameSound.playLoop("level1");
		UI.mapLoading(false);
	},
	
	/**
	 * Stop the game simply wid' an axe
	 */
	stop : function(){
		this.map.reset();
		this.gs.delEntity(this.players[0]);
		this.gs.delEntity(this.players[1]);
		this.players = [];
		UI.count_players = 0;
		GameSound.stopAll();
	},
	
	/**
	 * Dhis iz deh gameOver
	 */
	over : function(){
		//--------------------
		//get a json w/ winner, looser
		var players 	= {};
		
		if(this.players[0].getCat().nbLives > this.players[1].getCat().nbLives){
			players.winner = this.players[0];
			players.looser = this.players[1];
		}else if(this.players[0].getCat().nbLives < this.players[1].getCat().nbLives){
			players.winner = this.players[1];
			players.looser = this.players[0];
		}
		//--------------------
		//--------------------
		//get time interval for the game duration
		var date_end 	= new Date();
		var time 		= date_end.getTime() - this.date_game_start.getTime();
		//--------------------
		//--------------------
		//stop and free memory (almost) then display ending screen
		this.stop();
		UI.loadGameOver(players, time);
		//--------------------
	},
	
	/**
	 * Load a map 
	 */
	loadMap : function() {
		if(this.isOffline()) {
			this.tilemap.loadCsv("4240;66;66;219;66;66;12297\n1056;12432;66;2886;66;9;1056\n1056;1056;144;66;12297;1056;1056\n1056;3504;1581;0;3504;1581;1056\n1056;1056;14592;66;516;1056;1056\n1056;2304;66;219;66;12804;1056\n14592;66;66;2886;66;66;8708");
		} else {
			this.tilemap.load(this.map_name);
		}
		
		this.tilemap.draw();
	},
	
	/**
	 * Test if the game is running locally or somewhere that's not configured
	 */
	isOffline : function() {
		try{
			//try to change the domain
			var sub 		= document.domain;
			document.domain = DOMAIN;
			document.domain = sub;
			return false;
		}catch(e){
			return true;
		}
	}
};
