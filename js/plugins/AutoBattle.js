/*:
 * @plugindesc Auto battle mode
 * @author aueki@4Gamer
 *
 * @param speed
 * @desc Battle effect wait rate.(original=4:smaller is faster)
 * @default 1
 *
 * @param step
 * @desc Battle animation rate.(original=1)
 * @default 3
 *
 * @help This plugin does not provide plugin commands.
 *
 */

/*:ja
 * @plugindesc 戦闘時に自動戦闘モードを追加します。
 * @author aueki@4Gamer
 *
 * @param speed
 * @desc 戦闘時の武器エフェクト速度を指定します(オリジナル＝4:小さいほど高速)
 * @default 1
 *
 * @param step
 * @desc サイドビュー戦闘時の武器モーション速度を設定します(オリジナル＝1)
 * @default 3
 *
 * @help このプラグインには、プラグインコマンドはありません。
 *
 * 戦闘時に「ok」ボタンを連打するモードになります。
 */

var $autoMode        = 0;

Scene_Battle.prototype.commandAuto = function() {
	if($autoMode==0){
		$autoMode=1;
		Input._currentState='ok';
	}else{
		$autoMode=0;
	}
	this.selectNextCommand();
	console.log("auto :"+$autoMode);
};

(function() {

var parameters = PluginManager.parameters('AutoBattle');
var speed= Number(parameters['speed'] );
var step= Number(parameters['step'] );

var Input_update=Input.update;
Input.update = function() {

if($autoMode==0){
    this._pollGamepads();


    if (this._currentState[this._latestButton]) {
        this._pressedTime++;
    } else {
        this._latestButton = null;
    }

    for (var name in this._currentState) {
        if (this._currentState[name] && !this._previousState[name]) {
            this._latestButton = name;
            this._pressedTime = 0;
            this._date = Date.now();
        }
        this._previousState[name] = this._currentState[name];
    }
} else{

            this._latestButton = 'ok';
            this._pressedTime = 0;
            this._date = Date.now();
}
    this._updateDirection();

};

Window_PartyCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.fight,  'fight');
    this.addCommand(TextManager.escape, 'escape', BattleManager.canEscape());
    this.addCommand('自動',  'auto');
};

Scene_Battle.prototype.createPartyCommandWindow = function() {
    this._partyCommandWindow = new Window_PartyCommand();
    this._partyCommandWindow.setHandler('fight',  this.commandFight.bind(this));
    this._partyCommandWindow.setHandler('escape', this.commandEscape.bind(this));
    this._partyCommandWindow.setHandler('auto', this.commandAuto.bind(this));
    this._partyCommandWindow.deselect();
    this.addWindow(this._partyCommandWindow);
        this._waitCount = 2;
};

BattleManager.endBattle = function(result) {
    $autoMode = 0;

    this._phase = 'battleEnd';
    if (this._eventCallback) {
        this._eventCallback(result);
    }
    if (result === 0) {
        $gameSystem.onBattleWin();
    } else if (this._escaped) {
        $gameSystem.onBattleEscape();
    }
};
/*
BattleManager_endBattle=BattleManager.endBattle;
BattleManager.endBattle = function(result) {
    $autoMode=0;
	BattleManager_endBattle.call(result);
};
*/

Sprite_Animation.prototype.setupRate = function() {
    this._rate = speed;
};

Sprite_Weapon.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
    this._animationCount+=step;
    if (this._animationCount >= this.animationWait()) {
        this.updatePattern();
        this.updateFrame();
        this._animationCount = 0;
    }
};

})();

