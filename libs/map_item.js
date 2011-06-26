
/**
 * class MapItem extends Entity p4wned by Map
 * 
 * display an Item on the map
 * 
 * @author esion
 */
function MapItem(mapItemId, map, startingXTile, startingYTile){
	var parent 	= new Entity(map, startingXTile, startingYTile);
	
	var ITEMS 	= ["woolball", "rainbow"];
	
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
//		console.log(parent.pos);
		sprite.draw(c, parent.getAbsolutePos());
	}
	
	this.die = function() {
		// Doze noting, cant diez
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
	this.defineRandomizedLoot = function(){
		var rand_no = Math.floor((2-1)*Math.random()) + 1;
		this.item 	= ITEMS[rand_no];
	}
	
	/**
	 * Hmm tired, move constructor at the end is better for kitten
	 */
	this.item 	= this.defineRandomizedLoot();
}


