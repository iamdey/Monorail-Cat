// Game parameters
var TILE_SIZE = 79;
var NB_LIVES = 9;
var MAX_ITEMS = 1;
var CAT_SPEED = TILE_SIZE * 3;
var WOOLBALL_SPEED = TILE_SIZE * 5;
var WOOLBALL_LIFE_TIME = FRAMERATE * 8;
var RAINBOW_TIME = FRAMERATE * 3;

// Directions
var NONE = 0;
var NORTH = 1;
var SOUTH = 2;
var WEST = 3;
var EAST = 4;

// Team colors
var RED = 1;
var BLUE = 2;

// Strengths
var MAP_ITEM_STRENGTH = 0;
var CAT_STRENGTH = 1;
var WOOLBALL_STRENGTH = 1;
var WATER_STRENGTH = 1;
var RAINBOW_CAT_STRENGTH = 42;
var RAINBOW_SPEED = 2;

// Entity types
var CAT = 1;
var MAP_ITEM = 2;

// Pre-calculated values
var TILE_MIDDLE = TILE_SIZE / 2 + 1;
var DELTA_SPEED = Math.round(CAT_SPEED / FRAMERATE);
var DELTA_WOOLBALL_SPEED = Math.round(WOOLBALL_SPEED / FRAMERATE);

// Id counter
var ctId = 0;

/**
 * class Entity 
 * 
 * Teh class of all classez, wiz a position and stuff
 * 
 * @author didjor
 * @param startingTile the starting tile
 */
function Entity(startingTile) {
	var self = this;
	var id = ctId++;

	// Position in pixels, relative to the tile
	var pos = this.pos = [TILE_MIDDLE, TILE_MIDDLE];

	// Position in tiles
	var tile = this.tile = [startingTile[0], startingTile[1]];

	/**
	 *	Returns the entity id.
	 */
	this.getId = function() {
		return id;
	}

	/**
	 *	Returns the tile the entity is on.
	 */
	this.getTile = function() {
		return tile;
	}
	
	/**
	 *	Go to a specific tile.
	 */
	this.goTo = function(newTile) {
		tile = self.tile = [newTile[0], newTile[1]];
		pos = self.pos = [TILE_MIDDLE, TILE_MIDDLE];
	}
	
	// Move to starting blocks
	this.goTo(startingTile);

	/**
	  *	Moves the entity by dx ; dy (in pixels)
	  */
	this.move = function(dx, dy, changeSquareCallback, middleCallback) {
		// Save last position
		var savex = pos[0];
		var savey = pos[1];

		// Move
		pos[0] += dx;
		pos[1] += dy;
		
		// Compute tile movement
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

			if(changeSquareCallback) {
				changeSquareCallback();
			}
		}
		// Pass through middle
		else if (
			savex < TILE_MIDDLE && pos[0] >= TILE_MIDDLE
		||	savex > TILE_MIDDLE && pos[0] <= TILE_MIDDLE
		||	savey < TILE_MIDDLE && pos[1] >= TILE_MIDDLE
		||	savey > TILE_MIDDLE && pos[1] <= TILE_MIDDLE) {
			if(middleCallback) {
				middleCallback();
			}
		}
	}

	/**
	 *	Returns the absolute position so the canvas can place the entity.
	 *	Careful: This function works with canvas coordinates, not ours.
	 */
	this.getAbsolutePos = function() {
		return [pos[1] + tile[1] * TILE_SIZE, pos[0] + tile[0] * TILE_SIZE];
	}
}

/**
 * class Cat 
 * 
 * Teh cat
 * 
 * @author didjor
 */
function Cat(map, _playerId, color, startingTile, startingDirection) {
	var self = this;
	var parent = new Entity(startingTile);
	var playerId = _playerId;
	var direction = startingDirection;
	self.desiredDirection = NONE;
	var stackedItems = new Array();
	var sx = 0;			// X speed (-1 = North ; 1 = South)
	var sy = 0;			// Y speed (-1 = West ; 1 = East)
	var strength = CAT_STRENGTH;
	var nbLives = NB_LIVES;
	var rainbowTimer = 0;
	var speed = 1;

	// Cat sprite
	var sprite = new Sprite(["center", "center"], {
			left:	[["arts/cat"+color+"-left.png", 0]],
			right:	[["arts/cat"+color+"-right.png", 0]],
			up:		[["arts/cat"+color+"-up-1.png", 3],		["arts/cat"+color+"-up-2.png", 3]],
			down:	[["arts/cat"+color+"-down-1.png", 3],	["arts/cat"+color+"-down-2.png", 3]]
		}, function() {
			self.changeDirection(direction);
		}
	);
	
	// Rainbow sprite
	var rainbowSprite = new Sprite(["center", "center"], {
		left:	[["arts/rainbow-left1.png", 6],		["arts/rainbow-left2.png", 6]],
		right:	[["arts/rainbow-right1.png", 6],	["arts/rainbow-right2.png", 6]],
		up:		[["arts/rainbow-up1.png", 6],		["arts/rainbow-up2.png", 6]],
		down:	[["arts/rainbow-down1.png", 6],		["arts/rainbow-down2.png", 6]]
	});
	
	// Initalizes teh cat lives
	UI.setPlayerLives(playerId, nbLives);

	/**
	 *	Parent binding.
	 */
	this.getId = parent.getId;
	this.getTile = parent.getTile;
	
	/**
	 *	Returns the entity type.
	 */
	this.getType = function() {
		return CAT;
	}
	
	/**
	 *	Returns the cat strength.
	 */
	this.getStrength = function() {
		return strength;
	}

	/**
	 *	Moves the entity by dx ; dy (in pixels)
	 */
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

			if(DEBUG && self.desiredDirection != NONE)
				console.log("Desired direction: "+self.desiredDirection);

			// Trying to turn
			if (self.desiredDirection != NONE && map.isValidDirection(parent.tile[0], parent.tile[1], oppositeDirection, self.desiredDirection)) {
				self.changeDirection(self.desiredDirection);
				dirChanged = true;
				
				// Reset desired direction
				self.desiredDirection = NONE;
			}

			// Auto-direction: Can't go straigth
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

			// A change of direction occurred
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

	/**
	 *	Changes the desired direction, which will be taken into account on next possible turn.
	 */
	this.setDesiredDirection = function(direction) {
		self.desiredDirection = direction;
	}

	/**
	 *	Does the specified action.
	 *	action1: Use item
	 */
	this.doAction = function(key) {
		// Use item
		if(key == "action1") {
			if(stackedItems.length > 0) {
				var item = stackedItems.pop();

				// NYAN NYAN NYAN
				if (item == RAINBOW) {
					switch (direction) {
						case NORTH:	rainbowSprite.action("up");		break;
						case SOUTH:	rainbowSprite.action("down");	break;
						case WEST:	rainbowSprite.action("left");	break;
						case EAST:	rainbowSprite.action("right");	break;
					}
					
					// Init rainbow values
					rainbowTimer = RAINBOW_TIME;
					strength = RAINBOW_CAT_STRENGTH;
					speed = RAINBOW_SPEED;
					
					// Start NYAN sound
					GameSound.getInstance().pause("level1");
					GameSound.getInstance().play("nyan", function() {
						GameSound.getInstance().play("level1");
					});
				}
				// PSSSSHHHH
				else if (item == WATER) {
					map.addEntity(new Water(map, [parent.tile[0], parent.tile[1]]), true);
				}
				// SHOO!
				else if (item == WOOLBALL) {
					map.addEntity(new Woolball(map, [parent.tile[0], parent.tile[1]], direction), true);
				}
				
				// Display next item
				if(stackedItems.length > 0) {
					UI.setPlayerBonus(playerId, stackedItems[stackedItems.length - 1]);
				} else {
					UI.setPlayerBonus(playerId, "");
				}
			}
		}
	}

	/**
	 *	Changes the cat direction, meaning its values and the sprite orientation.
	 */
	this.changeDirection = function(newDirection) {
		direction = newDirection;

		// Change direction variables
		switch (direction) {
			case NORTH:	sx = -1;	sy =  0;	break;
			case SOUTH:	sx = +1;	sy =  0;	break;
			case WEST:	sx =  0;	sy = -1;	break;
			case EAST:	sx =  0;	sy = +1;	break;
			default:	sx =  0;	sy =  0;	break;
		}
		
		// Change sprite orientation
		switch (direction) {
			case NORTH:	sprite.action("up");	break;
			case SOUTH:	sprite.action("down");	break;
			case WEST:	sprite.action("left");	break;
			case EAST:	sprite.action("right");	break;
		}
		
		// Change rainbow sprite orientation
		if (rainbowTimer > 0) {
			switch (direction) {
				case NORTH:	rainbowSprite.action("up");		break;
				case SOUTH:	rainbowSprite.action("down");	break;
				case WEST:	rainbowSprite.action("left");	break;
				case EAST:	rainbowSprite.action("right");	break;
			}
		}
	}
	
	/**
	 *	Pick up the item.
	 */
	this.pickUp = function(mapItem) {
		// Tek teh itaim
		if(stackedItems.length < MAX_ITEMS) {
			var item = mapItem.pickUpRandomizedLoot();
			stackedItems.push(item);
			UI.setPlayerBonus(playerId, item);
		}
	}

	/**
	 *	Dumbledore diez.
	 */
	this.die = function() {
		// Play hit sound
		GameSound.getInstance().play("meow03");
		
		// Reset position
		self.changeDirection(startingDirection);
		parent.goTo(startingTile);
		
		// Reset values
		self.desiredDirection = NONE;
		rainbowTimer = 0;
		speed = 1;
		strength = CAT_STRENGTH;
		
		// Lose a life
		UI.setPlayerLives(playerId, --nbLives);
		if(nbLives == 0) {
			map.gameOver();
		}
	}

	/**
	 *	Draws the cat, and its rainbow if nyaning.
	 */
	this.draw = function(c) {
		if(rainbowTimer > 0) {
			var rainbowPos = parent.getAbsolutePos();
			
			// Position rainbow behind the cat
			switch (direction) {
				case NORTH:	rainbowPos[1] += TILE_MIDDLE;	break;
				case SOUTH:	rainbowPos[1] -= TILE_MIDDLE;	break;
				case WEST:	rainbowPos[0] += TILE_MIDDLE;	break;
				case EAST:	rainbowPos[0] -= TILE_MIDDLE;	break;
			}
			
			rainbowSprite.draw(c, rainbowPos);
		}
		
		sprite.draw(c, parent.getAbsolutePos());
	}

	/**
	 *	Updates the cat, by naming it move and updates its sprite.
	 */
	this.update = function() {
		this.move(sx * DELTA_SPEED * speed, sy * DELTA_SPEED * speed);

		if(rainbowTimer > 0) {
			rainbowTimer--;
			rainbowSprite.update();
			
			if(rainbowTimer == 0) {
				speed = 1;
				strength = CAT_STRENGTH;
				rainbowSprite ;
			}
		}

		sprite.update();
	}
}
