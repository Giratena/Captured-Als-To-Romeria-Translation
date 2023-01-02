//=============================================================================
// PANDA_ControlSelfSwitches.js
//=============================================================================
// [Update History]
// 2020-08-24 Ver.1.0.0 First Release for MZ.
// 2020-09-03 Ver.1.0.1 Added Map Refresh.
// 2020-09-06 Ver.1.0.2 Added the Korean Description.
// 2021-06-23 Ver.1.1.0 fix for subfolder (MZ 1.3.0).
// 2021-07-05 Ver.1.1.1 revert fix for subfolder (MZ 1.3.2).

/*:
 * @target MZ
 * @plugindesc control any self switches by plugin commands.
 * @author panda(werepanda.jp)
 * @url http://www.werepanda.jp/blog/20200824225543.html
 * 
 * @help [How to Use]
 * Add Plugin Commands to control any Self Switches.
 * 
 * # Reset Self Switches
 * Turn OFF the Self Switches of specified Map ID and Event ID.
 *  - Map ID      : Input Map ID. (0 = all maps, -1 = current map)
 *  - Event ID    : Input Event ID. (0 = all events)
 *  - Self Switch : Select the Self Switch from A-D. (blank = all self switches)
 * 
 * [License]
 * this plugin is released under MIT license.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @command RESET
 * @text Reset Self Switches
 * @desc Turn OFF the Self Switches of specified Map ID and Event ID.
 * 
 * @arg mapID
 * @text Map ID
 * @desc Input Map ID. (0 = all maps, -1 = current map)
 * @type number
 * @min -1
 * @default 0
 * 
 * @arg eventID
 * @text Event ID
 * @desc Input Event ID. (0 = all events)
 * @type number
 * @min 0
 * @default 0
 * 
 * @arg switchID
 * @text Self Switch
 * @desc Select the Self Switch from A-D. (blank = all self switches)
 * @type select
 * @option 
 * @option A
 * @option B
 * @option C
 * @option D
 * @default 
 */

/*:ja
 * @target MZ
 * @plugindesc プラグインコマンドで任意のセルフスイッチを操作します。
 * @author panda(werepanda.jp)
 * @url http://www.werepanda.jp/blog/20200824225543.html
 * 
 * @help ■ 使い方
 * 任意のセルフスイッチを操作できるプラグインコマンドを追加します。
 * 
 * ◆ セルフスイッチの消去
 * 指定したマップID、イベントIDのセルフスイッチをOFFにします。
 * - マップID　：対象のマップIDを指定します。0を指定すると全てのマップ、
 *   　　　　　　-1を指定すると現在のマップが対象になります。
 * - イベントID：対象のイベントIDを指定します。
 *   　　　　　　0を指定すると全てのイベントが対象になります。
 * - スイッチID：対象のセルフスイッチ(A,B,C,D)を指定します。
 *   　　　　　　空欄にすると全てのセルフスイッチが対象になります。
 * 
 * ■ 利用規約
 * このプラグインはMITライセンスで配布されます。
 * ご自由にお使いください。
 * https://opensource.org/licenses/mit-license.php
 * 
 * @command RESET
 * @text セルフスイッチの消去
 * @desc 指定したマップID、イベントIDのセルフスイッチをOFFにします。
 * 
 * @arg mapID
 * @text マップID
 * @desc マップIDを指定します。0を指定すると全てのマップ、-1を指定すると現在のマップが対象になります。
 * @type number
 * @min -1
 * @default 0
 * 
 * @arg eventID
 * @text イベントID
 * @desc イベントIDを指定します。0を指定すると全てのイベントが対象になります。
 * @type number
 * @min 0
 * @default 0
 * 
 * @arg switchID
 * @text セルフスイッチ
 * @desc 対象のセルフスイッチをA～Dで指定します。空にすると全てのセルフスイッチが対象になります。
 * @type select
 * @option 
 * @option A
 * @option B
 * @option C
 * @option D
 * @default 
 */

/*:ko
 * @target MZ
 * @plugindesc 플러그인 명령에서 임의의 셀프스위치를 조작합니다.
 * @author panda(werepanda.jp)
 * @url http://www.werepanda.jp/blog/20200824225543.html
 * 
 * @help [사용법]
 * 임의의 셀프스위치를 조작할 수 있는 플러그인 명령이 추가됩니다.
 * 
 * * 셀프스위치 소거
 * 지정된 맵ID, 이벤트ID에 해당되는 셀프스위치를 OFF로 합니다.
 * - 맵ID     : 대상인 맵ID를 지정합니다. 0을 지정하면 모든 맵,
 *              -1을 지정하면 현재 맵이 대상이 됩니다.
 * - 이벤트ID : 대상인 이벤트ID를 지정합니다.
 *              0을 지정하면 모든 이벤트가 대상이 됩니다.
 * - 스위치ID : 대상인 셀프스위치(A,B,C,D)를 지정합니다.
 *              비워두면 모든 셀프스위치가 대상이 됩니다.
 * 
 * [이용 약관]
 * 이 플러그인은 MIT 라이센스로 공개됩니다.
 * https://opensource.org/licenses/mit-license.php
 * 
 * @command RESET
 * @text 셀프스위치 소거
 * @desc 지정된 맵ID, 이벤트ID에 해당되는 셀프스위치를 OFF로 합니다.
 * 
 * @arg mapID
 * @text 맵ID
 * @desc 맵ID를 지정합니다. 0을 지정하면 모든 맵, -1을 지정하면 현재 맵이 대상이 됩니다.
 * @type number
 * @min -1
 * @default 0
 * 
 * @arg eventID
 * @text 이벤트ID
 * @desc 이벤트ID를 지정합니다. 0을 지정하면 모든 이벤트가 대상이 됩니다.
 * @type number
 * @min 0
 * @default 0
 * 
 * @arg switchID
 * @text 셀프스위치
 * @desc 대상인 셀프스위치를 A-D에서 지정합니다. 비워두면 모든 셀프스위치가 대상이 됩니다.
 * @type select
 * @option 
 * @option A
 * @option B
 * @option C
 * @option D
 * @default 
 */

(() => {
	'use strict';
	
	// This Plugin Name
	const pluginName = decodeURIComponent(document.currentScript.src).match(/([^\/]+)\.js$/)[1];
	
	
	//--------------------------------------------------
	// Plugin Command "Reset Self Switches"
	//--------------------------------------------------
	PluginManager.registerCommand(pluginName, 'RESET', function(args) {
		
		// get arguments
		let mapID = parseInt(args['mapID']);
		let eventID = parseInt(args['eventID']);
		let switchID = args['switchID'] || '';
		
		// get current mapID when -1
		if (mapID < 0) {
			mapID = this.character(0)._mapId;
		}
		
		// get all self switches
		for (let k in $gameSelfSwitches._data) {
			
			// split self switch key (map, event, switch)
			let key = k.split(',');
			let m = parseInt(key[0]);
			let e = parseInt(key[1]);
			let s = key[2];
			
			// check key match
			if (mapID === 0 || m === mapID) {
				if (eventID === 0 || e === eventID) {
					if (switchID === '' || s === switchID) {
						// delete self switch key
						delete $gameSelfSwitches._data[k];
					}
				}
			}
			
		}
		
		// refresh
		$gameMap.requestRefresh();
		
	});
	
})();
