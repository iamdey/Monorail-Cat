var FRAMERATE 	= 30;
var GAME_ID		= "gameBoard";
var MUSIC 		= true;
var DEBUG 		= false;
var OFFLINE		= true; 

tilemap = null;

function loadMap(mapName) {
	tilemap = new TileMap(document.getElementById("tileMap"));
	if(OFFLINE) {
		tilemap.loadCsv("144;66;66;219;66;66;9\n1056;144;66;2886;66;9;1056\n1056;1056;144;66;9;1056;1056\n1056;3504;1581;0;3504;1581;1056\n1056;1056;2304;66;516;1056;1056\n1056;2304;66;219;66;516;1056\n2304;66;66;2886;66;66;516\n");
	} else {
		tilemap.load(mapName);
	}
	setTimeout('tilemap.draw(document.getElementById("tileMap"))', 300);
}

function startGame() {
	var surface = document.getElementById("monorail-cat");
	var gs 		= new JSGameSoup(surface, FRAMERATE);
	new Game(gs);
	gs.launch();
	
	GameSound.getInstance().stopAll();
	GameSound.getInstance().playLoop("level1");
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

	var map = new Map(gs, tilemap);

	var mapItems = [
		new MapItem(map, 6, 0),
		new MapItem(map, 0, 6),
		new MapItem(map, 1, 1),
		new MapItem(map, 5, 5),
		new MapItem(map, 4, 2),
		new MapItem(map, 2, 4)
	];

	for (var i = 0; i < mapItems.length; i++) {
		map.addEntity(mapItems[i], true);
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

	map.addEntity(cats[0], true);
	map.addEntity(cats[1], true);
}
