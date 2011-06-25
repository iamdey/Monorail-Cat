
/**
 * class Player 
 * 
 * keyboard bindings
 * 
 * @author esion
 */
function Player(player_id, keymap){
	
	/** 
	 * const left / right
	 */
	var turn_right 	= "right";
	var turn_left 	= "left";
	
	/**
	 * the player current direction
	 */
	this.turn 	= null;
	/**
	 * the player current action
	 */
	this.action = null;
	
	
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
		this.propertySet(keyCode);
	}
	
	
	/**
	 * Reset turn attrib
	 */
	this.keyUp = function(keyCode) {
		this.propertySet(keyCode, true);
	}
	
	/**
	 * property setter turn or action depends on given keymap
	 */
	this.propertySet = function(keyCode, reset){
		for(key in keymap)
		{
			if(keymap[key] == keyCode){
				/**
				 * setting turn property
				 */
				if(key == turn_left || key == turn_right){
					if(!reset){
						this.turn = key;
					}else{
						this.turn = null;
					}
				}
				/**
				 * action property case
				 */
				else{
					if(!reset){
						this.action = key;
					}else{
						this.action = null;
					}
						
				}
			}
		}
	}
	
}