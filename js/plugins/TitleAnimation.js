//=============================================================================
// TitleAnimation.js
// ----------------------------------------------------------------------------
// <利用規約>
//  利用はRPGツクールMV/RPGMakerMVの正規ユーザーに限られます。
//  商用、非商用、ゲームの内容を問わず利用可能です。
//  ゲームへの利用の際、報告や出典元の記載等は必須ではありません。
//  二次配布や転載は禁止します。
//  ソースコードURL、ダウンロードURLへの直接リンクも禁止します。
//  不具合対応以外のサポートやリクエストは受け付けておりません。
//  スクリプト利用により生じたいかなる問題においても、一切責任を負いかねます。
// ----------------------------------------------------------------------------
//  Ver1.00  2016/01/11  初版
//=============================================================================

/*:
 * @plugindesc タイトル画面にアニメーション表示します。
 * @author こま
 *
 * @param name
 * @desc アニメーションさせる画像の名前（ファイル名の番号以外の部分）を指定してください。
 * @default 
 *
 * @param pattern
 * @desc アニメーションさせる画像の枚数を指定してください。
 * @default 0
 *
 * @param x
 * @desc アニメーション画像を表示するX座標を指定してください。
 * @default 0
 *
 * @param y
 * @desc アニメーション画像を表示するY座標を指定してください。
 * @default 0
 *
 * @param wait
 * @desc アニメーション画像の表示間隔を指定してください。
 * （フレーム数指定。1フレームあたり約0.0166秒）
 * @default 1
 *
 * @param loop
 * @desc アニメーションループの可否を指定してください。
 * （ループする：1、ループしない：0）
 * @default 1
 *
 * @help
 * アニメーションさせたい画像を「titles1」フォルダに準備します。
 * ファイル名は必ず、末尾に「3桁の連番」をつけるようにしてください。
 * また、連番は「000」から始まるようにしてください。
 * （例：image_000.png、image_001.png、image_002.png）
 *
 * パラメータの'name'に、画像ファイル名の「番号以外の部分」を入力してください。
 * （例：image_000.pngの場合、「image_」と入力）
 *
 * パラメータの'pattern'に、アニメーションさたい画像の枚数を入力してください。
 * （例：image_000.png～image_009.pngをアニメーションさせる場合、「10」と入力）
 *
 * その他のパラメータについては、パラメータの説明をご参照ください。
 *
 *
 * *このプラグインには、プラグインコマンドはありません。
 */

(function(){
    var params = PluginManager.parameters('TitleAnimation');

    var name = params['name'] || '';
    var pattern = Number(params['pattern']) || 0;
    var x = Number(params['x']) || 0;
    var y = Number(params['y']) || 0;
    var wait = Number(params['wait']) || 0;
    var loop = Number(params['loop']) || 0;

    var index;
    var next;

    var bitmap = Array(pattern);
    for (var i = 0; i < pattern; i++) {
        bitmap[i] = ImageManager.loadTitle1(name + i.padZero(3));
    }

    var sprite = new Sprite(bitmap[0]);
    sprite.x = x;
    sprite.y = y;

    var _Scene_Title_create = Scene_Title.prototype.create;
    Scene_Title.prototype.create = function() {
        index = 1;
        next = Graphics.frameCount + wait;
        _Scene_Title_create.call (this);
    };

    var _Scene_Title_createBackground = Scene_Title.prototype.createBackground;
    Scene_Title.prototype.createBackground = function() {
        _Scene_Title_createBackground.call (this);
        this.addChild(sprite);
    };

    var _Scene_Title_update = Scene_Title.prototype.update;
    Scene_Title.prototype.update = function() {
        if (index < pattern) {
            if (Graphics.frameCount > next) {
                sprite.bitmap = bitmap[index];
                next += wait;
                if (++index >= pattern && loop) {
                    index = 0;
                }
            }
        }
        _Scene_Title_update.call (this);
    };
}());
