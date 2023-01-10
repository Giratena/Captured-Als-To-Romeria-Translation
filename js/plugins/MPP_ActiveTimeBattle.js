//=============================================================================
// MPP_ActiveTimeBattle.js
//=============================================================================
// Copyright (c) 2018 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 【ver.2.10】戦闘システムをアクティブタイムバトルに変更します。
 * @author 木星ペンギン
 *
 * @help ▼ システム説明
 * --------------------------------
 *  〇 パーティコマンド
 *   アクターコマンド選択中か、誰もコマンド入力を行っていない状態で
 *   キャンセルキーを押すとパーティコマンドを開くことができます。
 *
 *   パーティコマンドを開いている間は、どの戦闘モードでも時間が止まります。
 *   一時停止の代わりです。
 *
 * --------------------------------
 *  〇 バトルイベントの実行
 *   イベント実行中にも時間は止まります。
 *
 * --------------------------------
 *  〇 戦闘モード（active, slow, wait, stop）
 *   active : 常に時間が流れます。
 *   slow   : 常に時間が経過しますが、コマンド入力中は時間の流れが遅くなり、
 *            そうでない場合は常に加速されます。
 *   wait   : スキルやアイテム、対象選択中は時間が止まります。
 * 　         アクターコマンド入力中は時間が流れます。
 *   stop   : コマンド入力中は常に時間が止まります。
 *            アクターコマンド入力中に加速ボタンを押すと時間が流れます。
 *
 *   ※どのモードでもパーティコマンド選択中、イベント実行中は時間が止まります。
 *   
 *   ※仕様上、プラグインパラメータ[ATB Mode Status _v2]に
 *     設定されていない戦闘モードは機能しません。
 *     使用したい戦闘モードは上記のパラメータに追加してください。
 *
 * --------------------------------
 *  〇 ATゲージ
 *   ATゲージの最大値は
 *    1.パーティメンバーの敏捷性の平均値（敵は含まない）
 *    2.オプションによるプレイヤーの設定
 *    3.プラグインコマンドで設定した基準値
 *   によって決定されます。
 *
 *   ATゲージの増加量は
 *    キャラクターの敏捷性 + 増加値
 *   です。
 *   プラグインコマンドで設定した[増加値]が大きいほど、
 *   敏捷性の影響が小さくなります。
 *
 * --------------------------------
 *  〇 逃げる
 *   戦闘可能なキャラ全員が逃走に必要なATをためると逃走判定を行います。
 *   逃走に失敗しても逃走状態は解除されません。
 *   パーティコマンドで戦うを選択すると解除されます。
 *
 * --------------------------------
 *  〇 アイテム/スキルの詠唱時間
 *   アイテム/スキルの速度補正をマイナスにすることで、詠唱時間が発生します。
 *   速度補正を-1するごとに約0.5秒の詠唱時間となります。
 *   詠唱が終わった時点で、行動順リストに入ります。
 *
 *   詠唱時間はオプションの[戦闘速度]の設定によって上下します。
 *   [戦闘速度の基準値]を変えても変化しません。
 *
 * --------------------------------
 *  〇 複数回行動
 *   特徴の[行動回数追加]によって２回以上の行動が可能になった際の動作は
 *   保証しません。
 *   １回行動になるようにしてください。
 *
 * ================================================================
 * ▼ 操作関連
 * --------------------------------
 *  〇 加速ボタン
 *   ゲームパッドではXボタン、キーボードではShift、
 *   タッチ操作ではステータスウィンドウより上をタッチし続けることで加速します。
 *   ただし、メッセージウィンドウが表示されている場合は加速しません。
 *
 * --------------------------------
 *  〇 コマンド入力を行うアクターの切り替え
 *   ゲームパッドではLB/RBボタン、キーボードではQ、Page up/W、Page down、
 *   タッチ操作ではステータスウィンドウをタッチすることで
 *   選択した対象に切り替えることができます。
 *   （正確にはタッチを離した際に切り替わります）
 *
 * --------------------------------
 *  〇 ステータスウィンドウのスクロール
 *   タッチ操作でタッチしたままウィンドウを上下に動かすと
 *   スクロールさせることができます。
 *   パーティメンバーがステータスウィンドウに収まらない場合の処置です。
 *
 * ================================================================
 * ▼ プラグインパラメータ 詳細
 * --------------------------------
 *  〇 Escape Anime? (逃走状態で逃走モーションを行うかどうか)
 *   有効にすると逃走状態にある間アクターは逃走モーションを行います。
 *   デフォルトでは後ろ向きに走るモーションはありません。
 * 
 * --------------------------------
 *  〇 Change Mode in Battle _v2 (戦闘中に戦闘モードを変更可能にするかどうか)
 *   戦闘モードの変更はパーティコマンドから行えます。
 * 
 * ================================
 * 制作 : 木星ペンギン
 * URL : http://woodpenguin.blog.fc2.com/
 *
 * @param === Base ===
 * @default 【基本設定】
 *
 * @param ATB Mode Default _v2
 * @type select
 * @option active
 * @option slow
 * @option wait
 * @option stop
 * @desc 戦闘モードのデフォルト値
 * @default wait
 * @parent === Base ===
 *
 * @param ATB Speed Base
 * @type number
 * @desc 戦闘速度の基準値
 * ゲーム内での変更はできない制作者側の設定
 * @default 6
 * @parent === Base ===
 *
 * @param AT Increment
 * @type number
 * @desc ATゲージの増加値
 * @default 10
 * @parent === Base ===
 *
 * @param Mode Slow Fast Rate
 * @desc 戦闘モード[slow]時のコマンド入力中でない場合の時間加速度
 * @default 1.5
 * @parent === Base ===
 *
 * @param Mode Slow Rate
 * @desc 戦闘モード[slow]時のコマンド入力中の時間加速度
 * @default 0.5
 * @parent === Base ===
 *
 * @param Mode Stop Fast Eneble?
 * @type boolean
 * @desc 戦闘モード[sto0]時のコマンド入力中の加速ボタンを有効にするかどうか
 * @default true
 * @parent === Base ===
 *
 *
 * @param === Option ===
 * @default 【オプション画面】
 *
 * @param ATB Mode Name _v2
 * @desc オプションで表示する戦闘モードの項目名
 * (空の場合オプションには追加されません)
 * @default 戦闘モード
 * @parent === Option ===
 *
 * @param ATB Mode Status _v2
 * @type select[]
 * @option active
 * @option slow
 * @option wait
 * @option stop
 * @desc オプションで表示する戦闘モードの表示順
 * @default ["active","slow","wait","stop"]
 * @parent === Option ===
 *
 * @param ATB Mode Texts _v2
 * @type struct<ModeStatus>
 * @desc 用語[戦闘モード]
 * @default {"active":"アクティブ","slow":"スロー","wait":"ウェイト","stop":"ストップ"}
 * @parent === Option ===
 *
 * @param ATB Speed Default
 * @type number
 * @max 4
 * @desc 戦闘速度のデフォルト値(0～4)
 * @default 2
 * @parent === Option ===
 *
 * @param ATB Speed Name
 * @desc オプションで表示する戦闘速度の項目名
 * (空の場合オプションには追加されません)
 * @default 戦闘速度
 * @parent === Option ===
 *
 * @param ATB Speed Status
 * @desc オプションで表示する戦闘速度のステータス名
 * （カンマで区切ってください）
 * @default 1,2,3,4,5
 * @parent === Option ===
 *
 *
 * @param === Battle ===
 * @default 【戦闘関連】
 *
 * @param Reset AT Die?
 * @type boolean
 * @desc 戦闘不能時にATゲージをリセットするかどうか？
 * @default true
 * @parent === Battle ===
 *
 * @param Need Escape At
 * @type number
 * @max 100
 * @desc 逃走に必要なATゲージの割合(0～100)
 * @default 100
 * @parent === Battle ===
 *
 * @param Escape AT Cost
 * @type number
 * @max 100
 * @desc 逃走失敗時に消費されるATゲージの割合(0～100)
 * @default 75
 * @parent === Battle ===
 *
 * @param Escape Anime?
 * @type boolean
 * @desc 逃走状態で逃走モーションを行うかどうか
 * @default false
 * @parent === Battle ===
 *
 * @param Input Step Forward?
 * @type boolean
 * @desc コマンド入力中に前進するかどうか
 * @default false
 * @parent === Battle ===
 *
 * @param ATB Fast Eneble?
 * @type boolean
 * @desc 加速ボタンの有効/無効
 * @default true
 * @parent === Battle ===
 *
 * @param ATB Fast Rate
 * @desc 加速ボタンを押したときの加速度
 * @default 2.0
 * @parent === Battle ===
 *
 * @param Fast Log Eneble?
 * @type boolean
 * @desc 戦闘ログ早送りの有効/無効
 * 戦闘ログ早送りはツクールデフォルトの機能です
 * @default true
 * @parent === Battle ===
 *
 * @param Active SE _v2
 * @type struct<SE>
 * @desc 行動順が回ってきたときのSE
 * @default {"Name":"Decision1","Volume":"90","Pitch":"100","Pan":"0"}
 * @parent === Battle ===
 *
 * @param Change Mode in Battle _v2
 * @type boolean
 * @desc 戦闘中に[戦闘モード]を変更可能にするかどうか
 * @default false
 * @parent === Battle ===
 *
 * @param Fast Cancel By Input
 * @type boolean
 * @desc コマンド入力を行う際、加速を一旦解除するかどうか
 * @default true
 * @parent === Battle ===
 *
 * @param Stop Time On Action
 * @type boolean
 * @desc アクション中に時間を止めるかどうか
 * @default false
 * @parent === Battle ===
 *
 *
 *
 * @param === Window ===
 * @default 【ウィンドウ】
 *
 * @param Help Window Pos
 * @type number
 * @min -1
 * @max 1
 * @desc ヘルプウィンドウの位置
 * (-1:非表示, 0:上, 1:ステータスの上)
 * @default 1
 * @parent === Window ===
 *
 * @param Help Window Row
 * @type number
 * @desc ヘルプウィンドウの行数
 * @default 1
 * @parent === Window ===
 *
 * @param Status Window Pos
 * @type number
 * @max 2
 * @desc ステータスウィンドウの位置
 * (0:左寄せ, 1:中央, 2:右寄せ)
 * @default 2
 * @parent === Window ===
 *
 * @param Skill Window HP Draw?
 * @type boolean
 * @desc スキルウィンドウ表示中にＨＰを表示するかどうか
 * @default false
 * @parent === Window ===
 *
 *
 * @param === AT Gauge ===
 * @default 【ATゲージ】
 *
 * @param AT Gauge Name
 * @desc ATゲージ名
 * @default
 * @parent === AT Gauge ===
 *
 * @param AT Gauge Width
 * @type number
 * @desc ATゲージの幅
 * @default 60
 * @parent === AT Gauge ===
 *
 * @param AT Gauge Height
 * @type number
 * @desc ATゲージの高さ
 * @default 12
 * @parent === AT Gauge ===
 *
 * @param AT Charge Color1
 * @desc ATゲージ増加中の色1(RGBで指定)
 * @default 192,192,192
 * @parent === AT Gauge ===
 *
 * @param AT Charge Color2
 * @desc ATゲージ増加中の色2(RGBで指定)
 * @default 255,255,255
 * @parent === AT Gauge ===
 *
 * @param AT Max Color1
 * @desc ATゲージMaxの色1(RGBで指定)
 * @default 192,192,192
 * @parent === AT Gauge ===
 *
 * @param AT Max Color2
 * @desc ATゲージMaxの色2(RGBで指定)
 * @default 255,255,192
 * @parent === AT Gauge ===
 *
 * @param Chanting View?
 * @type boolean
 * @desc 詠唱ゲージを表示するかどうか
 * @default true
 * @parent === AT Gauge ===
 *
 * @param AT Chanting Color1
 * @desc 詠唱ゲージの色1(RGBで指定)
 * @default 128,32,0
 * @parent === AT Gauge ===
 *
 * @param AT Chanting Color2
 * @desc 詠唱ゲージの色2(RGBで指定)
 * @default 255,64,0
 * @parent === AT Gauge ===
 *
 * @param Escaping Change?
 * @type boolean
 * @desc 逃走中にゲージの色を変更するかどうか
 * @default true
 * @parent === AT Gauge ===
 *
 * @param AT Escaping Color1
 * @desc 詠唱ゲージの色1(RGBで指定)
 * @default 192,192,192
 * @parent === AT Gauge ===
 *
 * @param AT Escaping Color2
 * @desc 詠唱ゲージの色2(RGBで指定)
 * @default 192,192,255
 * @parent === AT Gauge ===
 *
 */

/*~struct~ModeStatus:
 * @param active
 * @default アクティブ
 * 
 * @param slow
 * @default スロー
 * 
 * @param wait
 * @default ウェイト
 * 
 * @param stop
 * @default ストップ
 * 
 */

/*~struct~SE:
 * @param Name
 * @desc ファイル名
 * @default Decision1
 * @require 1
 * @dir audio/se
 * @type file
 *
 * @param Volume
 * @type number
 * @max 100
 * @desc 音量
 * @default 90
 *
 * @param Pitch
 * @type number
 * @min 50
 * @max 150
 * @desc ピッチ
 * @default 100
 *
 * @param Pan
 * @type number
 * @min -100
 * @max 100
 * @desc 位相
 * @default 0
 *
 */

function Window_AtbSkillStatus() {
    this.initialize.apply(this, arguments);
}

(function() {

var MPPlugin = {};

(function() {
    
    var parameters = PluginManager.parameters('MPP_ActiveTimeBattle')
    
    MPPlugin.contains = {};
    MPPlugin.contains['ComBat'] = $plugins.some(function(plugin) {
        return (plugin.name === 'MPP_CommonBattle' && plugin.status);
    });
    
    //=== Base ===
    MPPlugin.atbMode = parameters['ATB Mode Default _v2'] || "wait";
    MPPlugin.atbSpeedBase = Number(parameters['ATB Speed Base'] || 6);
    MPPlugin.atIncrement = Number(parameters['AT Increment'] || 10);
    MPPlugin.ModeSlowFastRate = Number(parameters['Mode Slow Fast Rate'] || 2);
    MPPlugin.ModeSlowRate = Number(parameters['Mode Slow Rate'] || 0.25);
    MPPlugin.ModeStopFastEneble = !!eval(parameters['Mode Stop Fast Eneble?']);
    
    //=== Option ===
    MPPlugin.atbModeName = parameters['ATB Mode Name _v2'];
    MPPlugin.atbModeStatus = JSON.parse(parameters['ATB Mode Status _v2']);
    MPPlugin.atbModeTexts = JSON.parse(parameters['ATB Mode Texts _v2']);
    MPPlugin.atbSpeed = Number(parameters['ATB Speed Default'] || 2).clamp(0, 4);
    MPPlugin.atbSpeedName = parameters['ATB Speed Name'];
    MPPlugin.atbSpeedStatus = (parameters['ATB Speed Status'] || '1,2,3,4,5').split(',');

    //=== Battle ===
    MPPlugin.resetAtDie = !!eval(parameters['Reset AT Die?']);
    MPPlugin.needEscapeAt = Number(parameters['Need Escape At'] || 100).clamp(0, 100);
    MPPlugin.escapeAtCost = Number(parameters['Escape At Cost'] || 75).clamp(0, 100);
    MPPlugin.escapeAnime = !!eval(parameters['Escape Anime?']);
    MPPlugin.inputStepForward = !!eval(parameters['Input Step Forward?']);
    MPPlugin.atbFastEneble = !!eval(parameters['ATB Fast Eneble?']);
    MPPlugin.atbFastRate = Number(parameters['ATB Fast Rate'] || 3).clamp(0, 10);
    MPPlugin.fastLogEneble = !!eval(parameters['Fast Log Eneble?']);
    var se = JSON.parse(parameters['Active SE _v2']);
    MPPlugin.ActiveSE = {
        name:se.Name || "",
        volume:Number(se.Volume || 90),
        pitch:Number(se.Pitch || 100),
        pan:Number(se.Pan || 0)
    };
    MPPlugin.ChangeModeInBattle = !!eval(parameters['Change Mode in Battle _v2']);
    MPPlugin.FastCancelByInput = !!eval(parameters['Fast Cancel By Input']);
    MPPlugin.StopTimeOnAction = !!eval(parameters['Stop Time On Action']);

    //=== Window ===
    MPPlugin.helpWindowPos = Number(parameters['Help Window Pos'] || 1).clamp(-1, 1);
    MPPlugin.helpWindowRow = Number(parameters['Help Window Row'] || 1).clamp(0, 2);
    MPPlugin.stWindowPos = Number(parameters['Status Window Pos'] || 1).clamp(0, 2);
    MPPlugin.SkillWindowHpDraw = !!eval(parameters['Skill Window HP Draw?']);

    //=== AT Gauge ===
    MPPlugin.atGaugeName = parameters['AT Gauge Name'] || '';
    MPPlugin.atGaugeWidth = Number(parameters['AT Gauge Width'] || 84);
    MPPlugin.atGaugeHeight = Number(parameters['AT Gauge Height'] || 12);
    MPPlugin.atChargeColor1 = 'rgb(%1)'.format(parameters['AT Charge Color1'] || '192,192,192');
    MPPlugin.atChargeColor2 = 'rgb(%1)'.format(parameters['AT Charge Color2'] || '255,255,255');
    MPPlugin.atMaxColor1 = 'rgb(%1)'.format(parameters['AT Max Color1'] || '192,192,192');
    MPPlugin.atMaxColor2 = 'rgb(%1)'.format(parameters['AT Max Color2'] || '255,255,192');
    MPPlugin.chantingView = !!eval(parameters['Chanting View?']);
    MPPlugin.atChantingColor1 = 'rgb(%1)'.format(parameters['AT Chanting Color1'] || '128,32,0');
    MPPlugin.atChantingColor2 = 'rgb(%1)'.format(parameters['AT Chanting Color2'] || '255,64,0');
    MPPlugin.EscapingChange = !!eval(parameters['Escaping Change?']);
    MPPlugin.atEscapingColor1 = 'rgb(%1)'.format(parameters['AT Escaping Color1'] || '192,192,192');
    MPPlugin.atEscapingColor2 = 'rgb(%1)'.format(parameters['AT Escaping Color2'] || '192,192,255');
    
})();

var Alias = {};

//=============================================================================
// Option
//=============================================================================

//-----------------------------------------------------------------------------
// ConfigManager

ConfigManager.atbMode = Math.max(MPPlugin.atbModeStatus.indexOf(MPPlugin.atbMode), 0);
ConfigManager.atbSpeed = MPPlugin.atbSpeed;

ConfigManager.mppParams3 = ConfigManager.mppParams3 || [];
ConfigManager.mppParams3.push({
    symbol:'atbMode',
    name:  MPPlugin.atbModeName,
    status:MPPlugin.atbModeStatus.map(function(mode) {
        return MPPlugin.atbModeTexts[mode];
    }),
    def:ConfigManager.atbMode
},{
    symbol:'atbSpeed',
    name:  MPPlugin.atbSpeedName,
    status:MPPlugin.atbSpeedStatus,
    def:MPPlugin.atbSpeed
});

ConfigManager.onAtbMode = function() {
    var status = MPPlugin.atbModeStatus;
    var value = this.atbMode;
    value++;
    if (value >= status.length) value = 0;
    value = value.clamp(0, status.length - 1);
    this.atbMode = value;
};

// ConfigManager.MppOption3
if (!ConfigManager.MppOption3) {
    
    //71
    Alias.CoMa_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        var config = Alias.CoMa_makeData.call(this);
        var params = this.mppParams3;
        for (var i = 0; i < params.length; i++) {
            var symbol = params[i].symbol;
            config[symbol] = this[symbol];
        }
        return config;
    };

    //82
    Alias.CoMa_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        Alias.CoMa_applyData.call(this, config);
        var params = this.mppParams3;
        for (var i = 0; i < params.length; i++) {
            var symbol = params[i].symbol;
            if (typeof config[symbol] === 'number')
                this[symbol] = config[symbol];
        }
    };

    ConfigManager.getMppParam = function(symbol) {
        var param;
        for (var i = 0; i < this.mppParams3.length; i++) {
            if (this.mppParams3[i].symbol === symbol) {
                param = this.mppParams3[i];
                break;
            }
        }
        if (param) {
            return param.name ? this[param.symbol] : param.def;
        }
        return 0;
    };

    //-----------------------------------------------------------------------------
    // Window_Options

    //31
    Alias.WiOp_makeCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function() {
        var params = ConfigManager.mppParams3;
        for (var i = 0; i < params.length; i++) {
            var param = params[i];
            if (param.name)
                this.addCommand(param.name, param.symbol);
        }
        Alias.WiOp_makeCommandList.call(this);
    };

    Window_Options.prototype.isMppSymbol3 = function(symbol) {
        return ConfigManager.mppParams3.some(function(param) {
            return param.symbol === symbol;
        });
    };

    Window_Options.prototype.getMppStatus3 = function(symbol) {
        var params = ConfigManager.mppParams3;
        for (var i = 0; i < params.length; i++) {
            if (params[i].symbol === symbol)
                return params[i].status;
        }
        return [];
    };

    //62
    Alias.WiOp_statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function(index) {
        var symbol = this.commandSymbol(index);
        if (this.isMppSymbol3(symbol)) {
            var status = this.getMppStatus3(symbol);
            var value = this.getConfigValue(symbol);
            return status[value];
        } else {
            return Alias.WiOp_statusText.call(this, index);
        }
    };

    //84
    Alias.WiOp_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
        var index = this.index();
        var symbol = this.commandSymbol(index);
        if (this.isMppSymbol3(symbol)) {
            var status = this.getMppStatus3(symbol);
            var value = this.getConfigValue(symbol);
            value++;
            if (value >= status.length) value = 0;
            value = value.clamp(0, status.length - 1);
            this.changeValue(symbol, value);
        } else {
            Alias.WiOp_processOk.call(this);
        }
    };

    //100
    Alias.WiOp_cursorRight = Window_Options.prototype.cursorRight;
    Window_Options.prototype.cursorRight = function(wrap) {
        var index = this.index();
        var symbol = this.commandSymbol(index);
        if (this.isMppSymbol3(symbol)) {
            var status = this.getMppStatus3(symbol);
            var value = this.getConfigValue(symbol);
            value++;
            value = value.clamp(0, status.length - 1);
            this.changeValue(symbol, value);
        } else {
            Alias.WiOp_cursorRight.call(this, wrap);
        }
    };

    //113
    Alias.WiOp_cursorLeft = Window_Options.prototype.cursorLeft;
    Window_Options.prototype.cursorLeft = function(wrap) {
        var index = this.index();
        var symbol = this.commandSymbol(index);
        if (this.isMppSymbol3(symbol)) {
            var status = this.getMppStatus3(symbol);
            var value = this.getConfigValue(symbol);
            value--;
            value = value.clamp(0, status.length - 1);
            this.changeValue(symbol, value);
        } else {
            Alias.WiOp_cursorLeft.call(this, wrap);
        }
    };

    ConfigManager.MppOption3 = true;
}

//=============================================================================
// Main
//=============================================================================

//-----------------------------------------------------------------------------
// BattleManager

//10
Alias.BaMa_setup = BattleManager.setup;
BattleManager.setup = function(troopId, canEscape, canLose) {
    Alias.BaMa_setup.call(this, troopId, canEscape, canLose);
    var rate = (7 - ConfigManager.getMppParam('atbSpeed')) * MPPlugin.atbSpeedBase * 16;
    this._maxAt = Math.max(Math.round($gameParty.agility() * rate), 10);
    this._refreshHandler = null;
    this._waitHandler = null;
    this._escaping = false;
    this._atbFast = false;
};

BattleManager.atbMode = function() {
    return MPPlugin.atbModeStatus[ConfigManager.getMppParam('atbMode')];
};

BattleManager.maxAt = function() {
    return this._maxAt;
};

BattleManager.setEscaping = function(escaping) {
    this._escaping = escaping;
    $gameParty.requestMotionRefresh();
};

BattleManager.isEscaping = function() {
    return this._escaping;
};

BattleManager.needEscapeAt = function() {
    return MPPlugin.needEscapeAt / 100;
};

BattleManager.escapeAtCost = function() {
    return MPPlugin.escapeAtCost / 100;
};

//114
Alias.BaMa_update = BattleManager.update;
BattleManager.update = function() {
    this.updateATB();
    this.updateCmdActor();
    Alias.BaMa_update.call(this);
};

BattleManager.updateATB = function() {
    if (!this._atbFast && this.isTriggeredFast()) {
        this._atbFast = true;
    } else if (this._atbFast && !this.isPressedFast()) {
        this._atbFast = false;
    }
    if (Graphics.frameCount % 2 === 0 && !this.isAtbWait()) {
        var rate = this.atbRealRate();
        this.allBattleMembers().forEach(function(battler) {
            battler.updateATB(rate);
            if (battler.isMadeAction())
                this.addActionBattler(battler);
        }, this);
    }
};

BattleManager.isTriggeredFast = function() {
    return Input.isTriggered('shift') ||
            (TouchInput.isTriggered() && TouchInput.y < this._statusWindow.y);
};

BattleManager.isPressedFast = function() {
    return Input.isPressed('shift') ||
            (TouchInput.isPressed() && TouchInput.y < this._statusWindow.y);
};

BattleManager.atbRealRate = function() {
    if (this.isFastForward()) {
        return MPPlugin.atbFastRate;
    } else if (BattleManager.atbMode() === "slow") {
        if (this.actor()) {
            return MPPlugin.ModeSlowRate;
        } else {
            return MPPlugin.ModeSlowFastRate;
        }
    } else {
        return 1;
    }
};

BattleManager.updateCmdActor = function() {
    if (this.isEvantWait() || this.isBattleEnd())
        return this.clearActor();
    if (!this.isAtbWait() && !this.actor()) {
        var members = $gameParty.battleMembers();
        for (var i = 0; i < members.length; i++) {
            if (members[i].isStandby()) {
                return this.changeActor(i);
            }
        }
    } else if (this.actor() && !this.actor().isStandby()) {
        this.clearActor();
    }
};

BattleManager.addActionBattler = function(battler) {
    this._actionBattlers.push(battler);
    battler.setDecided(2);
};

BattleManager.deleteDeactiveBattler = function() {
    this._actionBattlers = this._actionBattlers.filter(function(battler) {
        if (battler.atRate() === 1) {
            return true;
        } else {
            battler.setDecided(0);
            return false;
        }
    });
    if (this.actor() && !this.actor().isStandby()) {
        this.clearActor();
    }
};

BattleManager.isFastForward = function() {
    return MPPlugin.atbFastEneble && this._atbFast;
};

BattleManager.isEvantWait = function() {
    return $gameTroop.isEventRunning() || $gameMessage.isBusy();
};

BattleManager.isAtbWait = function() {
    if (MPPlugin.StopTimeOnAction && this._subject) {
        return true;
    }
    return (this.isEvantWait() || this._waitHandler());
};

//221
Alias.BaMa_startBattle = BattleManager.startBattle;
BattleManager.startBattle = function() {
    Alias.BaMa_startBattle.call(this);
    this.setupAllBattlerAt();
    this.startTurn();
};

BattleManager.setupAllBattlerAt = function() {
    if (this._preemptive) {
        $gameParty.members().forEach(function(member) {
            member.setAt(1);
        });
    } else if (this._surprise) {
        $gameTroop.members().forEach(function(member) {
            member.setAt(1);
        });
    } else {
        $gameParty.members().forEach(function(member) {
            member.setAt(0.8 * Math.random());
        });
        $gameTroop.members().forEach(function(member) {
            member.setAt(0.8 * Math.random());
        });
    }
    this.refreshStatus();
};

//254
BattleManager.selectNextCommand = function() {
    var members = $gameParty.battleMembers();
    if (this.actor() && this.actor().isStandby()) {
        var actionState = 'undecided';
    } else {
        var actionState = 'waiting';
    }
    for (var i = 1; i < members.length; i++) {
        var n = (this._actorIndex + i).mod(members.length);
        if (members[n].isStandby() && members[n].canInput()) {
            return this.changeActor(n, actionState);
        }
    }
    return this.changeActor(-1, actionState);
};

//266
BattleManager.selectPreviousCommand = function() {
    var members = $gameParty.battleMembers();
    if (this.actor() && this.actor().isStandby()) {
        var actionState = 'undecided';
    } else {
        var actionState = 'waiting';
    }
    for (var i = 1; i < members.length; i++) {
        var n = (this._actorIndex - i).mod(members.length);
        if (members[n].isStandby() && members[n].canInput()) {
            return this.changeActor(n, actionState);
        }
    }
    return this.changeActor(-1, actionState);
};

//277
BattleManager.refreshStatus = function() {
    this._refreshHandler();
};

//281
BattleManager.startTurn = function() {
    this._phase = 'turn';
    //this.clearActor();
    //$gameTroop.increaseTurn();
    //this.makeActionOrders();
    $gameParty.requestMotionRefresh();
    this._logWindow.startTurn();
};

//290
BattleManager.updateTurn = function() {
    $gameParty.requestMotionRefresh();
    if (!this._subject) {
        this._subject = this.getNextSubject();
        if (this._subject) {
            this._subject.onTurnEnd();
            this.refreshStatus();
            this._logWindow.displayAutoAffectedStatus(this._subject);
            this._logWindow.displayRegeneration(this._subject);
            if (this._logWindow.isBusy()) return;
        }
    }
    if (this._subject) {
        this.processTurn();
    } else {
        this.endTurn();
    }
};

//302
BattleManager.processTurn = function() {
    var subject = this._subject;
    var action = subject.currentAction();
    if (action) {
        action.prepare();
        if (action.isValid()) {
            this.startAction();
        }
        subject.removeCurrentAction();
    } else {
        $gameTroop.increaseTurn();
        subject.onAllActionsEnd();
        subject.resetAt(this._action ? this._action.item() : null);
        this.refreshStatus();
        this._logWindow.displayAutoAffectedStatus(subject);
        this._logWindow.displayCurrentState(subject);
        this._logWindow.displayRegeneration(subject);
        this.endTurn();
    }
};

//321
BattleManager.endTurn = function() {
    this._phase = 'turnEnd';
    this._subject = null;
};

//340
BattleManager.updateTurnEnd = function() {
    if (!this._escaping || !$gameParty.canEscape() || !this.processEscape()) {
        this.startTurn();
    }
};

//344
Alias.BaMa_getNextSubject = BattleManager.getNextSubject;
BattleManager.getNextSubject = function() {
    if (this.isAtbWait() || this._logWindow.isBusy()) return null;
    return Alias.BaMa_getNextSubject.call(this);
};

//466
Alias.BaMa_processForcedAction = BattleManager.processForcedAction;
BattleManager.processForcedAction = function() {
    if (this._subject) {
        var subject = this._subject;
        $gameTroop.increaseTurn();
        subject.onAllActionsEnd();
        subject.resetAt(this._action ? this._action.item() : null);
        this.refreshStatus();
        this._logWindow.displayAutoAffectedStatus(subject);
        this._logWindow.displayCurrentState(subject);
        this._logWindow.displayRegeneration(subject);
        this._subject = null;
    }
    Alias.BaMa_processForcedAction.apply(this, arguments);
};

//515
BattleManager.processEscape = function() {
    $gameParty.performEscape();
    SoundManager.playEscape();
    var success = this._preemptive ? true : (Math.random() < this._escapeRatio);
    if (success) {
        this.displayEscapeSuccessMessage();
        this._escaped = true;
        this.processAbort();
    } else {
        this.displayEscapeFailureMessage();
        this._escapeRatio += 0.1;
        //$gameParty.clearActions();
        //this.startTurn();
        $gameParty.escapeFailure();
    }
    return success;
};

//550
Alias.BaMa_endBattle = BattleManager.endBattle;
BattleManager.endBattle = function(result) {
    Alias.BaMa_endBattle.call(this, result);
    this.clearActor();
};

//-----------------------------------------------------------------------------
// Game_BattlerBase

//110
Alias.GaBa_initMembers = Game_BattlerBase.prototype.initMembers;
Game_BattlerBase.prototype.initMembers = function() {
    Alias.GaBa_initMembers.call(this);
    this._at = 0;
    this._ct = 0;
    this._maxCt = 0;
    this._turnCount = 0;
    this._decided = 0;
};

//235
Alias.GaBa_die = Game_BattlerBase.prototype.die;
Game_BattlerBase.prototype.die = function() {
    Alias.GaBa_die.call(this);
    if (MPPlugin.resetAtDie) {
        this._at = 0;
    } else {
        this._at = Math.min(this._at, BattleManager.maxAt() - 1);
    }
    this._ct = 0;
    this._maxCt = 0;
    this._decided = 0;
};

Game_BattlerBase.prototype.onMadeAction = function() {
    this.setDecided(1);
    this._ct = 0;
    this._maxCt = 0;
    var action = this.currentAction();
    if (action) {
        var item = action.item();
        if (item) {
            var rate = (ConfigManager.getMppParam('atbSpeed') - 7) * 3;
            this._maxCt = Math.max(item.speed * rate, 0);
        }
    }
};

Game_BattlerBase.prototype.setDecided = function(decided) {
    this._decided = decided;
};

Game_BattlerBase.prototype.setAt = function(value) {
    this._at = Math.floor(BattleManager.maxAt() * value);
    this._at = this._at.clamp(0, BattleManager.maxAt() - 1);
};

Game_BattlerBase.prototype.atRate = function() {
    return BattleManager.maxAt() > 0 ? this._at / BattleManager.maxAt() : 0;
};

Game_BattlerBase.prototype.castRate = function() {
    if (this._maxCt > 0) {
        return this._ct / this._maxCt;
    } else {
        return -1;
    }
};

Game_BattlerBase.prototype.isStandby = function() {
    return this._decided === 0 && this.atRate() === 1;
};

Game_BattlerBase.prototype.decided = function() {
    return this._decided;
};

Game_BattlerBase.prototype.isMadeAction = function() {
    return this._decided === 1 && this._ct === this._maxCt;
};

Game_BattlerBase.prototype.isStandby = function() {
    return this._decided === 0 && this.atRate() === 1;
};

//-----------------------------------------------------------------------------
// Game_Battler

//59
Alias.GaBa_requestMotion = Game_Battler.prototype.requestMotion;
Game_Battler.prototype.requestMotion = function(motionType) {
    Alias.GaBa_requestMotion.call(this, motionType);
    this._motionRefresh = false;
};

//144
Alias.GaBa_clearActions = Game_Battler.prototype.clearActions;
Game_Battler.prototype.clearActions = function() {
    Alias.GaBa_clearActions.call(this);
    this._ct = 0;
    this._maxCt = 0;
};

Game_Battler.prototype.setAt = function(value) {
    if (this.atRate() === 1 && value >= 1) return;
    Game_BattlerBase.prototype.setAt.call(this, value);
    if (this._decided > 0 && this.atRate() < 1) {
        this.setDecided(0);
        this.clearActions();
        BattleManager.deleteDeactiveBattler();
    }
};

Game_Battler.prototype.gainAt = function(value) {
    this.setAt(this.atRate() + value);
};

Game_Battler.prototype.resetAt = function(item) {
    this.setAt(0);
};

//419
Alias.GaBa_onBattleStart = Game_Battler.prototype.onBattleStart;
Game_Battler.prototype.onBattleStart = function() {
    Alias.GaBa_onBattleStart.call(this);
    this._ct = 0;
    this._maxCt = 0;
    this._turnCount = 0;
    this._decided = 0;
};

//427
Alias.GaBa_onAllActionsEnd = Game_Battler.prototype.onAllActionsEnd;
Game_Battler.prototype.onAllActionsEnd = function() {
    Alias.GaBa_onAllActionsEnd.apply(this, arguments);
    this.regenerateAll();
    this._turnCount++;
    this._ct = 0;
    this._maxCt = 0;
    this.setDecided(0);
    this.setActionState('undecided');
};

//433
Alias.GaBa_onTurnEnd = Game_Battler.prototype.onTurnEnd;
Game_Battler.prototype.onTurnEnd = function() {
    if ($gameParty.inBattle()) {
        this.clearResult();
        //this.regenerateAll();
        this.updateStateTurns();
        this.updateBuffTurns();
        this.removeStatesAuto(2);
    } else {
        Alias.GaBa_onTurnEnd.call(this);
    }
};

Game_Battler.prototype.canEscape = function() {
    return this.atRate() >= BattleManager.needEscapeAt();
};

Game_Battler.prototype.escapeFailure = function() {
    if (this.atRate() === 1 && BattleManager.escapeAtCost() > 0) {
        this.clearActions();
    }
    this.gainAt(-BattleManager.escapeAtCost());
};

Game_Battler.prototype.updateATB = function(rate) {
    if (!this.isAlive()) return;
    if (this._at < BattleManager.maxAt()) {
        this._at += (this.agi + MPPlugin.atIncrement) * rate;
        if(this._at >= BattleManager.maxAt()) {
            this._at = BattleManager.maxAt();
            this.makeActions();
        }
    } else if (this._ct < this._maxCt) {
        this._ct = Math.min(this._ct + rate, this._maxCt);
    }
};

Game_Battler.prototype.atGaugeRate = function() {
    if (MPPlugin.chantingView && this.castRate() >= 0) {
        return this.castRate();
    } else {
        return this.atRate();
    }
};

Game_Battler.prototype.atGaugeColor1 = function() {
    var color = this.atGaugeColorEx1();
    if (color) return color;
    return (this.atRate() < 1 ? MPPlugin.atChargeColor1 : MPPlugin.atMaxColor1);
};

Game_Battler.prototype.atGaugeColor2 = function() {
    var color = this.atGaugeColorEx2();
    if (color) return color;
    return (this.atRate() < 1 ? MPPlugin.atChargeColor2 : MPPlugin.atMaxColor2);
};

Game_Battler.prototype.atGaugeColorEx1 = function() {
    if (MPPlugin.chantingView && this.castRate() >= 0) {
        return MPPlugin.atChantingColor1;
    } else if (MPPlugin.EscapingChange && this.isActor() &&
            BattleManager.isEscaping() && this.isAlive()) {
        return MPPlugin.atEscapingColor1;
    }
    return null;
};

Game_Battler.prototype.atGaugeColorEx2 = function() {
    if (MPPlugin.chantingView && this.castRate() >= 0) {
        return MPPlugin.atChantingColor2;
    } else if (MPPlugin.EscapingChange && this.isActor() &&
            BattleManager.isEscaping() && this.isAlive()) {
        return MPPlugin.atEscapingColor2;
    }
    return null;
};

//-----------------------------------------------------------------------------
// Game_Actor

if (Game_Actor.prototype.hasOwnProperty('onRestrict')) {
    Alias.GaAc_onRestrict = Game_Actor.prototype.onRestrict;
}
Game_Actor.prototype.onRestrict = function() {
    if (Alias.GaAc_onRestrict) {
        Alias.GaAc_onRestrict.call(this);
    } else {
        Game_Battler.prototype.onRestrict.call(this);
    }
    if ($gameParty.inBattle() && !this._active && this.isAlive() &&
            this._at === BattleManager.maxAt()) {
        this.makeActions();
    }
};

//689
Alias.GaAc_performVictory = Game_Actor.prototype.performVictory;
Game_Actor.prototype.performVictory = function() {
    Alias.GaAc_performVictory.call(this);
    this.setDecided(0);
};

//714
Alias.GaAc_makeAutoBattleActions = Game_Actor.prototype.makeAutoBattleActions;
Game_Actor.prototype.makeAutoBattleActions = function() {
    Alias.GaAc_makeAutoBattleActions.call(this);
    this.onMadeAction();
};

//729
Alias.GaAc_makeConfusionActions = Game_Actor.prototype.makeConfusionActions;
Game_Actor.prototype.makeConfusionActions = function() {
    Alias.GaAc_makeConfusionActions.call(this);
    this.onMadeAction();
};

//736
Alias.GaAc_makeActions = Game_Actor.prototype.makeActions;
Game_Actor.prototype.makeActions = function() {
    Alias.GaAc_makeActions.call(this);
    if (!this.canInput()) this.onMadeAction();
};

//-----------------------------------------------------------------------------
// Game_Enemy

//214
Game_Enemy.prototype.meetsTurnCondition = function(param1, param2) {
    var n = this._turnCount;
    if (param2 === 0) {
        return n === param1;
    } else {
        return n >= param1 && n % param2 === param1 % param2;
    }
};

//278
Alias.GaEn_makeActions = Game_Enemy.prototype.makeActions;
Game_Enemy.prototype.makeActions = function() {
    Alias.GaEn_makeActions.call(this);
    this.onMadeAction();
};

//-----------------------------------------------------------------------------
// Game_Unit

Game_Unit.prototype.selectAll = function() {
    this.members().forEach(function(member) {
        member.select();
    });
};

Game_Unit.prototype.select = function(activeMember) {
    this.members().forEach(function(member) {
        if (member === activeMember) {
            member.select();
        } else {
            member.deselect();
        }
    });
};


//-----------------------------------------------------------------------------
// Game_Party

Game_Party.prototype.canEscape = function() {
    return this.aliveMembers().every(function(member) {
        return member.canEscape();
    });
};

Game_Party.prototype.escapeFailure = function() {
    this.aliveMembers().forEach(function(member) {
        member.escapeFailure();
    });
    BattleManager.deleteDeactiveBattler();
};

//179
Alias.GaPa_addActor = Game_Party.prototype.addActor;
Game_Party.prototype.addActor = function(actorId) {
    Alias.GaPa_addActor.call(this, actorId);
    if (this.inBattle())
        BattleManager.refreshStatus();
};

//187
Alias.GaPa_removeActor = Game_Party.prototype.removeActor;
Game_Party.prototype.removeActor = function(actorId) {
    Alias.GaPa_removeActor.call(this, actorId);
    if (this.inBattle())
        BattleManager.refreshStatus();
};

//-----------------------------------------------------------------------------
// Game_Troop

if (!MPPlugin.contains['ComBat']) {

//152
Alias.GaTr_setupBattleEvent = Game_Troop.prototype.setupBattleEvent;
Game_Troop.prototype.setupBattleEvent = function() {
    var lastRunning = this._interpreter.isRunning();
    Alias.GaTr_setupBattleEvent.call(this);
    if (!lastRunning && this._interpreter.isRunning()) {
        BattleManager.setEscaping(false);
    }
};

}// if (!MPPlugin.contains['ComBat'])

//-----------------------------------------------------------------------------
// Window_BattleLog

//121
Alias.WiBaLo_isFastForward = Window_BattleLog.prototype.isFastForward;
Window_BattleLog.prototype.isFastForward = function() {
    return (MPPlugin.fastLogEneble && Alias.WiBaLo_isFastForward.call(this));
};

//-----------------------------------------------------------------------------
// Window_PartyCommand

//28
Alias.WiPaCo_makeCommandList = Window_PartyCommand.prototype.makeCommandList;
Window_PartyCommand.prototype.makeCommandList = function() {
    Alias.WiPaCo_makeCommandList.call(this);
    if (MPPlugin.ChangeModeInBattle) {
        var mode = BattleManager.atbMode();
        var name = "[" + MPPlugin.atbModeTexts[mode] + "]";
        this.addCommand(name, 'atbMode');
    }
};

//-----------------------------------------------------------------------------
// Window_BattleStatus

Window_BattleStatus.prototype.setActorCmdWindow = function(actorCmdWindow) {
    this._actorCmdWindow = actorCmdWindow;
};

Window_BattleStatus.prototype.isActorCmdEnabled = function() {
    return this._actorCmdWindow &&
            (this._actorCmdWindow.active || !this._actorCmdWindow.isOpen());
};

Window_BattleStatus.prototype.processHandling = function() {
    if (this.isOpen() && this.isActorCmdEnabled()) {
        if (this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
            this.processPagedown();
        } else if (this.isHandled('pageup') && Input.isTriggered('pageup')) {
            this.processPageup();
        }
    }
};

Window_BattleStatus.prototype.processTouch = function() {
    if (this.isOpen() && this.isActorCmdEnabled()) {
        if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
            this._touching = true;
            this.updateInputData();
        }
        if (this._touching) {
            if (TouchInput.isPressed()) {
                this.onTouch(false);
            } else {
                if (this.isTouchedInsideFrame()) {
                    this.onTouch(true);
                }
                this._touching = false;
            }
        }
    }
};

Window_BattleStatus.prototype.onTouch = function(triggered) {
    var lastTopRow = this.topRow();
    var x = this.canvasToLocalX(TouchInput.x);
    var y = this.canvasToLocalY(TouchInput.y);
    var hitIndex = this.hitTest(x, y);
    if (hitIndex >= 0) {
        if (triggered && this.isTouchOkEnabled()) {
            var actor = $gameParty.battleMembers()[hitIndex];
            if (actor && actor.isStandby()) {
                this.select(hitIndex);
                this.processOk();
            }
        }
    } else if (this._stayCount >= 10) {
        if (y < this.padding) {
            this.scrollUp();
        } else if (y >= this.height - this.padding) {
            this.scrollDown();
        }
    }
    if (this.topRow() !== lastTopRow) {
        SoundManager.playCursor();
    }
};

Window_BattleStatus.prototype.processOk = function() {
    this.updateInputData();
    this.deactivate();
    this.callOkHandler();
};

Window_BattleStatus.prototype.processPageup = function() {
    this.updateInputData();
    this.deactivate();
    this.callHandler('pageup');
};

Window_BattleStatus.prototype.processPagedown = function() {
    this.updateInputData();
    this.deactivate();
    this.callHandler('pagedown');
};

Window_BattleStatus.prototype.isCursorMovable = function() {
    return false;
};

Window_BattleStatus.prototype.isDrawAt = function() {
    return MPPlugin.atGaugeWidth > 0;
};

//39
Alias.WiBaSt_refresh = Window_BattleStatus.prototype.refresh;
Window_BattleStatus.prototype.refresh = function() {
    this.clearUpdateDrawer();
    Alias.WiBaSt_refresh.call(this);
};

//63
Alias.WiBaSt_gaugeAreaWidth = Window_BattleStatus.prototype.gaugeAreaWidth;
Window_BattleStatus.prototype.gaugeAreaWidth = function() {
    if (this.isDrawAt()) {
        return 234 + MPPlugin.atGaugeWidth;
    } else {
        return Alias.WiBaSt_gaugeAreaWidth.call(this);
    }
};

//80
Alias.WiBaSt_drawGaugeAreaWithTp = Window_BattleStatus.prototype.drawGaugeAreaWithTp;
Window_BattleStatus.prototype.drawGaugeAreaWithTp = function(rect, actor) {
    if (this.isDrawAt()) {
        this.drawActorHp(actor, rect.x + 0, rect.y, 108);
        this.drawActorMpTp(actor, rect.x + 123, rect.y, 96);
        this.drawActorAt(actor, rect.x + 234, rect.y, MPPlugin.atGaugeWidth);
    } else {
        Alias.WiBaSt_drawGaugeAreaWithTp.call(this, rect, actor);
    }
};

//86
Alias.WiBaSt_drawGaugeAreaWithoutTp = Window_BattleStatus.prototype.drawGaugeAreaWithoutTp;
Window_BattleStatus.prototype.drawGaugeAreaWithoutTp = function(rect, actor) {
    if (this.isDrawAt()) {
        this.drawActorHp(actor, rect.x + 0, rect.y, 108);
        this.drawActorMp(actor, rect.x + 123, rect.y, 96);
        this.drawActorAt(actor, rect.x + 234, rect.y, MPPlugin.atGaugeWidth);
    } else {
        Alias.WiBaSt_drawGaugeAreaWithoutTp.call(this, rect, actor);
    }
};

Window_BattleStatus.prototype.drawActorMpTp = function(actor, x, y, width) {
    width = (width || 186) - 10;
    this.drawGauge(x + 10, y, width, actor.tpRate(),
                   this.tpGaugeColor1(), this.tpGaugeColor2());
    this.drawGauge(x, y - 8, width, actor.mpRate(),
                   this.mpGaugeColor1(), this.mpGaugeColor2());
    this.contents.fontSize = 24;
    this.changeTextColor(this.systemColor());
    this.contents.drawText(TextManager.mpA, x, y + 1, 32, 24);
    this.contents.drawText(TextManager.tpA, x + 22, y + 10, 32, 24);
    this.contents.fontSize = this.standardFontSize();
};

Window_BattleStatus.prototype.drawActorAt = function(actor, x, y, width, drawer) {
    width = width || 60;
    var color1 = actor.atGaugeColor1();
    var color2 = actor.atGaugeColor2();
    this.drawAtGauge(x, y, width, actor.atGaugeRate(), color1, color2);
    this.changeTextColor(this.systemColor());
    this.drawText(MPPlugin.atGaugeName, x, y, 44);
    
    if (drawer === undefined) drawer = true;
    if (drawer) {
        var process = this.actorAtDrawer.bind(this, actor, x, y, width);
        this.addUpdateDrawer(process);
    }
};

Window_BattleStatus.prototype.drawAtGauge = function(x, y, width, rate, color1, color2) {
    var height = MPPlugin.atGaugeHeight;
    var fillW = width * rate;
    var gaugeY = y + this.lineHeight() - height - 2;
    this.contents.fillRect(x, gaugeY, width, height, this.gaugeBackColor());
    this.contents.gradientFillRect(x, gaugeY, fillW, height, color1, color2);
};

Window_BattleStatus.prototype.actorAtDrawer = function(actor, x, y, width) {
    if (Graphics.frameCount % 2 === 0) {
        this.contents.clearRect(x, y, width, this.lineHeight());
        this.drawActorAt(actor, x, y, width, false);
    }
    return true;
};

//-----------------------------------------------------------------------------
// Window_BattleActor

Window_BattleActor.prototype.processHandling = function() {
    Window_Selectable.prototype.processHandling.call(this);
};

Window_BattleActor.prototype.processTouch = function() {
    Window_Selectable.prototype.processTouch.call(this);
};

Window_BattleActor.prototype.onTouch = function(triggered) {
    Window_Selectable.prototype.onTouch.call(this, triggered);
};

Window_BattleActor.prototype.processOk = function() {
    Window_Selectable.prototype.processOk.call(this);
};

Window_BattleActor.prototype.isCursorMovable = function() {
    return Window_Selectable.prototype.isCursorMovable.call(this);
};

Window_BattleActor.prototype.isDrawAt = function() {
    return false;
};

Window_BattleActor.prototype.selectForItem = function() {
    var actor = BattleManager.actor();
    var action = actor.inputtingAction();
    this.setCursorFixed(false);
    this.setCursorAll(false);
    if (action.isForUser()) {
        this.setCursorFixed(true);
        this.select(actor.index());
    } else if (action.isForAll()) {
        this.setCursorAll(true);
        this.select(0);
    } else {
        this.select(actor.index());
    }
};

//31
Alias.WiBaAc_select = Window_BattleActor.prototype.select;
Window_BattleActor.prototype.select = function(index) {
    Alias.WiBaAc_select.call(this, index);
    if (this._cursorAll) $gameParty.selectAll();
};

if (Window_BattleActor.prototype.hasOwnProperty('hitTest')) {
    Alias.WiBaAc_hitTest = Window_BattleActor.prototype.hitTest;
}
Window_BattleActor.prototype.hitTest = function(x, y) {
    var _super = Alias.WiBaAc_hitTest || Window_BattleStatus.prototype.hitTest;
    var result = _super.apply(this, arguments);
    if (result >= 0 && this._cursorAll && this.isContentsArea(x, y)) {
        return 0;
    }
    return result;
};

//-----------------------------------------------------------------------------
// Window_BattleEnemy

Window_BattleEnemy.prototype.isCurrentItemEnabled = function() {
    return !!this.enemy();
};

//58
Window_BattleEnemy.prototype.show = function() {
    //this.refresh();
    //this.select(0);
    Window_Selectable.prototype.show.call(this);
};

Window_BattleEnemy.prototype.selectForItem = function() {
    var actor = BattleManager.actor();
    var action = actor.inputtingAction();
    this.setCursorAll(false);
    if (action.isForAll())
        this.setCursorAll(true);
    this.select(0);
};

if (Window_BattleEnemy.prototype.hasOwnProperty('hitTest')) {
    Alias.WiBaEn_hitTest = Window_BattleEnemy.prototype.hitTest;
}
Window_BattleEnemy.prototype.hitTest = function(x, y) {
    var _super = Alias.WiBaEn_hitTest || Window_Selectable.prototype.hitTest;
    var result = _super.apply(this, arguments);
    if (result >= 0 && this._cursorAll && this.isContentsArea(x, y)) {
        return 0;
    }
    return result;
};

//69
Alias.WiBaEn_refresh = Window_BattleEnemy.prototype.refresh;
Window_BattleEnemy.prototype.refresh = function() {
    Alias.WiBaEn_refresh.call(this);
    if (this.index() >= 0)
        this.select(this._index.clamp(0, this.maxItems() - 1));
};

//74
Alias.WiBaEn_select = Window_BattleEnemy.prototype.select;
Window_BattleEnemy.prototype.select = function(index) {
    Alias.WiBaEn_select.call(this, index);
    if (this._cursorAll) $gameTroop.selectAll();
};


//-----------------------------------------------------------------------------
// Window_BattleSkill

Window_BattleSkill.prototype.setStatusWindow = function(statusWindow) {
    this._statusWindow = statusWindow;
};

Window_BattleSkill.prototype.setActor = function(actor) {
    Window_SkillList.prototype.setActor.call(this, actor);
    if (this._statusWindow)
        this._statusWindow.setActor(actor);
};

//18
Alias.WiBaSk_show = Window_BattleSkill.prototype.show;
Window_BattleSkill.prototype.show = function() {
    if (this._statusWindow) {
        this._statusWindow.refresh();
        this._statusWindow.show();
    }
    Alias.WiBaSk_show.call(this);
};

//24
Alias.WiBaSk_hide = Window_BattleSkill.prototype.hide;
Window_BattleSkill.prototype.hide = function() {
    if (this._statusWindow)
        this._statusWindow.hide();
    Alias.WiBaSk_hide.call(this);
};

//-----------------------------------------------------------------------------
// Window_AtbSkillStatus

Window_AtbSkillStatus.prototype = Object.create(Window_Base.prototype);
Window_AtbSkillStatus.prototype.constructor = Window_AtbSkillStatus;

Window_AtbSkillStatus.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.hide();
};

Window_AtbSkillStatus.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

Window_AtbSkillStatus.prototype.refresh = function() {
    this.contents.clear();
    if (this._actor) {
        var y = 0;
        var height = this.lineHeight();
        if (MPPlugin.SkillWindowHpDraw) {
            this.drawActorHp(this._actor, 0, 0, this.contentsWidth());
            y += height;
        }
        if ($dataSystem.optDisplayTp) {
            this.drawActorMp(this._actor, 0, y, this.contentsWidth());
            this.drawActorTp(this._actor, 0, y + height, this.contentsWidth());
        } else {
            this.drawActorMp(this._actor, 0, y, this.contentsWidth());
        }
    }
};

//-----------------------------------------------------------------------------
// Sprite_Actor

//141
Alias.SpAc_updateTargetPosition = Sprite_Actor.prototype.updateTargetPosition;
Sprite_Actor.prototype.updateTargetPosition = function() {
    if (MPPlugin.inputStepForward || !this._actor.isInputting()) {
        Alias.SpAc_updateTargetPosition.call(this);
    }
};

//208
Alias.SpAc_refreshMotion = Sprite_Actor.prototype.refreshMotion;
Sprite_Actor.prototype.refreshMotion = function() {
    if (MPPlugin.escapeAnime) {
        var actor = this._actor;
        if (BattleManager.isEscaping() && actor && !actor.isActing() &&
            actor.stateMotionIndex() < 2) {
            return this.startMotion('escape');
        }
    }
    Alias.SpAc_refreshMotion.call(this);
};

//-----------------------------------------------------------------------------
// Scene_Battle

//22
Alias.ScBa_start = Scene_Battle.prototype.start;
Scene_Battle.prototype.start = function() {
    BattleManager._refreshHandler = this.refreshStatus.bind(this);
    BattleManager._waitHandler = this.isAtbWait.bind(this);
    Alias.ScBa_start.apply(this, arguments);
};

Scene_Battle.prototype.isAtbWait = function() {
    if (!this._partyCommandWindow.isClosed()) return true;
    var mode = BattleManager.atbMode();
    if (mode === "wait") {
        if (this._skillWindow.visible || this._itemWindow.visible ||
                this._actorWindow.visible || this._enemyWindow.visible) {
            return true;
        }
    } else if (mode === "stop") {
        if (!!this._actor && (!MPPlugin.ModeStopFastEneble ||
                !BattleManager.isFastForward())) {
            return true;
        }
    }
    return false;
};

//41
Scene_Battle.prototype.updateBattleProcess = function() {
    //if (!this.isAnyInputWindowActive() || BattleManager.isAborting() ||
    //        BattleManager.isBattleEnd()) {
        BattleManager.update();
        this.changeInputWindow();
    //}
};

//58
Scene_Battle.prototype.changeInputWindow = function() {
    if (!this._partyCommandWindow.isClosed() ||
            this._actorCommandWindow.isClosing()) {
        return;
    } else if (this._actor !== BattleManager.actor()) {
        if (MPPlugin.FastCancelByInput)
            BattleManager._atbFast = false;
        this._actor = BattleManager.actor();
        if (this._actor) {
            this._actorCommandWindow.openness = 0;
            this.startActorCommandSelection();
        } else {
            this.endCommandSelection();
        }
    } else if (!this._actor && !BattleManager.isBattleEnd()) {
        if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
            SoundManager.playCancel();
            this.startPartyCommandSelection();
        }
    }
};

//82
Alias.ScBa_terminate = Scene_Battle.prototype.terminate;
Scene_Battle.prototype.terminate = function() {
    Alias.ScBa_terminate.apply(this, arguments);
    if (this._changeAtbMode) ConfigManager.save();
};

//106
Scene_Battle.prototype.updateWindowPositions = function() {
    var statusX = 0;
    if (!this._partyCommandWindow.isClosed() || !this._actorCommandWindow.isClosed()) {
        statusX = this._partyCommandWindow.width;
    } else {
        statusX = this._partyCommandWindow.width * MPPlugin.stWindowPos / 2;
    }
    if (this._statusWindow.x < statusX) {
        this._statusWindow.x += 16;
        if (this._statusWindow.x > statusX) {
            this._statusWindow.x = statusX;
        }
    }
    if (this._statusWindow.x > statusX) {
        this._statusWindow.x -= 16;
        if (this._statusWindow.x < statusX) {
            this._statusWindow.x = statusX;
        }
    }
};

//161
Alias.ScBa_createStatusWindow = Scene_Battle.prototype.createStatusWindow;
Scene_Battle.prototype.createStatusWindow = function() {
    Alias.ScBa_createStatusWindow.apply(this, arguments);
    this._statusWindow.setHandler('ok',  this.onStatusOk.bind(this));
    this._statusWindow.setHandler('pageup', this.selectPreviousCommand.bind(this));
    this._statusWindow.setHandler('pagedown', this.selectNextCommand.bind(this));
};

//166
Alias.ScBa_createPartyCommandWindow = Scene_Battle.prototype.createPartyCommandWindow;
Scene_Battle.prototype.createPartyCommandWindow = function() {
    Alias.ScBa_createPartyCommandWindow.apply(this, arguments);
    this._partyCommandWindow.setHandler('atbMode', this.onAtbMode.bind(this));
    this._partyCommandWindow.setHandler('cancel', this.onPartyCancel.bind(this));
};

//174
Alias.ScBa_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
Scene_Battle.prototype.createActorCommandWindow = function() {
    Alias.ScBa_createActorCommandWindow.apply(this, arguments);
    this._actorCommandWindow.setHandler('cancel', this.startPartyCommandSelection.bind(this));
    this._statusWindow.setActorCmdWindow(this._actorCommandWindow);
};

//184
Scene_Battle.prototype.createHelpWindow = function() {
    if (MPPlugin.helpWindowPos >= 0) {
        this._helpWindow = new Window_Help(MPPlugin.helpWindowRow);
        this._helpWindow.visible = false;
        if (MPPlugin.helpWindowPos === 1) {
            this._helpWindow.y = this._statusWindow.y - this._helpWindow.height;
        }
        this.addWindow(this._helpWindow);
    }
};

//190
Scene_Battle.prototype.createSkillWindow = function() {
    var wy = this._statusWindow.y;
    var ww = Graphics.boxWidth - 144
    var wh = this._statusWindow.height;
    this._skillWindow = new Window_BattleSkill(0, wy, ww, wh);
    this._skillWindow.setHelpWindow(this._helpWindow);
    this._skillWindow.setHandler('ok',     this.onSkillOk.bind(this));
    this._skillWindow.setHandler('cancel', this.onSkillCancel.bind(this));
    this.addWindow(this._skillWindow);

    this._skillStatusWindow = new Window_AtbSkillStatus(ww, wy, 144, wh);
    this.addWindow(this._skillStatusWindow);
    this._skillWindow.setStatusWindow(this._skillStatusWindow);
};

//200
Scene_Battle.prototype.createItemWindow = function() {
    var wy = this._statusWindow.y;
    var wh = this._statusWindow.height;
    this._itemWindow = new Window_BattleItem(0, wy, Graphics.boxWidth, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);
};

//210
Alias.ScBa_createActorWindow = Scene_Battle.prototype.createActorWindow;
Scene_Battle.prototype.createActorWindow = function() {
    Alias.ScBa_createActorWindow.apply(this, arguments);
    this._actorWindow.x = Graphics.boxWidth - this._actorWindow.width;
};

//238
Alias.ScBa_refreshStatus = Scene_Battle.prototype.refreshStatus;
Scene_Battle.prototype.refreshStatus = function() {
    Alias.ScBa_refreshStatus.apply(this, arguments);
    this._actorCommandWindow.refresh();
    if (this._skillWindow.visible) this._skillWindow.refresh();
    if (this._skillStatusWindow.visible) this._skillStatusWindow.refresh();
    if (this._itemWindow.visible)  this._itemWindow.refresh();
    if (this._actorWindow.visible) this._actorWindow.refresh();
    if (this._enemyWindow.visible) this._enemyWindow.refresh();
};

//242
Alias.ScBa_startPartyCommandSelection = Scene_Battle.prototype.startPartyCommandSelection;
Scene_Battle.prototype.startPartyCommandSelection = function() {
    Alias.ScBa_startPartyCommandSelection.apply(this, arguments);
    this._actor = null;
};

//250
Scene_Battle.prototype.commandFight = function() {
    BattleManager.setEscaping(false);
    this._partyCommandWindow.close();
};

//254
Scene_Battle.prototype.commandEscape = function() {
    BattleManager.setEscaping(true);
    this._partyCommandWindow.close();
};

Scene_Battle.prototype.onAtbMode = function() {
    ConfigManager.onAtbMode();
    this._changeAtbMode = true;
    this._partyCommandWindow.refresh();
    this._partyCommandWindow.activate();
};

Scene_Battle.prototype.onPartyCancel = function() {
    this._partyCommandWindow.close();
};

//259
Alias.ScBa_startActorCommandSelection = Scene_Battle.prototype.startActorCommandSelection;
Scene_Battle.prototype.startActorCommandSelection = function() {
    AudioManager.playStaticSe(MPPlugin.ActiveSE);
    Alias.ScBa_startActorCommandSelection.apply(this, arguments);
    this._skillWindow.deactivate();
    this._skillWindow.hide();
    this._itemWindow.deactivate();
    this._itemWindow.hide();
    this._actorWindow.deactivate();
    this._actorWindow.hide();
    this._enemyWindow.deactivate();
    this._enemyWindow.hide();
};

//265
Alias.ScBa_commandAttack = Scene_Battle.prototype.commandAttack;
Scene_Battle.prototype.commandAttack = function() {
    if (BattleManager.inputtingAction())
        Alias.ScBa_commandAttack.apply(this, arguments);
};

//278
Alias.ScBa_commandGuard = Scene_Battle.prototype.commandGuard;
Scene_Battle.prototype.commandGuard = function() {
    if (BattleManager.inputtingAction()) {
        BattleManager.inputtingAction().setGuard();
        BattleManager.actor().onMadeAction();
        Alias.ScBa_commandGuard.apply(this, arguments);
    }
};

Scene_Battle.prototype.onStatusOk = function() {
    BattleManager.changeActor(this._statusWindow.index(), 'undecided');
    this.changeInputWindow();
};

//299
Alias.ScBa_selectActorSelection = Scene_Battle.prototype.selectActorSelection;
Scene_Battle.prototype.selectActorSelection = function() {
    Alias.ScBa_selectActorSelection.apply(this, arguments);
    this._actorWindow.selectForItem();
};

//305
Alias.ScBa_onActorOk = Scene_Battle.prototype.onActorOk;
Scene_Battle.prototype.onActorOk = function() {
    if (BattleManager.inputtingAction()) {
        BattleManager.actor().onMadeAction();
        Alias.ScBa_onActorOk.apply(this, arguments);
    }
};

//328
Alias.ScBa_selectEnemySelection = Scene_Battle.prototype.selectEnemySelection;
Scene_Battle.prototype.selectEnemySelection = function() {
    Alias.ScBa_selectEnemySelection.apply(this, arguments);
    this._enemyWindow.selectForItem();
};

//335
Alias.ScBa_onEnemyOk = Scene_Battle.prototype.onEnemyOk;
Scene_Battle.prototype.onEnemyOk = function() {
    if (BattleManager.inputtingAction()) {
        BattleManager.actor().onMadeAction();
        Alias.ScBa_onEnemyOk.apply(this, arguments);
    }
};

//361
Alias.ScBa_onSkillOk = Scene_Battle.prototype.onSkillOk;
Scene_Battle.prototype.onSkillOk = function() {
    if (BattleManager.inputtingAction())
        Alias.ScBa_onSkillOk.apply(this, arguments);
};

//374
Alias.ScBa_onItemOk = Scene_Battle.prototype.onItemOk;
Scene_Battle.prototype.onItemOk = function() {
    if (BattleManager.inputtingAction())
        Alias.ScBa_onItemOk.apply(this, arguments);
};

//387
Scene_Battle.prototype.onSelectAction = function() {
    var action = BattleManager.inputtingAction();
    if (action) {
        //this._skillWindow.hide();
        //this._itemWindow.hide();
        if (action.isForOpponent()) {
            this.selectEnemySelection();
        } else {
            this.selectActorSelection();
        }
    }
};

//400
Alias.ScBa_endCommandSelection = Scene_Battle.prototype.endCommandSelection;
Scene_Battle.prototype.endCommandSelection = function() {
    this._actor = null;
    Alias.ScBa_endCommandSelection.apply(this, arguments);
    this._skillWindow.deactivate();
    this._skillWindow.hide();
    this._itemWindow.deactivate();
    this._itemWindow.hide();
    this._actorWindow.deactivate();
    this._actorWindow.hide();
    this._enemyWindow.deactivate();
    this._enemyWindow.hide();
};


})();


//=============================================================================
// UpdateDrawer
//=============================================================================

(function() {

if (!Window_Base.Mpp_UpdateDrawer) {

var Alias = {};

//-----------------------------------------------------------------------------
// Window_Base

//13
Alias.WiBa_initialize = Window_Base.prototype.initialize;
Window_Base.prototype.initialize = function(x, y, width, height) {
    Alias.WiBa_initialize.apply(this, arguments);
    this._updateDrawers = [];
};

//105
Alias.WiBa_update = Window_Base.prototype.update;
Window_Base.prototype.update = function() {
    Alias.WiBa_update.apply(this, arguments);
    this.updateDrawer();
};

Window_Base.prototype.updateDrawer = function() {
    if (this.isOpen() && this.visible && this._updateDrawers.length > 0) {
        this._updateDrawers = this._updateDrawers.filter(function(process) {
            return process();
        });
    }
};

Window_Base.prototype.addUpdateDrawer = function(process) {
    this._updateDrawers.push(process);
};

Window_Base.prototype.clearUpdateDrawer = function() {
    this._updateDrawers = [];
};

Window_Base.Mpp_UpdateDrawer = 1;
} //if (!Window_Base.Mpp_UpdateDrawer)


})();
