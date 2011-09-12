//  Monorail Cat - The Game
//  Copyright (C) 2011  Didjor, esion, Fred_o, Macha__, speedyop, zouip
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.



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
	
	this.countPossibleDirections = function(x, y, from) {
		var canGoStraight = isValidDirection(parent.tile[0], parent.tile[1], from, getOppositeDirection(from));
		var canGoLeft = isValidDirection(parent.tile[0], parent.tile[1], from, getLeftDirection(from));
		var canGoRight = isValidDirection(parent.tile[0], parent.tile[1], from, getRightDirection(from));
		
		return (canGoStraight ? 1 : 0) + (canGoLeft ? 1 : 0) + (canGoRight ? 1 : 0);
	}
	
	this.getFirstValidDirection = function(x, y, from) {
		if (isValidDirection(parent.tile[0], parent.tile[1], from, getOppositeDirection(from))) {
			return getOppositeDirection(from);
		} else if (isValidDirection(parent.tile[0], parent.tile[1], from, getLeftDirection(from))) {
			return getLeftDirection(from);
		} else {
			return getRightDirection(from);
		}
	}
	/*
	this.getPathsFrom = function(x, y, to) {
		var directions = { SOUTH, NORTH, WEST, EAST };
		var possibleDirections = new Array();
		
		var oppositeDirection = getOppositeDirection(to);
		
		for (var dir in directions) {
			if (isValidDirection(x, y, oppositeDirection, dir)) {
				console.log("adding "+dir+" to possible directions");
				possibleDirections[dir] = new Array();
				
				var nx = x;
				var ny = y;
				var ndir = dir;
				
				do {
					// Move in your head
					switch (ndir) {
						case NORTH:	nx--;	break;
						case SOUTH:	nx++;	break;
						case WEST:	ny--;	break;
						case EAST:	ny++;	break;
					}
					
					// Count dirs
					var nbPossibleDirections = countPossibleDirections(nx, ny, getOppositeDirection(ndir));
				} while (nbPossibleDirections == 1);
			}
		}
		
		return possibleDirections;
	}*/
	
	/**
	 *	Detect the collisions with an entity.
	 */
	this.detectCollision = function(entity) {
		var tile = entity.getTile();
		var gameOver = false;

		for (var i = 0; i < entities.length; i++) {
			var otherEntity         = entities[i];
			var otherTile           = otherEntity.getTile();
            var displayDyingItem    = (entity.getType() == CAT || otherEntity.getType() == CAT) ? false : true;
            
			// Collision detected
			if (otherTile[0] == tile[0] && otherTile[1] == tile[1] && otherEntity.getId() != entity.getId()) {
                
                // Doz nossing bicose datiz respawning kat or deadcat or somethong else
                if(!otherEntity.isKillable()){
                    break;
                }
                                
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
						gameOver |= otherEntity.die(true);
					}
				} else if(strength < otherStrength) {
					// Cat diez
					gameOver |= entity.die(displayDyingItem);
				} else {
					// Both diez
					if(!(entity.getType() == WOOLBALL && entity.doezRespect(otherEntity)
					|| (otherEntity.getType() == WOOLBALL && otherEntity.doezRespect(entity)))) {
						gameOver |= entity.die(displayDyingItem);
						gameOver |= otherEntity.die(displayDyingItem);
					}
				}
			}
		}
        
		if (gameOver) {
            //We wait for the user understand he'z a looser
            setTimeout(function(){ Game.over(); }, ((DEADCAT_LIFE_TIME / FRAMERATE ) * 1000)-10);
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
	}
    
}
