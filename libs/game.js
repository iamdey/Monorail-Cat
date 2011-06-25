function Game(gs) {
	var c = gs.c;
	gs.addEntity(new Player(gs));
	gs.addEntity(new Cat(null, 0, 0, SOUTH));
}

function startGame() {
    var surface = document.getElementById("monorail-cat");
    var gs 		= new JSGameSoup(surface, 30);
    var game 	= new Game(gs);
    gs.launch();
}
