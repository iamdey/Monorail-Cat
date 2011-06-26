var WOOLBALL = "woolball"
var RAINBOW = "rainbow"
var WATER = "water"
var INVISIBLE_FRAMES = 30;

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
function MapItem(mapItemId, map, startingXTile, startingYTile){
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
	var parent = new Entity(map, startingXTile, startingYTile);
	var direction = _direction;
	
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


