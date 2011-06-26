var NONE = 0;
var NORTH = 1;
var SOUTH = 2;
var WEST = 3;
var EAST = 4;

var NB_LIVES = 9;
var MAX_ITEMS = 2;

var TILE_SIZE = 79;
var TILE_MIDDLE = TILE_SIZE / 2 + 1;
var CAT_SPEED = TILE_SIZE * 2;
var DELTA_SPEED = Math.round(CAT_SPEED / FRAMERATE);

var RED = 1;
var BLUE = 2;

var MAP_ITEM_STRENGTH = 0;
var CAT_STRENGTH = 1;
var WOOLBALL_STRENGTH = 2;
var WATER_STRENGTH = 2;
var RAINBOW_CAT_STRENGTH = 42;

var CAT = 1;
var MAP_ITEM = 2;

var ctId = 0;

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
	var id = ctId++;
	var map = _map;
	
	// Position in pixels
	var pos = this.pos = [TILE_MIDDLE, TILE_MIDDLE];
	
	// Position in tiles
	var tile = this.tile = [startingXTile, startingYTile];
	
	this.getId = function() {
		return id;
	}
	
	this.getTile = function() {
		return tile;
	}
	
	// Moves the entity by dx ; dy (in pixels)
	this.move = function(dx, dy, changeSquareCallback, middleCallback) {
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
		
		// Square change
		if (movement[0] != 0 || movement[1] != 0) {
			pos[0] = (pos[0] + TILE_SIZE) % TILE_SIZE;
			pos[1] = (pos[1] + TILE_SIZE) % TILE_SIZE;
			
			tile[0] += movement[0];
			tile[1] += movement[1];
			
			changeSquareCallback();
		}
		// Pass through middle
		else if (
			savex < TILE_MIDDLE && pos[0] >= TILE_MIDDLE
		||	savex > TILE_MIDDLE && pos[0] <= TILE_MIDDLE
		||	savey < TILE_MIDDLE && pos[1] >= TILE_MIDDLE
		||	savey > TILE_MIDDLE && pos[1] <= TILE_MIDDLE) {
			middleCallback();
		}
	}
	
	this.getAbsolutePos = function() {
		return [pos[1] + tile[1] * TILE_SIZE, pos[0] + tile[0] * TILE_SIZE];
	}
}

function Cat(map, _playerId, color, startingXTile, startingYTile, _direction) {
	var self = this;
	var parent = new Entity(map, startingXTile, startingYTile);
	var playerId = _playerId;
	var sx = 0;			// X speed (-1 = North ; 1 = South)
	var sy = 0;			// Y speed (-1 = West ; 1 = East)
	var direction = _direction;
	self.desiredDirection = NONE;
	var stackedItems = new Array();
	
	var strength = CAT_STRENGTH;
	var nbLives = NB_LIVES;
	
	this.getType = function() {
		return CAT;
	}
	
	this.getId = parent.getId;
	this.getTile = parent.getTile;
	
	this.getStrength = function() {
		return strength;
	}
	
	// Sprite
	var sprite = new Sprite(["center", "center"], {
			left:	[["arts/cat"+color+"-left.png", 0]],
			right:	[["arts/cat"+color+"-right.png", 0]],
			up:		[["arts/cat"+color+"-up-1.png", 3],		["arts/cat"+color+"-up-2.png", 3]],
			down:	[["arts/cat"+color+"-down-1.png", 3],	["arts/cat"+color+"-down-2.png", 3]]
		}, function() {
			self.changeDirection(direction);
		}
	);
	
	// Moves the entity by dx ; dy (in pixels)
	this.move = function(dx, dy) {
		parent.move(dx, dy,
		// Change Square callback function
		function() {
			map.detectCollision(self);
		},
		// Middle passed callback function
		function() {
			var dirChanged = false;
			var oppositeDirection = getOppositeDirection(direction);
			
			console.log("Desired direction: "+self.desiredDirection);
			
			// Trying to turn
			if (self.desiredDirection != NONE && map.isValidDirection(parent.tile[0], parent.tile[1], oppositeDirection, self.desiredDirection)) {
				self.changeDirection(self.desiredDirection);
				dirChanged = true;
			}
			
			// Can't go straigth
			if (!dirChanged && !map.isValidDirection(parent.tile[0], parent.tile[1], oppositeDirection, direction)) {
				// Try to go left
				var autoDirection = getLeftDirection(direction);
				if(map.isValidDirection(parent.tile[0], parent.tile[1], oppositeDirection, autoDirection)) {
					self.changeDirection(autoDirection);
					dirChanged = true;
				}
				// Go right
				else {
					self.changeDirection(getRightDirection(direction));
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
	
	this.setDesiredDirection = function(direction) {
		self.desiredDirection = direction;
	}
	
	/**
	 * launch the latest action in stack
	 */
	this.doAction = function(key) {
		// Use item
		if(key == "action1") {
			if(stackedItems.length > 0) {
				var item = stackedItems.pop();
				
				console.log("Use item "+item);
			}
		}
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
	
	// Dumbledore diez
	this.die = function() {
		UI.setPlayerLives(playerId, nbLives--);
		
		if(nbLives == 0) {
			//TODO: Stop game
		}
	}
	
	this.pickUp = function(mapItem) {
		// Tek teh itaim
		if(stackedItems.length < MAX_ITEMS) {
			var item = mapItem.pickUpRandomizedLoot();
			console.log("Pick up "+item);
			stackedItems.push(item);
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
