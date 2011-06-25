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
	
	
	gs.addEntity(new Player(gs, "player 1", this.keymap_player_1));
	gs.addEntity(new Player(gs, "player 2", this.keymap_player_2));
	gs.addEntity(new Cat(null, 0, 0, SOUTH));
	
}

function startGame() {
    var surface = document.getElementById("monorail-cat");
    var gs 		= new JSGameSoup(surface, 30);
    var game 	= new Game(gs);
    gs.launch();
}
