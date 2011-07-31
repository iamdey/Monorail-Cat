// Item names
var NO_ITEM = false
var WOOLBALL = "woolball"
var RAINBOW = "rainbow"
var WATER = "water"

// Time of item invizibliness
var INVISIBLE_FRAMES = FRAMERATE * 1;

// Probability of each item to come (They are cumulated so the formula is simpler)
var PROBA_WOOLBALL = 5
var PROBA_WATER = PROBA_WOOLBALL + 5
var PROBA_RAINBOW = PROBA_WATER + 2
var PROBA_TOTAL = PROBA_RAINBOW;

/**
 * class MapItem extends Entity p4wned by Map
 * 
 * display an Item on the map
 * 
 * @author esion
 */
function MapItem(startingTile){
	var parent 	= new Entity(startingTile);
	var invisibleCt = 0;
	
	// Map item sprite
	var sprite = new Sprite(["center", "center"], {
			stand: [["arts/bonus1.png", 3], ["arts/bonus2.png", 5], ["arts/bonus3.png", 5]]
		}, function() {
			sprite.action("stand");
		}
	);
	
	/**
	 *	Parent binding.
	 */
	this.getId = parent.getId;
	this.getTile = parent.getTile;
	
	/**
	 *	Returns the entity type.
	 */
	this.getType = function() {
		return MAP_ITEM;
	}
	
	/**
	 *	Returns the entity strength.
	 */
	this.getStrength = function() {
		return MAP_ITEM_STRENGTH;
	}
	
	/**
	 *	Teh itaim haz been taken bye a damm cat!
	 */
	this.die = function() {
		// Doze noting, me cant diez
		invisibleCt = INVISIBLE_FRAMES;
		
		return false;
	}
	
	/**
	 * Refresh the sprite.
	 */
	this.update = function(c) {
		sprite.update();
	}
	
	/**
	 * Draw teh itaim.
	 */
	this.draw = function(c) {
		if(invisibleCt == 0) {
			sprite.draw(c, parent.getAbsolutePos());
		} else {
			invisibleCt--;
		}
	}
	
	/**
	 * Returns a random Item (cf. rand_no = 4).
	 */
	this.pickUpRandomizedLoot = function() {
		if (invisibleCt > 0) {
			return NO_ITEM;
		} else {
			var rand_no = PROBA_TOTAL * Math.random();
			
			if (rand_no < PROBA_WOOLBALL) {
				return WOOLBALL;
			} else if (rand_no < PROBA_WATER) {
				return WATER;
			} else {
				return RAINBOW;
			}
		}
	}
	
	/**
	 * Hmm tired, doez noting at the end is better for kitten.
	 */
}

/**
 * class Water 
 * 
 * Cold and wet water on the level...
 * 
 * @author didjor
 */
function Water(map, startingTile) {
	var parent 	= new Entity(startingTile);
	
	// Water sprite
	var sprite = new Sprite(["center", "center"], {
		shpritz: [["arts/water1.png", 6], ["arts/water2.png", 6]]
		}, function() {
			sprite.action("shpritz");
			GameSound.play("geyser02");
		}
	);
	
	/**
	 * Parent binding.
	 */
	this.getId = parent.getId;
	this.getTile = parent.getTile;
	
	/**
	 * Returns the entity type.
	 */
	this.getType = function() {
		return WATER;
	}
	
	/**
	 * Returns the entity strength.
	 */
	this.getStrength = function() {
		return WATER_STRENGTH;
	}
	
	/**
	 *	SHHHHHH!
	 */
	this.die = function() {
		map.removeEntity(this);
		
		return false;
	}
	
	/**
	 *	Refresh teh sprite (evn if it dosent need!).
	 */
	this.update = function() {
		sprite.update();
	}
	
	/**
	 *	Draws teh sprite.
	 */
	this.draw = function(c) {
		sprite.draw(c, parent.getAbsolutePos());
	}
}

/**
 * class Woolball 
 * 
 * Funny woolballz in teh map
 * 
 * @author didjor
 */
function Woolball(map, startingTile, _direction) {
	var self = this;
	var parent = new Entity(startingTile);
	var direction = _direction;
	var sx = 0;			// X speed (-1 = North ; 1 = South)
	var sy = 0;			// Y speed (-1 = West ; 1 = East)
	var direction = _direction;
	var lifetime = WOOLBALL_LIFE_TIME;
	var directions = [SOUTH, NORTH, WEST, EAST];
	
	// Woolball sprite
	var sprite = new Sprite(["center", "center"], {
		roooolllinnn: [["arts/wool_ball1.png", 6], ["arts/wool_ball2.png", 6]]
		}, function() {
			sprite.action("roooolllinnn");
			GameSound.play("meow01");
		}
	);
	
	/**
	 * Parent binding.
	 */
	this.getId = parent.getId;
	this.getTile = parent.getTile;
	
	/**
	 * Returns the entity type.
	 */
	this.getType = function() {
		return WOOLBALL;
	}
	
	/**
	 * Returns the entity strength.
	 */
	this.getStrength = function() {
		return WOOLBALL_STRENGTH;
	}
	
	/**
	 * Changes the woolball direction.
	 */
	this.changeDirection = function(newDirection) {
		direction = newDirection;
		
		switch (direction) {
			case NORTH:	sx = -1;	sy =  0;	break;
			case SOUTH:	sx = +1;	sy =  0;	break;
			case WEST:	sx =  0;	sy = -1;	break;
			case EAST:	sx =  0;	sy = +1;	break;
			default:	sx =  0;	sy =  0;	break;
		}
	}
	
	/**
	 *	Not funny anymoar!
	 */
	this.die = function() {
		map.removeEntity(this);
		
		return false;
	}
	
	/**
	 *	Decides a random direction for the next possible turn.
	 */
	this.goRandomlySomewhere = function() {
		var decided = false;
		var oppositeDirection = getOppositeDirection(direction);
		
		// Shuffle possible directions
		directions = directions.shuffle();
		
		// Try to go on each direction...
		for (var i = 0; i < 4 && !decided; i++) {
			var randDir = directions[i];
			
			if (map.isValidDirection(parent.tile[0], parent.tile[1], oppositeDirection, randDir)) {
				self.changeDirection(randDir);
				
				decided = true;
			}
		}
		
		// Turn successful
		if(decided) {
			// Reposition sprite
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
	}
	
	/**
	 *	Updates the woolball.
	 */
	this.update = function() {
		if (lifetime-- == 0) {
			self.die();
		} else {
			sprite.update();
			
			parent.move(sx * DELTA_WOOLBALL_SPEED, sy * DELTA_WOOLBALL_SPEED,
			
			// Change Square callback function
			function() {
				map.detectCollision(self);
			},

			// Middle passed callback function
			function() {
				self.goRandomlySomewhere();
			});
		}
	}
	
	/**
	 *	Draws teh sprite.
	 */
	this.draw = function(c) {
		sprite.draw(c, parent.getAbsolutePos());
	}
	
	/**
	 *	CONSTRUCTORZ
	 */
	// Set initial direction
	this.changeDirection(direction);
	
	// Move two squares ahead
	for (var i = 0; i < 2; i++) {
		if (!map.isValidOutDirection(parent.tile[0], parent.tile[1], direction)) {
			// Head to random direction from this new square
			this.goRandomlySomewhere();
		}
		
		// Move ahead
		switch(direction) {
			case SOUTH:	parent.tile[0]++;	break;
			case NORTH:	parent.tile[0]--;	break;
			case EAST:	parent.tile[1]++;	break;
			case WEST:	parent.tile[1]--;	break;
		}
	}
	
	// Set ball on first pixel on this square
	switch(direction) {
		case SOUTH:	parent.pos[0] = 0;				break;
		case NORTH:	parent.pos[0] = TILE_SIZE - 1;	break;
		case EAST:	parent.pos[1] = 0;				break;
		case WEST:	parent.pos[1] = TILE_SIZE - 1;	break;
	}
}
