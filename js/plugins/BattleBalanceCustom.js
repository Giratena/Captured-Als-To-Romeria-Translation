//=============================================================================
// BattleBalanceCustom.js
//=============================================================================
// Copyright (c) 2015 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 【MPP ver.2.1】デフォルトで変更できない戦闘バランスを調整します。
 * @author 木星ペンギン
 * @help ●運の弱体への影響率
 *  運の弱体への影響率は加算ではなく乗算です。
 * 
 *  例えば、対象より運が10多ければ成功率が1%上がることになりますが、
 *  元の成功率が50%の場合
 *    50% + 1% = 51%
 *  になるのではなく
 *    50% * 101% = 50.5%
 *  となります。
 * 
 * 
 * ●能力値強化/弱体アイコンの開始位置
 *  アイコンの並び順は
 *    HP, MP, 攻撃力, 防御力, 魔法力, 魔法防御, 敏捷性, 運
 *  です。
 *  HPのアイコン番号が開始位置になります。
 * 
 *  デフォルトの能力値強化アイコンの開始位置は[32,40]となっていますが
 *  これは重ね掛け1回は32番、重ね掛け2回は40番が開始位置になるということです。
 * 
 * 
 * ●逃走確率
 *  逃走に失敗するごとに成功率が0.1上昇します。
 *  $gameParty.agility()  // 味方の敏捷性の平均値
 *  $gameTroop.agility()  // 敵の敏捷性の平均値
 * 
 * 
 * ●命中と回避
 *  ツクールのデフォルトでは、命中判定と回避判定が別々に行われています。
 *  そのため命中率が100%を超えていても、回避率が設定されている相手には
 *  その確率でミスします。
 *  
 *  命中率と回避率の差で判定したい場合は、
 *    [物理攻撃]の命中率を successRate * (a.hit - b.eva)
 *    [物理攻撃]の回避率を 0
 *  に変更してください。
 * 
 * 
 * ================================
 * ● Custom Formula
 *  計算式を直接変更できます。
 *  アイテムやスキルのダメージ計算と同じで、攻撃者を"a"、対象者を"b"、
 *  "v[n]"で変数n番の値を参照します。
 * 
 * ▽確率を設定する際の注意点
 *   ツクールでは成功判定を0以上1未満の乱数によって行っています。
 *   よって1.0で成功率100%となります。
 *   成功率50%であれば0.5、成功率80%なら0.8となるように設定してください。
 * 
 * ▽各メソッドの説明
 *   rand(n)   // 0 ～ n-1 の範囲内からランダムで値を取得します。
 *   floor(n)  // 数値 n の小数点以下を切り捨てます。
 * 
 * ▽能力値一覧
 *  "x"を"a"または"b"に置き換えてください。
 *  
 *   x.hp   // 現在のHP
 *   x.mp   // 現在のMP
 *   x.tp   // 現在のTP
 *   
 *  通常能力値
 *   x.mhp  // 最大HP
 *   x.mmp  // 最大MP
 *   x.atk  // 攻撃力
 *   x.def  // 防御力
 *   x.mat  // 魔法力
 *   x.mdf  // 魔法防御
 *   x.agi  // 敏捷性
 *   x.luk  // 運
 *   
 *  追加能力値 (100%は1.0になります)
 *   x.hit  // 命中率
 *   x.eva  // 回避率
 *   x.cri  // 会心率
 *   x.cev  // 会心回避率
 *   x.mev  // 魔法回避率
 *   x.mrf  // 魔法反射率
 *   x.cnt  // 反撃率
 *   x.hrg  // HP再生率
 *   x.mrg  // MP再生率
 *   x.trg  // TP再生率
 *   
 *  特殊能力値 (100%は1.0になります)
 *   x.tgr  // 狙われ率
 *   x.grd  // 防御効果率
 *   x.rec  // 回復効果率
 *   x.pha  // 薬の知識
 *   x.mcr  // MP消費率
 *   x.tcr  // TPチャージ率
 *   x.pdr  // 物理ダメージ率
 *   x.mdr  // 魔法ダメージ率
 *   x.fdr  // 床ダメージ率
 *   x.exr  // 経験獲得率
 *   
 * ================================
 * 制作 : 木星ペンギン
 * URL : http://woodpenguin.blog.fc2.com/
 * 
 * @param === Buff ===
 * 
 * @param Max Buff
 * @desc 能力値強化/弱体の重ね掛け上限
 * @default 2
 *
 * @param Buff Rate
 * @desc 能力値強化/弱体の重ね掛け１回ごとの影響率
 * 左から 最大HP,最大MP,攻撃力,防御力,魔法力,魔法防御,敏捷性,運
 * @default 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25
 *
 * @param Icon Buff Start
 * @desc 能力値強化アイコンの開始位置
 * 重ね掛け回数ごとの開始位置をカンマで区切って設定
 * @default 32,40
 *
 * @param Icon Debuff Start
 * @desc 能力値弱体アイコンの開始位置
 * 重ね掛け回数ごとの開始位置をカンマで区切って設定
 * @default 48,56
 *
 * @param === Custom Formula ===
 * 
 * @param Speed 
 * @desc 行動速度の計算式
 * "b"は使用不可。
 * @default a.agi + rand(floor(5 + a.agi / 4))
 * 
 * @param Certain Hit Rate
 * @desc 命中タイプが[必中]の場合の命中率
 * "item"でアイテム/スキル、"successRate"で成功率を参照。
 * @default successRate
 * 
 * @param Physical Hit Rate
 * @desc 命中タイプが[物理攻撃]の場合の命中率
 * "item"でアイテム/スキル、"successRate"で成功率を参照。
 * @default successRate * a.hit
 * 
 * @param Magical Hit Rate
 * @desc 命中タイプが[魔法攻撃]の場合の命中率
 * "item"でアイテム/スキル、"successRate"で成功率を参照。
 * @default successRate
 * 
 * @param Certain Eva Rate
 * @desc 命中タイプが[必中]の場合の回避率
 * @default 0
 * 
 * @param Physical Eva Rate
 * @desc 命中タイプが[物理攻撃]の場合の回避率
 * @default b.eva
 * 
 * @param Magical Eva Rate
 * @desc 命中タイプが[魔法攻撃]の場合の回避率
 * @default b.mev
 * 
 * @param Apply Critical
 * @desc クリティカルダメージの計算式
 * "damage"で元のダメージを参照。
 * @default damage * 3
 * 
 * @param Critical Rate
 * @desc クリティカル率の計算式
 * @default a.cri * (1 - b.cev)
 * 
 * @param Luk Effect Rate
 * @desc 運による弱体有効度
 * @default 1.0 + (a.luk - b.luk) * 0.001
 * 
 * @param Charge TP By Damage
 * @desc 被ダメージによる TP チャージ量
 * "damageRate"で受けたダメージ率(ダメージ量 / 最大HP)を参照。
 * @default floor(50 * damageRate * a.tcr)
 * 
 * @param Init TP
 * @desc 戦闘開始時のTP
 * "b"は使用不可。
 * @default rand(25)
 * 
 * @param Encounter Count
 * @desc エンカウント歩数
 * "step"でマップのエンカウント歩数を参照。"a","b"は使用不可。
 * @default rand(step) + rand(step) + 1
 * 
 * @param Escape Ratio
 * @desc 逃走確率
 * "a","b"は使用不可。
 * @default 0.5 * $gameParty.agility() / $gameTroop.agility()
 * 
 * 
 */

(function() {

var parameters = PluginManager.parameters('BattleBalanceCustom');
var Buff = {
    max:  Number(parameters['Max Buff'] || 2),
    rate:  (parameters['Buff Rate']).split(",").map(Number),
    iconBuffStart: (parameters['Icon Buff Start'] || '32,40').split(",").map(Number),
    iconDebuffStart: (parameters['Icon Debuff Start'] || '48,56').split(",").map(Number)
};
for (var i = 0; i < 8; i++) {
    if (Buff.rate[i] === undefined) Buff.rate[i] = 0.25;
}
var Advanced = {
    speed: parameters['Speed'] || '0',
    
    certainHitRate: parameters['Certain Hit Rate'] || '0',
    physicalHitRate: parameters['Physical Hit Rate'] || '0',
    magicalHitRate: parameters['Magical Hit Rate'] || '0',
    certainEvaRate: parameters['Certain Eva Rate'] || '0',
    physicalEvaRate: parameters['Physical Eva Rate'] || '0',
    magicalEvaRate: parameters['Magical Eva Rate'] || '0',
    
    applyCritical: parameters['Apply Critical'] || '0',
    lukEffectRate: parameters['Luk Effect Rate'] || '1',
    criticalRate: parameters['Critical Rate'] || '0',
    initTp: parameters['Init TP'] || '0',
    chargeTpByDamage: parameters['Charge TP By Damage'] || '0',
    encounterCount: parameters['Encounter Count'] || '1',
    escapeRatio: parameters['Escape Ratio'] || '0.5'
    
};

for (var key in Advanced) {
    Advanced[key] = Advanced[key].replace(/rand\(/g, 'Math.randomInt(');
    Advanced[key] = Advanced[key].replace(/floor\(/g, 'Math.floor(');
}

var Alias = {};

//-----------------------------------------------------------------------------
// BattleManager

//109
BattleManager.makeEscapeRatio = function() {
    var v = $gameVariables._data;
    this._escapeRatio = eval(Advanced.escapeRatio);
};

//-----------------------------------------------------------------------------
// Game_Action

//249
Game_Action.prototype.speed = function() {
    var a = this.subject();
    var v = $gameVariables._data;
    var speed = eval(Advanced.speed);
    if (this.item()) {
        speed += this.item().speed;
    }
    if (this.isAttack()) {
        speed += this.subject().attackSpeed();
    }
    return speed;
};

//442
Game_Action.prototype.itemHit = function(target) {
    var a = this.subject();
    var b = target;
    var v = $gameVariables._data;
    var item = this.item();
    var successRate = item.successRate * 0.01;
    if (this.isPhysical()) {
        return eval(Advanced.physicalHitRate);
    } else if (this.isMagical()) {
        return eval(Advanced.magicalHitRate);
    } else {
        return eval(Advanced.certainHitRate);
    }
};

//450
Game_Action.prototype.itemEva = function(target) {
    var a = this.subject();
    var b = target;
    var v = $gameVariables._data;
    if (this.isPhysical()) {
        return eval(Advanced.physicalEvaRate);
    } else if (this.isMagical()) {
        return eval(Advanced.magicalEvaRate);
    } else {
        return eval(Advanced.certainEvaRate);
    }
};

//460
Game_Action.prototype.itemCri = function(target) {
    if (this.item().damage.critical) {
        var a = this.subject();
        var b = target;
        var v = $gameVariables._data;
        return eval(Advanced.criticalRate);
    } else {
        return 0;
    }
};

//486
var criTarget;
Alias.GaAc_makeDamageValue = Game_Action.prototype.makeDamageValue
Game_Action.prototype.makeDamageValue = function(target, critical) {
    criTarget = target;
    return Alias.GaAc_makeDamageValue.call(this, target, critical);
};

//539
Game_Action.prototype.applyCritical = function(damage) {
    var a = this.subject();
    var b = criTarget;
    var v = $gameVariables._data;
    return eval(Advanced.applyCritical);
};

//776
Game_Action.prototype.lukEffectRate = function(target) {
    var a = this.subject();
    var b = target;
    var v = $gameVariables._data;
    return Math.max(eval(Advanced.lukEffectRate), 0.0);
};

//-----------------------------------------------------------------------------
// Game_BattlerBase

//197
Game_BattlerBase.prototype.isMaxBuffAffected = function(paramId) {
    return this._buffs[paramId] === Buff.max;
};

//201
Game_BattlerBase.prototype.isMaxDebuffAffected = function(paramId) {
    return this._buffs[paramId] === -Buff.max;
};

//271
Game_BattlerBase.prototype.buffIconIndex = function(buffLevel, paramId) {
    if (buffLevel > 0) {
        if (Buff.iconBuffStart[buffLevel - 1]) {
            return Buff.iconBuffStart[buffLevel - 1] + paramId;
        }
    } else if (buffLevel < 0) {
        if (Buff.iconDebuffStart[-buffLevel - 1]) {
            return Buff.iconDebuffStart[-buffLevel - 1] + paramId;
        }
    }
    return 0;
};

//362
Game_BattlerBase.prototype.paramBuffRate = function(paramId) {
    return this._buffs[paramId] * Buff.rate[paramId] + 1.0;
};

//-----------------------------------------------------------------------------
// Game_Battler

//374
Game_Battler.prototype.initTp = function() {
    var a = this;
    var v = $gameVariables._data;
    this.setTp(eval(Advanced.initTp));
};

//382
Game_Battler.prototype.chargeTpByDamage = function(damageRate) {
    var a = this;
    var v = $gameVariables._data;
    this.gainSilentTp(eval(Advanced.chargeTpByDamage));
};

//-----------------------------------------------------------------------------
// Game_Player

//179
Game_Player.prototype.makeEncounterCount = function() {
    var v = $gameVariables._data;
    var step = $gameMap.encounterStep();
    this._encounterCount = eval(Advanced.encounterCount);
};

})();
