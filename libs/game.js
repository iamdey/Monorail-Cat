var FRAMERATE 	= 30;
var GAME_ID		= "gameBoard";
var MUSIC 		= true;
var DEBUG 		= true;
var OFFLINE		= true;


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
	
	this.keymap_player_1 = {
		up: 90,		// z
		down: 83,	// s
		left: 81, 	// q
		right: 68, 	// d
		action1: 32	// space
	};

	this.keymap_player_2 = {
		up: 38,		// up
		down: 40,	// down
		left: 37, 	// left
		right: 39, 	// right
		action1: 13	// enter
	};
	
	this.initialize();
}

_Game.prototype = {
	initialize : function(){
		UI.loadGameIntro();
		GameSound.initialize();
		GameSound.playLoop("openning");
	},
	
	start : function() {
		//load deh canvas Cuiiiik!
		UI.loadGameView();
		
		this.surface 	= e("monorail-cat");
		this.tilemap 	= new TileMap(e("tileMap"));
		
		this.gs			= new JSGameSoup(this.surface, FRAMERATE);
		
		this.loadMap();
		
		this.map = new Map(this.gs, this.tilemap);
		
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
			new Player("Player 1", this.keymap_player_1, cats[0]),
			new Player("Player 2", this.keymap_player_2, cats[1])
		];

		this.gs.addEntity(this.players[0]);
		this.gs.addEntity(this.players[1]);

		for (var i = 0; i < mapItems.length; i++) {
			this.map.addEntity(mapItems[i]);
		}

		this.map.addEntity(cats[0]);
		this.map.addEntity(cats[1]);
		
		this.gs.launch();

		GameSound.stopAll();
		GameSound.playLoop("level1");
	},
	
	/**
	 * Stop the game simply wid' an axe
	 */
	stop : function(){
		this.map.reset();
		this.gs.delEntity(this.players[0]);
		this.gs.delEntity(this.players[1]);
		UI.count_players = 0;
		GameSound.stopAll();
	},
	
	/**
	 * Dhis iz deh gameOver
	 */
	over : function(){
		this.stop();
		UI.loadGameOver();
	},
	
	/**
	 * Load a map 
	 */
	loadMap : function(mapName) {
		if(OFFLINE) {
			this.tilemap.loadCsv("4240;66;66;219;66;66;12297\n1056;12432;66;2886;66;9;1056\n1056;1056;144;66;12297;1056;1056\n1056;3504;1581;0;3504;1581;1056\n1056;1056;14592;66;516;1056;1056\n1056;2304;66;219;66;12804;1056\n14592;66;66;2886;66;66;8708");
		} else {
			this.tilemap.load(mapName);
		}

		this.tilemap.draw(e("tileMap"));
	}
};
