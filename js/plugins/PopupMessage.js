//
//  ポップアップメッセージ ver1.00
//
// author yana
//

var Imported = Imported || {};
Imported['PopupMessage'] = 1.00;

if (!Imported.CommonPopupCore) {
	console.error('CommonPopupCoreを導入してください。')
}

/*:
 * @plugindesc メッセージの表示をポップアップに変更する制御文字_pum[delay]を追加します。
 * @author Yana
 * 
 * @param Pop Message FontSize
 * @desc ポップアップメッセージのデフォルトフォントサイズです。
 * @default 28
 * 
 * @param Pop Message Count
 * @desc ポップアップメッセージの表示時間です。
 * @default 120
 * 
 * @help プラグインコマンドはありません。
 * 
 * メッセージの表示のメッセージの中に_pum[x]と記述することで、メッセージをポップアップに変更します。
 * xはディレイ値で、この値フレーム分待ってから、ポッポアップを行います。
 * ------------------------------------------------------
 * 利用規約：特になし。素材利用は自己責任でお願いします。
 * ------------------------------------------------------
 * このプラグインには「汎用ポップアップベース」のプラグインが必要です。
 * 汎用ポップアップベースより下に配置してください。 
 * ------------------------------------------------------
 * 更新履歴:
 * ver1.00:
 * 公開
 */

(function() {
	var parameters = PluginManager.parameters('PopupMessage');
	var popMesFontSize = Number(parameters['Pop Message FontSize'] || 28);
	var popMesCount = Number(parameters['Pop Message Count'] || 120);
	var popMesSlide = Number(parameters['Pop Message Slide'] || 60);
	var popMesRegExp = /_PUM\[\d+\]/gi;
	
	var _pMes_GInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		_pMes_GInterpreter_pluginCommand.call(this, command, args);
		if (command === 'PopupMessage') {
		}
	};
	
	var _pMes_GInterpreter_c101 = Game_Interpreter.prototype.command101;
	Game_Interpreter.prototype.command101 = function(){
		var texts = [];
		var pIndex = this._index;
		var param = {'delay':null};
		while (this.nextEventCode() === 401){
			this._index++;
			texts.push(this.currentCommand().parameters[0]);
		}
    	for(var i=0;i<texts.length;i++){
    		if (texts[i].match(popMesRegExp)){
        		text = texts[i].replace(popMesRegExp,'');
        		texts[i] = text;
        		CommonPopupManager.setPopupMessage(this._params, texts, Number(RegExp.$1));
        		return true;
    		}
    	}
		this._index = pIndex;
		var result = _pMes_GInterpreter_c101.call(this);
		return result;
	}
	
	var _pMes_GMessage_add = Game_Message.prototype.add;
	Game_Message.prototype.add = function(text){
		text = text.replace(popMesRegExp,'');
		_pMes_GMessage_add.call(this,text);
	}
	
	CommonPopupManager.setPopupMessage = function(params,texts,delay){
		this._readyPopup = this._readyPopup || [];
		this.bltCheck(ImageManager.loadFace(params[0]));
		this._readyPopup.push([params,texts,delay,'pMessage']);
	}
	
	var _pMes_CPManager_makeBitmap = CommonPopupManager.makeBitmap;
	CommonPopupManager.makeBitmap = function(arg){
		if (arg[3] === 'pMessage'){
			return ImageManager.loadFace(arg[0][0]);
		}else{
			return _pMes_CPManager_makeBitmap.call(this,arg);
		}
	}
	
	var _pMes_CPManager_startPopup = CommonPopupManager.startPopup;
	CommonPopupManager.startPopup = function(arg){
		if (arg[3] === 'pMessage'){
			this.startPopupMessage(arg[0],arg[1],arg[2]);	
		}else{
			_pMes_CPManager_startPopup.call(this,arg);
		}
	}
	
	CommonPopupManager.startPopupMessage = function(params,texts,delay){
		var fontSize = popMesFontSize;
		var oneHeight = (fontSize + 8)
		var height = params[0] ? 144 : oneHeight * texts.length;
		var bitmap = new Bitmap(Graphics.boxWidth, height);
		var faceSize = params[0] === '' ? 0 : 144;
		bitmap.fillRect(0, 0, bitmap.width / 2, bitmap.height, 'rgba(0,0,0,0.5)');
		bitmap.gradientFillRect(bitmap.width / 2, 0, bitmap.width / 2, bitmap.height, 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0)');
		this.window().contents = bitmap;
		this.window().drawTextEx('\\FS[' + fontSize + ']', 0, 0);
		this.window().drawFace(params[0],params[1],0,0);
		var iFontSize = fontSize;
		for (var i = 0; i < texts.length; i++) {
			var text = '\\FS[' + iFontSize + ']' + texts[i]
			this.window().drawTextEx(text, 8 + faceSize, i * oneHeight);
			iFontSize = this.window().contents.fontSize;
		}
		var arg = this.setPopup([]);
		arg.bitmap = bitmap;
		arg.x = Graphics.boxWidth * -1;
		arg.y = Graphics.boxHeight - height;
		arg.y = $gameParty.inBattle() ? arg.y - 180 : arg.y
		arg.moveX = Graphics.boxWidth;
		arg.moveY = 0;
		arg.anchorX = 0;
		arg.anchorY = 0;
		arg.count = popMesCount;
		arg.fixed = false;
		arg.slideCount = popMesSlide;
		arg.delay = delay;
		this._tempCommonSprites.setNullPos(arg);
	}
})();