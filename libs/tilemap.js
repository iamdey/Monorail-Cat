/*
 * Représentation du niveau de jeu
 *
 * Membres utiles :
 *  - level : matrice représentant le niveau
 *  - scale : échelle appliquée si un des côtés du niveau >7
 *  - load(mapId) : charge la map mapId
 *  - draw(canvas) : dessine la map dans le canvas canvas.
 *  - isValidDirection(x,y, from, to) : permet de savoir si une entité, sur la tuile (x,y), venant de from, peut aller vers to.
 */


// Classe, map vide de taille 0 par défaut.
function TileMap(_canvas) {
	var level;
	var tiles;
	var images;
	var bits;
	var scale;
	var ready;
	var tilesize = TILE_SIZE;
	var nbSprites = 0;
	var canvas = _canvas;

	// matrice représentant le niveau
	this.level = new Array();

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
	this.tiles[4095] = 'qb';

	// chargement des images
	this.images = new Array();
	for(var tid in this.tiles) {
		this.images[tid] = new Image();
		this.images[tid].src = 'arts/'+this.tiles[tid]+'.png';
	}

	// de base, map non chargée
	this.ready = false;

	// Affichage de la map
	this.draw = function(c) {
		// Si une map est chargée :
		if(this.ready) {
			// Si la map a une longueur/hauteur plus grande que 7, on définit un coefficient d'échelle < 1.
			var maxMapSize = Math.max(this.level.length, this.level[0].length);
			this.scale = 1;
			if(maxMapSize > 7) {
				this.scale = 7.0 / maxMapSize;
			}
			
			// Redimensionnement des images :
			for(var tid in this.images) {
				this.images[tid].width  = TILE_SIZE * this.scale;
				this.images[tid].height = TILE_SIZE * this.scale;
			}
			// Effacer la map précédente.
			c.getContext('2d').clearRect(0,0, c.width, c.height);
			var i, j;
			for(i=0; i< this.level.length; i++) {
				for(j=0; j< this.level[i].length; j++) {
					c.getContext('2d').drawImage(this.images[this.level[i][j]], Math.round(this.scale * j * TILE_SIZE), Math.round(this.scale * i * TILE_SIZE));
				}
			}
			// Redimensionnement des images vers leur taille d'origine, pour éviter d'éventuels conflits :
			for(var tid in this.images) {
				this.images[tid].width  = TILE_SIZE;
				this.images[tid].height = TILE_SIZE;
			}
		}
	}

	this.bits = new Array();
	this.bits[NORTH] = new Array();
	this.bits[NORTH][SOUTH] = 10;
	this.bits[NORTH][WEST] = 9;
	this.bits[NORTH][EAST] = 11;
	this.bits[SOUTH] = new Array();
	this.bits[SOUTH][NORTH] = 5;
	this.bits[SOUTH][WEST] = 3;
	this.bits[SOUTH][EAST] = 4;
	this.bits[WEST] = new Array();
	this.bits[WEST][NORTH] = 2;
	this.bits[WEST][SOUTH] = 0;
	this.bits[WEST][EAST] = 1;
	this.bits[EAST] = new Array();
	this.bits[EAST][NORTH] = 8;
	this.bits[EAST][SOUTH] = 7;
	this.bits[EAST][WEST] = 6;

	// Validité de la direction demandée en fonction de la tuile
	this.isValidDirection = function(x, y, from, to) {
		return (from != to &&((this.level[x][y] & (1 << this.bits[from][to])) != 0));
	}

	// Appelée une fois la map chargée
	// A surcharger dans le contexte appelant
	this.onload = function() {
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
		for(i=0, ieff=0; i< lines.length; i++) {
			if(trim(lines[i]) != '') {
				this.level[ieff] = new Array();
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
