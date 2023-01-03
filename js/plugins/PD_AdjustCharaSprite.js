//=============================================================================
// PD_AdjustCharaSprite.js
//=============================================================================

/*:
 * @plugindesc Adjusting character sprite and player move speed down in world map.
 * @author Shio_inu
 *
 * @help character file name include "noAdjust", no adjusting character sprite.
 * last update : 18th dec 2015 v1.01
 */

/*:ja
 * @plugindesc ワールドマップで自動的にキャラクターの表示サイズを小さくし、移動速度を下げるプラグインです。
 * @author しおいぬ
 *
 * @help ファイル名に「noAdjust」が含まれるキャラクターチップは縮小されません。
 * ファイル名の末尾に「_F」の文字列が含まれる歩行グラフィックを
 * フィールドグラフィックとして扱います。
 * このグラフィック変更はPD_8DirDash.jsと併用可能です。
 * last update : 2015/12/18 v1.01
 */
(function(){

    Sprite_Character.prototype.updateOther = function() {
        this.opacity = this._character.opacity();
        this.blendMode = this._character.blendMode();
        this._bushDepth = this._character.bushDepth();

        var fileName = this._characterName.substring(this._characterName.lastIndexOf( "_" ));
        if($gameMap.isOverworld() && this._characterName.indexOf("noAdjust") === -1 && this._tileId === 0 && (fileName.indexOf("F") === -1)){
            this.scale = new Point(0.5, 0.5);
        }
        else {
            this.scale = new Point(1, 1);
        }
    };

    Sprite_Character.prototype.characterPatternX = function() {
        var fileName = this._characterName.substring(this._characterName.lastIndexOf( "_" ));
        if($gameMap.isOverworld() && (fileName.indexOf("F") != -1)){
            if(fileName.indexOf("D") != -1){
                return this.shiftCharacterPatternX(6);
            } else {
                return this.shiftCharacterPatternX(3);
            }
        }
        return this.shiftCharacterPatternX(0);
    };

    var shiftPatternX = Sprite_Character.prototype.shiftCharacterPatternX;
    Sprite_Character.prototype.shiftCharacterPatternX = function(shift) {
        if(!shiftPatternX){
            return this._character.pattern() + shift;
        }
        return shiftPatternX.call(this, shift);
    };

    Game_Player.prototype.realMoveSpeed = function() {
        return this._moveSpeed + (this.isDashing() ? 1 : 0) - ($gameMap.isOverworld() ? 1 : 0);
    };

})();