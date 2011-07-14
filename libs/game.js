var FRAMERATE 	= 30;
var GAME_ID		= "gameBoard";
var MUSIC 		= true;
var DEBUG 		= false;
var OFFLINE		= false;

tilemap = null;

function loadMap(mapName) {
	tilemap = new TileMap(document.getElementById("tileMap"));
	if(OFFLINE) {
		tilemap.loadCsv("4240;66;66;219;66;66;12297\n1056;12432;66;2886;66;9;1056\n1056;1056;144;66;12297;1056;1056\n1056;3504;1581;0;3504;1581;1056\n1056;1056;14592;66;516;1056;1056\n1056;2304;66;219;66;12804;1056\n14592;66;66;2886;66;66;8708");
	} else {
		tilemap.load(mapName);
	}

	setTimeout('tilemap.draw(document.getElementById("tileMap"))', 300);
}

function startGame() {
	loadMap('default');
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

	var itemsCoords = tilemap.getItemTiles();
	var mapItems = [];
	var i = 0;
	while(tmp = itemsCoords.pop()) {
		mapItems[i] = new MapItem([tmp.x, tmp.y]);
		i++;
	}

	var departChat1 = tilemap.getPlayerStartTile(1);
	var departChat2 = tilemap.getPlayerStartTile(2);

	var cats = [
		new Cat(map, 1, RED, [departChat1.x, departChat1.y], tilemap.getAValidDirection(departChat1.x,departChat1.y, SOUTH)),
		new Cat(map, 2, BLUE, [departChat2.x, departChat2.y], tilemap.getAValidDirection(departChat2.x,departChat2.y, NORTH))
	];

	var players = [
		new Player("Player 1", this.keymap_player_1, cats[0]),
		new Player("Player 2", this.keymap_player_2, cats[1])
	];
	
	for(i = 0; i < players.length; i++){
//		UI.addPlayer(players[i]);
		gs.addEntity(players[i]);
		
	}
	
	for (var i = 0; i < mapItems.length; i++) {
		map.addEntity(mapItems[i]);
	}

	map.addEntity(cats[0]);
	map.addEntity(cats[1]);
}

