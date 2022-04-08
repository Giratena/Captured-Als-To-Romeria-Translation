//=============================================================================
// HzRandomChoice.js
//=============================================================================

/*:ja
 * @plugindesc 選択肢の順番をランダムにします。また、タイマーが0になった際に強制的に最後の選択肢を選択させます。
 * @author hiz
 *
 *  @help 
 * ■ランダムな選択肢の順番
 * 　順番をランダムにしたい選択肢の「一番最後の選択文」に、以下のように記述します。
 *
 *  <random>
 *  
 *  ■タイマー0で最後の選択肢に強制分岐
 *  　タイマーが0になった際に強制分岐したい選択肢の「一番最後の選択文」に、以下のように記述します。
 *  　選択肢の実行前にタイマーを起動しておいてください。
 *  
 *  <timer>
 *
 * *このプラグインには、プラグインコマンドはありません。

 */
/*:en
 * @plugindesc Shuffle choices order.
 * @author hiz
 *
 *  @help 
 *  * Shuffled choices
 *  Put the forrowing on the end of option. 
 *  
 *  <random>
 *  
 *  * Force choice the end of option when the timer is expired.
 *  Put the forrowing on the end of option.
 *  Please start the timer before show choices. 
 *  
 *  <timer>
 *  
 *  * This plugin has no plugin command.
 */

(function () {
    // 配列のシャッフル
    function shuffle(array) {
        var n = array.length, t, i;
        while (n) {
            i = Math.floor(Math.random() * n--);
            t = array[n];
            array[n] = array[i];
            array[i] = t;
        }

        return array;
    }
    
    var _Window_ChoiceList_start = Window_ChoiceList.prototype.start;
    Window_ChoiceList.prototype.start = function() {
        // <random>:シャッフル
        this._shuffledIndexes = null;
        if (/<random>/.test($gameMessage._choices[$gameMessage._choices.length - 1])) {
            var lastChoice = $gameMessage._choices.pop();
            var choiceNum = $gameMessage._choices.length;
            // 選択肢のインデックスのシャッフル
            this._shuffledIndexes = new Array(choiceNum);
            for(var i=0;i<choiceNum;i++) {
                 this._shuffledIndexes[i] = i;
            }
            shuffle(this._shuffledIndexes);
            // 選択肢のシャッフル
            var shuffledChoices  = new Array(choiceNum);
            for(var i=0;i<choiceNum;i++) {
                 shuffledChoices[i] = $gameMessage._choices[this._shuffledIndexes[i]];
            }
            $gameMessage._choices = shuffledChoices;  
            $gameMessage._choices.push(lastChoice);
        }
        // <timer>:タイマーが0になった際に強制的に最後の選択肢に分岐
        this._timer_idx = -1;
        if (/<timer>/.test ($gameMessage._choices[$gameMessage._choices.length - 1])) {
            this._timer_idx = $gameMessage._choices.length - 1;
        }
        
        // 一番最後の選択文を削除
        if(/<.*>/.test($gameMessage._choices[$gameMessage._choices.length - 1])) {
            $gameMessage._choices.pop();
        }
        
        _Window_ChoiceList_start.call (this);
    };
    
    var _Window_ChoiceList_update = Window_ChoiceList.prototype.update;
    Window_ChoiceList.prototype.update = function() {
        if (this.isOpen() && this._timer_idx >= 0) {
            if ($gameTimer.isWorking() && $gameTimer._frames === 0) {
                // タイマーが0になった際、強制的に一番最後の選択肢を選択。
                this._index = this._timer_idx;
                this._timer_idx = -1;
                this.updateInputData();
                this.deactivate();
                this.callOkHandler();
                return;
            }
        }
        _Window_ChoiceList_update.call (this);
    };
    
    Window_ChoiceList.prototype.callOkHandler = function() {
        $gameMessage.onChoice(this.resultIndex(this.index()));
        this._messageWindow.terminateMessage();
        this.close();
    };

    Window_ChoiceList.prototype.callCancelHandler = function() {
        $gameMessage.onChoice(this.resultIndex($gameMessage.choiceCancelType()));
        this._messageWindow.terminateMessage();
        this.close();
    };
    
    // シャッフル後のインデックスに変換
    Window_ChoiceList.prototype.resultIndex = function(idx) {
        if(this._shuffledIndexes        === null) return idx;
        if(this._shuffledIndexes.length <=  idx ) return idx;
        return this._shuffledIndexes[idx];
    };
    
})();