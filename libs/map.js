function Map(gs, _tilemap) {
	var tilemap = _tilemap;
	var entities = new Array();
	
	this.isValidDirection = function(x, y, from, to) {
		return tilemap.isValidDirection(x, y, from, to);
	}
	
	this.addEntity = function(entity) {
		entities.push(entity);
		gs.addEntity(entity);
	}
	
	this.removeEntity = function(entity) {
		for (var i = 0; i < entities.length; i++) {
			if (entities[i].getId() == entity.getId()) {
				entities.splice(i, 1);
				break;
			}
		}
		
		gs.delEntity(entity);
	}
	
	this.detectCollision = function(entity) {
		var tile = entity.getTile();
		
		for (var i = 0; i < entities.length; i++) {
			var otherEntity = entities[i];
			var otherTile = otherEntity.getTile();
			
			// Collision detected
			if (otherTile[0] == tile[0] && otherTile[1] == tile[1] && otherEntity.getId() != entity.getId()) {
				var strength = entity.getStrength();
				var otherStrength = otherEntity.getStrength();
				
				if(strength > otherStrength) {
					// Killz collider
					console.log("Killz other entity");
					otherEntity.die();
					
					// Pick up item
					if (entity.getType() == CAT && otherEntity.getType() == MAP_ITEM) {
						entity.pickUp(otherEntity);
					}
				} else if(strength < otherStrength) {
					// Cat diez 
					console.log("Killz entity");
					entity.die();
				} else {
					// Both diez
					console.log("Both diez");
					entity.die();
					otherEntity.die();
				}
			}
		}
	}
	
	this.printEntities = function() {
		var s = "[ ";
		for (var i = 0; i < entities.length; i++) {
			s += entities[i].getId() + " ";
		}
		s += "]";
		
		console.log("Entities = "+s);
	}
}
