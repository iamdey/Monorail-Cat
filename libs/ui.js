
/*
 * Manipulation de l'interface utilisateur autour du jeu (compteurs de vies, items, messages)
 *
 */

function _UI() {
	// Map Bonus => Img
	this.bonusImages = new Array();
	this.bonusImages['woolball'] = 'woolBall.png';
	this.bonusImages['rainbow'] = 'rainbow_eo1.png';
	this.bonusImages['water'] = 'water2.png';

	// Last Timeout defined for msg
	this.lastTimeout = null;

	// Message text size
	this.NORMAL = '20pt';
	this.BIG    = '35pt';
	this.HUGE   = '50pt';


	this.setPlayerName = function(player, name) {
		if(player == 1 || player == 2) {
			e('player'+player+'name').innerHTML = name;
		}
	}

	this.setPlayerLives = function(player, nbLives) {
		if(player == 1 || player == 2) {
			var lives = '';
			for(var i = 0; i< nbLives; i++) {
				if(player == 1)
					lives += '<img src="arts/cat1-right.png"></img><br />';
				else
					lives += '<img src="arts/cat2-left.png"></img><br />';
			}
			e('player'+player+'lives').innerHTML = lives;
		}
	}

	this.setPlayerBonus = function(player, bonusName) {
		if(player == 1 || player == 2) {
			if(this.bonusImages[bonusName] != undefined) {
				e('player'+player+'bonusImage').src = 'arts/'+this.bonusImages[bonusName];
			} else {
				e('player'+player+'bonusImage').src = 'arts/blank.png';
			}
		}
	}

	// Affiche un message
	// @param text texte à afficher (HTML autorisé)
	// @param size taille du texte (UI.{NORMAL, BIG, HUGE}, ou manuel (eg. '15pt')). Defaut : UI.NORMAL
	// @param timeout durée de disparition automatique en ms, si <=0 alors fermeture manuelle par l'utilisateur. Defaut : 3s
	// @param command commande lancée à la fermeture du message. Defaut : ''
	this.printMsg = function(text, size, timeout, command) {
		var box = e('msg');
		// changement de style, positionnement
		var sw = document.body.clientWidth || window.innerWidth;
		var sh = document.body.clientHeight || window.innerHeight;
		box.style.top = /*((sh - 400) / 2)*/ 200 + 'px';
		box.style.left = ((sw - 550) / 2 -30) + 'px';
		box.style.fontSize = size || this.NORMAL;
		// si timeout précédent, on le retire
		if(this.lastTimeout != null) {
			clearTimeout(this.lastTimeout);
			this.lastTimeout = null;
		}
		timeout = timeout ||3000;
		command = command || '';
		// préparation du texte
		text = '<p>'+text+'</p>';
		if(timeout <= 0) {
			text += '<p><input type="button" value="Fermer" onclick="'+command+';UI.closeMsg(); return false;" /></p>';
		}
		box.innerHTML = text;
		// timeout si nécessaire
		if(timeout >0) {
			this.lastTimeout = setTimeout('UI.closeMsg();', timeout);
			setTimeout(command, timeout);
		}
		// affichage final :
		box.style.display = 'block';
	}

	// Ferme le message actuellemnt à l'écran
	this.closeMsg = function() {
		var box = e('msg');
		box.style.display = 'none';
		// s'il y avait un timeout en cours, on le retire
		if(this.lastTimeout != null) {
			clearTimeout(this.lastTimeout);
			this.lastTimeout = null;
		}
	}

}

UI = new _UI();
