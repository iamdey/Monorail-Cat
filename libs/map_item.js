var WOOLBALL = "woolball"
var RAINBOW = "rainbow"
var WATER = "water"
var INVISIBLE_FRAMES = 30;

var PROBA_WOOLBALL = 5
var PROBA_WATER = PROBA_WOOLBALL + 5
var PROBA_RAINBOW = PROBA_WATER + 2000
var PROBA_TOTAL = PROBA_RAINBOW;

/**
 * class MapItem extends Entity p4wned by Map
 * 
 * display an Item on the map
 * 
 * @author esion
 */
function MapItem(map, startingXTile, startingYTile){
	var parent 	= new Entity(map, startingXTile, startingYTile);
	var invisibleCt = 0;
	
	this.getType = function() {
		return MAP_ITEM;
	}
	
	this.getId = parent.getId;
	this.getTile = parent.getTile;
	
	this.getStrength = function() {
		return MAP_ITEM_STRENGTH;
	}
	
	// Sprite
	var sprite = new Sprite(["center", "center"], 
			{ stand: [["arts/bonus1.png", 3], ["arts/bonus2.png", 5], ["arts/bonus3.png", 5]] },
			function() {
				sprite.action("stand");
			}
	);
	
	/**
	 * Traw teh itaim
	 */
	this.draw = function(c) {
		if(invisibleCt == 0) {
			sprite.draw(c, parent.getAbsolutePos());
		} else {
			invisibleCt--;
		}
	}
	
	this.die = function() {
		// Doze noting, me cant diez
		invisibleCt = INVISIBLE_FRAMES;
	}
	
	/**
	 * refresh the sprite
	 */
	this.update = function(c) {
		sprite.update();
	}
	
	/**
	 * define a random Item (cf. rand_no = 4)
	 */
	this.pickUpRandomizedLoot = function(){
		var rand_no = Math.floor(PROBA_TOTAL * Math.random());
		
		if (rand_no < PROBA_WOOLBALL) {
			return WOOLBALL;
		} else if (rand_no < PROBA_WATER) {
			return WATER;
		} else {
			return RAINBOW;
		}
	}
	
	// do not delete this comment, even if it's useless.
	/**
	 * Hmm tired, move constructor at the end is better for kitten
	 */
}

function Water(map, startingXTile, startingYTile) {
	var parent 	= new Entity(map, startingXTile, startingYTile);
	
	this.getType = function() {
		return WATER;
	}
	
	this.getId = parent.getId;
	this.getTile = parent.getTile;
	
	this.getStrength = function() {
		return WATER_STRENGTH;
	}
	
	// Sprite
	var sprite = new Sprite(["center", "center"], 
			{ shpritz: [["arts/water1.png", 6], ["arts/water2.png", 6]] },
			function() {
				sprite.action("shpritz");
				GameSound.getInstance().play("geyser02");
			}
	);
	
	// SHOO! 
	this.die = function() {
		map.removeEntity(this);
	}
	
	this.update = function() {
		sprite.update();
	}
	
	this.draw = function(c) {
		sprite.draw(c, parent.getAbsolutePos());
	}
}

function Woolball(map, startingXTile, startingYTile, _direction) {
	var self = this;
	var parent = new Entity(map, startingXTile, startingYTile);
	var direction = _direction;
	var sx = 0;			// X speed (-1 = North ; 1 = South)
	var sy = 0;			// Y speed (-1 = West ; 1 = East)
	var direction = _direction;
	var lifetime = WOOLBALL_LIFE_TIME;
	var directions = [SOUTH, NORTH, WEST, EAST];
	
	this.getType = function() {
		return WOOLBALL;
	}
	
	this.getId = parent.getId;
	this.getTile = parent.getTile;
	
	this.getStrength = function() {
		return WOOLBALL_STRENGTH;
	}
	
	// Sprite
	var sprite = new Sprite(["center", "center"], 
			{ roooolllinnn: [["arts/wool_ball1.png", 6], ["arts/wool_ball2.png", 6]] },
			function() {
				sprite.action("roooolllinnn");
				self.playSound();
			}
	);
	
	this.playSound = function(){
		GameSound.getInstance().play("meow01");
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
	}
	
	// SHOO! 
	this.die = function() {
		map.removeEntity(this);
	}
	
	this.goRandomlySomewhere = function() {
		var decided = false;
		var oppositeDirection = getOppositeDirection(direction);
		
		directions = directions.shuffle();
		
		for (var i = 0; i < 4 && !decided; i++) {
			var randDir = directions[i];
			
			if (map.isValidDirection(parent.tile[0], parent.tile[1], oppositeDirection, randDir)) {
				self.changeDirection(randDir);
				
				decided = true;
			}
		}
		
		// Turn successful
		if(decided) {
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
	
	this.update = function() {
		if (lifetime-- == 0) {
			self.die();
		} else {
			sprite.update();
			
			parent.move(sx * DELTA_WOOLBALL_SPEED, sy * DELTA_WOOLBALL_SPEED,
			// Change Square callback function
			function() {
				parent.map.detectCollision(self);
			},
			// Middle passed callback function
			function() {
				self.goRandomlySomewhere();
			});
		}
	}
	
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
		// Head to random direction from this new square
		this.goRandomlySomewhere();
		
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
