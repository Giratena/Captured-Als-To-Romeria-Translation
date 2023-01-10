//=============================================================================
// T_dashMotion.js
//=============================================================================
//Copyright (c) 2016 Trb
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//
//twitter https://twitter.com/Trb_surasura
/*:
 * @plugindesc 簡易的なダッシュモーションを実装します
 * @author Trb
 * @version 1.00 2016/6/3 初版
 *          1.1  2016/6/4 フォロワーがダッシュモーションにならない不具合を修正
 *                        また、構造を少し改変しやすい形に変更
 * 
 * @help キャラクターが走っている時、画像を少し傾け上下させることで
 * 簡易的にダッシュモーションのようにします。
 * 上下の動きや傾きの角度を調整したい場合はプラグイン内を直接編集して下さい。
 */
(function () {

var SC_uo = Sprite_Character.prototype.updateOther;
Sprite_Character.prototype.updateOther = function() {
    SC_uo.call(this);
    this.updateDashMotion();//ダッシュモーション用の処理を追加
};


//ダッシュモーションの計算
Sprite_Character.prototype.updateDashMotion = function() {
    var chara = this._character;
    //フォロワーだったらダッシュ判定をプレイヤーと同じにする処理を追加(ver1.1)
    var isDashing = chara._memberIndex ? $gamePlayer.isDashing() : chara.isDashing();
    if(isDashing && (chara.isMoving() || this.T_lastMoving)){//キャラクターが走っている時
        this.y -= chara.pattern() % 2 * 2;//y座標に補正をかける（画像を上下させる）
        switch(chara.direction()){//キャラの向きで分岐
            case 2://上下を向いてる時
            case 8:
                this.scale.y = 0.92;//少し潰す
                this.rotation = 0;
            break;
            case 4://左を向いてる時
                this.rotation = -0.14;//少し左に傾ける
            break;
            case 6://右を向いてる時
                this.rotation = 0.14;//少し右に傾ける
            break;
        }
    }else{//走ってない時角度と潰れをリセット
        this.rotation = 0;
        this.scale.y = 1;
    }
    this.T_lastMoving = chara.isMoving();
};
/* T_lastMoving という値について
このプラグインではキャラクターがダッシュ中かつ移動中にダッシュモーションになるようにしていますが、
デフォルトではキャラクターが1マス移動し終わった時に一瞬だけ移動判定がfalseになってしまいます。
なので移動判定を「今の移動判定」と「前回の移動判定」の2重にチェックする形にしました。
 */
})();