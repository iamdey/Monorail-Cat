var FRAMERATE 	= 30;
var GAME_ID		= "gameBoard";
var MUSIC 		= true;
var DEBUG 		= false;
var OFFLINE		= false;

tilemap = null;

// Global settings
player1Name = getPlayerDefaultName(1);
player2Name = getPlayerDefaultName(2);
player1Keymap = getPlayerDefaultKeyMap(1);
player2Keymap = getPlayerDefaultKeyMap(2);

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
	var surface = document.getElementById("monorail-cat");
	var gs 		= new JSGameSoup(surface, FRAMERATE);
	new Game(gs);
	gs.launch();

	GameSound.getInstance().stopAll();
	GameSound.getInstance().playLoop("level1");
}

function Game(gs) {
	this.keymap_player_1 = player1Keymap;

	this.keymap_player_2 = player2Keymap;

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
		new Player(player1Name, this.keymap_player_1, cats[0]),
		new Player(player2Name, this.keymap_player_2, cats[1])
	];

	gs.addEntity(players[0]);
	gs.addEntity(players[1]);

	for (var i = 0; i < mapItems.length; i++) {
		map.addEntity(mapItems[i]);
	}

	map.addEntity(cats[0]);
	map.addEntity(cats[1]);
}
