var FRAMERATE = 30;

function startGame() {
    var surface = document.getElementById("monorail-cat");
    var gs 		= new JSGameSoup(surface, FRAMERATE);
    var game 	= new Game(gs);
    gs.launch();
}

function Game(gs) {
	this.keymap_player_1 = {
		left: 81, 	// q
		right: 68, 	// d
		action1: 32
	};

	this.keymap_player_2 = {
		left: 37, 	// left
		right: 39, 	// right
		action1: 13
	};

	var tilemap = new TileMap(document.getElementById("tileMap"));
	var map = new Map(tilemap);
	tilemap.loadCsv("144;66;66;219;66;66;9\n1056;144;66;2886;66;9;1056\n1056;1056;144;66;9;1056;1056\n1056;3504;1581;0;3504;1581;1056\n1056;1056;2304;66;516;1056;1056\n1056;2304;66;219;66;516;1056\n2304;66;66;2886;66;66;516\n");
	tilemap.draw(document.getElementById("tileMap"));
	
	gs.addEntity(new MapItem("6_0", map, 6, 0));
	gs.addEntity(new MapItem("0_6", map, 0, 6));
//	gs.addEntity(new MapItem("1_1", map, 1, 1));
//	gs.addEntity(new MapItem("5_5", map, 5, 5));
//	gs.addEntity(new MapItem("4_3", map, 5, 2));
//	gs.addEntity(new MapItem("0_6", map, 0, 6));
	
	gs.addEntity(new Player("player 1", this.keymap_player_1));
	gs.addEntity(new Player("player 2", this.keymap_player_2));
	gs.addEntity(new Cat(map, 0, 0, SOUTH));
	
}
