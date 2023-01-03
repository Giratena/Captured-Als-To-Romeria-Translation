//=============================================================================
// BattleAnimationOverThePictures.js
//=============================================================================

/*:
 * @plugindesc バトル中の攻撃アニメーションを、ピクチャより前に表示します。
 * @author こま
 *
 * @help *このプラグインには、プラグインコマンドはありません。
 *
 * [ 利用規約 ] ...................................................................
 *  本プラグインの利用者は、RPGツクールMV/RPGMakerMVの正規ユーザーに限られます。
 *  商用、非商用、ゲームの内容（年齢制限など）を問わず利用可能です。
 *  ゲームへの利用の際、報告や出典元の記載等は必須ではありません。
 *  二次配布や転載、ソースコードURLやダウンロードURLへの直接リンクは禁止します。
 *  （プラグインを利用したゲームに同梱する形での結果的な配布はOKです）
 *  不具合対応以外のサポートやリクエストは受け付けておりません。
 *  本プラグインにより生じたいかなる問題においても、一切の責任を負いかねます。
 * [ 改訂履歴 ] ...................................................................
 *   Version 1.00  2016/05/13  初版
 * -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 *  Web Site: http://i.gmobb.jp/nekoma/rpg_tkool/
 *  Twitter : https://twitter.com/koma_neko
 */

(function(){
    var _Sprite_Base_startAnimation = Sprite_Base.prototype.startAnimation;
    Sprite_Base.prototype.startAnimation = function(animation, mirror, delay) {
        _Sprite_Base_startAnimation.call(this, animation, mirror, delay);
        if (this._pictureContainer) {
            var sprite = this._animationSprites[this._animationSprites.length - 1];
            this.parent.removeChild(sprite);
            this._pictureContainer.addChild(sprite);
        }
    };

    var _Spriteset_Battle_initialize = Spriteset_Battle.prototype.initialize;
    Spriteset_Battle.prototype.initialize = function() {
        _Spriteset_Battle_initialize.call(this);
        this._actorSprites.forEach(function(sprite) {
            sprite._pictureContainer = this._pictureContainer;
        }, this);
        this._enemySprites.forEach(function(sprite) {
            sprite._pictureContainer = this._pictureContainer;
        }, this);
    };
}());