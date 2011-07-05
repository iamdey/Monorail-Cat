/**
 * GameSound manager
 *
 * @author vlavv
 * @author esion
 *
 * @returns {Sound}
 */
function GameSound () {
	/**
	 * Stack sounds
	 */
	this.loaded_sounds = new Array();

	this.load = function(sound_id, a_url){
		try{
			this.loaded_sounds[sound_id] = new Sound(sound_id, a_url);
		}catch(e){
			if(DEBUG)
				console.log(e);
		}
	}

	this.play = function(id, endedCallback) {
		if(MUSIC){
			this.loaded_sounds[id].play(endedCallback);
		}
	}

	this.playLoop = function(id) {
		if(MUSIC){
			this.loaded_sounds[id].playLoop();
		}
	}
	this.pause = function(id){
		this.loaded_sounds[id].pause();
	}

	/**
	 * Kill all sounds from the page
	 */
	this.stopAll = function(){
		doc_audio = document.getElementsByTagName("audio");
		for(i = 0; i < doc_audio.length; i++){
			doc_audio[i].pause();
		}
	}

	/**
	 * constructor
	 * path is relative to html file
	 */
	this.load("openning", ["sound/openning.ogg", "sound/openning.mp3"]);
	this.load("game_over", ["sound/game_over.ogg", "sound/game_over.mp3"]);
	this.load("level1", ["sound/level1.ogg", "sound/level1.mp3"]);
	this.load("meow01", ["sound/meow01.ogg", "sound/meow01.mp3"]);
	this.load("meow03", ["sound/meow03.ogg", "sound/meow03.mp3"]);
	this.load("geyser02", ["sound/geyser02.ogg", "sound/geyser02.mp3"]);
	this.load("nyan", ["sound/nyan.ogg", "sound/nyan.mp3"]);
	
	 
	if ( GameSound.caller != GameSound.getInstance ) {  
		throw new Error("This object cannot be instanciated");  
	}
}

/**
 * Singleton design pattern
 */
GameSound.instance = null;
GameSound.getInstance = function(){
	if (this.instance == null) {
		this.instance = new GameSound();
	}

	return this.instance;
}
/**
 */

function Sound(sound_id, a_url){

	this.element = new Array();
	element_prefix = "snd_";
	var self = this;

	this.load = function(sound_id, a_url){

		if(e(element_prefix + sound_id) != null){
			throw new Error("A loaded sound already has the same name : " + sound_id);
		}

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
			e(GAME_ID).appendChild(this.element[i]);
			this.element[i].load();

			//define its neighbour id in order to play almost fluent loop
			this.element[i].neighbourg = (i + 1) % 2;

			if(DEBUG){
				this.element[i].setAttribute("controls", "controls");
			}
		}
	}

	this.unload = function(){

	}

	/**
	 * dozssingz
	 */
	this.play = function(endedCallback){
		if(endedCallback) {
			this.element[0].addEventListener('ended', endedCallback, false);
		}
		
		this.element[0].play();
	}

	/**
	 * dozssingz
	 */
	this.playLoop = function(){
		this.element[0].play();

//		this.element.setAttribute("loop", "loop"); //doznot work on ff@ubuntu
		for(i = 0;i<this.element.length;i++){
			this.element[i].addEventListener('ended', function(elem){
				this.currentTime = 0.05;
				this.pause();
				self.element[this.neighbourg].play();
			}, false);
		}

	}

	this.pause = function(){
		for(i = 0; i < this.element.length; i++){
			this.element[i].pause();
		}
	}

	/**
	 * constructor
	 */
	this.load(sound_id, a_url);
}

function muteUnmute() {
	var audios = document.getElementsByTagName('audio');
	for(var i=0; i< audios.length; i++) {
		audios[i].muted = !audios[i].muted;
	}
}
