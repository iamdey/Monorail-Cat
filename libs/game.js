var FRAMERATE 	= 30;
var MUSIC 		= true;
var DEBUG 		= true;

/**
 * Singleton for trollerz
 */
var game_sound = new GameSound();

tilemap = null;

function loadMap() {
	tilemap = new TileMap(document.getElementById("tileMap"));
	tilemap.loadCsv("144;66;66;219;66;66;9\n1056;144;66;2886;66;9;1056\n1056;1056;144;66;9;1056;1056\n1056;3504;1581;0;3504;1581;1056\n1056;1056;2304;66;516;1056;1056\n1056;2304;66;219;66;516;1056\n2304;66;66;2886;66;66;516\n");
	//tilemap.load('zouip');
	setTimeout('tilemap.draw(document.getElementById("tileMap"))', 500);
}

function startGame() {
    var surface = document.getElementById("monorail-cat");
    var gs 		= new JSGameSoup(surface, FRAMERATE);
    var game 	= new Game(gs);
    
    game_sound.play("openning");
    
    gs.launch();
}

function Game(gs) {
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

	var map = new Map(tilemap);
	
	var mapItems = [
		new MapItem("6_0", map, 6, 0),
		new MapItem("0_6", map, 0, 6),
		new MapItem("1_1", map, 1, 1),
		new MapItem("5_5", map, 5, 5),
		new MapItem("2_2", map, 4, 2),
		new MapItem("4_4", map, 2, 4)
	];
	
	for (var i = 0; i < mapItems.length; i++) {
		map.addEntity(mapItems[i]);
		gs.addEntity(mapItems[i]);
	}
	
	var cats = [
		new Cat(map, 1, RED, 0, 0, SOUTH),
		new Cat(map, 2, BLUE, 6, 6, NORTH)
	];
	
	var players = [
		new Player("player 1", this.keymap_player_1, cats[0]),
		new Player("player 2", this.keymap_player_2, cats[1])
	];
	
	gs.addEntity(players[0]);
	gs.addEntity(players[1]);
	gs.addEntity(cats[0]);
	gs.addEntity(cats[1]);
	
	map.addEntity(cats[0]);
	map.addEntity(cats[1]);
}
