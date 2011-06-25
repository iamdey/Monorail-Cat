
/**
 * class Player 
 * 
 * keyboard bindings
 * 
 * @author esion
 */
function Player(gs, keymap){
	
	/** 
	 * const left / right
	 */
	var turn_null 	= null; //obviously nerdy const for trollerz
	var turn_right 	= "right";
	var turn_left 	= "left";
	
	/**
	 * the player current direction
	 */
	this.turn = null;
	
	/**
	 * temporary display fake squared cat
	 */
	var x = gs.width * 0.5;
    var y = gs.height * 0.5;
    var r = gs.width * 0.1;
	
    /**
     * player representation
     */
	this.draw = function(c) {
        c.fillRect(x / 2, y / 2, r, r);
        
        if(this.turn)
        	console.log(this.turn);
    }
	
	/**
	 * capture keys
	 */
	this.keyDown_81 = function(){
		this.turn = turn_left;
	}
	
	this.keyDown_68 = function(){
		this.turn = turn_right;
	}
	
	
	/**
	 * Reset turn attrib
	 */
	this.keyUp = function(keycode){
		this.turn = turn_null;
		console.log("keyUp");
	}
	
	this.keyDown = function (keyCode) {
		console.log("keyDown");
	}
}