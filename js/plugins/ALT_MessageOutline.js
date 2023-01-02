//=============================================================================
// ALT_MessageOutline.js
// by Altered (Machina)
// Version: 1.00
//=============================================================================

/*:
 * @plugindesc 「文章の表示」の文字のアウトラインを変更
 *
 * @author Altered (Machina)
 * @help 「文章の表示(Window_Message)」と同じ処理で描画される文字のアウトラインを変更します。
 *
 *--------------------------------------------------
 *
 * 1.利用上の注意
 * ・有償、無償、年齢制限コンテンツでの利用に、特に制限はありません。
 *
 * ・利用に関しては全て自己責任で行ってください。
 *   本スクリプトを使用すること及びゲームなどを制作・配布・販売することにより、
 *   第三者との間で生じたトラブル等に関しては、本素材作成者は一切責任を負わないものとします。
 *
 * ・素材制作者に許可無く改変可。改変物の配布時には、
 *   添付ドキュメント内に本素材を使用して制作した旨を表記してください。
 *
 * 2.利用報告
 * ・特に必要ありません。
 *
 * 3.禁止事項
 * ・素材単体での二次配布。
 * ・素材への直リンク。
 *
 *  4.サポート
 * ・競合などの対処は致しかねますので、予めご了承下さい。
 *
 * @param アウトラインの太さ
 * @default 4
 * @desc 標準は"4"です。なしにする場合は"0"。
 */

//=============================================================================

(function() {

  var parameters = PluginManager.parameters('ALT_MessageOutline');
  var paramOutlineSize = Number(parameters['アウトラインの太さ'] || '4');

  var Window_Message_resetFontSettings = Window_Base.prototype.resetFontSettings;
  Window_Message.prototype.resetFontSettings = function() {
    Window_Message_resetFontSettings.call(this);
    this.contents.outlineWidth = paramOutlineSize;
  };

})();
