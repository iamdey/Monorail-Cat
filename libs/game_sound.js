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
 * GameSound manager
 * 
 * this must initialized after the dom is ready
 *
 * @author vlavv
 * @author esion
 *
 * @returns {Sound}
 */
function _GameSound() {
	/**
	 * @var Stacked sounds
	 */
	this.loaded_sounds 	= {};
	
	/**
	 * @var game sound is muted?
	 */ 
	this.is_mute 		= false;
}

_GameSound.prototype = {
	/**
	 * constructor
	 * path is relative to html file
	 */
	initialize : function(){
		this.load("openning", ["sound/openning.ogg", "sound/openning.mp3"]);
		this.load("game_over", ["sound/game_over.ogg", "sound/game_over.mp3"]);
		this.load("level1", ["sound/level1.ogg", "sound/level1.mp3"]);
		this.load("meow01", ["sound/meow01.ogg", "sound/meow01.mp3"]);
		this.load("meow03", ["sound/meow03.ogg", "sound/meow03.mp3"]);
		this.load("geyser02", ["sound/geyser02.ogg", "sound/geyser02.mp3"]);
		this.load("nyan", ["sound/nyan.ogg", "sound/nyan.mp3"]);
	},
	/**
	 * load sound into dom
	 */
	load : function(sound_id, a_url){
		try{
			this.loaded_sounds[sound_id] = new Sound(sound_id, a_url);
		}catch(e){
			if(DEBUG)
				console.log(e);
		}
	},

	/**
	 * Play a sound
	 */
	play : function(id, endedCallback) {
		if(MUSIC){
			this.loaded_sounds[id].play(endedCallback);
		}
	},

	/**
	 * Play sound as a loop
	 */
	playLoop : function(id) {
		if(MUSIC){
			this.loaded_sounds[id].playLoop();
		}
	},
	
	/**
	 * Pause a sound
	 */
	pause : function(id){
		this.loaded_sounds[id].pause();
	},

	/**
	 * Kill all sounds from the dom
	 */
	stopAll : function(){
		for(i in this.loaded_sounds){
			this.loaded_sounds[i].stop();
		}
	},

	/**
	 * Toggle mute all sound
	 */ 
	toggleMute : function() {
		this.is_mute = !this.is_mute;
        
        createCookie('is_mute', this.is_mute);

		for(i in this.loaded_sounds){
			this.loaded_sounds[i].mute(this.is_mute);
		}
        
        UI.checkAudioButton();
	}
}

/**
 * Sound class
 * 
 * manage one sound foar the lulz
 */
function Sound(sound_id, a_url){

	this.element 	= new Array();
	element_prefix 	= "snd_";
	this.sound_id 	= sound_id;
	this.a_url 		= a_url;
	var self 		= this;
	
	/**
	 * this is the callback launched at the end of a loop
	 * We need a ref to self
	 * this cannot be prototyped
	 */
	this.toggleLoopSound = function(event){
		this.currentTime = 0.05;
		this.pause();
		self.element[this.neighbourg].play();
	};	
	
	this.initialize();
}

Sound.prototype = {
	
	initialize: function(){
		
		this.load(this.sound_id, this.a_url);
	},

	load : function(sound_id, a_url){
		/*if(e(element_prefix + sound_id) != null){
			throw new Error("A loaded sound already has the same name : " + sound_id);
		}*/

		//the basic html attribut loop won't work on FF
		//Loop by setting time is very laggy
		//define two audio element and switch at the end of the other
		for(i=0;i<2; i++){
			this.element[i] = document.createElement("audio");
			this.element[i].setAttribute("id", element_prefix + sound_id + "_" + i);
			for(k = 0; k < a_url.length; k++){
				this.element[i].innerHTML += "<source src=\"" + a_url[k] + "\" />";
			}
			
			//add the audio element to dom
			//e(GAME_ID).appendChild(this.element[i]);
			this.element[i].load();

			//define its neighbour id in order to play almost fluent loop
			this.element[i].neighbourg = (i + 1) % 2;

			if(DEBUG){
				this.element[i].setAttribute("controls", "controls");
			}
		}
	},

	/**
	 * Maybe that will do things a day
	 */
	unload : function(){
		throw new Error("unload iz not yet implemented");
	},

	/**
	 * dozssingz
	 */
	play : function(endedCallback){
		if(endedCallback) {
			this.element[0].addEventListener('ended', endedCallback, false);
		}
		
		this.element[0].play();
		this.element[0].currentTime = 0;
	},

	/**
	 * dozssingz
	 */
	playLoop : function(){
		this.element[0].play();

		//this.element[0].setAttribute("loop", "loop"); //doznot work on ff@ubuntu
		for(i = 0;i<this.element.length;i++){
			this.element[i].addEventListener('ended', this.toggleLoopSound, false);
		}
	},
	
	/**
	 * pause and reset the sound
	 */ 
	stop : function(){
		for(i = 0; i < this.element.length; i++){
			this.element[i].pause();
			this.element[i].currentTime = 0;
		}
	},
	
	/**
	 * pause the sound
	 */ 
	pause : function(){
		for(i = 0; i < this.element.length; i++){
			this.element[i].pause();
		}
	},
	
	mute: function(is_mute){
		for(i = 0; i < this.element.length; i++){
			this.element[i].muted = is_mute;
		}
	}
}

/**
 * @var game sound manager singleton 
 */
GameSound = new _GameSound();
