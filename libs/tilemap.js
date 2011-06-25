/*
 * Représentation du niveau de jeu
 *
 */


// Classe, map vide de taille 0 par défaut.
function TileMap(_canvas) {
	var level;
	var tiles;
	var sprites = this.sprites = new Array();
	var bits;
	var ready;
	var tilesize = TILE_SIZE;
	var nbSprites = 0;
	var canvas = _canvas;

	// matrice représentant le niveau
	this.level;

	// association type de tuile => image à utiliser
	this.tiles = new Array();
	this.tiles[   0] = 'blank';
	this.tiles[1056] = 's_ns';
	this.tiles[  66] = 's_oe';
	this.tiles[2304] = 's_en';
	this.tiles[ 144] = 's_es';
	this.tiles[   9] = 's_os';
	this.tiles[ 516] = 's_on';
	this.tiles[3504] = 'tb_e';
	this.tiles[ 219] = 'tb_s';
	this.tiles[1581] = 'tb_o';
	this.tiles[2886] = 'tb_n';

	// de base, map non chargée
	this.ready = false;

	// Affichage de la map
	this.draw = function(c) {
		var i, j;
		for(i=0; i< this.level.length; i++) {
			for(j=0; j< this.level[i].length; j++) {
				this.sprites[i][j].draw(c, [i * TILE_SIZE, j * TILE_SIZE]);
			}
		}
	}

	var N, S, W, E;
	N = 1;
	S = 2;
	W = 3;
	E = 4;

	this.bits = new Array();
	this.bits[this.N] = new Array();
	this.bits[this.N][this.S] = 10;
	this.bits[this.N][this.W] = 9;
	this.bits[this.N][this.E] = 11;
	this.bits[this.S] = new Array();
	this.bits[this.S][this.N] = 5;
	this.bits[this.S][this.W] = 3;
	this.bits[this.S][this.E] = 4;
	this.bits[this.W] = new Array();
	this.bits[this.W][this.N] = 2;
	this.bits[this.W][this.S] = 0;
	this.bits[this.W][this.E] = 1;
	this.bits[this.E] = new Array();
	this.bits[this.E][this.N] = 8;
	this.bits[this.E][this.S] = 7;
	this.bits[this.E][this.W] = 6;

	// Validité de la direction demandée en fonction de la tuile
	this.isValidDirection = function(x, y, from, to) {
		if(this.level[x][y] & (1 << this.bits(from, to)) != 0) {
			return true;
		}
		return false;
	}

	// Appelée une fois la map chargée
	// A surcharger dans le contexte appelant
	this.onload = function() {
		for(i=0; i< this.level.length; i++) {
			for(j=0; j< this.level[0].length; j++) {
				this.sprites[i][j] = new Sprite(["left", "top"], {
					default: [["arts/"+this.tiles[this.level[j][i]]+".png", 0]]
				});
				this.sprites[i][j].action("default");
			}
		}
	}

	this.load = function(mapId) {
		var xhr;
		var refMap = this;
		xhr = getXHR();
		xhr.onreadystatechange  = function() {
			if(xhr.readyState  == 4) {
				if(xhr.status  == 200) {
					refMap.loadCsv(xhr.responseText);
				} else {
					alert("Error code " + xhr.status + " : " + xhr.statusText);
				}
			}
		};
		xhr.open("GET", 'maps/'+mapId+'.csv',  true);
		xhr.send(null);
	}

	// Permet de charger les données matricielles sous forme de csv
	this.loadCsv = function(csv) {
		var lines = csv.split("\n");
		var i,j, columns, ieff;
		this.level = new Array();
		this.sprites = new Array();
		for(i=0, ieff=0; i< lines.length; i++) {
			if(trim(lines[i]) != '') {
				this.level[ieff] = new Array();
				this.sprites[ieff] = new Array();
				columns = lines[i].split(';');
				for(j=0; j< columns.length; j++) {
					this.level[ieff][j] = parseInt(columns[j]);
				}
				
				ieff ++;
			}
		}
		this.ready = true;
		this.onload();
	}
}
