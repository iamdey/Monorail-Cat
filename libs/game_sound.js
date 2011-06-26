soundManager.url = '../../vendor/soundmanager/swf/';
soundManager.useHTML5Audio = true;
soundManager.debugFlash = true;
soundManager.debugMode = true;

/**
 * GameSound manager
 * 
 * @author vlavb
 * 
 * @returns {Sound}
 */
function GameSound() {
	this.load = function(url, id) {
		soundManager.createSound({
			id: id,
			url: url,
			autoLoad: true
		});
	}

	this.play = function(id, duration) {
		duration = duration || -1;
		if (duration <= 0) {
			soundManager.play(id);
		} else {
			var s = soundManager.getSoundById(id);
			s.onposition(duration, function(eventPosition) {
				this.stop();
			});
			s.play();
		}
	}

	this.playLoop = function(id, loops) {
		var s = soundManager.getSoundById(id);
		function loopfinished() {
			if (typeof loops != "undefined") {
				loops--;
				if (loops <= 0) {
					return;
				}
			}
			this.play({onfinish: loopfinished});
		};
		s.play({onfinish: loopfinished});
	}
	
	/**
	 * constructor
	 */
	this.load("../sound/openning.mp3", "openning");
	this.load("../sound/level1.mp3", "level");
//	this.load("../sound/openning.mp3", "openning");
//	this.load("../sound/openning.mp3", "openning");
//	this.load("../sound/openning.mp3", "openning");
//	this.load("../sound/openning.mp3", "openning");
//	this.load("../sound/openning.mp3", "openning");
//	this.load("../sound/openning.mp3", "openning");
	
}
