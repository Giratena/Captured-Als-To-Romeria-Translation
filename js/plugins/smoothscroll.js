//=============================================================================
// 滑らかカメラの移動プラグインです。
// smoothscroll.js
// Copyright (c) 2018 村人Ａ
//=============================================================================

/*:ja
 * @plugindesc カメラの移動を滑らかにするプラグインです。
 * @author 村人A
 *
 * @help
 *
 * なめらかスクロールonの後にはカメラがプレイヤーを追う速さの数値を入れてください。
 * 1で通常のスピードです。0.02くらいがいい感じのスクロールになります。
 * イベントコマンドでスクロールをする場合は一度なめらかスクロールをoffにしてください。
 *
 * プラグインコマンド例:
 *   なめらかスライドon 0.02    # なめらかスライドon　カメラの速さを0.02に
 *   なめらかスライドoff        # なめらかスライドoff
 */

(function() {
	villaA_scrollSpeed = 1;
	villaA_mapscroll = false;
	villaA_smoothScrolling = false;
	
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'なめらかスライドon') {
			villaA_smoothScrolling = true;
			villaA_scrollSpeed = args[0]
		}
		
        if (command === 'なめらかスライドoff') {
			villaA_smoothScrolling = false;
			villaA_scrollSpeed = 1;
		}
	}
		
	Game_Map.prototype.player_scrollDown = function(distance) {
		if (this.isLoopVertical()) {
			this._displayY += distance;
			this._displayY %= $dataMap.height;
			if (this._parallaxLoopY) {
				this._parallaxY += distance;
			}
		} else if (this.height() >= this.screenTileY()) {
			var lastY = this._displayY;
			this._displayY = Math.min(this._displayY + distance*villaA_scrollSpeed,
				this.height() - this.screenTileY());
			this._parallaxY += this._displayY - lastY;
		}
	};

	Game_Map.prototype.player_scrollLeft = function(distance) {
		if (this.isLoopHorizontal()) {
			this._displayX += $dataMap.width - distance;
			this._displayX %= $dataMap.width;
			if (this._parallaxLoopX) {
				this._parallaxX -= distance;
			}
		} else if (this.width() >= this.screenTileX()) {
			var lastX = this._displayX;
			this._displayX = Math.max(this._displayX - distance*villaA_scrollSpeed, 0);
			this._parallaxX += this._displayX - lastX;
		}
	};

	Game_Map.prototype.player_scrollRight = function(distance) {
		if (this.isLoopHorizontal()) {
			this._displayX += distance;
			this._displayX %= $dataMap.width;
			if (this._parallaxLoopX) {
				this._parallaxX += distance;
			}
		} else if (this.width() >= this.screenTileX()) {
			var lastX = this._displayX;
			this._displayX = Math.min(this._displayX + distance*villaA_scrollSpeed,
				this.width() - this.screenTileX());
			this._parallaxX += this._displayX - lastX;
		}
	};

	Game_Map.prototype.player_scrollUp = function(distance) {
		if (this.isLoopVertical()) {
			this._displayY += $dataMap.height - distance;
			this._displayY %= $dataMap.height;
			if (this._parallaxLoopY) {
				this._parallaxY -= distance;
			}
		} else if (this.height() >= this.screenTileY()) {
			var lastY = this._displayY;
			this._displayY = Math.max(this._displayY - distance*villaA_scrollSpeed, 0);
			this._parallaxY += this._displayY - lastY;
		}
	};

	Game_Player.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
		var villaA_roundingNum = 0
		var x1 = lastScrolledX;
		var y1 = lastScrolledY;
		
		if(villaA_smoothScrolling){
			villaA_roundingNum = 0.5;
			x1 = 8;
			y1 = 6;
		}
		
		var x2 = this.scrolledX();
		var y2 = this.scrolledY();
		if (y2-villaA_roundingNum > y1 && y2 > this.centerY()) {
			$gameMap.player_scrollDown(y2 - y1);
		}
		if (x2+villaA_roundingNum < x1 && x2 < this.centerX()) {
			$gameMap.player_scrollLeft(x1 - x2);
		}
		if (x2-villaA_roundingNum > x1 && x2 > this.centerX()) {
			$gameMap.player_scrollRight(x2 - x1);
		}
		if (y2+villaA_roundingNum < y1 && y2 < this.centerY()) {
			$gameMap.player_scrollUp(y1 - y2);
		}
	};
})();