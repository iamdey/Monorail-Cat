var NORTH = 1;
var SOUTH = 2;
var WEST = 3;
var EAST = 4;
var TILE_SIZE = 79;
var TILE_MIDDLE = TILE_SIZE / 2 + 1;
var CAT_SPEED = TILE_SIZE * 4;
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

function getLeftDirection(direction) {
	switch (direction) {
		case NORTH:	return WEST;
		case SOUTH: return EAST;
		case WEST:	return SOUTH;
		case EAST:	return NORTH;
		default:	return 0;
	}
}

function getRightDirection(direction) {
	switch (direction) {
		case NORTH:	return EAST;
		case SOUTH: return WEST;
		case WEST:	return NORTH;
		case EAST:	return SOUTH;
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
		
		var movement = [0, 0];
		if (pos[0] > TILE_SIZE) {
			movement[0] = 1;
		} else if (pos[1] > TILE_SIZE) {
			movement[1] = 1;
		} else if (pos[0] < 0) {
			movement[0] = -1;
		} else if (pos[1] < 0) {
			movement[1] = -1;
		} 
		
		var changeOfTile = false;
		
		// Square change
		if (movement[0] != 0 || movement[1] != 0) {
			pos[0] = (pos[0] + TILE_SIZE) % TILE_SIZE;
			pos[1] = (pos[1] + TILE_SIZE) % TILE_SIZE;
			
			tile[0] += movement[0];
			tile[1] += movement[1];
			
			changeOfTile = true;
		}
		
		// Pass through middle
		if (!changeOfTile
		&& (savex < TILE_MIDDLE && pos[0] >= TILE_MIDDLE
		||	savex > TILE_MIDDLE && pos[0] <= TILE_MIDDLE
		||	savey < TILE_MIDDLE && pos[1] >= TILE_MIDDLE
		||	savey > TILE_MIDDLE && pos[1] <= TILE_MIDDLE)) {
			middleCallback();
		}
	}
	
	this.getAbsolutePos = function() {
		return [pos[1] + tile[1] * TILE_SIZE, pos[0] + tile[0] * TILE_SIZE];
	}
}

function Cat(map, _player, startingXTile, startingYTile, _direction) {
	var t = this;
	var parent = new Entity(map, startingXTile, startingYTile);
	var player = _player;
	var sx = 0;			// X speed (-1 = North ; 1 = South)
	var sy = 0;			// Y speed (-1 = West ; 1 = East)
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
			var dirChanged = false;
			var desiredDirection = 0;
			var oppositeDirection = getOppositeDirection(direction);
			
			// Player choice
			if(player.turn == LEFT) {
				desiredDirection = WEST;
			} else if(player.turn == RIGHT) {
				desiredDirection = EAST;
			} else if(player.turn == UP) {
				desiredDirection = NORTH;
			} else if(player.turn == DOWN) {
				desiredDirection = SOUTH;
			}
			
			/*if (player.turn == LEFT) {
				console.log("User tries to go left");
				desiredDirection = getLeftDirection(direction);
			} else if(player.turn == RIGHT) {
				console.log("User tries to go right");
				desiredDirection = getRightDirection(direction);
			}*/
			
			// Trying to turn
			if (desiredDirection != 0 && map.isValidDirection(parent.tile[0], parent.tile[1], oppositeDirection, desiredDirection)) {
				console.log("User turns");
				t.changeDirection(desiredDirection);
				dirChanged = true;
			}
			
			// Can't go straigth
			if (!dirChanged && !map.isValidDirection(parent.tile[0], parent.tile[1], oppositeDirection, direction)) {
				console.log("Can't go straight!");
				
				// Try to go left
				desiredDirection = getLeftDirection(direction);
				if(map.isValidDirection(parent.tile[0], parent.tile[1], oppositeDirection, desiredDirection)) {
					console.log("Automatically go left");
					t.changeDirection(desiredDirection);
					dirChanged = true;
				}
				// Go right
				else {
					console.log("Automatically go right");
					t.changeDirection(getRightDirection(direction));
					dirChanged = true;
				}
			}
			
			// Turn successful
			if(dirChanged) {
				if(direction == NORTH) {
					parent.pos[0] -= Math.abs(TILE_MIDDLE - parent.pos[1]);
					parent.pos[1] = TILE_MIDDLE;
				} else if(direction == SOUTH) {
					parent.pos[0] += Math.abs(TILE_MIDDLE - parent.pos[1]);
					parent.pos[1] = TILE_MIDDLE;
				} else if(direction == WEST) {
					parent.pos[0] = TILE_MIDDLE;
					parent.pos[1] -= Math.abs(TILE_MIDDLE - parent.pos[0]);
				} else {
					parent.pos[0] = TILE_MIDDLE;
					parent.pos[1] += Math.abs(TILE_MIDDLE - parent.pos[0]);
				}
			}
		});
	}
	
	this.changeDirection = function(newDirection) {
		direction = newDirection;
		
		switch (direction) {
			case NORTH:	sx = -1;	sy =  0;	break;
			case SOUTH:	sx = +1;	sy =  0;	break;
			case WEST:	sx =  0;	sy = -1;	break;
			case EAST:	sx =  0;	sy = +1;	break;
			default:	sx =  0;	sy =  0;	break;
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