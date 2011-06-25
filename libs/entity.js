var NORTH = 1;
var SOUTH = 2;
var WEST = 3;
var EAST = 4;
var TILE_SIZE = 79;

function Entity(map, startingXTile, startingYTile) {
	// Position in pixels
	var pos = this.pos = [(startingXTile + 0.5) * TILE_SIZE, (startingYTile + 0.5) * TILE_SIZE];
	
	// Position in tiles
	var tile = this.tile = [startingXTile, startingYTile];
	
	// Moves the entity by dx ; dy (in pixels)
	this.move = function(dx, dy) {
		x += dx;
		y += dy;
	}
}

function Cat(map, startingXTile, startingYTile, direction) {
	var parent = new Entity(map, startingXTile, startingYTile);
	var sx = 0;			// X speed (-1 = West ; 1 = East)
	var sy = 0;			// Y speed (-1 = North ; 1 = South)
	
	// Sprite
	var sprite = new Sprite(["center", "center"], {
			left:	[["arts/cat1-left.png", 0]],
			right:	[["arts/cat1-right.png", 0]],
			up:		[["arts/cat1-up-1.png", 3], ["arts/cat1-up-2.png", 3]],
			down:	[["arts/cat1-down-1.png", 3], ["arts/cat1-down-2.png", 3]]
		}, function() {
			
			switch (direction) {
				case NORTH:	sprite.action("up");	break;
				case SOUTH:	sprite.action("down");	break;
				case WEST:	sprite.action("left");	break;
				case EAST:	sprite.action("right");	break;
				default:	sprite.action("right");	break;
			}
		}
	);
	
	// Set speed
	switch (direction) {
		case NORTH:	sy = -1;	break;
		case SOUTH:	sy = +1;	break;
		case WEST:	sx = -1;	break;
		case EAST:	sx = +1;	break;
		default:	sx = +1;	break;
	}
	
	// Moves the entity by dx ; dy (in pixels)
	this.move = function(dx, dy) {
		parent.move(dx, dy);
	}
	
	// Draws the cat
	this.draw = function(c) {
		sprite.draw(c, parent.pos);
	}
	
	// Updates the cat
	this.update = function() {
		sprite.update();
	}
}