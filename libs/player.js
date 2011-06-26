var RIGHT = "right";
var LEFT = "left";
var UP = "up";
var DOWN = "down";

/**
 * class Player 
 * 
 * keyboard bindings
 * damned the cat must control the player !!! 
 * 
 * @author esion
 * @param player_id string
 * @param keymap json
 * @param cat Cat
 */
function Player(player_id, keymap, cat){
	
    /**
     * player representation
     */
	this.draw = function(c) {
//        c.fillRect(x / 2, y / 2, r, r);
        
        if(this.turn)
        	console.log(player_id, "turn", this.turn);
        
        if(this.action)
        	console.log(player_id, "action", this.action);
    }
	
	/**
	 * capture keys
	 */
	this.keyDown = function (keyCode) {
		this.catManipulation(keyCode);
	}
	
	/**
	 * Reset turn attribute
	 */
	this.keyUp = function(keyCode) {
		this.catManipulation(keyCode, true);
	}
	
	/**
	 * property setter turn or action depends on given keymap
	 */
	this.catManipulation = function(keyCode, reset){
		for(key in keymap)
		{
			if(keymap[key] == keyCode){
				/**
				 * setting turn property
				 */
				if(key == LEFT || key == RIGHT || key == UP || key == DOWN){
					if(!reset){
						cat.setDesiredDirection(key);
					}else{
						cat.setDesiredDirection(NONE);
					}
				}
				/**
				 * action property case
				 */
				else{
					if(!reset){
						cat.doAction(key);
					}else{
						cat.doAction(NONE);
					}
						
				}
			}
		}
	}
	
}