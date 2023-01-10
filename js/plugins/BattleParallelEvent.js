//=============================================================================
// - BattleParallelEvent
// BattleParallelEvent.js
//=============================================================================

//=============================================================================
 /*:
 * @plugindesc 戦闘中でも「並列処理」のコモンイベントを実行する為のプラグインです。
 * @author 名無し蛙
 *
 *
 * Version 1.0:
 * 2016/06/29 - リリース
 */
//=============================================================================

(function() {
    //
    var _Game_Switches_onChange = Game_Switches.prototype.onChange;
    Game_Switches.prototype.onChange = function() {
        _Game_Switches_onChange.call(this);
        if ($gameParty.inBattle()) {
            $gameTroop.refreshCommonEvents();
        }
    };

    //
    var _Game_Troop_setup = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function(troopId) {
        _Game_Troop_setup.call(this, troopId);
        this._commonEvents = this.parallelCommonEvents().map(function(commonEvent) {
            return new Game_CommonEvent(commonEvent.id);
        });
    };

    //
    Game_Troop.prototype.parallelCommonEvents = function() {
        return $dataCommonEvents.filter(function(commonEvent) {
            return commonEvent && commonEvent.trigger === 2;
        });
    };

    //
    Game_Troop.prototype.refreshCommonEvents = function() {
        this._commonEvents.forEach(function(event) {
            event.refresh();
        });
    };

    //
    Game_Troop.prototype.updateCommonEvents = function() {
        this._commonEvents.forEach(function(event) {
            event.update();
        });
    };

    //
    var _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        $gameTroop.updateCommonEvents();
        _Scene_Battle_update.call(this);
    };
}());

//=============================================================================
// End of File
//=============================================================================
