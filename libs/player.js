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
	 * list of pressed keys
	 */
	this.keys_stack = new Array();
	
	/**
	 * capture keys
	 */
	this.keyDown = function (keyCode) {
		this.catManipulation(keyCode);
	}
	
	/**
	 * Reset captured key
	 */
	this.keyUp = function(keyCode) {
		this.catManipulation(keyCode, true);
	}
	
	/**
	 * property setter turn or action depends on given keymap
	 */
	this.catManipulation = function(keyCode, reset){
		for(key in keymap){
			if(keymap[key] == keyCode){
				
				/**
				 * setting turn property
				 */
				if(key == LEFT || key == RIGHT || key == UP || key == DOWN){
					if(!reset) {
						
						this.keys_stack.push(key);
						this.setCatDirection(key);
						
					} else {
						
						for(k in this.keys_stack){
							if(this.keys_stack[k] == key){
								this.keys_stack.splice(k, 1);
							}
						}
						
						if(this.keys_stack.length > 0){
							console.log(this.keys_stack[this.keys_stack.length - 1 ]);
							
							this.setCatDirection(this.keys_stack[this.keys_stack.length - 1]);
							
						}else{
							this.setCatDirection(null);
							
						}
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
	
	
	/**
	 * proxy method for cat manipulation
	 * @param key - string direction
	 */
	this.setCatDirection = function(key){
		switch(key) {
			case LEFT:	cat.setDesiredDirection(WEST);	break;
			case RIGHT:	cat.setDesiredDirection(EAST);	break;
			case UP:	cat.setDesiredDirection(NORTH);	break;
			case DOWN:	cat.setDesiredDirection(SOUTH);	break;
			
			default: 	cat.setDesiredDirection(NONE);	break;
		}
	}
	
	
	
}