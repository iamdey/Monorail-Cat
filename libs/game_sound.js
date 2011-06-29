/**
 * GameSound manager
 * 
 * @author vlavb
 * @author esion
 * 
 * @returns {Sound}
 */
function GameSound() {
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
	
	this.play = function(id, duration) {
		if(MUSIC){
			this.loaded_sounds[id].play();
		}
		
//		duration = duration || -1;
//		if (duration <= 0) {
//			soundManager.play(id);
//		} else {
//			var s = soundManager.getSoundById(id);
//			s.onposition(duration, function(eventPosition) {
//				this.stop();
//			});
//			s.play();
//		}
	}

	this.playLoop = function(id) {
		this.loaded_sounds[id].playLoop();
	}
	
//	this.playLoop = function(id, loops) {
//		var s = soundManager.getSoundById(id);
//		function loopfinished() {
//			if (typeof loops != "undefined") {
//				loops--;
//				if (loops <= 0) {
//					return;
//				}
//			}
//			this.play({onfinish: loopfinished});
//		};
//		s.play({onfinish: loopfinished});
//	}
	
	/**
	 * Kill all sounds from the page
	 */
	this.stopAll = function(){
		doc_audio = document.getElementsByTagName("audio");
		for(i = 0; i < doc_audio.length; i++){
			console.log(doc_audio[i]);
			doc_audio[i].pause();
//			doc_audio[i].currentTime=0;
		}
	}
	
	/**
	 * constructor 
	 * path is relative to html file
	 */
	this.load("openning", ["sound/openning.ogg", "sound/openning.mp3"]);
	this.load("game_over", ["sound/game_over-src.ogg", "sound/game_over.mp3"]);
	this.load("level1", ["sound/level1.ogg", "sound/level1.mp3"]);
//	this.load("openning", ["sound/openning.ogg", "sound/openning.mp3"]);
//	this.load("openning", ["sound/openning.ogg", "sound/openning.mp3"]);
	
}

function Sound(sound_id, a_url){
	
	this.element = null;
	element_prefix = "snd_";
	
	this.load = function(sound_id, a_url){
		
		if(e(element_prefix + sound_id) != null){
			throw new Error("A loaded sound already has the same name : " + sound_id);
		}
		
		this.element = document.createElement("audio");
		this.element.setAttribute("id", element_prefix + sound_id);
		if(DEBUG){
			this.element.setAttribute("controls", "controls");
		}
		
		for(k = 0; k < a_url.length; k++){
			this.element.innerHTML += "<source src=\"" + a_url[k] + "\" />";
		}
		
		//add the audio element to dom 
			e(GAME_ID).appendChild(this.element);
		
		this.element.load();
	}
	
	this.unload = function(){
		
	}
	
	/**
	 * dozssingz
	 */
	this.play = function(){
		console.log("play ", sound_id);
		this.element.play();
	}
	
	/**
	 * dozssingz
	 */
	this.playLoop = function(){
//		this.element.setAttribute("loop", "loop"); //doznot work on ff@ubuntu
		this.element.addEventListener('ended', function(elem){
			this.currentTime = 0;
		}, false);
		
		this.element.play();
	}
	
	this.stop = function(){
		this.element.stop();
	}
	
	/**
	 * constructor
	 */
	this.load(sound_id, a_url);
}