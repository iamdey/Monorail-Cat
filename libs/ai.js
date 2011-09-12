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



var DEFAULT_AI_NAME = "Catputer";

var ITEM_CHECK_INTERVAL = FRAMERATE * .5;
var WATER_DROP_MAX_COUNTDOWN = FRAMERATE * 3;
var WOOLBALL_DROP_MAX_TIME = FRAMERATE * 3;
var RAINBOW_DROP_MAX_TIME = FRAMERATE * 3;

/**
 * class Ai 
 * 
 * Stiupid cats ar stupidz.
 *
 * == Cat AI ===
 * Rule #1: You do not talk about teh cat club
 * Rule #2: You do not talk about teh cat club
 * 
 * - When to play items?
 * Water: play it randomly somewhere
 * Woolball: play it when enemy ahead or danger (water or woolball)
 * Rainbow: play it when enemy ahead (close enough) or danger (water or woolball)
 * 
 * - Where to go?
 * If no item: go to nearest item, but not if there is the other cat or a trap
 * If has item (woolball or rainbow): try to approach other cat
 * Else: Go randomly somewhere
 * 
 * @author Didjor
 * @param cat Cat
 */
function Ai(map, cat){
	/**
	 *	Meoooww*bbzzzz*www
	 */
	this.name = DEFAULT_AI_NAME;
	
	/**
	 * Can I controlz U?
	 */
	this.cat = cat;
	
	// Other varz
	this.map = map;
	this.item = undefined;
	this.itemDropCountdown = 0;
	this.ctItemCheck = 0;
	this.directions = [SOUTH, NORTH, WEST, EAST];
	
	/**
	 * obviously obvious method
	 */
	this.initialize();
}

Ai.prototype = {
	
	/**
	 * Oley initilaize the player lif' bar on ze Gui
	 */
	initialize: function() {
		UI.addPlayer(this);
		this.cat.registerAi(this);
	},

	/**
	 * cat getter
	 */
	getCat: function() {
		return this.cat;
	},
	
	/**
	 * Good kitty picked up an item
	 */
	itemPicked: function(item) {
		this.item = item;
		
		if (item == WATER) {
			this.itemDropCountdown = randint(0, WATER_DROP_MAX_COUNTDOWN);
			this.ctItemCheck = 0;
		} else if (item == WOOLBALL) {
			this.itemDropCountdown = randint(0, WOOLBALL_DROP_MAX_TIME);
			this.ctItemCheck = 0;
		} else {
			this.itemDropCountdown = randint(0, RAINBOW_DROP_MAX_TIME);
			this.ctItemCheck = 0;
		}
	},
	
	/**
	 *	Kitty doez not no were to go
	 */
	pathIntersection: function(tile, direction) {
		var oppositeDirection = getOppositeDirection(direction);
		var decided = false;
		
		// Shuffle possible directions
		this.directions = this.directions.shuffle();
		
		// Try to go on each direction...
		for (var i = 0; i < 4 && !decided; i++) {
			var randDir = this.directions[i];
			
			if (this.map.isValidDirection(tile[0], tile[1], oppositeDirection, randDir)) {
				this.cat.setDesiredDirection(randDir);
				
				decided = true;
			}
		}
	},
	
	update: function() {
		// Haz item
		if (this.item) {
			// Drop countdown
			if(--this.itemDropCountdown == 0) {
				this.cat.playItem();
				this.item = undefined;
			}
			
			// Check
			else if(++this.ctItemCheck == ITEM_CHECK_INTERVAL) {
				this.ctItemCheck = 0;
			}
		}
	}
}
	
