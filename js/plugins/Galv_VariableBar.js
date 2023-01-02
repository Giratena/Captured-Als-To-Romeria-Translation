//-----------------------------------------------------------------------------
//  Galv's Variable Bar
//-----------------------------------------------------------------------------
//  For: RPGMAKER MV
//  Galv_VariableBar.js
//-----------------------------------------------------------------------------
//  2017-09-08 - Version 1.0 - release
//-----------------------------------------------------------------------------
// Terms can be found at:
// galvs-scripts.com
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.Galv_VariableBar = true;

var Galv = Galv || {};        // Galv's main object
Galv.VBAR = Galv.VBAR || {};        // Galv's plugin stuff

//-----------------------------------------------------------------------------
/*:
 * @plugindesc (v.1.0) A graphical bar that displays in the map scene to show the current value of a max value visually using variables.
 *
 * @author Galv - galvs-scripts.com
 *
 * @help
 *   Galv's Variable Bar
 * ----------------------------------------------------------------------------
 * This plugin displays a graphical bar on the map scene based on two variables
 * that are chosen when each bar is created.
 *
 * ----------------------------------------------------------------------------
 *   SCRIPT CALLS
 * ----------------------------------------------------------------------------
 * To create a variable bar on screen, you can use the following script call:
 *
 *      Galv.VBAR.create(id,"barimage","barimage2",var1,var2,x,y,ox,oy);
 *
 * id         = A unique id number and index to reference the variable bar
 * barimage   = Image name from /img/pictures/ to use for the variable bar
 * barimage2  = Image name from /img/pictures/ to use for the bar underlay
 * var1       = Variable id to use for current value of bar
 * var2       = Variable id to use for maximum value of bar
 * x          = X position of the bar images on the screen
 * y          = Y position of the bar images on the screen
 * ox         = The x offset of the barimage in relation to barimage2
 * oy         = The y offset of the barimage in relation to barimage2
 *
 * If you create a new bar using the same id as another bar you have already
 * created, it will remove that bar and create the new one.
 *
 *
 * To remove a variable bar from the screen, you can use:
 *
 *       Galv.VBAR.remove(id);
 *
 *
 * To modify a variable bar, you can use the following:
 *
 *       Galv.VBAR.mod(id).barimage = "image";
 *       Galv.VBAR.mod(id).barimage2 = "image";
 *       Galv.VBAR.mod(id).var1 = currentVarId;
 *       Galv.VBAR.mod(id).var2 = maxVarId;
 *       Galv.VBAR.mod(id).x = xPos;
 *       Galv.VBAR.mod(id).y = yPos;
 *       Galv.VBAR.mod(id).ox = oxPos;
 *       Galv.VBAR.mod(id).oy = oyPos;
 */

//-----------------------------------------------------------------------------
//  CODE STUFFS
//-----------------------------------------------------------------------------

(function() {


Galv.VBAR.create = function(id,image,image2,var1,var2,x,y,ox,oy) {
	if (id >= 0) {
		$gameSystem._varBars[id] = {
			barimage:image || "",
			barimage2: image2 || "",
			var1:var1 || 0,
			var2:var2 || 0,
			x:x || 0,
			y:y || 0,
			ox:ox || 0,
			oy:oy || 0
		};
	}
	// refresh scene
	if (SceneManager._scene.createVarBars) SceneManager._scene.createVarBars();
};

Galv.VBAR.remove = function(id) {
	$gameSystem._varBars[id] = null;
	// refresh scene
	if (SceneManager._scene.createVarBars) SceneManager._scene.createVarBars();
};

Galv.VBAR.mod = function(id) {
	return $gameSystem._varBars[id];
};


//-----------------------------------------------------------------------------
//  GAME SYSTEM
//-----------------------------------------------------------------------------

Galv.VBAR.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
	Galv.VBAR.Game_System_initialize.call(this);
	this._varBars = []; // list of all bars existing in game
};


//-----------------------------------------------------------------------------
//  SCENE MAP
//-----------------------------------------------------------------------------

Galv.VBAR.Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
Scene_Map.prototype.createDisplayObjects = function() {
	Galv.VBAR.Scene_Map_createDisplayObjects.call(this);
	this.createVarBars();
};

Scene_Map.prototype.createVarBars = function() {
	// if bars exist, remove them all
	if (this._varBars) {
		for (var i = 0; i < this._varBars.length; i++) {
			this.removeChild(this._varBars[i]);
		}
	}
	// init varBar sprite container
	this._varBars = [];	
	// create varBar sprites
	for (var i = 0; i < $gameSystem._varBars.length; i++) {
		// if index exists in array, add as sprite
		if ($gameSystem._varBars[i]) {
			this._varBars.push(new Sprite_VarBar(i));		
		}
	}	
	// make children
	for (var i = 0; i < this._varBars.length; i++) {
		this.addChild(this._varBars[i]);
	}
};

})();



//-----------------------------------------------------------------------------
//  SPRITE VARBAR
//-----------------------------------------------------------------------------

function Sprite_VarBar() {
    this.initialize.apply(this, arguments);
}

Sprite_VarBar.prototype = Object.create(Sprite_Base.prototype);
Sprite_VarBar.prototype.constructor = Sprite_VarBar;

Sprite_VarBar.prototype.initialize = function(index) {
    Sprite_Base.prototype.initialize.call(this);
	this._id = index;
	this._barWidth = 0;
	this.createGraphics();
};

Sprite_VarBar.prototype.obj = function() {
    return $gameSystem._varBars[this._id];
};

Sprite_VarBar.prototype.createGraphics = function() {
	var obj = this.obj();
	// under image
	this._barimage2 = obj.barimage2;
	this.bitmap = ImageManager.loadPicture(obj.barimage2);
	
	// bar image
	if (this._bar) this.removeChild(this._bar);
	this._bar = new Sprite();
	this._barimage = obj.barimage;
	this._bar.bitmap = ImageManager.loadPicture(obj.barimage);
	this.addChild(this._bar);
	
	this._barNeedsInit = true;
	this.updatePos(obj);
};

Sprite_VarBar.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
	var obj = this.obj();
	if (!obj) return;
	this.updatePos(obj);
	this.updateImages(obj);
};

Sprite_VarBar.prototype.updatePos = function(obj) {
	this.x = obj.x;
	this.y = obj.y;
	this._bar.x = obj.ox;
	this._bar.y = obj.oy;
};

Sprite_VarBar.prototype.updateImages = function(obj) {
	if (this._barimage2 != obj.barimage2 || this._barimage != obj.barimage) {
		this.createGraphics();
	}
	
	// update bar sprite
	if (this._bar.bitmap.isReady()) {
		if (this._barNeedsInit) {
			// store full bar image width for max width
			this._barWidth = this._bar.width;
			this._barNeedsInit = false;
		}
		// set width based on current/max values
		var curVal = $gameVariables.value(obj.var1);
		var maxVal = $gameVariables.value(obj.var2);
		
		var percent = curVal > 0 && maxVal > 0 ? curVal / maxVal : 0;
		this._bar.width = Math.max(0,Math.min(this._barWidth * percent,this._barWidth));
	}
};