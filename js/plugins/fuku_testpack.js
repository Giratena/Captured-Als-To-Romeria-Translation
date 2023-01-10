// Copyright (c) 2017-2019 fuku
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//

// 最新版は↓から
// http://www5f.biglobe.ne.jp/~fuku-labo/library/etc/

/*:
 * @plugindesc 書いただけ詰め合わせ
 * @author fuku
 *
 * @help いろんなプラグインの素詰め合わせです。
 * 書いただけで一切テストしておりませんので、多分動きません。
 *
 * 必要に応じて抽出/修正してお使いください。
 * バグ報告などがあった場合はある程度対応します。
*/

//////////////////////////////////////
//メッセージウェイト調整

var Fuku_Plugins=Fuku_Plugins||{};
Fuku_Plugins.MessageCtrl={Version:2};

Fuku_Plugins.MessageCtrl.enable=true;
Input.keyMapper[65]='fuku_mst';
Fuku_Plugins.MessageCtrl.nowaittoggle='fuku_mst';
Fuku_Plugins.MessageCtrl.nowaitmode=false;
Fuku_Plugins.MessageCtrl.skipbutton='control';

(function(){
var mes_updateInput=Window_Message.prototype.updateInput;
Window_Message.prototype.updateInput=function(){
	if(Input.isTriggered(Fuku_Plugins.MessageCtrl.nowaittoggle)){
		Fuku_Plugins.MessageCtrl.nowaitmode=!Fuku_Plugins.MessageCtrl.nowaitmode;
		Input.update();
		return true;
	}
	return mes_updateInput.call(this);
};

var mes_isTriggered=Window_Message.prototype.isTriggered;
Window_Message.prototype.isTriggered=function(){
	if(Fuku_Plugins.MessageCtrl.enable){
		if(Input.isPressed(Fuku_Plugins.MessageCtrl.skipbutton)){
			return true;
		}
	}
	return mes_isTriggered.call(this);
};

var mes_updateWait=Window_Message.prototype.updateWait;
Window_Message.prototype.updateWait=function(){
	if(Fuku_Plugins.MessageCtrl.enable){
		if(Fuku_Plugins.MessageCtrl.nowaitmode || Input.isPressed(Fuku_Plugins.MessageCtrl.skipbutton)){
			if(this._textState){
				var ci=this._textState.index;
				var tx=this._textState.text;
				var c=tx[ci];
				var cn=tx[ci+1];
				while((c==='\x1b')&&((cn==='.')||(cn==='|'))){
					ci+=2;
					c=tx[ci];
					cn=tx[ci+1];
				}
				if((c!=='\x1b')||(cn!=='^')){
					this._waitCount=0;
					return false;
				}
			}
			else{
				this._waitCount=0;
				return false;
			}
		}
	}
	return mes_updateWait.call(this);
};
})();



//////////////////////////////////////
//ターン終了処理修正

var Fuku_Plugins=Fuku_Plugins||{};
Fuku_Plugins.FixTurnEnd={Version:1};

(function(){
var battle_endTurn=BattleManager.endTurn;
BattleManager.endTurn=function(){
	if(this._fuku_processedturnend){
		this._phase='turnEnd';
		return;
	}
	this._fuku_processedturnend=true;
	battle_endTurn.call(this);
};
var battle_updateTurnEnd=BattleManager.updateTurnEnd;
BattleManager.updateTurnEnd=function(){
	this._fuku_processedturnend=false;
	battle_updateTurnEnd.call(this);
};
})();



//////////////////////////////////////
//イベント/ピクチャの重複判定

var Fuku_Plugins=Fuku_Plugins||{};
Fuku_Plugins.OverlapEvents={Version:5};

Fuku_Plugins.OverlapEvents.enable=true;
Fuku_Plugins.OverlapEvents.handlers={};
//↑ハンドラを登録します。
Fuku_Plugins.OverlapEvents.alwayswatch=[];
//↑常時配置する監視オブジェクトを登録します。
Fuku_Plugins.OverlapEvents.oneshotwatch=[];
//↑一回反応すると消える監視オブジェクトを登録します。

/*
監視オブジェクトの作り方：
new 監視オブジェクトクラス名(new 矩形オブジェクトクラス名(ID),
		反応時に呼び出すハンドラ名,←の時に渡すパラメータ,反応終了時に呼び出すハンドラ名,←の時に渡すパラメータ)
例：プレイヤーと全ピクチャを判定し、重複時にスイッチ1ONおよび変数1に重複ピクチャID、重複終了時にスイッチ2ONおよび変数2に重複ピクチャID
new Fuku_Plugins.OverlapEvents.AllPictureWatcher(new Fuku_Plugins.OverlapEvents.CharacterRect(-1),
		'info_set',[1,null,1],'info_set',[2,null,2]);
*/

Fuku_Plugins.OverlapEvents._lastcheck_list=0;
Fuku_Plugins.OverlapEvents._lastcheck_index=0;
Fuku_Plugins.OverlapEvents._interpreter=new Game_Interpreter();
Fuku_Plugins.OverlapEvents.call_watcher=null;

var Fuku_Plugins_OverlapEvents_PictureRect=null;//ピクチャーの矩形を取る矩形オブジェクト
var Fuku_Plugins_OverlapEvents_CharacterRect=null;//イベントやプレイヤーの矩形を取る矩形オブジェクト

var Fuku_Plugins_OverlapEvents_ArrayWatcher=null;//矩形の配列と判定する監視オブジェクト
var Fuku_Plugins_OverlapEvents_AllEventWatcher=null;//全てのイベントと判定する監視オブジェクト
var Fuku_Plugins_OverlapEvents_PlayerWatcher=null;//プレイヤーと判定する監視オブジェクト
var Fuku_Plugins_OverlapEvents_AllPictureWatcher=null;//全てのピクチャーと判定する監視オブジェクト

(function(){
'use strict';

//ハンドラはサンプルです。都合のいいように編集/追加してください。
Fuku_Plugins.OverlapEvents.handlers.switch_on=function(watcher,first,param){
	if(first){
		$gameSwitches.setValue(param,true);
		return true;//trueを返すと判定を中断し、再度呼び出されます。
	}
	if($gameSwitches.value(param))return true;//ONにしたスイッチがOFFになるまで進めない
	return false;//falseを返すと即座に次に進みます。
};
Fuku_Plugins.OverlapEvents.handlers.info_set=function(watcher,first,param){
	if(first){
		$gameSwitches.setValue(param[0],true);
		if(param[1])$gameVariables.setValue(param[1],watcher.getTargetObject().getId());//監視対象のID
		if(param[2])$gameVariables.setValue(param[2],watcher.getPairObject().getId());//監視対象に重なったID
		return true;
	}
	if($gameSwitches.value(param[0]))return true;//ONにしたスイッチがOFFになるまで進めない
	return false;
};
Fuku_Plugins.OverlapEvents.handlers.commonevent=function(watcher,first,param){
	//並列イベント扱いになります。このプラグイン内で多重実行されることはありません。
	if(first){
		Fuku_Plugins.OverlapEvents.call_watcher=watcher;
		var commonevent=$dataCommonEvents[param];
		if(commonevent){
			Fuku_Plugins.OverlapEvents._interpreter.setup(commonevent.list,0);
			if(Fuku_Plugins.OverlapEvents._interpreter.setEventInfo){//for com1.3
				Fuku_Plugins.OverlapEvents._interpreter.setEventInfo({eventType:'common_event',commonEventId:param});
			}
		}
		return true;
	}
	return false;
};

Fuku_Plugins.OverlapEvents.IRect=function(id){
	this.clear();
	this.setId(id);
	if(id!==undefined)this.update();
};
Fuku_Plugins.OverlapEvents.IRect.prototype.constructor=Fuku_Plugins.OverlapEvents.IRect;

Fuku_Plugins.OverlapEvents.IRect.prototype.update=null;//pure func
Fuku_Plugins.OverlapEvents.IRect.prototype.object=null;//pure func
Fuku_Plugins.OverlapEvents.IRect.prototype.clear=function(){
	this.left=this.top=this.right=this.bottom=-10000;
};
Fuku_Plugins.OverlapEvents.IRect.prototype.getId=function(){
	return this._id;
};
Fuku_Plugins.OverlapEvents.IRect.prototype.setId=function(id){
	this._id=id;
};
Fuku_Plugins.OverlapEvents.IRect.prototype.checkOverlap=function(rect){
	return (rect.right>this.left)&&(rect.left<this.right)&&
			(rect.bottom>this.top)&&(rect.top<this.bottom);
};


Fuku_Plugins_OverlapEvents_PictureRect=function(id){
	Fuku_Plugins.OverlapEvents.IRect.apply(this,arguments);
};
Fuku_Plugins.OverlapEvents.PictureRect=Fuku_Plugins_OverlapEvents_PictureRect;
Fuku_Plugins.OverlapEvents.PictureRect.prototype=Object.create(Fuku_Plugins.OverlapEvents.IRect.prototype);
Fuku_Plugins.OverlapEvents.PictureRect.prototype.constructor=Fuku_Plugins.OverlapEvents.PictureRect;

Fuku_Plugins.OverlapEvents.PictureRect.prototype.object=function(){
	return $gameScreen.picture(this._id);
};
Fuku_Plugins.OverlapEvents.PictureRect.prototype.update=function(){
	var picture=this.object();
	if(picture){
		var bitmap=ImageManager.loadPicture(picture.name());
		if(bitmap && bitmap.isReady()){
			if(picture.origin()===0){
				this.left=Math.floor(picture.x());
				this.top=Math.floor(picture.y());
				this.right=Math.floor(this.left+picture.scaleX()*bitmap.width/100);
				this.bottom=Math.floor(this.top+picture.scaleY()*bitmap.height/100);
			}
			else{
				this.left=Math.floor(picture.x()-picture.scaleX()*bitmap.width/200);
				this.top=Math.floor(picture.y()-picture.scaleY()*bitmap.height/200);
				this.right=Math.floor(this.left+picture.scaleX()*bitmap.width/100);
				this.bottom=Math.floor(this.top+picture.scaleY()*bitmap.height/100);
			}
			return;
		}
	}
	this.clear();
};


Fuku_Plugins_OverlapEvents_CharacterRect=function(id){
	Fuku_Plugins.OverlapEvents.IRect.apply(this,arguments);
};
Fuku_Plugins.OverlapEvents.CharacterRect=Fuku_Plugins_OverlapEvents_CharacterRect;
Fuku_Plugins.OverlapEvents.CharacterRect.prototype=Object.create(Fuku_Plugins.OverlapEvents.IRect.prototype);
Fuku_Plugins.OverlapEvents.CharacterRect.prototype.constructor=Fuku_Plugins.OverlapEvents.CharacterRect;

Fuku_Plugins.OverlapEvents.PictureRect.prototype.object=function(){
	return (this._id<0?$gamePlayer:$gameMap.event(this._id));
};
Fuku_Plugins.OverlapEvents.CharacterRect.prototype.syncRect=function(event){
	var width,height;
	if(event._tileId>0){//isTileの定義が何故かGame/Spriteで異なるためSprite側を使用
		width=$gameMap.tileWidth();
		height=$gameMap.tileHeight();
	}
	else{
		var bitmap=ImageManager.loadPicture(event.characterName());
		if(bitmap && bitmap.isReady()){
			if(ImageManager.isBigCharacter(event.characterName())){
				width=bitmap.width/3;
				height=bitmap.height/4;
			}
			else{
				width=bitmap.width/12;
				height=bitmap.height/8;
			}
		}
		else{
			this.clear();
			return;
		}
	}
	this.left=Math.floor(event.screenX()-width/2);
	this.top=Math.floor(event.screenY()-height);
	this.right=Math.floor(this.left+width);
	this.bottom=Math.floor(this.right+height);
};
Fuku_Plugins.OverlapEvents.CharacterRect.prototype.update=function(){
	var event=this.object();
	if(event){
		this.syncRect(event);
		return;
	}
	this.clear();
};


Fuku_Plugins.OverlapEvents.IOverlapWatcher=function(target,on_handler,on_param,off_handler,off_param){
	this._target=target;
	this._on_triggered=false;
	this._off_triggered=false;
	this._trigger_first=false;
	this._overlapping=false;
	this._triggerpair=null;
	this._on_handler=on_handler;
	this._on_param=on_param;
	this._off_handler=off_handler;
	this._off_param=off_param;
	
	this.enable=true;
};
Fuku_Plugins.OverlapEvents.IOverlapWatcher.prototype.constructor=Fuku_Plugins.OverlapEvents.IOverlapWatcher;

Fuku_Plugins.OverlapEvents.IOverlapWatcher.prototype.update=function(){
	if(this._on_triggered || this._off_triggered)return false;
	this._target.update();
	if(this._overlapping){
		this._triggerpair.update();
		if(this._target.checkOverlap(this._triggerpair))return false;
		this._off_triggered=true;
		this._trigger_first=true;
		this._overlapping=false;
		return false;
	}
	return true;
};
Fuku_Plugins.OverlapEvents.IOverlapWatcher.prototype._setOnTrigger=function(pair){
	this._on_triggered=true;
	this._trigger_first=true;
	this._triggerpair=pair;
	this._overlapping=true;
}
Fuku_Plugins.OverlapEvents.IOverlapWatcher.prototype.getPairObject=function(){
	return this._triggerpair;
};
Fuku_Plugins.OverlapEvents.IOverlapWatcher.prototype.getTargetObject=function(){
	return this._target;
};
Fuku_Plugins.OverlapEvents.IOverlapWatcher.prototype.isOnTriggered=function(){
	return this._on_triggered;
};
Fuku_Plugins.OverlapEvents.IOverlapWatcher.prototype.isOffTriggered=function(){
	return this._off_triggered;
};
Fuku_Plugins.OverlapEvents.IOverlapWatcher.prototype.isActive=function(){
	return this._overlapping || this._off_triggered;
};
Fuku_Plugins.OverlapEvents.IOverlapWatcher.prototype.dispatch=function(){
	if(this._on_triggered){
		var handler=Fuku_Plugins.OverlapEvents.handlers[this._on_handler];
		if(handler)this._on_triggered=handler(this,this._trigger_first,this._on_param);
		else this._on_triggered=false;
		this._trigger_first=false;
		return this._on_triggered;
	}
	if(this._off_triggered){
		var handler=Fuku_Plugins.OverlapEvents.handlers[this._off_handler];
		if(handler)this._off_triggered=handler(this,this._trigger_first,this._off_param);
		else this._off_triggered=false;
		if(!this._off_triggered)this._triggerpair=null;
		this._trigger_first=false;
		return this._off_triggered;
	}
	return false;
};


Fuku_Plugins_OverlapEvents_ArrayWatcher=function(target,on_handler,on_param,off_handler,off_param){
	Fuku_Plugins.OverlapEvents.IOverlapWatcher.apply(this,arguments);
};
Fuku_Plugins.OverlapEvents.ArrayWatcher=Fuku_Plugins_OverlapEvents_ArrayWatcher;
Fuku_Plugins.OverlapEvents.ArrayWatcher.prototype=Object.create(Fuku_Plugins.OverlapEvents.IOverlapWatcher.prototype);
Fuku_Plugins.OverlapEvents.ArrayWatcher.prototype.constructor=Fuku_Plugins.OverlapEvents.ArrayWatcher;

Fuku_Plugins.OverlapEvents.ArrayWatcher.prototype.setPairList=function(list){
	this._pairlist=list;
};
Fuku_Plugins.OverlapEvents.ArrayWatcher.prototype.update=function(){
	if(!Fuku_Plugins.OverlapEvents.IOverlapWatcher.update())return false;
	var i,max,target=this._target,pairlist=this._pairlist,pair;
	for(i=0,max=pairlist.length;i<max;i++){
		pair=pairlist[i];
		pair.update();
		if(target.checkOverlap(pair)){
			this._setOnTrigger(pair);
			return false;
		}
	}
	return true;
};


Fuku_Plugins_OverlapEvents_AllEventWatcher=function(target,on_handler,on_param,off_handler,off_param){
	Fuku_Plugins.OverlapEvents.IOverlapWatcher.apply(this,arguments);
};
Fuku_Plugins.OverlapEvents.AllEventWatcher=Fuku_Plugins_OverlapEvents_AllEventWatcher;
Fuku_Plugins.OverlapEvents.AllEventWatcher.prototype=Object.create(Fuku_Plugins.OverlapEvents.IOverlapWatcher.prototype);
Fuku_Plugins.OverlapEvents.AllEventWatcher.prototype.constructor=Fuku_Plugins.OverlapEvents.AllEventWatcher;

Fuku_Plugins.OverlapEvents.AllEventWatcher.prototype.update=function(){
	if(!Fuku_Plugins.OverlapEvents.IOverlapWatcher.update())return false;
	var i,max,target=this._target,pairlist=$gameMap.events();
	var pair=new Fuku_Plugins.OverlapEvents.CharacterRect();
	var exc_obj=target.object();
	for(i=0,max=pairlist.length;i<max;i++){
		if(exc_obj===pairlist[i])continue;
		pair.setid(pairlist[i].eventId());
		pair.syncRect(pairlist[i]);
		if(target.checkOverlap(pair)){
			this._setOnTrigger(pair);
			return false;
		}
	}
	return true;
};


Fuku_Plugins_OverlapEvents_PlayerWatcher=function(target,handler){
	Fuku_Plugins.OverlapEvents.IOverlapWatcher.apply(this,arguments);
};
Fuku_Plugins.OverlapEvents.PlayerWatcher=Fuku_Plugins_OverlapEvents_PlayerWatcher;
Fuku_Plugins.OverlapEvents.PlayerWatcher.prototype=Object.create(Fuku_Plugins.OverlapEvents.IOverlapWatcher.prototype);
Fuku_Plugins.OverlapEvents.PlayerWatcher.prototype.constructor=Fuku_Plugins.OverlapEvents.PlayerWatcher;

Fuku_Plugins.OverlapEvents.PlayerWatcher.prototype.update=function(){
	if(!Fuku_Plugins.OverlapEvents.IOverlapWatcher.update())return false;
	var pair=new Fuku_Plugins.OverlapEvents.CharacterRect(-1);
	if(this._target.checkOverlap(pair)){
		this._setOnTrigger(pair);
		return false;
	}
	return true;
};


Fuku_Plugins_OverlapEvents_AllPictureWatcher=function(target,handler){
	Fuku_Plugins.OverlapEvents.IOverlapWatcher.apply(this,arguments);
};
Fuku_Plugins.OverlapEvents.AllPictureWatcher=Fuku_Plugins_OverlapEvents_AllPictureWatcher;
Fuku_Plugins.OverlapEvents.AllPictureWatcher.prototype=Object.create(Fuku_Plugins.OverlapEvents.IOverlapWatcher.prototype);
Fuku_Plugins.OverlapEvents.AllPictureWatcher.prototype.constructor=Fuku_Plugins.OverlapEvents.AllPictureWatcher;

Fuku_Plugins.OverlapEvents.AllPictureWatcher.prototype.update=function(){
	if(!Fuku_Plugins.OverlapEvents.IOverlapWatcher.update())return false;
	var i,max,target=this._target;
	var pair=new Fuku_Plugins.OverlapEvents.PictureRect();
	var exc_id=-1;
	if(target instanceof Fuku_Plugins.OverlapEvents.PictureRect)exc_id=target.getId();
	for(i=1,max=$gameScreen.maxPictures();i<=max;i++){
		if(exc_id===i)continue;
		pair.setid(i);
		pair.update();
		if(target.checkOverlap(pair)){
			this._setOnTrigger(pair);
			return false;
		}
	}
	return true;
};


var gm_update=Game_Map.prototype.update;
Game_Map.prototype.update=function(sceneActive){
	gm_update.apply(this,arguments);
	
	var self=Fuku_Plugins.OverlapEvents;
	if(!self.enable)return;
	
	var list,i,max,active;
	
	list=self.alwayswatch;
	for(max=list.length;i<max;i++){
		if(list[i].enable)list[i].update();
	}
	list=self.oneshotwatch;
	for(max=list.length;i<max;i++){
		if(list[i].enable)list[i].update();
	}
	
	if(self._interpreter.isRunning()){
		self._interpreter.update();
		if(self._interpreter.isRunning())return;
		self._interpreter.clear();
		self.call_watcher=null;
	}
	
	if(self._lastcheck_list<=0){
		list=self.alwayswatch;
		if(self._lastcheck_list===0){
			i=self._lastcheck_index;
		}
		else i=0;
		for(max=list.length;i<max;i++){
			if(list[i].dispatch()){
				self._lastcheck_list=0;
				self._lastcheck_index=i;
				return;
			}
		}
	}
	if(self._lastcheck_list<=1){
		list=self.oneshotwatch;
		if(self._lastcheck_list===1){
			i=self._lastcheck_index;
		}
		else i=0;
		for(max=list.length;i<max;i++){
			active=list[i].isActive();
			if(list[i].dispatch()){
				self._lastcheck_list=1;
				self._lastcheck_index=i;
				return;
			}
			if(active!==list[i].isActive()){
				list.splice(i,1);
				i--;
				max--;
			}
		}
	}
	
	if(self._lastcheck_list>=0){
		list=self.alwayswatch;
		if(self._lastcheck_list===0){
			max=self._lastcheck_index;
			if(max>list.length)max=list.length;
		}
		else max=list.length;
		for(i=0;i<max;i++){
			if(list[i].dispatch()){
				self._lastcheck_list=0;
				self._lastcheck_index=i;
				return;
			}
		}
	}
	if(self._lastcheck_list>=1){
		list=self.oneshotwatch;
		if(self._lastcheck_list===1){
			max=self._lastcheck_index;
			if(max>list.length)max=list.length;
		}
		else max=list.length;
		for(i=0;i<max;i++){
			active=list[i].isActive();
			if(list[i].dispatch()){
				self._lastcheck_list=1;
				self._lastcheck_index=i;
				return;
			}
			if(active!==list[i].isActive()){
				list.splice(i,1);
				i--;
				max--;
			}
		}
	}
	self._lastcheck_list=-1;
	self._lastcheck_index=0;
};

var dm_makeSaveContents=DataManager.makeSaveContents;
DataManager.makeSaveContents=function(){
	var contents=dm_makeSaveContents.apply(this,arguments);
	contents.Fuku_OverlapEvents={};
	contents.Fuku_OverlapEvents.oneshotwatch=Fuku_Plugins.OverlapEvents.oneshotwatch;
	contents.Fuku_OverlapEvents._lastcheck_list=Fuku_Plugins.OverlapEvents._lastcheck_list;
	contents.Fuku_OverlapEvents._lastcheck_index=Fuku_Plugins.OverlapEvents._lastcheck_index;
	contents.Fuku_OverlapEvents._interpreter=Fuku_Plugins.OverlapEvents._interpreter;
	contents.Fuku_OverlapEvents.call_watcher=Fuku_Plugins.OverlapEvents.call_watcher;
	return contents;
};
var dm_extractSaveContents=DataManager.extractSaveContents;
DataManager.extractSaveContents=function(contents){
	dm_extractSaveContents.apply(this,arguments);
	if(contents.Fuku_OverlapEvents){
		Fuku_Plugins.OverlapEvents.oneshotwatch=contents.Fuku_OverlapEvents.oneshotwatch;
		Fuku_Plugins.OverlapEvents._lastcheck_list=contents.Fuku_OverlapEvents._lastcheck_list;
		Fuku_Plugins.OverlapEvents._lastcheck_index=contents.Fuku_OverlapEvents._lastcheck_index;
		Fuku_Plugins.OverlapEvents._interpreter=contents.Fuku_OverlapEvents._interpreter;
		Fuku_Plugins.OverlapEvents.call_watcher=contents.Fuku_OverlapEvents.call_watcher;
		if(Fuku_Plugins.OverlapEvents._lastcheck_list===0){
			Fuku_Plugins.OverlapEvents._lastcheck_list=-1;
			Fuku_Plugins.OverlapEvents._lastcheck_index=0;
		}
	}
};
})();



//////////////////////////////////////
//選択肢中シーン遷移エラー修正

var Fuku_Plugins=Fuku_Plugins||{};
Fuku_Plugins.FixChoiceScene={Version:1};

(function(){
var wcl_windowWidth=Window_ChoiceList.prototype.windowWidth;
Window_ChoiceList.prototype.windowWidth=function(){
	if(!this._windowContentsSprite)return 10;
	return wcl_windowWidth.call(this);
};
})();



//////////////////////////////////////
//強制無音モード

var Fuku_Plugins=Fuku_Plugins||{};
Fuku_Plugins.ForceSilentMode={Version:1};

SceneManager.initAudio=function(){
	WebAudio.initialize(true);
};



//////////////////////////////////////
//アイテム/スキルに追加バトルアニメーション

//アイテムやスキルのメモに <fuku_addanime:アニメID> と書くと本来の
//アニメーション処理後に追加再生される

var Fuku_Plugins=Fuku_Plugins||{};
Fuku_Plugins.AdditionalBattleAnimation={Version:2};

(function(){
var sb_updateAnimation=Sprite_Battler.prototype.updateAnimation;
Sprite_Battler.prototype.updateAnimation=function(){
	sb_updateAnimation.call(this);
	if(!this.isAnimationPlaying()){
		var add_anime=this._battler.fukuShiftAdditionalAnimation();
		if(add_anime){
			this._battler.startAnimation(add_anime,false,0);
			this.setupAnimation();
		}
	}
};

Game_Battler.prototype.fukuPushAdditionalAnimation=function(animelist){
	this._fuku_add_animelist=(this._fuku_add_animelist || []).concat(animelist);
};
Game_Battler.prototype.fukuShiftAdditionalAnimation=function(){
	if(this._fuku_add_animelist &&(this._fuku_add_animelist.length>0)){
		return this._fuku_add_animelist.shift();
	}
	return null;
};

var wbl_startAction=Window_BattleLog.prototype.startAction;
Window_BattleLog.prototype.startAction=function(subject,action,targets){
	wbl_startAction.apply(this,arguments);
	var item=action.item();
	if(item.meta.fuku_addanime){
		if(!(item.meta.fuku_addanime instanceof Array)){
			item.meta.fuku_addanime=item.meta.fuku_addanime.split(',').map(function(id){
				return Number(id);
			});
		}
		var animelist=item.meta.fuku_addanime;
		targets.forEach(function(target){
			target.fukuPushAdditionalAnimation(animelist);
		});
	}
};
})();



//////////////////////////////////////
//全描画停止バグ暫定修正

var Fuku_Plugins=Fuku_Plugins||{};
Fuku_Plugins.FixScreenFreeze={Version:1};

(function(){
var g_render=Graphics.render;
Graphics.render=function(stage){
	g_render.apply(this,arguments);
	if(this._skipCount<0)this._skipCount=1;
};
})();



//////////////////////////////////////
//自動行動にカウンター/反射を考慮

var Fuku_Plugins=Fuku_Plugins||{};
Fuku_Plugins.EvalAutoCommandCntRef={Version:1};

(function(){
var ga_evaluateWithTarget=Game_Action.prototype.evaluateWithTarget;
Game_Action.prototype.evaluateWithTarget=function(target){
	if(this.isHpEffect() && this.isForOpponent()){
		var cnt_prob=this.itemCnt(target);
		var mrf_prob=this.itemMrf(target)*(1-cnt_prob);
		var normal_prob=1-cnt_prob-mrf_prob;
		var value=0;
		if(cnt_prob>0){
			var cnt_action=new Game_Action(target);
			cnt_action.setAttack();
			value-=cnt_action.makeDamageValue(this.subject(),false)*cnt_prob;
		}
		if(mrf_prob>0){
			value-=this.makeDamageValue(this.subject(),false)*mrf_prob;
		}
		if(normal_prob>0){
			value+=this.makeDamageValue(target,false)*normal_prob;
		}
		return value;
	}
	return ga_evaluateWithTarget.apply(this,arguments);
};
})();


//////////////////////////////////////
//シンプルなパーティクルを出現させる

var Fuku_Plugins=Fuku_Plugins||{};
Fuku_Plugins.SimpleParticle={Version:2};

(function(){

Fuku_Plugins.SimpleParticle.ParticleSprite=function(){
	this.initialize.apply(this,arguments);
	this._now_showing=false;
};
Fuku_Plugins.SimpleParticle.ParticleSprite.prototype=Object.create(Sprite.prototype);
Fuku_Plugins.SimpleParticle.ParticleSprite.prototype.constructor=Fuku_Plugins.SimpleParticle.ParticleSprite;

Fuku_Plugins.SimpleParticle.ParticleSprite.prototype.eraseParticle=function(){
	if(this._now_showing){
		if(this._parentsprite)this._parentsprite.removeChild(this);
		else this._parentscene.removeChild(this);
		this._now_showing=false;
	}
};
Fuku_Plugins.SimpleParticle.ParticleSprite.prototype.showParticle=function(parent,imgname,x,y,spd,ang,accel,frames,opt_start,opt_end){
	this.eraseParticle();
	this.bitmap=ImageManager.loadPicture(imgname);
	this._parentsprite=parent;
	this._parentscene=SceneManager._scene;
	this.move(x,y);
	this._speed=spd;
	this._angle=ang;
	this._accel=accel;
	this._now_frames=0;
	this._part_frames=frames;
	this._opt_start=opt_start;
	this._opt_end=opt_end;
	this.opacity=opt_start;
	if(parent)parent.addChild(this);
	else this._parentscene.addChild(this);
	this._now_showing=true;
};

Fuku_Plugins.SimpleParticle.ParticleSprite.prototype.update=function(){
	Sprite.prototype.update.call(this);
	if(!this._now_showing)return;
	this._now_frames++;
	if(this._now_frames>this._part_frames){
		this.eraseParticle();
		return;
	}
	this._speed+=this._accel;
	this.move(this.x+Math.cos(this._angle)*this._speed,this.y+Math.sin(this._angle)*this._speed);
	this.opacity=this._opt_start+(this._opt_end-this._opt_start)*(this._now_frames/this._part_frames);
};

Fuku_Plugins.SimpleParticle.create=function(parent,imgname,x,y,spd,ang,accel,frames,opt_start,opt_end){
	var sprite=new Fuku_Plugins.SimpleParticle.ParticleSprite();
	sprite.showParticle(parent,imgname,x,y,spd,ang,accel,frames,opt_start,opt_end);
	return sprite;
};

})();


//////////////////////////////////////
//中途半端な位置にスクロールするとマップやイベントの描画がずれる場合がある問題の修正

var Fuku_Plugins=Fuku_Plugins||{};
Fuku_Plugins.FixScrollFloatingPointError={Version:2};

var sm_updateMain=Scene_Map.prototype.updateMain;
Scene_Map.prototype.updateMain=function(){
	sm_updateMain.call(this);
	
	var w=$gameMap.tileWidth()*16777216;
	var h=$gameMap.tileHeight()*16777216;
	$gameMap._displayX=Math.round($gameMap._displayX*w)/w;
	$gameMap._displayY=Math.round($gameMap._displayY*h)/h;
};


//////////////////////////////////////
//低速スクロール時にマップとイベントの移動タイミングがずれる問題の修正

var Fuku_Plugins=Fuku_Plugins||{};
Fuku_Plugins.FixUnmatchMapAndEventFragCoordProcess={Version:1};

Game_CharacterBase.prototype.screenX = function() {
    var tw = $gameMap.tileWidth();
    return Math.ceil(this.scrolledX() * tw + tw / 2);
};

Game_CharacterBase.prototype.screenY = function() {
    var th = $gameMap.tileHeight();
    return Math.ceil(this.scrolledY() * th + th -
                      this.shiftY() - this.jumpHeight());
};


//////////////////////////////////////
//色調変更スプライトが正常に描画できないことがある問題の修正

var Fuku_Plugins=Fuku_Plugins||{};
Fuku_Plugins.FixToneChangedSpriteDrawError={Version:1};

var sp_createTinter=Sprite.prototype._createTinter;
Sprite.prototype._createTinter=function(w,h){
   sp_createTinter.apply(this,arguments);
   this._tintTexture.mipmap=false;
};


