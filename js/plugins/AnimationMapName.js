//
//  アニメーションマップネーム ver1.00
//
// author yana
//

var Imported = Imported || {};
Imported['AnimationMapName'] = 1.00;

/*:
 * @plugindesc マップ名表示をアニメーションさせます。
 * @author Yana
 * 
 * @param Anime Font Size
 * @desc 表示マップ名のフォントサイズです。
 * @default 28
 *
 * @param Anime Count
 * @desc マップ名の表示時間です。
 * @default 300
 * 
 * @param Anime OriginalX
 * @desc 移動前の座標Xです。
 * @default 0
 * 
 * @param Anime OriginalY
 * @desc 移動前の座標Yです。
 * @default -60
 * 
 * @param Anime MoveX
 * @desc X座標の移動距離です。
 * @default 0
 * 
 * @param Anime MoveY
 * @desc Y座標の移動距離です。
 * @default 60
 * 
 * @help プラグインコマンド
 * ------------------------------------------------------
 * 利用規約：特になし。素材利用は自己責任でお願いします。
 * ------------------------------------------------------
 * マップ名表示を改造し、アニメーションするように変更します。
 * また、
 * \C[x]　\I[x]　\V[x] \N[x] \P[x] \G
 * の制御文字を使用できるようになります。
 * ------------------------------------------------------
 * 更新履歴:
 * ver1.00:
 * 公開
 */

(function() {
	var parameters = PluginManager.parameters('AnimationMapName');
	var animeFontSize = Number(parameters['Anime Font Size'] || 28);
	var animeCount = Number(parameters['Anime Count'] || 300);
	var animeOriginalX = Number(parameters['Anime OriginalX'] || 0);
	var animeOriginalY = Number(parameters['Anime OriginalY'] || -60);
	var animeMoveX = Number(parameters['Anime MoveX'] || 0);
	var animeMoveY = Number(parameters['Anime MoveY'] || 60);
	
	Game_Interpreter.prototype.animationMapName = function() {
		var text = $gameMap.displayName();
		var array = CommonPopupManager.window().convertEscapeCharacters(text).split("");
		var a2 = [];
		var flag = false;
		var cflag = false;
		var setIndex = -1;
		var count = 0;
		var s1 = '';
		for(var i=0;i<array.length;i++){
			if (array[i+1] === 'I' && array[i+2] === '['){
				a2.push('\\');
				setIndex = a2.length-1;
				count += 1;
				flag = true;
			}else if (flag){
				console.log(array[i])
				a2[setIndex] += array[i];
				if (array[i] === ']'){ flag = false }
			}else if (cflag){
				a2[setIndex] += array[i];
				if (array[i] === ']'){ cflag = false }
			}else{
				if (array[i+1] === 'C' && array[i+2] === '['){
					a2.push('\\');
					cflag = true;
					setIndex = a2.length-1;
				}else{
					a2.push(array[i]);
					s1 += array[i];
				}
			}
		}
		
		CommonPopupManager.window().resetFontSettings();
		var fontStr = '\\FS[' + animeFontSize + ']';
		CommonPopupManager.window().drawTextEx(fontStr,0,0);
		var textSize = CommonPopupManager.window().textWidth(s1);
		textSize += (animeFontSize + 4) * count;
		
		var bitmap = new Bitmap(textSize + 48,animeFontSize + 8);
		
		bitmap.gradientFillRect(0,0,bitmap.width/3,bitmap.height,'rgba(0,0,0,0)','rgba(0,0,0,0.5)');
		bitmap.fillRect(bitmap.width/3,0,bitmap.width/3,bitmap.height,'rgba(0,0,0,0.5)');
		bitmap.gradientFillRect((bitmap.width*2)/3,0,bitmap.width/3,bitmap.height,'rgba(0,0,0,0.5)','rgba(0,0,0,0)');
		
		var arg = CommonPopupManager.setPopup('');
		arg.x =   animeOriginalX;
		arg.y = animeOriginalY;
		arg.moveX = animeMoveX;
		arg.moveY = animeMoveY;
		arg.bitmap = bitmap;
		arg.anchorX = 0;
		arg.anchorY = 0;
		arg.count = animeCount;
		arg.extend = [arg.count*0.8,arg.count*0.2];
		arg.fixed = false;
		
		CommonPopupManager._tempCommonSprites.setNullPos(arg);
		
		var a = '';
		var s = Math.floor((animeCount*0.4)/s1.length);
		var n = 0;
		var setColor = '';
		
		for(var i=0;i<a2.length;i++){
			if (a2[i].match(/\\C\[\d+\]/)){
				setColor = a2[i];
			}else{
				var arg = CommonPopupManager.setPopup('');
				arg.text = fontStr + setColor + a2[i];
				arg.x = animeOriginalX + CommonPopupManager.window().textWidth(a) + n;
				arg.y = animeOriginalY;
				arg.moveX = animeMoveX;
				arg.moveY = animeMoveY;
				arg.anchorX = 0;
				arg.anchorY = 0;
				arg.delay = s * (i + 1);
				arg.count = Math.floor((animeCount-20) - (i * s));
				arg.extend = [arg.count*0.8,arg.count*0.2];
				arg.fixed = false;
				if (a2[i].match(/\\I\[\d+\]/)){
					n += 36;
				}else{
					a += a2[i];
				}
				CommonPopupManager._tempCommonSprites.setNullPos(arg);
			}	
		}
	};
	
	Game_Map.prototype.showMapName = function() {
		if (this.enableNameDisplay && this.displayName() !== ''){
			this._interpreter.animationMapName();	
		}
	}
	
	var _animeMN_GPlayer_performTransfer = Game_Player.prototype.performTransfer;
	Game_Player.prototype.performTransfer = function() {
		_animeMN_GPlayer_performTransfer.call(this);
		$gameMap.showMapName();
	};
	
	// 再定義　何もしなくする
	Window_MapName.prototype.open = function() {
   		//this.refresh();
    	this._showCount = 0;
	};
	
})();
