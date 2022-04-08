/*:
 * @plugindesc タイミングを合わせてボタン入力するタイミングバーを実行します。
 * @author hiz
 * 
 * @param bar width
 * @desc バーの幅
 * @default 500
 *
 * @param required SE
 * @desc 必須エリアヒット時のSE
 * @default Decision2
 *
 * @param hit SE
 * @desc ヒットエリアヒット時のSE
 * @default Attack2
 * 
 * @param critical SE
 * @desc クリティカルエリアヒット時のSE
 * @default Attack3
 *
 * @param miss SE
 * @desc 入力時（失敗）のSE
 * @default Buzzer1
 * 
 * @help
 * タイミングを合わせてボタン入力するタイミングバーを実行します。
 * 
 *  プラグインコマンド:
 *   HzTimingBar [var_no] [hit_area] [critical_area] [require_area] [x] [y]  # コマンド入力起動
 *   
 *   [var_no]
 *    【必須】結果を返す変数番号。ミスの場合は0・ヒットの場合は1・クリティカルの場合は2が返される。
 *   [hit_area] 
 *    【必須】ヒット範囲の最小値・最大値を0〜100の間で設定。min-max
 *    　　例）70-90
 *        
 *   [critical_area]
 *    【任意】クリティカル範囲の最小値・最大値を0〜100の間で設定。min-max
 *    　　例）90-95
 *   [require_area]
 *    【任意】入力必須範囲（複数可）の最小値・最大値を0〜100の間で設定。min-max,min-max,...
 *           入力必須範囲で全てボタン入力しないとヒット範囲・クリティカル範囲でボタン入力してもミスになります。
 *    　　　　※ 必ずヒット範囲・クリティカル範囲より前になるように設定して下さい。
 *      例） [10-20]         # 必須エリアは10〜20の範囲
 *          [20-30,50-60]   # 必須エリアは20〜30・50〜60の範囲
 *          []              # 必須エリア無し
 *   [x]
 *     【任意】コマンドの表示位置を指定します。（デフォルトでは画面中央）
 *   [y]
 *     【任意】コマンドの表示位置を指定します。（デフォルトでは画面中央）
 *   
 *  コマンド例）
 *    HzTimingBar 1 70-90 90-95     # ヒット範囲は70-90、クリティカル範囲は90-95。結果は変数番号１にセットされる。
 *    HzTimingBar 1 70-90 90-95 [10-30,40-60]    
 *                                # ヒット範囲は70-90、クリティカル範囲は90-95。結果は変数番号１にセットされる。
 *                                # 10-30・40-60の両方の範囲内でボタン入力しないとミス。
 *    HzTimingBar 1 80-90 90-95 [10-20] 413 20
 *                                # ヒット範囲は80-90、クリティカル範囲は90-95。結果は変数番号１にセットされる。
 *                                # 10-20の範囲内でボタン入力しないとミス。
 *                                # コマンドの表示位置は画面中央上端。
 */

// 必須エリア追加
// 必須エリアヒット時、効果音を出す
// プラグインコマンド
// TODO:アイテム・スキル使用時の実行
// TODO:状態異常の効果追加（エリア非表示・高速/低速）

(function() {
    
    var parameters = PluginManager.parameters('HzTimingBar');
    var requiredSe      = parameters['required SE'];
    var hitSe           = parameters['hit SE'];
    var criticalSe      = parameters['critical SE'];
    var missSe          = parameters['miss SE'];

    
    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        // スクリプトコマンド「HZCOMMAND」
        if (command.toUpperCase() === 'HZTIMINGBAR') {
			this.setWaitMode("hzTimingBar");
            var varNo            = Number(args[0]);
            var hitAreaParm      = String(args[1]);
            var criticalAreaParm = String(args[2]);
            var requiredAreaParm = String(args[3]);
            var x = args[4] != null ? Number(args[4]) : SceneManager._screenWidth/2;
            var y = args[5] != null ? Number(args[5]) : SceneManager._screenHeight/2;
            
            var hitArea       = hitAreaParm.split("-").map(function(elm) {return Number(elm);});
            var criticalArea  = criticalAreaParm.split("-").map(function(elm) {return Number(elm);});
            var requiredAreas = requiredAreaParm.substring(1,requiredAreaParm.length-1).split(",").map(function(requiredArea) {
                return requiredArea.split("-").map(function(elm) {return Number(elm);});
            });
            
			this._timingBar = new HzTimingBar(x, y, hitArea, criticalArea, requiredAreas);
        }
    };
    
    // 待機状態の更新用関数に機能追加
    var _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function() {
        var waiting = null;
        switch (this._waitMode) {
        case 'hzTimingBar':
            // 待機状態の更新
            // ※ waitingには必ずtrueかfalseをセットすること！
            waiting = this._timingBar.update();
            if(!waiting) {
                // 終了処理
                this._timingBar.terminate();
                this._timingBar = null;
            }
            break;
        }
        if (waiting !== null) {
            if(!waiting) {
                this._waitMode = '';
            }
            return waiting;
        }
        return _Game_Interpreter_updateWaitMode.call(this);
    };
    
    // コマンド入力実行用クラス
    function HzTimingBar() {
        this.initialize.apply(this, arguments);
    }
    
    HzTimingBar.DELAY    = 20;
	HzTimingBar.maxFrame = 100;
    HzTimingBar.WIDTH    = parameters['bar width'] ? Number(parameters['bar width']) : 500;
    HzTimingBar.HEIGHT   = 10;
    HzTimingBar.RADIUS   = 4;
    HzTimingBar.speed    = 1;
    
    // 初期化処理（プロパティの初期化・スプライトの作成等を行う）
    HzTimingBar.prototype.initialize = function(x, y, hitArea, criticalArea, requiredAreas) {
		this._varNo = 1;
		this._hitArea = hitArea;
        this._criticalArea = criticalArea != null ? criticalArea : [-1,0];
        this._requiredAreas = requiredAreas != null ? requiredAreas : [];
		this._frame = -HzTimingBar.DELAY;
        this._hitRequired = [];
        for(var i=0;i<this._requiredAreas.length;i++) {
            this._hitRequired.push(this._requiredAreas[i].length != 2);
        }
        
        // 描画コンテナ
        this._container = new Sprite();
        this._container.position.set(x - HzTimingBar.WIDTH / 2,y - HzTimingBar.HEIGHT / 2);
        
        
        // 枠
        var barFrameBmp = new Bitmap(HzTimingBar.WIDTH+4, HzTimingBar.HEIGHT+4);
        var framePath = roundedRectangle(barFrameBmp.context, 2,2,HzTimingBar.WIDTH, HzTimingBar.HEIGHT, HzTimingBar.RADIUS);
        barFrameBmp.context.fillStyle = "#FFFFFF";
        barFrameBmp.context.lineWidth = 2;
        barFrameBmp.context.strokeStyle = "#000000";
        barFrameBmp.context.fill();
        barFrameBmp.context.stroke();
        var barFrame = new Sprite(barFrameBmp);
        barFrame.position.set(-2, -2);
        this._container.addChild(barFrame);
        
        // 必須エリア
        for(var i=0;i<this._requiredAreas.length;i++) {
            var requiredArea = this._requiredAreas[i];
            var reqWidth = HzTimingBar.WIDTH * (requiredArea[1] - requiredArea[0]) / HzTimingBar.maxFrame;
            var reqBmp = new Bitmap(reqWidth, HzTimingBar.HEIGHT-1);
            reqBmp.context.fillStyle = "#43D197";
            reqBmp.context.rect(0, 1, reqWidth, HzTimingBar.HEIGHT-1);
            reqBmp.context.fill();
            var req = new Sprite(reqBmp);
            req.position.set(HzTimingBar.WIDTH * requiredArea[0] / HzTimingBar.maxFrame, 0);
            this._container.addChild(req);
        }
        
        // ヒットエリア
        var hitWidth = HzTimingBar.WIDTH * (this._hitArea[1] - this._hitArea[0]) / HzTimingBar.maxFrame;
        var hitBmp = new Bitmap(hitWidth, HzTimingBar.HEIGHT-1);
        hitBmp.context.fillStyle = "#EBCE41";
        hitBmp.context.rect(0, 1, hitWidth, HzTimingBar.HEIGHT-1);
        hitBmp.context.fill();
        var hit = new Sprite(hitBmp);
        hit.position.set(HzTimingBar.WIDTH * this._hitArea[0] / HzTimingBar.maxFrame, 0);
        this._container.addChild(hit);
        
        // クリティカルエリア
        var criticalWidth = HzTimingBar.WIDTH * (this._criticalArea[1] - this._criticalArea[0])/ HzTimingBar.maxFrame;
        var criticalBmp = new Bitmap(criticalWidth, HzTimingBar.HEIGHT-1);
        criticalBmp.context.fillStyle = "#E47237";
        criticalBmp.context.rect(0, 1, criticalWidth, HzTimingBar.HEIGHT-1);
        criticalBmp.context.fill();
        var critical = new Sprite(criticalBmp);
        critical.position.set(HzTimingBar.WIDTH * this._criticalArea[0] / HzTimingBar.maxFrame, 0);
        this._container.addChild(critical);
        
        // カーソル
        var cursorBmp = new Bitmap(18, 32+HzTimingBar.HEIGHT+2);
        cursorBmp.context.fillStyle = "#000000";
        cursorBmp.context.strokeStyle = "#FFFFFF";
        cursorBmp.context.lineWidth = 1;
        cursorBmp.context.moveTo(1, 1);
        cursorBmp.context.lineTo(17, 1);
        cursorBmp.context.lineTo(9, 17);
        cursorBmp.context.lineTo(1, 1);
        cursorBmp.context.moveTo(9, HzTimingBar.HEIGHT + 17);
        cursorBmp.context.lineTo(17, HzTimingBar.HEIGHT + 33);
        cursorBmp.context.lineTo(1, HzTimingBar.HEIGHT + 33);
        cursorBmp.context.lineTo(9, HzTimingBar.HEIGHT + 17);
        cursorBmp.context.fill();
        cursorBmp.context.stroke();
        this._cursor = new Sprite(cursorBmp);
        this._cursor.opacity = 0;
        this._cursor.position.set(-9,-17);
        this._container.addChild(this._cursor);
        
        SceneManager._scene._spriteset.addChild(this._container);
        
    };
    
    // 更新処理（終了時はfalseを返す）
    HzTimingBar.prototype.update = function() {
        // タイマーによる時間制限
        if ($gameTimer.isWorking() && $gameTimer._frames === 0) {
            // 終了（失敗）
            $gameVariables.setValue(this._varNo, 0);
            return false;
        }
		this._frame += HzTimingBar.speed;
        // カーソルアニメーション
        if(this._frame >= 0) {
            this._cursor.x = HzTimingBar.WIDTH * this._frame / HzTimingBar.maxFrame;
            this._cursor.opacity = 255;
        } else {
            this._cursor.x = 0;
            this._cursor.opacity = (HzTimingBar.DELAY + this._frame) / HzTimingBar.DELAY * 255;
        }
        // 時間経過でミス
		if(this._frame > HzTimingBar.maxFrame) {
			$gameVariables.setValue(this._varNo, 0);
            if(missSe) {
                AudioManager.playSe({name:missSe, volume:90, pitch:100, pan:0});
            }
			return false;
		}
        // ボタン押下時の判定
		if(Input.isTriggered ('ok') && this._frame >= 0) {
            var result = 0;
            // 必須エリアチェック
            for(var i=0;i<this._requiredAreas.length;i++) {
                var requiredArea = this._requiredAreas[i];
                if(requiredArea[0] <= this._frame && this._frame < requiredArea[1]) {
                    this._hitRequired[i] = true;
                    if(requiredSe) {
                        AudioManager.playSe({name:requiredSe, volume:90, pitch:100, pan:0});
                    }
                    return true;
                }
			}
			if(this._criticalArea[0] <= this._frame && this._frame < this._criticalArea[1]) {
                if(this.allRequiredAreaHitted()) {
                    result = 2;
                    if(criticalSe) {
                        AudioManager.playSe({name:criticalSe, volume:90, pitch:100, pan:0});
                    }
                }
			} else if(this._hitArea[0] <= this._frame && this._frame < this._hitArea[1]) {
				if(this.allRequiredAreaHitted()) {
                    result = 1;
                    if(hitSe) {
                        AudioManager.playSe({name:hitSe, volume:90, pitch:100, pan:0});
                    }
                }
			}
            if(result === 0) {
                if(missSe) {
                    AudioManager.playSe({name:missSe, volume:90, pitch:100, pan:0});
                }
            }
            $gameVariables.setValue(this._varNo, result);
			return false;
		} 
        
        return true;
    };
    
    HzTimingBar.prototype.allRequiredAreaHitted = function() {
         for(var i=0;i<this._hitRequired.length;i++) {
             if(this._hitRequired[i] === false) return false;
         }
         return true;
    };
    
    // 終了処理
    HzTimingBar.prototype.terminate = function() {
        SceneManager._scene._spriteset.removeChild(this._container);
        this._container = null;
    };
    
    // 角丸長方形を描画
    function roundedRectangle(ctx, top, left, width, height, borderRadius) {
        ctx.beginPath();
        ctx.moveTo(left + borderRadius, top);
        ctx.lineTo(left + width - borderRadius, top);
        ctx.quadraticCurveTo(left + width, top, left + width, top + borderRadius);
        ctx.lineTo(left + width, top + height - borderRadius);
        ctx.quadraticCurveTo(left + width, top + height, left + width - borderRadius, top + height);
        ctx.lineTo(left + borderRadius, top + height);
        ctx.quadraticCurveTo(left, top + height, left, top + height - borderRadius);
        ctx.lineTo(left, top + borderRadius);
        ctx.quadraticCurveTo(left, top, left + borderRadius, top);
        ctx.closePath();
    }
})();