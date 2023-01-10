//=============================================================================
// KMS_AccelerateFileScene.js
//   Last update: 2015/12/05
//=============================================================================

/*:
 * @plugindesc
 * [v0.1.0] Accelerate drawing save/load scene.
 * 
 * @author TOMY (Kamesoft)
 *
 * @help This plugin does not provide plugin commands.
 */

/*:ja
 * @plugindesc
 * [v0.1.0] セーブ/ロード画面の描画を高速化します。
 * 
 * @author TOMY (Kamesoft)
 *
 * @help このプラグインには、プラグインコマンドはありません。
 */

var KMS = KMS || {};

(function() {

KMS.imported = KMS.imported || {};
KMS.imported['AccelerateFileScene'] = true;

//var pluginParams = PluginManager.parameters('KMS_AccelerateFileScene');
//var Params = {};

//-----------------------------------------------------------------------------
// DataManager

var _KMS_AccelerateFileScene_DataManager_loadGlobalInfo = DataManager.loadGlobalInfo;
DataManager.loadGlobalInfo = function()
{
    if (!this._globalInfoCache)
    {
        this._globalInfoCache = _KMS_AccelerateFileScene_DataManager_loadGlobalInfo.call(this);
    }

    return this._globalInfoCache;
};

var _KMS_AccelerateFileScene_DataManager_saveGlobalInfo = DataManager.saveGlobalInfo;
DataManager.saveGlobalInfo = function(info)
{
    this._globalInfoCache = null;
    _KMS_AccelerateFileScene_DataManager_saveGlobalInfo.call(this, info);
};

})();
