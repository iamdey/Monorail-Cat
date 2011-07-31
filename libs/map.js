/**
 * class Map
 * 
 * Manages teh entitiz.
 * 
 * @author didjor
 */
 function Map(gs, _tilemap) {
	var tilemap = _tilemap;
	var entities = new Array();
	
	/**
	 *	Adds an entity to the map.
	 */
	this.addEntity = function(entity) {
		entities.push(entity);
		gs.addEntity(entity);
	}
	
	/**
	 *	Removes an entity from the map.
	 */
	this.removeEntity = function(entity) {
		for (var i = 0; i < entities.length; i++) {
			if (entities[i].getId() == entity.getId()) {
				entities.splice(i, 1);
				break;
			}
		}
		
		gs.delEntity(entity);
	}
	
	/**
	 *	Returns true if the entity can go from direction "from" to direction "to" on square x;y.
	 */
	this.isValidDirection = function(x, y, from, to) {
		return tilemap.isValidDirection(x, y, from, to);
	}
	
	/**
	 *	Returns true if the entity can go from direction "from" to direction "to" on square x;y.
	 */
	this.isValidOutDirection = function(x, y, to) {
		return tilemap.isValidOutDirection(x, y, to);
	}
	
	/**
	 *	Detect the collisions with an entity.
	 */
	this.detectCollision = function(entity) {
		var tile = entity.getTile();
		var gameOver = false;
		
		for (var i = 0; i < entities.length; i++) {
			var otherEntity = entities[i];
			var otherTile = otherEntity.getTile();
			
			// Collision detected
			if (otherTile[0] == tile[0] && otherTile[1] == tile[1] && otherEntity.getId() != entity.getId()) {
				var strength = entity.getStrength();
				var otherStrength = otherEntity.getStrength();
				
				if(strength > otherStrength) {
					if (otherEntity.getType() == MAP_ITEM) {
						// Pick up item
						if (entity.getType() == CAT && entity.pickUp(otherEntity)) {
							gameOver |= otherEntity.die();
						}
					}
					// Killz collider
					else {
						gameOver |= otherEntity.die();
					}
				} else if(strength < otherStrength) {
					// Cat diez 
					gameOver |= entity.die();
				} else {
					// Both diez
					gameOver |= entity.die();
					gameOver |= otherEntity.die();
				}
			}
		}
		
		if (gameOver) {
			Game.over();
		}
	}
	
	/**
	 *	Endz teh game.
	 */
	this.reset = function() {
		// Remove every entity
		for (var i = 0; i < entities.length; i++) {
			gs.delEntity(entities[i]);
		}
		entities = new Array();
	}
	
	/**
	 *	Prints the entities (debug).
	 */
	this.printEntities = function() {
		var s = "[ ";
		for (var i = 0; i < entities.length; i++) {
			s += entities[i].getId() + " ";
		}
		s += "]";
		
		console.log("Entities = "+s);
	}
}
