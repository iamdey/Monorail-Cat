function Map(_tilemap) {
	var tilemap = _tilemap;
	
	
	this.isValidDirection = function(x, y, from, to) {
		return tilemap.isValidDirection(x, y, from, to);
	}
}
