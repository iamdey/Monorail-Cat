
/**
 * class MapItem extends Entity p4wned by Map
 * 
 * display an Item on the map
 * 
 * @author esion
 */
function MapItem(item, map, startingXTile, startingYTile){
	var parent = new Entity(map, startingXTile, startingYTile);
	
	// Sprite
	var sprite = new Sprite(["center", "center"], 
			{ stand: [["arts/cat2-left.png", 50]]}, function() {}
	);
	
	// Draws the item
	this.draw = function(c) {
//		console.log(parent.pos);
		sprite.draw(c, parent.pos);
	}
}