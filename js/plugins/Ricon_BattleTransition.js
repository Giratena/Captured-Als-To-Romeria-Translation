//=============================================================================
// Ricon_BattleTransition.js
// Version: 1.0.0
//----------------------------------------------------------------------------
// Copyright (c) 2019 RiceConstruction
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//----------------------------------------------------------------------------
// Versions
// 1.1.0 2019/02/06 プラグインコマンドを追加
// 1.0.0 2019/01/02 初版
//----------------------------------------------------------------------------
// [ホームページ] https://riceconstruction.weebly.com/
// [GitHub] https://github.com/RiceConstruction/
// [Twitter] https://twitter.com/riceconstr/
// [Fantia] https://fantia.jp/rice-construction/
//=============================================================================

/*:
 * @plugindesc 戦闘開始時トランジション変更プラグイン
 * @author べるろ＊(Ricon)
 *
 * @help 戦闘開始時のトランジションの色合いやタイミングを変更することができます。
 * 
 * ----------------------------------------------------------------------------
 * プラグインコマンド
 * 
 * 「BattleTransition」はBとTのみ大文字、その他は小文字で入力してください。
 * コマンドの他の部分については大文字・小文字の区別はありません。
 * 
 * BattleTransition Speed 数値
 * 戦闘開始時エフェクトの効果時間を変更します。
 * 数値の部分には処理時間をフレーム単位で入力してください。
 * defaultと入力するとパラメータで指定した数値に戻ります。
 * 有効範囲：0～600
 * 初期値：60
 * 
 * BattleTransition zoom 番号
 * 一度のエフェクト中にズームを行う回数を切り替えます。
 * 番号の部分にの下記いずれかの数字を入力してください。
 * 0(ズームなし)、1(1段階ズーム)、2(2段階ズーム)
 * defaultと入力するとパラメータで指定した数値に戻ります。
 * 初期値：2
 * 
 * BattleTransition ZoomMode in/out
 * ズームの種類を切り替えます。
 * 下記いずれかの文字を入力してください。
 * in(ズームイン)、out(ズームアウト)
 * defaultと入力するとパラメータで指定した数値に戻ります。
 * 初期値：in
 * 
 * BattleTransition Flash on/off
 * フラッシュの有効・無効を切り替えます。
 * 下記いずれかの文字を入力してください。
 * on(有効)、off(無効)
 * defaultと入力するとパラメータで指定した数値に戻ります。
 * 初期値：on
 * 
 * BattleTransition FlashR 数値
 * フラッシュ色調の赤の強さを変更します。
 * 数値の部分に値を入力してください。
 * defaultと入力するとパラメータで指定した数値に戻ります。
 * 有効範囲：0～255
 * 初期値：255
 * 
 * BattleTransition FlashG 数値
 * フラッシュ色調の緑の強さを変更します。
 * 数値の部分に値を入力してください。
 * defaultと入力するとパラメータで指定した数値に戻ります。
 * 有効範囲：0～255
 * 初期値：255
 * 
 * BattleTransition FlashB 数値
 * フラッシュ色調の青の強さを変更します。
 * 数値の部分に値を入力してください。
 * defaultと入力するとパラメータで指定した数値に戻ります。
 * 有効範囲：0～255
 * 初期値：255
 * 
 * BattleTransition FlashI 数値
 * フラッシュの強さを変更します。
 * 数値の部分に値を入力してください。
 * defaultと入力するとパラメータで指定した数値に戻ります。
 * 有効範囲：0～255
 * 初期値：255
 * 
 * 
 * ----------------------------------------------------------------------------
 * このプラグインは他のトランジション変更プラグインと併用することは出来ません。
 *
 * @param Speed
 * @type number
 * @min 0
 * @max 600
 * @default 60
 * @desc トランジション効果の実行時間(フレーム)。短いほど速くなります。
 * 
 * @param Zoom
 * @type combo
 * @option 0
 * @option 1
 * @option 2
 * @default 2
 * @desc ズーム回数。
 * 0:ズームなし　1:1段階ズーム　2(デフォルト):2段階ズーム
 * 
 * @param ZoomMode
 * @parent Zoom
 * @type boolean
 * @on ズームイン
 * @off ズームアウト
 * @default true
 * @desc ズームの種類。
 * ON(デフォルト):ズームイン　OFF:ズームアウト
 * 
 * @param Flash
 * @type boolean
 * @on 有効
 * @off 無効
 * @default true
 * @desc フラッシュの有効化切り替え。
 * 
 * @param FlashRed
 * @parent Flash
 * @type number
 * @min 0
 * @max 255
 * @default 255
 * @desc フラッシュ色の設定(赤)。
 * 
 * @param FlashGreen
 * @parent Flash
 * @type number
 * @min 0
 * @max 255
 * @default 255
 * @desc フラッシュ色の設定(緑)。
 * 
 * @param FlashBlue
 * @parent Flash
 * @type number
 * @min 0
 * @max 255
 * @default 255
 * @desc フラッシュ色の設定(青)。
 * 
 * @param FlashIntensity
 * @parent Flash
 * @type number
 * @min 0
 * @max 255
 * @default 255
 * @desc フラッシュ色の設定(強さ)。
 *
 */

(function(){
    'use strict';

    //=============================================================================
    // プラグインパラメータ
    //=============================================================================

    var parameters = PluginManager.parameters('Ricon_BattleTransition');

    var getParamBoolean = function(paramName) {
        var value = parameters[paramName];
        return (value || '').toUpperCase() === 'ON' || (value || '').toUpperCase() === 'TRUE';
    };

    var getParamNumber = function(paramName) {
        var value = parameters[paramName];
        return (parseInt(value, 10) || 0).clamp(-Infinity,Infinity);
    };

    var RBT = {};
    RBT.speed = getParamNumber('Speed');
    RBT.zoom = getParamNumber('Zoom');
    RBT.zoomMode = getParamBoolean('ZoomMode');
    RBT.flash = getParamBoolean('Flash');
    RBT.flashR = getParamNumber('FlashRed');
    RBT.flashG = getParamNumber('FlashGreen');
    RBT.flashB = getParamNumber('FlashBlue');
    RBT.flashI = getParamNumber('FlashIntensity');

    //=============================================================================
    // ゲーム内データ
    //=============================================================================

    RBT.game = {};
    RBT.game.speed = null;
    RBT.game.zoom = null;
    RBT.game.zoomMode = null;
    RBT.game.flash = null;
    RBT.game.flashR = null;
    RBT.game.flashG = null;
    RBT.game.flashB = null;
    RBT.game.flashI = null;

    RBT.setData = function(args) {
        var mode = String(args[0]).toLowerCase();
        var value = String(args[1]).toLowerCase();
        if(value == 'default') {
            RBT.game[mode] = null;
        }
        switch(mode) {
            case 'speed':
                this.setSpeed(value);
                break;
            case 'zoom':
                this.setZoom(value);
                break;
            case 'zoommode':
                this.setZoomMode(value);
                break;
            case 'flash':
                this.setFlash(value);
                break;
            case 'flashr':
                this.setFlashR(value);
                break;
            case 'flashg':
                this.setFlashG(value);
                break;
            case 'flashb':
                this.setFlashB(value);
                break;
            case 'flashi':
                this.setFlashI(value);
                break;
        }
    };

    function valueLimit(val,min,max) {
        return val < min ? min : (val > max ? max : val);
    };

    RBT.setSpeed = function(value) {
        RBT.game.speed = valueLimit(Number(value),0,600);
    };

    RBT.setZoom = function(value) {
        RBT.game.zoom = Number(value);
    };

    RBT.setZoomMode = function(value) {
        RBT.game.zoomMode = value;
    };

    RBT.setFlash = function(value) {
        RBT.game.flash = value == 'on' ? true: false;
    };

    RBT.setFlashR = function(value) {
        RBT.game.flashR = valueLimit(Number(value),0,255);
    };

    RBT.setFlashG = function(value) {
        RBT.game.flashG = valueLimit(Number(value),0,255);
    };

    RBT.setFlashB = function(value) {
        RBT.game.flashB = valueLimit(Number(value),0,255);
    };

    RBT.setFlashI = function(value) {
        RBT.game.flashI = valueLimit(Number(value),0,255);
    };

    //=============================================================================
    // Game_Interpreter
    //=============================================================================

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if(command == 'BattleTransition') {
            RBT.setData(args);
        }
    };

    //=============================================================================
    // Game_System
    //=============================================================================

    var _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this.RBT = {};
    };

    var _Game_System_onBeforeSave = Game_System.prototype.onBeforeSave;
    Game_System.prototype.onBeforeSave = function() {
        _Game_System_onBeforeSave.call(this);
        this.RBT = RBT.game;
    };

    var _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
    Game_System.prototype.onAfterLoad = function() {
        _Game_System_onAfterLoad.call(this);
        RBT.game = this.RBT;
    };

    //=============================================================================
    // Scene_Map
    //=============================================================================

    Scene_Map.prototype.updateEncounterEffect = function() {
        if (this._encounterEffectDuration > 0) {
            this._encounterEffectDuration--;
            var speed = this.encounterEffectSpeed();
            var n = speed - this._encounterEffectDuration;
            var p = n / speed;
            var zoomX = $gamePlayer.screenX();
            var zoomY = $gamePlayer.screenY() - 24;
            var flash = (typeof RBT.game.flash == 'boolean') ? RBT.game.flash : RBT.flash;
            if (n === 2) {
                $gameScreen.setZoom(zoomX, zoomY, 1);
                this.snapForBattleBackground();
                if(RBT.flash) {
                    this.startFlashForEncounter(speed / 2);
                }
            }
            this.riconZoom(zoomX, zoomY, p);
            if (n === Math.floor(speed / 6)) {
                if(flash) {
                    this.startFlashForEncounter(speed / 2);
                }
            }
            if (n === Math.floor(speed / 2)) {
                BattleManager.playBattleBgm();
                this.startFadeOut(this.fadeSpeed());
            }
        }
    };

    Scene_Map.prototype.riconZoom = function(x,y,p) {
        var in1 = (20 * p * p + 5) * p / 2 + 1;
        var in2 = ((p - 1) * 20 * p + 5) * p + 1;
        var out1 = 1 / in1;
        var out2 = 1 / in2;
        var mode = (typeof RBT.game.zoomMode == 'string') ? RBT.game.zoomMode : (RBT.zoomMode ? 'in' : 'out');
        var repeat = (typeof RBT.game.zoom == 'number') ? RBT.game.zoom : RBT.zoom;
        if(mode == 'in' && repeat == 1) {
            $gameScreen.setZoom(x,y,in1);
        }
        if(mode == 'in' && repeat == 2) {
            $gameScreen.setZoom(x,y,in2);
        }
        if(mode == 'out' && repeat == 1) {
            $gameScreen.setZoom(x,y,out1);
        }
        if(mode == 'out' && repeat == 2) {
            $gameScreen.setZoom(x,y,out2);
        }
    };

    Scene_Map.prototype.startFlashForEncounter = function(duration) {
        var flashR = (typeof RBT.game.flashR == 'number') ? RBT.game.flashR : RBT.flashR;
        var flashG = (typeof RBT.game.flashG == 'number') ? RBT.game.flashG : RBT.flashG;
        var flashB = (typeof RBT.game.flashB == 'number') ? RBT.game.flashB : RBT.flashB;
        var flashI = (typeof RBT.game.flashI == 'number') ? RBT.game.flashI : RBT.flashI;
        var color = [flashR, flashG, flashB, flashI];
        $gameScreen.startFlash(color, duration);
    };

    Scene_Map.prototype.encounterEffectSpeed = function() {
        return (typeof RBT.game.speed == 'number') ? RBT.game.speed : RBT.speed;
    };
})()