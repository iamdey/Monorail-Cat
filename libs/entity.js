var NORTH = 1;
var SOUTH = 2;
var WEST = 3;
var EAST = 4;
var TILE_SIZE = 79;
var TILE_MIDDLE = (TILE_SIZE + 1) / 2;
var CAT_SPEED = TILE_SIZE * 2;
var DELTA_SPEED = Math.round(CAT_SPEED / FRAMERATE);
	
function getOppositeDirection(direction) {
	switch (direction) {
		case NORTH:	return SOUTH;
		case SOUTH: return NORTH;
		case WEST:	return EAST;
		case EAST:	return WEST;
		default:	return 0;
	}
}

function Entity(_map, startingXTile, startingYTile) {
	var map = _map;
	
	// Position in pixels
	var pos = this.pos = [TILE_MIDDLE, TILE_MIDDLE];
	
	// Position in tiles
	var tile = this.tile = [startingXTile, startingYTile];
	
	// Moves the entity by dx ; dy (in pixels)
	this.move = function(dx, dy, middleCallback) {
		var savex = pos[0];
		var savey = pos[1];
		
		pos[0] += dx;
		pos[1] += dy;
		
		var movement = [Math.floor(pos[0] / TILE_SIZE), Math.floor(pos[1] / TILE_SIZE)]
		var changeOfTile = false;
		
		// Square change
		if (movement[0] > 0 || movement[1] > 0) {
			pos[0] %= TILE_SIZE;
			pos[1] %= TILE_SIZE;
			
			tile[0] += movement[0];
			tile[1] += movement[1];
			changeOfTile = true;
		}
		
		// Pass through middle
		
	//console.log(savex+";"+savey+" > "+pos[0]+";"+pos[1]);
		if (!changeOfTile
		&& (savex < TILE_MIDDLE && pos[0] >= TILE_MIDDLE
		||	savex > TILE_MIDDLE && pos[0] <= TILE_MIDDLE
		||	savey < TILE_MIDDLE && pos[1] >= TILE_MIDDLE
		||	savey > TILE_MIDDLE && pos[1] <= TILE_MIDDLE)) {
			middleCallback();
		}
	}
	
	this.getAbsolutePos = function() {
		return [pos[0] + tile[0] * TILE_SIZE, pos[1] + tile[1] * TILE_SIZE];
	}
	
	this.recenter = function() {
		//TODO: Don't do it that way
		pos[0] = TILE_MIDDLE;
		pos[1] = TILE_MIDDLE;
	}
}

function Cat(map, startingXTile, startingYTile, _direction) {
	var t = this;
	var parent = new Entity(map, startingXTile, startingYTile);
	var sx = 0;			// X speed (-1 = West ; 1 = East)
	var sy = 0;			// Y speed (-1 = North ; 1 = South)
	var direction = _direction;
	
	// Sprite
	var sprite = new Sprite(["center", "center"], {
			left:	[["arts/cat1-left.png", 0]],
			right:	[["arts/cat1-right.png", 0]],
			up:		[["arts/cat1-up-1.png", 3],		["arts/cat1-up-2.png", 3]],
			down:	[["arts/cat1-down-1.png", 3],	["arts/cat1-down-2.png", 3]]
		}, function() {
			t.changeDirection(direction);
		}
	);
	
	// Moves the entity by dx ; dy (in pixels)
	this.move = function(dx, dy) {
		parent.move(dx, dy, function() {
			parent.recenter();
			
			if(map.isValidDirection(parent.tile[1], parent.tile[0], getOppositeDirection(direction), EAST)) {
				t.changeDirection(EAST);
			}
		});
	}
	
	this.changeDirection = function(newDirection) {
		direction = newDirection;
		
		switch (direction) {
			case NORTH:	sx =  0;	sy = -1;	break;
			case SOUTH:	sx =  0;	sy = +1;	break;
			case WEST:	sx = -1;	sy =  0;	break;
			case EAST:	sx = +1;	sy =  0;	break;
			default:	sx = +1;	sy =  0;	break;
		}
		
		switch (direction) {
			case NORTH:	sprite.action("up");	break;
			case SOUTH:	sprite.action("down");	break;
			case WEST:	sprite.action("left");	break;
			case EAST:	sprite.action("right");	break;
			default:	sprite.action("right");	break;
		}
	}
	
	// Draws the cat
	this.draw = function(c) {
		sprite.draw(c, parent.getAbsolutePos());
	}
	
	// Updates the cat
	this.update = function() {
		this.move(sx * DELTA_SPEED, sy * DELTA_SPEED);
		
		sprite.update();
	}
}