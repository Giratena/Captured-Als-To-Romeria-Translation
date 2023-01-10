/*:
 * @plugindesc 戦闘開始時の「～が現れた！」というメッセージを非表示にします。
 * @author 茶の助
 */
 
 (function() {
	
	BattleManager.startBattle = function() {
		this._phase = 'start';
		$gameSystem.onBattleStart();
		$gameParty.onBattleStart();
		$gameTroop.onBattleStart();
		//this.displayStartMessages();
	};
	
})();