//=============================================================================
// MPP_EquipStatusEX.js
//=============================================================================
// Copyright (c) 2018-2019 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 【ver.3.0】装備ステータスの拡張
 * @author 木星ペンギン
 *
 * @help 武器・防具のメモ:
 *   <mppEqSt:name1[,name2[,name3[,...]]]>   # 装備変更時に name を表示
 * 
 * ================================================================
 * ▼ 武器・防具のメモ 詳細
 * --------------------------------
 *  〇 <mppEqSt:name1[,name2[,name3[,...]]]>
 *   装備変更時のステータスウィンドウにオリジナルのパラメータ名を表示させます。
 *   
 *   例:
 *    <mppEqSt:炎半減,氷半減> と記述したアイテムを装備した場合、
 *    [炎半減]と[氷半減]が表示されます。
 *  
 *  
 * ================================================================
 * ▼プラグインパラメータ詳細
 * --------------------------------
 *  〇 Max Square (数値が増えるほどゲージの増加量を減らす)
 *   ステータスの値が低いほどゲージが伸び、高くなってくるとゲージの増加量が
 *   減るようになります。
 *   
 *   ゲームの後半でステータスが高くなるようなゲームだと、
 *   ステータスの低い序盤ではゲージの変化がわかりにくいため、
 *   その対策として用意した機能です。
 *   
 *   この設定は通常能力値のみに適用されます。
 *  
 * --------------------------------
 *  〇 Status (能力値)
 *   [通常ステータス] : 装備スロット選択中に表示されるステータス
 *   [固定ステータス] : 変更後のアイテムを選択中、常に表示されるステータス
 *   [装備ステータス] : 変更後のアイテムを選択中、
 *                      装備品に含まれる場合に表示されるステータス
 *   [変動ステータス] : 変更後のアイテムを選択中、
 *                      ステータスに変更がある場合に表示されるステータス
 *  
 *   設定する数値は以下の通りです。
 *  
 *     0:最大ＨＰ, 1:最大ＭＰ, 2:攻撃力, 3:防御力,
 *     4:魔法力,   5:魔法防御, 6:敏捷性, 7:運,
 *  
 *     8:命中率,      9:回避率,     10:会心率, 11:会心回避率,
 *    12:魔法回避率, 13:魔法反射率, 14:反撃率, 15:ＨＰ再生率,
 *    16:ＭＰ再生率, 17:ＴＰ再生率,
 *  
 *    18:狙われ率,   19:防御効果率,     20:回復効果率,   21:薬の知識,
 *    22:ＭＰ消費率, 23:ＴＰチャージ率, 24:物理ダメージ, 25:魔法ダメージ,
 *    26:床ダメージ, 27:経験獲得率
 * 
 * --------------------------------
 *  〇 Rate (耐性)
 *   Reverse?(反転表示)を有効にした場合、表示される数値が
 *     (1 - 有効度)*100
 *   となります。
 *   (例：有効度80%の場合は20、有効度30%の場合は70)
 *   これは[有効度]ではなく[耐性値]として表示するための機能です。
 *  
 *   表示タイプにて表示する条件を指定します。
 *    0 : 非表示
 *    1 : [固定ステータス]として表示
 *    2 : [装備ステータス]として表示
 *    3 : [変動ステータス]として表示
 *    4 : [装備ステータス]または[変動ステータス]として表示
 * 
 * --------------------------------
 *  〇 プラグインパラメータの配列
 *   数値を配列で設定する際、
 *   n-m と表記することでnからmまでの数値を指定できます。
 *   (例 : 1-4,8,10-12 => 1,2,3,4,8,10,11,12)
 * 
 * --------------------------------
 *  〇 Equip Metadata
 *   プラグインコマンド名を変更できます。
 *   コマンドを短くしたり日本語化等が可能です。
 * 
 * ================================
 * 制作 : 木星ペンギン
 * URL : http://woodpenguin.blog.fc2.com/
 *
 * @param === Base ===
 * 
 * @param Status Window Row
 * @type number
 * @min 1
 * @desc ステータスウィンドウの行数
 * @default 7
 * @parent === Base ===
 * 
 * @param Gauge Height
 * @type number
 * @min 1
 * @desc ゲージの高さ
 * @default 8
 * @parent === Base ===
 * 
 * @param Gauge Color
 * @desc 現在値のゲージの色
 * @default 232,255,255
 * @parent === Base ===
 * 
 * @param Gauge Type
 * @type number
 * @max 2
 * @desc ゲージタイプ
 * (0:通常, 1:丸み, 2:2ライン)
 * @default 0
 * @parent === Base ===
 * 
 * @param Gauge Slope
 * @type number
 * @min -1
 * @max 1
 * @decimals 1
 * @desc ゲージの傾き
 * (-1.0～1.0で指定)
 * @default -0.5
 * @parent === Base ===
 * 
 * 
 * @param === Gauge Max ===
 * 
 * @param param Gauge Max
 * @type struct<ParamGaugeMax>
 * @desc 通常能力値ゲージの最大値
 * @default {"mhp":"10000","mmp":"2000","atk":"200","def":"200","mat":"200","mdf":"200","agi":"400","luk":"400"}
 * @parent === Gauge Max ===
 * 
 * @param Max Square
 * @type boolean
 * @desc 数値が増えるほどゲージの増加量を減らす
 * @default false
 * @parent param Gauge Max
 * 
 * @param xparam Gauge Max
 * @type number
 * @min 1
 * @decimals 2
 * @desc 追加能力値ゲージの最大値
 * @default 2.50
 * @parent === Gauge Max ===
 * 
 * @param sparam Gauge Max
 * @type number
 * @min 1
 * @decimals 2
 * @desc 特殊能力値ゲージの最大値
 * @default 2.50
 * @parent === Gauge Max ===
 * 
 * @param rate Gauge Max
 * @type number
 * @min 1
 * @decimals 2
 * @desc 有効度ゲージの最大値
 * @default 2.50
 * @parent === Gauge Max ===
 * 
 * 
 * @param === Status ===
 * 
 * @param Default Status
 * @desc 装備スロット選択中に表示されるステータス
 * @default 2-7
 * @parent === Status ===
 * 
 * @param Fixing Status
 * @desc 変更後のアイテムを選択中、常に表示されるステータス
 * @default 
 * @parent === Status ===
 * 
 * @param Item Status
 * @desc 変更後のアイテムを選択中、装備品に含まれる場合に表示されるステータス
 * @default 0-27
 * @parent === Status ===
 * 
 * @param Flow Status
 * @desc 変更後のアイテムを選択中、ステータスに変更がある場合に表示されるステータス
 * @default 0-27
 * @parent === Status ===
 * 
 * 
 * @param === Trait ===
 * 
 * @param Element Rate Params
 * @type struct<Rate>
 * @desc 属性有効度
 * @default {"Draw Ids":"1-9","Reverse?":"true","View Type":"4"}
 * @parent === Trait ===
 * 
 * @param Debuff Rate Params
 * @type struct<DebuffRate>
 * @desc 弱体有効度
 * @default {"Draw Params":"0-7","Reverse?":"true","View Type":"4"}
 * @parent === Trait ===
 * 
 * @param State Rate Params
 * @type struct<Rate>
 * @desc ステート有効度
 * @default {"Draw Ids":"1-13","Reverse?":"true","View Type":"4"}
 * @parent === Trait ===
 * 
 * @param State Resist Params
 * @type struct<StateResist>
 * @desc ステート無効化
 * @default {"Draw Ids":"1-13","View Type":"3"}
 * @parent === Trait ===
 * 
 * @param Original Trait Type
 * @type number
 * @max 4
 * @desc オリジナルパラメータの表示タイプ
 * (0:非表示, 1:固定, 2:装備, 3:変動, 4:装備or変動)
 * @default 4
 * @parent === Trait ===
 * 
 * 
 * @param === Terms ===
 * 
 * @param xparams
 * @type struct<xparams>
 * @desc 用語[追加能力値]
 * @default {"hit":"命中率","eva":"回避率","cri":"会心率","cev":"会心回避率","mev":"魔法回避率","mrf":"魔法反射率","cnt":"反撃率","hrg":"ＨＰ再生率","mrg":"ＭＰ再生率","trg":"ＴＰ再生率"}
 * @parent === Terms ===
 * 
 * @param sparams
 * @type struct<sparams>
 * @desc 用語[特殊能力値]
 * @default {"tgr":"狙われ率","grd":"防御効果率","rev":"回復効果率","pha":"薬の知識","mcr":"ＭＰ消費率","tcr":"ＴＰチャージ率","pdr":"物理ダメージ率","mdr":"魔法ダメージ率","fdr":"床ダメージ率","exr":"経験獲得率"}
 * @parent === Terms ===
 * 
 * @param Element Rate
 * @desc 用語[属性有効度]
 * (%1が属性名となります)
 * @default %1耐性
 * @parent === Terms ===
 * 
 * @param Debuff Rate
 * @desc 用語[弱体有効度]
 * (%1が能力値名となります)
 * @default %1ダウン耐性
 * @parent === Terms ===
 * 
 * @param State Rate
 * @desc 用語[ステート有効度]
 * (%1がステート名となります)
 * @default %1耐性
 * @parent === Terms ===
 * 
 * @param State Resist
 * @desc 用語[ステート無効化]
 * (%1がステート名となります)
 * @default %1無効化
 * @parent === Terms ===
 * 
 * 
 * @param === Command ===
 * 
 * @param Equip Metadata
 * @type struct<EquipMetadata>
 * @desc 武器・防具のメモ欄のコマンド名
 * @default {"mppEqSt":"mppEqSt"}
 * @parent === Command ===
 * 
 * 
 */

/*~struct~ParamGaugeMax:
 * @param mhp
 * @type number
 * @min 1
 * @desc 最大ＨＰ
 * @default 10000
 *
 * @param mmp
 * @type number
 * @min 1
 * @desc 最大ＭＰ
 * @default 2000
 * 
 * @param atk
 * @type number
 * @desc 攻撃力
 * @default 200
 * 
 * @param def
 * @type number
 * @min 1
 * @desc 防御力
 * @default 200
 * 
 * @param mat
 * @type number
 * @min 1
 * @desc 魔法力
 * @default 200
 * 
 * @param mdf
 * @type number
 * @min 1
 * @desc 魔法防御
 * @default 200
 *
 * @param agi
 * @type number
 * @min 1
 * @desc 敏捷性
 * @default 400
 * 
 * @param luk
 * @type number
 * @min 1
 * @desc 運
 * @default 400
 *
 */

/*~struct~Rate:
 * @param Draw Ids
 * @desc 表示するIDの配列
 * @default 1-9
 *
 * @param Reverse?
 * @type boolean
 * @desc 反転表示
 * @default true
 * 
 * @param View Type
 * @type number
 * @max 4
 * @desc 表示タイプ
 * (0:非表示, 1:固定, 2:装備, 3:変動, 4:装備or変動)
 * @default 4
 *
 */

/*~struct~DebuffRate:
 * @param Draw Params
 * @desc 表示する能力値の配列
 * @default 0-7
 *
 * @param Reverse?
 * @type boolean
 * @desc 反転表示
 * @default true
 * 
 * @param View Type
 * @type number
 * @max 4
 * @desc 表示タイプ
 * (0:非表示, 1:固定, 2:装備, 3:変動, 4:装備or変動)
 * @default 4
 *
 */

/*~struct~StateResist:
 * @param Draw Ids
 * @desc 表示するステートIDの配列
 * @default 1-13
 *
 * @param View Type
 * @type number
 * @max 4
 * @desc 表示タイプ
 * (0:非表示, 1:固定, 2:装備, 3:変動, 4:装備or変動)
 * @default 4
 *
 */

/*~struct~xparams:
 * @param hit
 * @desc 命中率
 * @default 命中率
 *
 * @param eva
 * @desc 回避率
 * @default 回避率
 * 
 * @param cri
 * @desc 会心率
 * @default 会心率
 * 
 * @param cev
 * @desc 会心回避率
 * @default 会心回避率
 * 
 * @param mev
 * @desc 魔法回避率
 * @default 魔法回避率
 * 
 * @param mrf
 * @desc 魔法反射率
 * @default 魔法反射率
 *
 * @param cnt
 * @desc 反撃率
 * @default 反撃率
 * 
 * @param hrg
 * @desc ＨＰ再生率
 * @default ＨＰ再生率
 *
 * @param mrg
 * @desc ＭＰ再生率
 * @default ＭＰ再生率
 *
 * @param trg
 * @desc ＴＰ再生率
 * @default ＴＰ再生率
 *
 */

/*~struct~sparams:
 * @param tgr
 * @desc 狙われ率
 * @default 狙われ率
 *
 * @param grd
 * @desc 防御効果率
 * @default 防御効果率
 * 
 * @param rev
 * @desc 回復効果率
 * @default 回復効果率
 * 
 * @param pha
 * @desc 薬の知識
 * @default 薬の知識
 * 
 * @param mcr
 * @desc ＭＰ消費率
 * @default ＭＰ消費率
 * 
 * @param tcr
 * @desc ＴＰチャージ率
 * @default ＴＰチャージ率
 * 
 * @param pdr
 * @desc 物理ダメージ率
 * @default 物理ダメージ率
 *
 * @param mdr
 * @desc 魔法ダメージ率
 * @default 魔法ダメージ率
 * 
 * @param fdr
 * @desc 床ダメージ率
 * @default 床ダメージ率
 *
 * @param exr
 * @desc 経験獲得率
 * @default 経験獲得率
 *
 */

/*~struct~EquipMetadata:
 * @param mppEqSt
 * @desc 装備変更時に name を表示
 * @default mppEqSt
 * 
 */

(function() {

const MPPlugin = {};

{
    
    let parameters = PluginManager.parameters('MPP_EquipStatusEX');

    let convertParam = function(param) {
        let result = [];
        if (param) {
            let data = param.split(',');
            for (let i = 0; i < data.length; i++) {
                if (/(\d+)\s*-\s*(\d+)/.test(data[i])) {
                    for (let n = Number(RegExp.$1); n <= Number(RegExp.$2); n++) {
                        result.push(n);
                    }
                } else {
                    result.push(Number(data[i]));
                }
            }
        }
        return result;
    };

    MPPlugin.statusWindowRow = Number(parameters['Status Window Row'] || 7);
    MPPlugin.gaugeHeight = Number(parameters['Gauge Height'] || 8);
    MPPlugin.GaugeColor = 'rgb(%1)'.format(parameters['Gauge Color'] || '224,255,255');
    MPPlugin.GaugeType = Number(parameters['Gauge Type'] || 0);
    MPPlugin.GaugeSlope = Number(parameters['Gauge Slope'] || 0.5);

    // Gauge Max
    let param = JSON.parse(parameters['param Gauge Max'] || "{}");
    MPPlugin.paramGaugeMax = [];
    MPPlugin.paramGaugeMax[0] = Number(param.mhp);
    MPPlugin.paramGaugeMax[1] = Number(param.mmp);
    MPPlugin.paramGaugeMax[2] = Number(param.atk);
    MPPlugin.paramGaugeMax[3] = Number(param.def);
    MPPlugin.paramGaugeMax[4] = Number(param.mat);
    MPPlugin.paramGaugeMax[5] = Number(param.mdf);
    MPPlugin.paramGaugeMax[6] = Number(param.agi);
    MPPlugin.paramGaugeMax[7] = Number(param.luk);
    MPPlugin.MaxSquare = !!eval(parameters['Max Square']);
    MPPlugin.xparamGaugeMax = Number(parameters['xparam Gauge Max'] || 2.0);
    MPPlugin.sparamGaugeMax = Number(parameters['sparam Gauge Max'] || 2.0);
    MPPlugin.rateGaugeMax = Number(parameters['rate Gauge Max'] || 2.0);

    // Status
    MPPlugin.defaultStatus = convertParam(parameters['Default Status']);
    MPPlugin.fixingStatus = convertParam(parameters['Fixing Status']);
    MPPlugin.itemStatus = convertParam(parameters['Item Status']);
    MPPlugin.flowStatus = convertParam(parameters['Flow Status']);

    // Rate
    param = JSON.parse(parameters['Element Rate Params'] || "{}");
    MPPlugin.ElementRate = {
        DrawIds:  convertParam(param["Draw Ids"]),
        Reverse:  !!eval(param["Reverse?"]),
        ViewType: Number(param["View Type"])
    };
    param = JSON.parse(parameters['Debuff Rate Params'] || "{}");
    MPPlugin.DebuffRate = {
        DrawParams: convertParam(param["Draw Params"]),
        Reverse:  !!eval(param["Reverse?"]),
        ViewType: Number(param["View Type"])
    };
    param = JSON.parse(parameters['State Rate Params'] || "{}");
    MPPlugin.StateRate = {
        DrawIds:  convertParam(param["Draw Ids"]),
        Reverse:  !!eval(param["Reverse?"]),
        ViewType: Number(param["View Type"])
    };
    param = JSON.parse(parameters['State Resist Params'] || "{}");
    MPPlugin.StateResist = {
        DrawIds:  convertParam(param["Draw Ids"]),
        ViewType: Number(param["View Type"])
    };
    MPPlugin.OriginalTraitType = Number(parameters['Original Trait Type'] || 4);
    
    // Terms
    MPPlugin.terms = {};
    param = JSON.parse(parameters['xparams'] || "{}");
    MPPlugin.terms[8]  = param.hit;
    MPPlugin.terms[9]  = param.eva;
    MPPlugin.terms[10] = param.cri;
    MPPlugin.terms[11] = param.cev;
    MPPlugin.terms[12] = param.mev;
    MPPlugin.terms[13] = param.mrf;
    MPPlugin.terms[14] = param.cnt;
    MPPlugin.terms[15] = param.hrg;
    MPPlugin.terms[16] = param.mrg;
    MPPlugin.terms[17] = param.trg;
    param = JSON.parse(parameters['sparams'] || "{}");
    MPPlugin.terms[18] = param.tgr;
    MPPlugin.terms[19] = param.grd;
    MPPlugin.terms[20] = param.rec;
    MPPlugin.terms[21] = param.pha;
    MPPlugin.terms[22] = param.mcr;
    MPPlugin.terms[23] = param.tcr;
    MPPlugin.terms[24] = param.pdr;
    MPPlugin.terms[25] = param.mdr;
    MPPlugin.terms[26] = param.fdr;
    MPPlugin.terms[27] = param.exr;
    MPPlugin.terms.elementRate = parameters['Element Rate'] || '';
    MPPlugin.terms.debuffRate = parameters['Debuff Rate'] || '';
    MPPlugin.terms.stateRate = parameters['State Rate'] || '';
    MPPlugin.terms.stateResist = parameters['State Resist'] || '';
    
    MPPlugin.downStrongParams = [22,24,25,26];
    
    // Command
    MPPlugin.EquipMetadata = JSON.parse(parameters['Equip Metadata'] || "{}");

}

const Alias = {};

//-----------------------------------------------------------------------------
// Game_BattlerBase

Game_BattlerBase.prototype.allMetadata = function(name) {
    return this.traitObjects().map( obj => obj.meta[name] ).filter(Boolean);
};

Game_BattlerBase.prototype.allOriginalTraits_mpp = function() {
    var result = [];
    var name = MPPlugin.EquipMetadata.mppEqSt || "mppEqSt";
    var data = this.allMetadata(name);
    for (var i = 0; i < data.length; i++) {
        var params = data[i].split(',').filter( t => !result.contains(t) );
        result = result.concat(params);
    }
    return result;
};

//-----------------------------------------------------------------------------
// Window_EquipItem

//57
Alias.WiEqIt_updateHelp = Window_EquipItem.prototype.updateHelp;
Window_EquipItem.prototype.updateHelp = function() {
    if (this._actor && this._statusWindow) {
        this._statusWindow.setNewItem(this.item());
    }
    Alias.WiEqIt_updateHelp.apply(this, arguments);
};

//-----------------------------------------------------------------------------
// Window_EquipStatus

//13
Alias.WiEqSt_initialize = Window_EquipStatus.prototype.initialize;
Window_EquipStatus.prototype.initialize = function(x, y) {
    this._createDrawer = false;
    this._mppEqStGaugeCount = 0;
    Alias.WiEqSt_initialize.apply(this, arguments);
};

//30
Window_EquipStatus.prototype.numVisibleRows = function() {
    return MPPlugin.statusWindowRow;
};

Window_EquipStatus.prototype.setNewItem = function(item) {
    this._item = item;
};

//
if (Window_EquipStatus.prototype.hasOwnProperty('update')) {
    Alias.WiEqSt_update = Window_EquipStatus.prototype.update
}
Window_EquipStatus.prototype.update = function() {
    if (this._mppEqStGaugeCount > 0) this._mppEqStGaugeCount--;
    var _super = Alias.WiEqSt_update || Window_Base.prototype.update;
    _super.apply(this, arguments);
};

//41
Window_EquipStatus.prototype.refresh = function() {
    this.clearUpdateDrawer();
    this.contents.clear();
    if (this._actor) {
        this._createDrawer = true;
        this._mppEqStGaugeCount = 30;
        this.drawActorName(this._actor, this.textPadding(), 0);
        var height = this.lineHeight();
        var maxRow = Math.floor((this.contentsHeight() - height) / height);
        this.drawParameters(0, height, maxRow);
        this._createDrawer = false;
    }
};

Window_EquipStatus.prototype.drawParameters = function(x, y, maxRow) {
    var list = this.makeStatusList(maxRow);
    var height = this.lineHeight();
    for (var i = 0; i < list.length; i++) {
        this.drawItem(x, y + i * height, list[i]);
    }
};

Window_EquipStatus.prototype.makeStatusList = function(maxRow) {
    if (this._tempActor) {
        //EquipParams
        var list = this.createEquipParamsList(maxRow);
        
        //ElementRate
        if (maxRow > list.length) 
            list = list.concat(this.createElementRateList(maxRow - list.length));
        
        //DebuffRate
        if (maxRow > list.length) 
            list = list.concat(this.createDebuffRateList(maxRow - list.length));
        
        //StateRate
        if (maxRow > list.length) 
            list = list.concat(this.createStateRateList(maxRow - list.length));
        
        //StateResist
        if (maxRow > list.length) 
            list = list.concat(this.createStateResistList(maxRow - list.length));
        
        //OriginalTrait
        if (maxRow > list.length) 
            list = list.concat(this.createOriginalTraitList(maxRow - list.length));
        
        return list;
    } else {
        return this.createDefaultParamsList(maxRow);
    }
};

Window_EquipStatus.prototype.convertList = function(list, type) {
    return list.map( id => ({ type:type, value:id }) );
};

Window_EquipStatus.prototype.createEquipParamsList = function(maxRow) {
    var list = [];
    
    //FixingStatus
    var status = this.getFixingStatus().slice(0, maxRow);
    list = list.concat(status);
    
    //ItemStatus
    if (maxRow > list.length) {
        status = this.getItemStatus();
        status = status.filter( id => !list.contains(id) && this.includeParam(id) );
        status = status.slice(0, maxRow - list.length);
        list = list.concat(status);
    }

    //FlowStatus
    if (maxRow > list.length) {
        status = this.getFlowStatus();
        status = status.filter( id => !list.contains(id) && this.isChangedParam(id) );
        status = status.slice(0, maxRow - list.length);
        list = list.concat(status);
    }
    
    list.sort( (a, b) => a - b );
    return this.convertList(list, "param");
};

Window_EquipStatus.prototype.isChangedParam = function(paramId) {
    return this.getActorParam(this._actor, paramId) !==
            this.getActorParam(this._tempActor, paramId);
};

Window_EquipStatus.prototype.isChangedRate = function(method, id) {
    return this._actor[method](id) !== this._tempActor[method](id);
};

Window_EquipStatus.prototype.createElementRateList = function(maxRow) {
    var type = this.getElementRateType();
    if (MPPlugin.terms.elementRate && type > 0) {
        var code = Game_BattlerBase.TRAIT_ELEMENT_RATE;
        var elements = MPPlugin.ElementRate.DrawIds;
        elements = elements.filter( id => this.includeRate(type, code, "elementRate", id) );
        elements = elements.slice(0, maxRow);
        return this.convertList(elements, "elementRate");
    } else {
        return [];
    }
};

Window_EquipStatus.prototype.createDebuffRateList = function(maxRow) {
    var type = this.getDebuffRateType();
    if (MPPlugin.terms.debuffRate && type > 0) {
        var code = Game_BattlerBase.TRAIT_DEBUFF_RATE;
        var debuffs = MPPlugin.DebuffRate.DrawParams;
        debuffs = debuffs.filter( id => this.includeRate(type, code, "debuffRate", id) );
        debuffs = debuffs.slice(0, maxRow);
        return this.convertList(debuffs, "debuffRate");
    } else {
        return [];
    }
};

Window_EquipStatus.prototype.createStateRateList = function(maxRow) {
    var type = this.getStateRateType();
    if (MPPlugin.terms.stateRate && type > 0) {
        var code = Game_BattlerBase.TRAIT_STATE_RATE;
        var states = MPPlugin.StateRate.DrawIds;
        states = states.filter( id => this.includeRate(type, code, "stateRate", id) );
        states = states.slice(0, maxRow);
        return this.convertList(states, "stateRate");
    } else {
        return [];
    }
};

Window_EquipStatus.prototype.createStateResistList = function(maxRow) {
    var type = this.getStateResistType();
    if (MPPlugin.terms.stateResist && type > 0) {
        var code = Game_BattlerBase.TRAIT_STATE_RESIST;
        var states = MPPlugin.StateResist.DrawIds;
        states = states.filter( id => this.includeRate(type, code, "isStateResist", id) );
        states = states.slice(0, maxRow);
        return this.convertList(states, "stateResist");
    } else {
        return [];
    }
};

Window_EquipStatus.prototype.createOriginalTraitList = function(maxRow) {
    var list = [];
    var type = this.getOriginalTraitType();
    if (type === 2 || type === 4) {
        if (this._item && this._item.meta.mppEqSt) {
            list = list.concat(this._item.meta.mppEqSt.split(','));
        }
    }
    if (maxRow > list.length && (type === 3 || type === 4)) {
        var curTraits = this._actor.allOriginalTraits_mpp();
        var newTraits = this._tempActor.allOriginalTraits_mpp();
        list = list.concat( curTraits.filter( t =>
                            !list.contains(t) && !newTraits.contains(t)) );
        list = list.concat( newTraits.filter( t =>
                            !list.contains(t) && !curTraits.contains(t)) );
    }
    if (maxRow < list.length) list.length = maxRow;
    return this.convertList(list, "original");
};

Window_EquipStatus.prototype.createDefaultParamsList = function(maxRow) {
    var list = this.getDefaultStatus().slice(0, maxRow);
    return this.convertList(list, "param");
};

//58
Window_EquipStatus.prototype.drawItem = function(x, y, data) {
    switch (data.type) {
        case "param":
            this.drawParam(x, y, data.value);
            break;
        case "elementRate":
            this.drawElement(x, y, data.value);
            break;
        case "debuffRate":
            this.drawDebuff(x, y, data.value);
            break;
        case "stateRate":
            this.drawState(x, y, data.value);
            break;
        case "stateResist":
            this.drawResist(x, y, data.value);
            return;
        case "original":
            this.drawOriginal(x, y, data.value);
            return;
    }
    
    if (this._createDrawer && this._tempActor) {
        this.createItemDrawer(x, y, data);
    }
};

Window_EquipStatus.prototype.createItemDrawer = function(x, y, data) {
    var width = this.contentsWidth();
    this.addUpdateDrawer(() => {
        var count = this._mppEqStGaugeCount;
        if (count <= 22 && count % 2 === 0) {
            this.contents.clearRect(x, y, width, this.lineHeight());
            this.drawItem(x, y, data);
        }
        return count > 0;
    });
};

Window_EquipStatus.prototype.getDefaultStatus = function() {
    return MPPlugin.defaultStatus;
};
Window_EquipStatus.prototype.getFixingStatus = function() {
    return MPPlugin.fixingStatus;
};
Window_EquipStatus.prototype.getItemStatus = function() {
    return MPPlugin.itemStatus;
};
Window_EquipStatus.prototype.getFlowStatus = function() {
    return MPPlugin.flowStatus;
};
Window_EquipStatus.prototype.getElementRateType = function() {
    return MPPlugin.ElementRate.ViewType;
};
Window_EquipStatus.prototype.getDebuffRateType = function() {
    return MPPlugin.DebuffRate.ViewType;
};
Window_EquipStatus.prototype.getStateRateType = function() {
    return MPPlugin.StateRate.ViewType;
};
Window_EquipStatus.prototype.getStateResistType = function() {
    return MPPlugin.StateResist.ViewType;
};
Window_EquipStatus.prototype.getOriginalTraitType = function() {
    return MPPlugin.OriginalTraitType;
};

Window_EquipStatus.prototype.drawParamGauge = function(x, y, width, curValue, newValue, max, reverse) {
    var count = Math.min(this._mppEqStGaugeCount, 24);
    var curWidth = width * curValue / max;
    var value = newValue - (newValue - curValue) * Math.pow(count, 2) / Math.pow(24, 2);
    var newWidth = width * value / max;
    
    var color = MPPlugin.GaugeColor;
    if (curValue !== newValue) {
        var diffvalue = (newValue - curValue) * (reverse ? -1 : 1);
        color = this.paramchangeTextColor(diffvalue);
    }
    
    switch (MPPlugin.GaugeType) {
        case 0: // flat
            this.drawFlatGauge(x, y, curWidth, newWidth, color);
            break;
        case 1: // arch
            this.drawArcGauge(x, y, curWidth, newWidth, color);
            break;
        case 2: // 2line
            this.draw2LineGauge(x, y, curWidth, newWidth, color);
            break;
    }
};

Window_EquipStatus.prototype.drawFlatGauge = function(x, y, curWidth, newWidth, color) {
    var gh = MPPlugin.gaugeHeight;
    var gy = y + this.lineHeight() - 3 - gh;
    
    var curW = curWidth;
    var newX = 0;
    var newW = newWidth;
    
    if (curWidth >= 0) {
        if (newWidth >= curWidth) {
            newX = curWidth;
        } else if (newWidth >= 0) {
            newX = newWidth;
            newW = curWidth;
            curW = newWidth;
        } else {
            newX = curWidth;
            curW = 0;
        }
    } else {
        if (newWidth <= curWidth) {
            newX = curWidth;
        } else if (newWidth <= 0) {
            newX = newWidth;
            newW = curWidth;
            curW = newWidth;
        } else {
            newX = curWidth;
            curW = 0;
        }
    }
    
    var context = this.contents.context;
    context.save();
    context.setTransform(1, 0, MPPlugin.GaugeSlope, 1, x, gy);
    
    var sx = Math.min(curWidth, newWidth, 0);
    var sw = Math.max(curWidth, newWidth, 0) - sx;
    this.drawFlatShadow(sx, 0, sw);
    
    if (curWidth !== newWidth) {
        if (curWidth > newWidth)
            this.contents.paintOpacity = 192;
        this.drawFlatLine(newX, 0, newW - newX, color);
        this.contents.paintOpacity = 255;
    }
    this.drawFlatLine(0, 0, curW, MPPlugin.GaugeColor);
    
    context.restore();
};

Window_EquipStatus.prototype.drawFlatLine = function(x, y, width, color) {
    var gh = MPPlugin.gaugeHeight;
    var context = this.contents.context;
    //context.save();
    //context.setTransform(1, 0, MPPlugin.GaugeSlope, 1, x, y);
    
    var gradient = context.createLinearGradient(x, y + 2, x, y + gh * 2);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'black');
    
    context.lineWidth = gh;

    context.beginPath();
    context.moveTo(x, y + gh / 2);
    context.lineTo(x + width, y + gh / 2);
    context.strokeStyle = gradient;
    context.stroke();
    
    //context.restore();
};

Window_EquipStatus.prototype.drawFlatShadow = function(x, y, width) {
    var context = this.contents.context;
    context.shadowColor = 'black';
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowBlur = 1;
    this.drawFlatLine(x, y, width, 'black');
    context.shadowColor = 'transparent';
};

Window_EquipStatus.prototype.drawArcGauge = function(x, y, curWidth, newWidth, color) {
    var gh = MPPlugin.gaugeHeight;
    var gy = y + this.lineHeight() - 3 - gh;
    
    var curW = curWidth;
    var newX = 0;
    var newW = newWidth;
    
    if (curWidth >= 0) {
        if (newWidth >= curWidth) {
            newX = Math.max(curWidth - gh, 0);
        } else if (newWidth >= 0) {
            newX = Math.max(newWidth - gh, 0);
            newW = curWidth;
            curW = newWidth;
        } else {
            newX = curWidth;
            curW = 0;
        }
    } else {
        if (newWidth <= curWidth) {
            newX = Math.min(curWidth + gh, 0);
        } else if (newWidth <= 0) {
            newX = Math.min(newWidth + gh, 0);
            newW = curWidth;
            curW = newWidth;
        } else {
            newX = curWidth;
            curW = 0;
        }
    }
    
    var context = this.contents.context;
    context.save();
    context.setTransform(1, 0, MPPlugin.GaugeSlope, 1, x, gy);
    
    var sx = Math.min(curWidth, newWidth, 0);
    var sw = Math.max(curWidth, newWidth, 0) - sx;
    this.drawArcShadow(sx, 0, sw);
    
    if (curWidth !== newWidth) {
        if (curWidth > newWidth)
            this.contents.paintOpacity = 160;
        this.drawArcLine(newX, 0, newW - newX, color);
        this.contents.paintOpacity = 255;
    }
    this.drawArcLine(0, 0, curW, MPPlugin.GaugeColor);
    
    context.restore();
};

Window_EquipStatus.prototype.drawArcLine = function(x, y, width, color) {
    var minX = Math.min(x, x + width);
    var maxX = Math.max(x, x + width);
    var h = MPPlugin.gaugeHeight;
    var gy = y + h / 2;
    var context = this.contents.context;
    //context.save();
    //context.setTransform(1, 0, MPPlugin.GaugeSlope, 1, x, y);
    
    var gradient = context.createLinearGradient(x, y + 2, x, y + h * 2);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'black');
    
    if (maxX - minX < h) {
        var r = h / 2;
        var angle = Math.acos((r - (maxX - minX)/2) / r);
        context.beginPath();
        context.arc(minX + r, gy, r, Math.PI-angle, Math.PI+angle);
        context.arc(maxX - r, gy, r, -angle, angle);
        context.fillStyle = gradient;
        context.fill();
    } else {
        context.lineWidth = h;
        context.lineCap = 'round';
        
        context.beginPath();
        context.moveTo(minX + h / 2, gy);
        context.lineTo(maxX - h / 2, gy);
        context.strokeStyle = gradient;
        context.stroke();
    }
    
    //context.restore();
};

Window_EquipStatus.prototype.drawArcShadow = function(x, y, width) {
    var context = this.contents.context;
    context.shadowColor = 'black';
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowBlur = 1;
    this.drawArcLine(x, y, width, 'black');
    context.shadowColor = 'transparent';
};

Window_EquipStatus.prototype.draw2LineGauge = function(x, y, curWidth, newWidth, color) {
    var gh = MPPlugin.gaugeHeight;
    var gy = y + this.lineHeight() - 3 - gh;
    
    var context = this.contents.context;
    context.save();
    context.setTransform(1, 0, MPPlugin.GaugeSlope, 1, x, gy);
    
    context.shadowColor = 'black';
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowBlur = 1;
    
    if (color === MPPlugin.GaugeColor) {
        this.drawFlatLine(0, 0, curWidth, MPPlugin.GaugeColor);
    } else {
        this.drawFlatLine(0, -gh, curWidth, MPPlugin.GaugeColor);
        this.drawFlatLine(0, 0, newWidth, color);
    }
    
    context.restore();
};

Window_EquipStatus.prototype.drawParam = function(x, y, paramId) {
    var curValue = this.getActorParam(this._actor, paramId);
    var newValue = this._tempActor ? this.getActorParam(this._tempActor, paramId) : curValue;
    var max = this.getParamMax(paramId);
    if (MPPlugin.MaxSquare && paramId < 8) {
        curValue = Math.sqrt(curValue);
        newValue = Math.sqrt(newValue);
        max = Math.sqrt(max);
    }
    var reverse = MPPlugin.downStrongParams.contains(paramId);
    this.drawParamGauge(x + 140, y, 130, curValue, newValue, max, reverse);
    this.drawParamName(x + this.textPadding(), y, paramId);
    if (this._actor) {
        this.drawCurrentParam(x + 140, y, paramId);
    }
    if (this._tempActor) {
        this.drawRightArrow(x + 188, y);
        this.drawNewParam(x + 222, y, paramId, reverse);
    }
};

//69
Alias.WiEqSt_drawParamName = Window_EquipStatus.prototype.drawParamName;
Window_EquipStatus.prototype.drawParamName = function(x, y, paramId) {
    if (paramId < 8) {
        Alias.WiEqSt_drawParamName.apply(this, arguments);
    } else {
        this.changeTextColor(this.systemColor());
        this.drawText(MPPlugin.terms[paramId], x, y, 120);
    }
};

//74
Alias.WiEqSt_drawCurrentParam = Window_EquipStatus.prototype.drawCurrentParam;
Window_EquipStatus.prototype.drawCurrentParam = function(x, y, paramId) {
    if (paramId < 8) {
        Alias.WiEqSt_drawCurrentParam.apply(this, arguments);
    } else {
        this.resetTextColor();
        var param = Math.round(this.getActorParam(this._actor, paramId) * 100);
        this.drawText(param, x, y, 48, 'right');
    }
};

//84
Alias.WiEqSt_drawNewParam = Window_EquipStatus.prototype.drawNewParam;
Window_EquipStatus.prototype.drawNewParam = function(x, y, paramId, reverse) {
    if (paramId < 8) {
        Alias.WiEqSt_drawNewParam.apply(this, arguments);
    } else {
        var newValue = this.getActorParam(this._tempActor, paramId);
        var diffvalue = newValue - this.getActorParam(this._actor, paramId);
        if (reverse) diffvalue *= -1;
        this.changeTextColor(this.paramchangeTextColor(diffvalue));
        this.drawText(Math.round(newValue * 100), x, y, 48, 'right');
    }
};

Window_EquipStatus.prototype.includeParam = function(paramId) {
    if (paramId < 8) {
        if (this._item && this._item.params[paramId] !== 0) return true;
        return this.includeTrait(Game_BattlerBase.TRAIT_PARAM, paramId);
    } else if (paramId < 18) {
        return this.includeTrait(Game_BattlerBase.TRAIT_XPARAM, paramId - 8);
    } else {
        return this.includeTrait(Game_BattlerBase.TRAIT_SPARAM, paramId - 18);
    }
};

Window_EquipStatus.prototype.includeTrait = function(code, id) {
    return (this._item &&
            this._item.traits.some( t => t.code === code && t.dataId === id ));
};

Window_EquipStatus.prototype.includeRate = function(type, code, method, id) {
    switch (type) {
        case 1: return true;
        case 2: return this.includeTrait(code, id);
        case 3: return this.isChangedRate(method, id);
        case 4: return this.includeTrait(code, id) || this.isChangedRate(method, id);
        default: return false;
    }
};

Window_EquipStatus.prototype.getActorParam = function(actor, paramId) {
    if (paramId < 8) {
        return actor.param(paramId);
    } else if (paramId < 18) {
        return actor.xparam(paramId - 8);
    } else {
        return actor.sparam(paramId - 18);
    }
};

Window_EquipStatus.prototype.getParamMax = function(paramId) {
    if (paramId < 8) {
        return MPPlugin.paramGaugeMax[paramId];
    } else if (paramId < 18) {
        return MPPlugin.xparamGaugeMax;
    } else {
        return MPPlugin.sparamGaugeMax;
    }
};

Window_EquipStatus.prototype.drawElement = function(x, y, id) {
    var name = MPPlugin.terms.elementRate.format($dataSystem.elements[id]);
    var curValue = this._actor.elementRate(id);
    var newValue = this._tempActor.elementRate(id);
    var reverse = MPPlugin.ElementRate.Reverse;
    this.drawRate(x, y, name, curValue, newValue, reverse);
};

Window_EquipStatus.prototype.drawDebuff = function(x, y, id) {
    var name = MPPlugin.terms.debuffRate.format(TextManager.param(id));
    var curValue = this._actor.debuffRate(id);
    var newValue = this._tempActor.debuffRate(id);
    var reverse = MPPlugin.DebuffRate.Reverse;
    this.drawRate(x, y, name, curValue, newValue, reverse);
};

Window_EquipStatus.prototype.drawState = function(x, y, id) {
    var name = MPPlugin.terms.stateRate.format($dataStates[id].name);
    var curValue = this._actor.stateRate(id);
    var newValue = this._tempActor.stateRate(id);
    var reverse = MPPlugin.StateRate.Reverse;
    this.drawRate(x, y, name, curValue, newValue, reverse);
};

Window_EquipStatus.prototype.drawRate = function(x, y, name, curValue, newValue, reverse) {
    this.changeTextColor(this.systemColor());
    this.drawText(name, x + this.textPadding(), y, 120);
    var curValue2 = reverse ? 1 - curValue : curValue;
    var newValue2 = reverse ? 1 - newValue : newValue;
    var max = MPPlugin.rateGaugeMax;
    this.drawParamGauge(x + 140, y, 130, curValue2, newValue2, max, !reverse);
    this.resetTextColor();
    this.drawText(Math.round(curValue2 * 100), x + 140, y, 48, 'right');
    this.drawRightArrow(x + 188, y);
    this.changeTextColor(this.paramchangeTextColor(curValue - newValue));
    this.drawText(Math.round(newValue2 * 100), x + 222, y, 48, 'right');
};

Window_EquipStatus.prototype.drawResist = function(x, y, id) {
    var name = MPPlugin.terms.stateResist.format($dataStates[id].name);
    var curFlag = this._actor.isStateResist(id);
    var newFlag = this._tempActor.isStateResist(id);
    this.drawTraitText(x + 96, y, name, curFlag, newFlag);
};

Window_EquipStatus.prototype.drawOriginal = function(x, y, trait) {
    var curFlag = this._actor.allOriginalTraits_mpp().contains(trait);
    var newFlag = this._tempActor.allOriginalTraits_mpp().contains(trait);
    this.drawTraitText(x + 96, y, trait, curFlag, newFlag);
};

Window_EquipStatus.prototype.drawTraitText = function(x, y, name, curFlag, newFlag) {
    var diffvalue = !curFlag ? 1 : !newFlag ? -1 : 0;
    this.changeTextColor(this.paramchangeTextColor(diffvalue));
    var text = !curFlag ? '+' + name : !newFlag ? '-' + name : name;
    var width = this.contentsWidth() - x;
    this.drawText(text, x, y, width);
};




})();

//=============================================================================
// UpdateDrawer
//=============================================================================

(function() {

if (!Window_Base.Mpp_UpdateDrawer) {

    const Alias = {};

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
            this._updateDrawers = this._updateDrawers.filter( process => process() );
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
