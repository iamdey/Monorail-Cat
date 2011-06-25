
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
	
	var rand_no = Math.floor((2-1)*Math.random()) + 1;
	
	this.item 	= ITEMS[rand_no];
	
	console.log(this.item);
	
	// Sprite
	var sprite = new Sprite(["center", "center"], 
			{ stand: [["arts/bonus1.png", 7], ["arts/bonus2.png", 5]] },
			function() {
				sprite.action("stand");
			}
	);
	
	// Draws the item
	this.draw = function(c) {
//		console.log(parent.pos);
		sprite.draw(c, parent.getAbsolutePos());
	}
	
	/**
	 * refresh the sprite
	 */
	this.update = function(c) {
		sprite.update();
	}
}


