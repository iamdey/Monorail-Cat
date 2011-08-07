function e(bloc) {
//	console.log(bloc);
	return document.getElementById(bloc);
}

function getXHR() {
	var xhr = null;
	if(window.XMLHttpRequest) // Firefox et autres
		xhr = new XMLHttpRequest();
	else if(window.ActiveXObject){ // Internet Explorer
		try {
		xhr = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}
	} else { // XMLHttpRequest non supporté par le navigateur
		//alert("Votre navigateur ne supporte pas les objets XMLHTTPRequest...");
		xhr = false;
	}
	return xhr;
}

function trim(str, chars) {
	return ltrim(rtrim(str, chars), chars);
}

function ltrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}

function rtrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}

/**
 * cookies manipulation functions to save user preferences
 */

function createCookie(name,value,days) {
	days = days || 360;
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

Array.prototype.shuffle = function() {
	var s = [];
	while (this.length) s.push(this.splice(Math.random() * this.length, 1)[0]);
	while (s.length) this.push(s.pop());
	return this;
}

/**
 *	Returns the opposite direction.
 */
function getOppositeDirection(direction) {
	switch (direction) {
		case NORTH:	return SOUTH;
		case SOUTH: return NORTH;
		case WEST:	return EAST;
		case EAST:	return WEST;
		default:	return NONE;
	}
}

/**
 *	Returns the left direction.
 */
function getLeftDirection(direction) {
	switch (direction) {
		case NORTH:	return WEST;
		case SOUTH: return EAST;
		case WEST:	return SOUTH;
		case EAST:	return NORTH;
		default:	return NONE;
	}
}

/**
 *	Returns the right direction.
 */
function getRightDirection(direction) {
	switch (direction) {
		case NORTH:	return EAST;
		case SOUTH: return WEST;
		case WEST:	return NORTH;
		case EAST:	return SOUTH;
		default:	return NONE;
	}
}

/**
 *	Returns the direction as a string.
 */
function translateDirection(direction) {
	switch (direction) {
		case NORTH:	return "NORTH";
		case SOUTH: return "SOUTH";
		case WEST:	return "WEST";
		case EAST:	return "EAST";
		default:	return "NONE ("+direction+")";
	}
}
