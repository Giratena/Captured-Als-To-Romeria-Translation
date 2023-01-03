/*:
 * @plugindesc ツクールのゲームスピードを快適に遊べるように調整されたプラグインです。
 * 自分で調整もできます。詳細はヘルプを見てね。
 * @author tachi, merusaia （著作表示はTachiさん)
 *
 * @help 気をつけろ！( ・´ｰ・｀) by Tachiさん
 *  
 *  ↓以下、メルサイアが追記しました。ヘルプ・誤字脱字・要望・バグ報告などは
 * 　twitter:(https://twitter.com/merusaia/)までお気軽に。
 *
 * 【ファイル名：minRPG_CustomizeGameSpeed.js】
 *
 * 【更新履歴:  詳細（更新者 連絡先）】
 * 2016/01/16: Tachiさんのプラグインが素晴らしすぎるので、ソース内部に
 *             コメントを入れて解読を始める。「Tachi2」と命名。（merusaia）
 * 2016/06/04: 早送りの多機能化、スキップモード、かばうの条件変更などの機能を
 *             追加して、初版公開。「Tachi3」と命名。         （merusaia）
 * 2016/08/02: スキップモード中、メッセージ中の「/.」や「\|」を飛ばす機能を実装。
 *             「/.」や「\|」待ち時間をパラメータで変更可能に。（merusaia）
 * 2016/09/05: かばう（制御フラグ：身代わり）条件の変更を追加  （merusaia）
 * 2016/10/09: 通常時・早送り時・スキップ時それぞれにおいて、
 *             バトルメッセージの細かなパラメータ調整。
 *             デバッグON/OF機能を追加。                     （merusaia）
 * 2016/10/20: α版公開(ver.0.1）。やっと正常に動くようになりました…。
 *                                                         （merusaia）
 * 2016/10/25: 身代わり時にエラーが出るバグ修正。             （merusaia）
 * 2016/10/30: スキップ機能をパラメータ化。これで
 *            「ゲーム１～１００倍速で数分クリア」も思いのまま？（merusaia）
 * 2016/11/13: 身代わり時に任意のコモンイベントを呼べるように。 （merusaia）
 * 2016/11/14: トリアコンタンさんのアドバイスを元に、
 *            「minRPG_CustomizeGameSpeed」に改名。         （merusaia）
 * 2016/11/20: スキップをニュートラル・移動・イベント・戦闘中、
 *             それぞれパラメータでON/OFFできるように。        （merusaia）
 * 2016/11/23: 大規模なリファクタリング
 *             ザコ・ボス戦闘問わず、敵グループIDを取れるように（merusaia）
 * 2016/12/11: β版公開（ver.0.2）。やっと親切になってきました。
 *             身代わり条件の精査、デフォルト値の精査。
 * 　　　　　　 テストプレイの繰り返しで、各種パラメータを調整。（merusaia）
 * 2016/12/13: 戦闘を逃走または中断した時にONになるスイッチ実装。（merusaia）
 * 2016/12/21: Advent Callender 2016用にヘルプや使い方を改善。
 *             使い方説明記事を作成 http://qiita.com/merusaia/items/75c266e31435d5f3937c
 *                                                          （merusaia）
 * 2017/04/10: ゲームスピード1～9に最速スピードの10段階目、10を追加。
 *             10の時
 * 　　　　　　 ・ウェイトフレームや制御文字「\.」も待たずに自動スキップ
 * 　　　　　　 ・制御文字「\|」はスキップしません。自動送りメッセージ用
 *             ・パラメータ「***ボタンでスキップ可能か」がOFFでも自動スキップ
 * 　　　　　　 ただし、ゲーム演出が大きくくずれるので、ライトユーザ向けです。
 * 　　　　　　 追加したくない人は、
 *             ゲームスピードの最大値を9に設定してください。
 *                                                          （merusaia）
 * 2017/04/18:  競合対策のため、Game_Action.prototype.applyの上書きを廃止。
 *             パラメータ「【機能】吸収技もダメージエフェクトをつけるか」を削除。
 *              ver.1.3.2公式アップデートで対応済みのようです。
 *                                                          （merusaia）
 * 2018/09/14: ヘルプを修正。追加定義メソッドの記述ミスを修正。
 *             戦闘アニメーションが設定値+2倍になってしまう不具合を修正。
 *             ツクールデフォルトの値を各パラメータの説明に記載。（merusaia）
 *
 *
 * 【概要】
 * ツクールMVサンプルゲーム「Sea Pirate」のプロジェクトファイル
 * に入っている凄腕プラグイン「Tachi.js」を改良して、
 * ゲームスピードを高速化します。
 * またパラメータを調整により、ゲームスピードの静的・動的な調整だけでなく、
 * 多くの機能を細かくカスタマイズできるようになっています。
 * 
 * 
 * 【プラグインコマンド】
 * エディタ上で、以下のプラグインコマンドを実行してください。
 * ・「スキップモードON」、もしくは「SKIPMODE_ON」
 *   →  スキップモードを開始します。
 * ・「スキップモードOFF」、もしくは「SKIPMODE_OFF」
 *   →  スキップモードを停止します。
 * 
 * 
 * 【主な機能】
 * このプラグインをONにすると、以下の機能が追加されます。
 * 
 * ・ゲームスピードの高速化
 *    → マップ移動・戦闘ログ・各種モーション・エンカウント速度など、
 *      ユーザがストレスになりそうな部分を極力少なくして、いい感じに快適にします。
 * 
 * ・スキップモードの追加
 *    → 全てのウェイトや制御文字「\.」や「\|」をすっ飛ばす機能。
 *      デフォルトではダッシュボタン「Shift」キーに割り当てています。
 *    → スキップ機能を無ししたり、他のボタンにしたい場合は、パラメータ
 *      「ダッシュボタンでスキップ可能か」をOFFにしてください。
 *      他には、決定ボタン(zキー)、キャンセルボタン(xキー)に対応しています。
 * 
 * 出来る限りプラグインの導入を簡単にするために、デフォルトのままでも、
 * 快適に遊べるようになっています。
 * もちろん、プラグインのパラメータを変更することで、自分好みに調整できます。
 * 
 * ・標準ゲームスピードの調整
 * ・早送りボタンのカスタマイズ・早送り倍率の調整
 * ・標準・早送り時の動的なスピードの調整
 * ・「\.」や「\|」のウェイトフレーム数の調整
 * 
 * 
 * 【トリアコンタンさんのプラグインとの合わせ技】
 * トリアコンタンさんのプラグイン CustomizeConfigItem.js と併用すると、
 * 以下の機能が使えます。
 * 
 * ・オプション項目に「ゲームスピード（1～9）」追加
 *    → プレイヤーがいつでもゲームスピードを変更できるようにします。
 *      速度を9段階に変更することで、各種速度を快適になるように自動調整します。
 *
 * 導入方法
 * (1)パラメータ「可変ゲームスピードを格納する変数番号」に「【変数番号X】」を記入
 * https://gyazo.com/278a250e3c4e65a5b40a3566e84cb30f
 * (2)下記のURLから CustomizeConfigItem.js をダウンロードし、プラグインに追加
 * http://triacontane.blogspot.jp/2016/01/blog-post.html
 * (3)パラメータ「数値項目1」に、「ゲームスピード:2:【変数番号X】:OFF:1:9:1」を記入し、
 *    他のパラメータの隠しフラグを全て「OFF」にする
 * https://gyazo.com/8d14177e35129a93a17ad4d97ad8759a
 * ※以下がめんどくさい or うまくいかない場合は、
 *   サンプルプロジェクトを以下からダウンロードして、参照してみてください。
 *   https://www.dropbox.com/s/27nsond56y8jch1/PluginDeki-ru1_3_3.zip?dl=1
 * 
 * 
 * 【その他の機能について】
 * この他にも、ユーザさんがゲームをより柔軟にコントロールできるように、
 * プラグインのパラメータをたくさん用意しています。
 * 「もっと調整したい」という人向けに、
 * 各種機能をONにすることで、デフォルトから変更できるようになっています。
 * 
 * ・パラメーター最大値限界突破（攻撃力などの限界値を999→99億などに設定可能）
 * ・かばう（制御フラグ：身代わり）の条件変更
 * ・かばう成功時にコモンイベントを呼び出す
 * 
 *  これらの機能は、他プラグインとの競合を避けるため、
 *  必要な機能だけを、パラメータでON／OFF出来るようになっています。
 *  また、他の方が改変して使いやすいよう、
 *  ソース内部に多くの日本語コメントを追加しています。
 *
 * 
 * 
 * 【背景】
 *  Tachiさんのプラグイン「Tachi.js」では、
 *  より快適に遊べるように、何度も何度もテストプレイをされて、
 *  ゲームスピードを調整されていました。
 * 「なんだか戦闘エフェクトの待ち時間が多いな」とか、
 * 「もう少しだけここを早くできないかな」とか、
 *  ストレスを感じやすいウェイトを、極力少なくしてありました。
 * 
 *  そのノウハウを、なんとか多くのツクール製ゲームに応用できないかと思い、
 *  このプラグインを作成しました。
 *  早送り速度の調整の他、タッチ操作にも対応しています。
 * （ただし、スマホ実機でのテストはしてません。誰か助けて…＞＜）。
 *
 * ＜ボタン長押しによる早送りの問題点＞
 *  早送りとは、ツクールのデフォルトで実装されている機能であり、
 * 「決定ボタン(okボタン、Enter/zキーのこと)」を押しっぱなしにしている時、
 *  戦闘・メッセージ送りなどが早くなる機能のことです（通常は２倍になる）。
 * 
 *  デフォルトで、早送り機能があるということは、
 *  ツクールMVのデフォルトの戦闘スピードは、遅いという認識があります。
 *  （普通のコンシューマRPGをやっている人は結構ストレス）
 * 
 *  ただ、ツクラー目線に立つと、
 *  せっかく丁寧に作ったシナリオや戦闘をデフォルトで早送り出来てしまい、
 *  ユーザの没入感を阻害してしまっているのではないか、と心配になります。
 * 
 *  だがしかし、プレイヤー目線に立つと、
 *  忙しくてゲームに時間の酒無い人や、
 *  周回プレイなど、早送りしたい人も多数いて、賛否両論あると思います。
 *  
 *  そこで、ツクラーさんやユーザさんが、自分好みにゲームスピードや、
 *  早送り・スキップ速度などを調整できるようにしました。
 * 
 * 
 * 
 * 【詳細】
 *  各種機能のパラメータの調整の仕方について、それぞれ説明しています。
 * 
 * 
 * ＜スピード調整機能について＞
 * ・プラグインのパラメータにより、ゲームのスピード倍率を調整できます。
 *     →  「標準○○スピード」と書かれたパラメータにより、静的に変更できます。
 *        「可変○○スピード」と書かれたパラメータに変数番号を入れることで、
 *         ゲーム内変数\V[n]などで動的に調整が可能です。
 * 
 *     →  トリアコンタンさんのCustomizeConfigItem.jsプラグインと併用すると、
 *        オプション項目でそのゲーム内変数の値を設定できるようになり、
 *        プレイヤーが自由に倍率を変更することが出来ます（オススメ！）。
 * 
 * 
 * ＜早送りについて＞
 * ・早送りボタンを押した時のスピードを調整できます。
 *     →  「早送り○○スピード」と書かれたパラメータにより、静的に変更できます。
 * ・早送りボタンに、「画面タッチ押しっぱなし」が追加されます。
 *     →  スマホの人は、画面を押しっぱなしにすることで、早く遊べます。
 * ・早送りボタンに、
 *   「決定ボタン(zキー)」、「キャンセルボタン(x)キー」、
 *   「ダッシュボタン(SHIFTキー)」を、それぞれ個別に割り当てられます。
 * 
 * ※決定ボタンによるメッセージの瞬時表示機能をなくすことは出来ません。
 *     →  早送り倍率は、あくまでスピードを調整するものです。
 *        デフォルトにある、決定ボタン長押しでの高速化を和らげたい場合は、
 *        パラメータ「決ボタンでイベント早送り可能か」や、
 *        「決ボタンで戦闘早送り可能か」を「OFF」にしてください。
 * 
 * ※他のプラグインをかぶるようであれば、
 *   パラメータ「【機能】スピード変更」をONにすることで、
 *   これらのスピード変更機能を無効化することが出来ます。
 * 
 * 
 * ＜スキップ機能について＞
 * ・スキップ機能とは、このプラグインで新しく実装されている機能です。
 *   専用のスキップボタンを押すことで、ゲームをあっという間に過ぎさせる機能です。
 *     →  イベントの「ウェイト○フレーム」を待ちません
 *     →  メッセージ内の制御文字「\.」「\^」ですら、すっ飛ばします。
 *     →  唯一まともに待つのは、「画面色調の変更」のウェイトフレームくらいです。
 * 
 *   ※用途としては、一度見たイベントのスキップや、戦闘エフェクトのスキップ、
 *     テストプレイ時などに確認の必要のないイベントを飛ばす、などを想定しています。
 * 
 * ・スキップボタンには、デフォルトではダッシュボタンに割り当てています。
 *     →  ゲームパッドではスーファミ表記だと「Yボタン」、
 *        キーボードでは「Shiftキー」です。
 *     →  それ以外のボタンに割り当てたい場合は、
 *        エディタの並列処理でコモンイベント「スキップモードON」を呼び出すか、
 *        このソースを改変してください。
 * ・スキップ時のスピードは、「早送り時のスピード×スキップ倍数」となります。
 * ・スキップを一時的に禁止したい場合は、
 *   プラグインコマンド「スキップモードOFF」を実行してください。
 * 
 * 
 * ＜かばうの条件変更について＞
 * ・制御フラグ：身代わりが付いたキャラは、
 *   デフォルトではHPが１／４以下の味方を１００％かばう仕様です。
 *     →  これだと、かばうキャラが戦闘不能になるまで、
 *        延々と身代わりして死んでしまうのが、ちょっと扱いづらいです。
 * ・この機能をONにすると、
 *   かばわれるキャラ、かばわれる側それぞれに、
 *   「HPやMPがいくら以下」か、かつ「○％の確率で」などの条件を、
 *   プラグインのパラメータで自由に変えられるようにしました。
 *
 * 
 * 
 * 【競合について】
 * ・このプラグインは、下記メソッドを上書きしています。
 *   他のプラグインとの競合に注意してください。
 * 
 * ・このプラグインは、パラメータで各種機能をON/OFFすることで、
 *   競合対策をしています。
 *   ※メソッドの上書きは、各種「【機能】○○」パラメータをONにした時だけです。
 *   ※個別で「【機能】○○」パラメータをOFFすることで、上書きを禁止でき、
 *     競合を避けられます。
 *   ※ただし、プラグインリストで、このプラグインよりも
 *    「下にある」プラグインがこれらのメソッドの上書きしていると、
 *     正常に動きません。
 *      → 上記メソッドを丸ごと上書きしているプラグインは、
 *        このプラグインの「上」においてください。
 * 
 * ・パラメータ「【機能】スピード変更」がONの時、下記メソッドを上書き
 *    rpg_scenes.jsの、Scene_Map.prototype.isFastForward
 *      → 「マップ上で早送りボタンが長押しされている時」のデフォルトを、
 *        「マップ上で、各種早送りボタン（ok/shiftなど）が有効の時のみ、
 *          長押し押されているとtrue」という機能に置き換えています。
 *    Window_BattleLog.prototype.updateWaitCount
 *    Scene_Map.prototype.updateMainMultiply
 *    Scene_Map.prototype.encounterEffectSpeed
 *    Scene_Map.prototype.updateEncounterEffect
 *    Scene_Map.prototype.startEncounterEffect
 *    Sprite_Animation.prototype.update
 *    Sprite_Enemy.prototype.update
 *    Sprite_Weapon.prototype.animationWait
 *    Sprite_Actor.prototype.motionSpeed
 *    Sprite_Actor.prototype.updateMove
 *   
 *
 *  ・パラメータ「【機能】ステータス限界値変更」がONの時、下記メソッドを上書き
 *     rpg_object.jsの、Game_BattlerBase.prototype.paramMax
 *       → ステータス限界値の変更を、このプラグインのパラメータで
 *         動的に変更できるようにしています。
 * 
 * 
 *  ・パラメータ「【機能】戦闘を検知するか」
 *    がONの時、下記メソッドを上書き
 *     BattleManager.endBattle
 *       → 戦闘勝利や逃走・中断時に、指定したスイッチをONにして、自動実行可能に。
 *     BattleManager.updateBattleEnd
 *       → ゲームオーバー制御のため。
 *        （ランダムエンカウントや敗北分岐の無いの敵に負けても、ゲームオーバーにせず、
 *          指定したスイッチをONにして、コモンイベントで自動実行or検出可能にする機能）
 *     Game_Player.prototype.executeEncounter
 *       → ランダムエンカウント制御のため。
 *        （エンカウント開始直後に、指定したスイッチをONにして、
 *          ランダムエンカウント時は敵グループIDを指定した変数に格納）
 * 
 *  ・「【機能】身代わり条件を変えるか」パラメータがONの時、下記メソッドを上書き
 *     BattleManager.checkSubstitute
 *     BattleManager.applySubstitute;
 *       → 身代わり条件の変更のため。
 *
 *  ・下記メソッドを　【追加定義】
 *    ■Game_Interpreter.prototype.pluginCommand
 *    ■Game_Interpreter.prototype.command230
 *    ■Game_Interpreter.prototype.command301
 *    ■Game_Battler.prototype.performSubstitute
 *    ■Window_Message.prototype.updateShowFast
 *    ■Window_Message.prototype.updateInput
 *    ■Window_ScrollText.prototype.scrollSpeed
 *    ■Window_Message.prototype.processEscapeCharacter
 *    ■Window_BattleLog.prototype.messageSpeed
 *  　   → 通常の使い方では問題ないです。
 *       → 上記メソッドを丸ごと上書きしているプラグインは、
 *         このプラグインの「上」においてください。
 *         それでも、予期せぬ動作が起こる場合は、これらのメソッドを
 *         呼び出しているプラグインをOFFにして使ってください。

 * 
 * 【開発者用メモ （※ツクラーさんは読まなくて大丈夫です）】
 * (0)プラグイン競合スクリプトの書き方：
 *   ・プラグイン作成時は、他のプラグインとの競合に注意が必要です。
 *       競合とは、同名メソッド
 *      （例えばオプション項目を追加する、Window_Options.prototype.addGeneralOptions = function()など）
 *       を上書きするプラグインのリストの下に、
 *      「まったく同じ名前の」同名メソッドを定義したプラグインがある場合、
 *        複数のプラグインをONにしても、
 *      「一番下にあるプラグインの同名メソッドしか機能しない」ことにより、
 *       ゲーム中に意図しない動作を引き起こすことです。
 *
 * (1)追加定義による競合対策
 *   ・このプラグインでは、以下のような競合に強い書き方をしています。
 *       同名メソッドを上書きする前に、新規メソッドに代入し、
 *       その中で、別名メソッド.call(this, 引数1, 引数2, ...)や、
 *       別名メソッド.apply(this, arguments)を呼ぶことで、
 *       複数のプラグインをONにしても、
 *      「全てのプラグインの同名メソッドが順に実行される」ように出来ます。
 *=============================================================================
 * ＜記述例＞
 * var _hoge = hoge;
 * hoge = function(引数) {
 *   var ret = _hoge.apply(this, arguments); // 上書き後メソッドの最初に、上書き前メソッドを呼び出す。
 *   追加したい処理;                          // この行から、上書き後のメソッドの処理を実行。 
 *   return ret;                            // 返り値を忘れないようにね。そうしないと、予期せぬエラーに悩まされるよ。
 * };
 *=============================================================================
 * ＜実際の記述例＞
 *   // (1)デフォルトのメソッドを別名に置き換え、(2)上書き後のメソッドの中で、(3)applyやcallを使って呼び出すことで、このプラグインより上でONにされている、同じメソッドを上書きするプラグインとの競合を回避できます。
 *   var _KeyboardConfig_Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions; // (1)上書き前のメソッドを退避
 *   Window_Options.prototype.addGeneralOptions = function() {                                          // (2)上書き後
 *	     var ret = _KeyboardConfig_Window_Options_addGeneralOptions.apply(this, arguments);             // (3)上書き後メソッド内で、上書き前メソッドを呼び出す。
 *       // ↓  この行から、上書き後のメソッドの処理を記述しています。
 *	     this.addKeyConfigCommand();                                                   
 *       return ret;                                  
 *   };
 * =============================================================================
 * ↑ このようにすることで、競合を出来る限り回避できます。プラグイン作成時は、これを基本としてください。
 * 
 * 
 * (2)分岐による競合対策
 *  ※ただし、この方法は、「元のメソッドに処理を追加する」場合にしか使えません。
 *    そこで、元のメソッドの処理を呼び出さず、「内容そのものを置き換える」場合は、このようにします。
 *=============================================================================
 * ＜実際の記述例＞
 *   var _hoge = hoge;
 *   hoge = function (引数1, 引数2, ...) {
 *       if(特定条件){                                        // このプラグインの機能が不要なら
 *           return _hoge.apply(this, arguments);            // 元のメソッドを呼び出す。.call(this, 引数1, 引数2, ...)よりapplyの方がコピペミスを防げていいよ。
 *       }else{
 *           return 変更した処理;                             // 返り値は、元のメソッドを同じ性質のものを返そうね。でないと、使う側が混乱するよ。
 *      }
 *  }
 * =============================================================================
 *  ↑ このようにすることで、パラメータや特定の条件を元の処理を上書きせず、
 *    保持したまま、元メソッドの機能を変更することが出来ます。
 *  ※ただし、この場合、プラグインリストで、このプラグインよりも
 *   「下にある」プラグインがこのメソッドを上書きしている場合、
 *    正常に動かないことに注意してください。
 * 
 *  余談: いずれはVisualStudioCodeにフォルダ内検索が実装され、
 *       競合チェックも簡単になるのでは…（もうなりましたね。よかった！）。
 *
 *
 * 【謝辞】
 * ・トリアコンタンさん (http://triacontane.blogspot.jp)
 *   → 主にIconDescription.jsのソースを参考にさせていただいてます。感謝！
 * ・マンカインドさん (https://twitter.com/mankind_games)
 *   → 主にMKR_ControlCharacterEx.jsのソースを参考にさせていただいてます。感謝！
 * ・T.Akatsukiさん(http://utakata-no-yume.net/gallery/plugin/tkmv/msg_skip/)
 *   → 主にUTA_MessageSkip.jsのソースを参考にさせていただいています。感謝！
 *
 * 
 * 【著作権について】
 * このプラグインはMITライセンスです。
 *     ・「地球の共有物（パブリックドメイン）」と、MITライセンスは、
 *       著作権情報の明記以外、ほとんど変わりありません。
 *     ・無償・有償問わず、あらゆる作品に使用でき、
 *       また自由に改変・改良・二次配布できます。
 *     ・著作表示のわずらわしさを回避するため、merusaiaの著作権は放棄します。
 *       事後報告、クレジット記載は「Tachi」とだけ入れてください。
 *     ・もちろんクローズドに使っていただいてもOKです。
 *       是非、自分好みに改造してお使いください。
 *     ・改変・再配布時は、以下のMITライセンス全文は消さないでください。
 *       よろしくお願いします。
 *     ・なお、ソース内のコメントなどは、必要に応じて消していただいて結構です。
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 * おわび：
 *   パラメータの説明が切れて見にくい場合は、
 *   実際のソースのjsファイルを参考にしてください。
 *   端的に説明できず、申し訳ないです……）
 *
 * @param ※表示領域の調整方法
 * @desc 上のバー項目の境目「｜」をドラッグすると、項目表示の横幅が調整できます。項目名が見にくい場合、調整してみてください。
 * @default 上のバー「｜」ドラッグで横幅調整可能
 *
 * @param デバッグ出力するか
 * @desc 初期値=OFF。速度情報や早送り、スキップモードON/OFFタイミングを出力するかです。ONでも本番時は表示されません。
 * @default OFF
 *
 * @param ■スピードの変更
 * @desc 以下は、「【機能】スピード変更」がONの時だけ有効です。制御文字「\.」や「\|」のウェイトは別判定です。
 * @default 
 * 
 * @param 【機能】スピード変更
 * @desc 初期値=ON。競合対策。このプラグインの機能を使うならON。他のプラグインでスピード変更を行う場合はOFFにしてください。
 * @default ON
 *
 * @param スピード倍率の設定
 * @desc このゲームの速度を設定します。変数で動的に変更可能なものは「可変」、静的なものは「標準」を参照してください。
 * @default ↓は上がONの時だけ有効
 * 
 * @param 「＼.」の待ちフレーム数
 * @desc 初期値=15。制御文字「\.」利用時に待機するフレーム数です。(60フレーム=1秒)。ここだけ、制御文字\V[n]が使えます。
 * @default 15
 *
 * @param 「＼|」の待ちフレーム数
 * @desc 初期値=60。制御文字「\|」利用時に待機するフレーム数です。(60フレーム=1秒)。ここだけ、制御文字\V[n]が使えます。
 * @default 60
 *
 * @param ↓可変スピード倍率変更
 * @desc 以下は、ゲーム中に変更可能なスピード(1-9)や倍数(○倍)を格納する、変数番号を入れます。設定しなくても構いません。
 * @default ↓変数番号を入力
 * 
 * @param 可変ゲームスピードを格納する変数番号
 * @desc 初期値=0。15（\V[15]）など。変数値は1-9で、各種スピードが自動調整されます。未定義か0の場合、標準スピードが適応されます。
 * @default 0
 * 
 * @param 可変メッセージウェイト制御文字スピードを格納する変数番号
 * @desc 初期値=0。16（\V[16]）など。変数値は「\.」「\|」の速さで、1-9。未定義か0の場合、標準スピードが適応されます。
 * @default 0
 * 
 * @param 可変イベント早送り倍数を格納する変数番号
 * @desc 初期値=0。301（\V[301]）などが使いやすいです。未定義や0だと早送りイベントスピード倍数（後述）になります。
 * @default 0
 *
 * @param 可変戦闘早送り倍数を格納する変数番号
 * @desc 初期値=0。302（\V[302]）などが使いやすいです。未定義や0だと各種早送り戦闘倍数（後述）になります。
 * @default 0
 *
 * @param 可変スキップ倍数を格納する変数番号
 * @desc 初期値=0。303（\V[303]）などが使いやすいです。未定義や0だと「デフォルトスキップ倍数」（後述）になります。
 * @default 0
 * 
 * @param ↓標準スピード倍率
 * @desc 以下は、このゲームの標準速度を設定します。制御文字「\.」や「\|」、ウェイトには無効です。
 * @default ↓整数を入力
 * 
 * @param 標準イベントスピード
 * @desc 初期値=1。ツクールデフォルトに対する、イベント速度倍率です。制御文字「\.」などには無効。
 * @default 1
 * 
 * @param 標準戦闘ログスピード
 * @desc 初期値=2。ツクールデフォルトは1。戦闘ログ一行毎の_waitCount減少数です。早いと感じる場合は1か0にしてみてください。
 * @default 2
 * 
 * @param 標準戦闘敵スプライトスピード
 * @desc 初期値=2。ツクールデフォルトは1。敵キャラの状態異常や倒れエフェクト速度です。
 * @default 2
 * 
 * @param 標準戦闘武器モーションスピード
 * @desc 初期値=1。ツクールデフォルトは1。サイドビューキャラの武器・戦闘モーション速度です。
 * @default 1
 * 
 * @param 標準戦闘移動スピード
 * @desc 初期値=2。ツクールデフォルトは1。サイドビューキャラの移動速度です。
 * @default 2
 * 
 * @param 標準戦闘アニメーションスピード
 * @desc 初期値=1。ツクールデフォルトは1。スキルエフェクトのアニメーション倍率です。
 * @default 1
 * 
 * 
 * @param ↓早送りスピード倍率
 * @desc 早送りボタンの押し中の、各種スピード倍率。標準スピードを上書き。制御文字「\.」や「\|」、ウェイトは早送り不可。
 * @default ↓整数を入力
 * 
 * @param 早送りイベントスピード
 * @desc 初期値=2。ツクールデフォルトは2。早送り時のイベント速度倍率を調整します。
 * @default 2
 * 
 * @param 早送り戦闘ログスピード
 * @desc 初期値=20。ツクールデフォルトは3。早送り時の戦闘ログ一行毎の_waitCount減少数です。早いと感じる場合は3か2にしてみてください。
 * @default 20
 * 
 * @param 早送り戦闘敵スプライトスピード
 * @desc 初期値=6。ツクールデフォルトは1。早送り時の敵キャラの状態異常や倒れエフェクト速度です。
 * @default 6
 * 
 * @param 早送り戦闘武器モーションスピード
 * @desc 初期値=6。ツクールデフォルトは1。早送り時のサイドビューキャラの武器モーション速度です。
 * @default 6
 * 
 * @param 早送り戦闘移動スピード
 * @desc 初期値=8。ツクールデフォルトは1。早送り時のサイドビューキャラの移動速度です。
 * @default 8
 * 
 * @param 早送り戦闘アニメーションスピード
 * @desc 初期値=2。ツクールデフォルトは1。早送り時のスキルエフェクトのアニメーション倍率です。
 * @default 2
 * 
 * 
 * @param ↓早送りボタンの有効/無効化
 * @desc 以下は、各種ボタンの押しっぱなしで、ゲームが早送りできるかを設定します。ゲームの中の変更はコモンイベントで。
 * @default "↓ON/OFFを入力"
 * 
 * @param 決定ボタンでイベント早送り可能か
 * @desc 初期値=ON。整数で入力。決定(z)ボタン押しっぱなしで、マップの移動やイベントを早送りするかです。ゲーム中は変更不可。
 * @default ON
 * 
 * @param 決定ボタンで戦闘早送り可能か
 * @desc 初期値=ON。整数で入力。決定(z)ボタン押しっぱなしで、戦闘を早送りするかです。ゲーム中は変更不可。
 * @default ON
 * 
 * @param キャンセルボタンでイベント早送り可能か
 * @desc 初期値=ON。整数で入力。キャンセル(x)ボタン押しっぱなしで、マップの移動やイベントを早送りするかです。ゲーム中は変更不可。
 * @default ON
 * 
 * @param キャンセルボタンで戦闘早送り可能か
 * @desc 初期値=ON。整数で入力。キャンセル(x)ボタン押しっぱなしで、戦闘を早送りするかです。ゲーム中は変更不可。
 * @default ON
 * 
 * @param ダッシュボタンでイベント早送り可能か
 * @desc 初期値=OFF。ダッシュ(SHIFT)ボタン押しっぱなしで、マップの移動やイベントを早送りするかです。ゲーム中は変更不可。
 * @default OFF
 *
 * @param ダッシュボタンで戦闘早送り可能か
 * @desc 初期値=OFF。ダッシュ(SHIFT)ボタン押しっぱなしで、戦闘を早送りするかです。ゲーム中は変更不可。
 * @default OFF
 * 
 *
 * @param ↓スキップボタンの有効/無効化
 * @desc 以下は、各種ボタンの押しっぱなしで、スキップできるかを設定します。操作性向上の為、ボタンは限定しています。
 * @default "↓ON/OFFを入力"
 * 
 * @param 決定ボタンでスキップ可能か
 * @desc 初期値=OFF。決定(z)ボタン押しっぱなしで、スキップできるかです。※早送りと同時実行可能。
 * @default OFF
 *
 * @param キャンセルボタンでスキップ可能か
 * @desc 初期値=OFF。決定(cancel)ボタン押しっぱなしで、スキップできるかです。※早送りと同時実行可能。
 * @default OFF
 *
 * @param ダッシュボタンでスキップ可能か
 * @desc 初期値=ON。ダッシュ(Shift)ボタン押しっぱなしで、スキップできるかです。※早送りと同時実行可能。
 * @default ON
 *
 * @param ↓スキップのシーン毎の有効/無効化
 * @desc 以下は、各種シーンで、スキップできるかを設定します。
 * @default "↓ON/OFFを入力"
 * 
 * @param マップイベント中もスキップ可能か
 * @desc 初期値=ON。マップのイベント中にスキップできるかです。動的な変更はスキップ禁止中か（後述）を使ってください。
 * @default ON
 *
 * @param マップ移動中もスキップ可能か
 * @desc 初期値=ON。マップのイベント中だけでなく、十字キーの移動中もスキップできるかです。動的な変更はスキップ禁止中か（後述）を使ってください。
 * @default ON
 *
 * @param マップ無操作中もスキップ可能か
 * @desc 初期値=ON。マップのイベント中だけでなく、何も操作してない中もスキップできるかです。動的な変更はスキップ禁止中か（後述）を使ってください。
 * @default ON
 *
 * @param 戦闘中もスキップ可能か
 * @desc 初期値=ON。戦闘イベント中にスキップできるかです。動的な変更はスキップ禁止中か（後述）を使ってください。
 * @default ON
 *
 * @param ↓スキップ機能詳細
 * @desc スキップ時の有効/無効化と、スキップ倍率です。ゲーム中に変更可能。「\.」や「\|」、ウェイトもすっ飛ばします。
 * @default ↓整数を入力
 * 
 * @param デフォルトスキップ倍数
 * @desc 初期値=50。スキップ倍率が見つからなかった時、早送り時に掛け算する値です。「\.」、「\|」、ウェイトもすっ飛ばします。
 * @default 50
 *  
 * @param スキップ中かを格納するスイッチ番号
 * @desc 初期値=0（無効）。8（\V[8]）などが使いやすいです。スキップ中に自動的にON/OFFするスイッチ番号です。
 * @default 0
 * 
 * @param スキップ禁止中かを格納するスイッチ番号
 * @desc 初期値=0（無効）。9（\V[9]）などが使いやすいです。このスイッチをONだと、スキップボタンによるユーザのスキップを禁止します。
 * @default 0
 *
 * 
 * @param ＜スピードの変更、終わり＞
 * @desc 
 * @default 
 * 
 * 
 * @param ■パラメータの変更
 * @desc 
 * @default 
 *  
 * @param 【機能】ステータス限界値変更
 * @desc 初期値=OFF。競合対策。このプラグインで、パラメータ限界値を変更するかを設定します。他のプラグインを使う場合はOFFにしてください。
 * @default OFF
 * 
 * @param ↓パラメータ限界値の変更
 * @desc 以下は、パラメータの限界値を変えたい時に使ってください。デフォルトから変更したくなければ、そのままでOKです。
 * @default ↓は上がONの時だけ有効
 * 
 * @param 最大HPの限界値
 * @desc 初期値=99999。最大HPの限界値です。敵味方共通。エディタで10万以上を設定したい場合は、他プラグインを使ってください。
 * @default 99999
 * 
 * @param 最大MPの限界値
 * @desc 初期値=999。最大MPの限界値です。敵味方共通。エディタで1000以上を設定したい場合、他プラグインを使ってください。
 * @default 999
 * 
 * @param 攻撃力などの限界値
 * @desc 初期値=999。攻撃力などその他能力値の限界値です。エディタで1000以上を設定したい場合、他プラグインを使ってください。
 * @default 999
 * 
 * @param ＜パラメータの変更、終わり＞
 * @desc 
 * @default 
 * 
 * @param ■その他の機能
 * @desc 
 * @default 
 * 
 * @param 【機能】戦闘を検知するか
 * @desc 初期値=OFF。競合対策。ONだと、戦闘の勝利時、全滅時に、指定したスイッチがONになります。
 * @default OFF
 * 
 * @param ↓戦闘の検知
 * @desc 以下は、戦闘の開始と終了を検知したい時に使ってください。デフォルトから変更したくなければ、そのままでOKです。
 * @default ↓は上がONの時だけ有効
 * 
 * @param ↓戦闘時の変数制御
 * @desc 以下は、戦闘時に自動的に値が入る、変数番号を入れます。スクリプトによる変数更新が面倒な場合などに使ってください。
 * @default ↓変数番号を入力
 * 
 * @param 最後に戦闘した敵グループIDを格納する変数番号
 * @desc 初期値=0。（5。\V[5]が使いやすいです)。ランダムエンカウントでも取ります。適時、敵グループイベントで参照してね。
 * @default 0
 * 
 * @param ↓戦闘時のスイッチ制御
 * @desc 以下は、戦闘時に自動にONになる、スイッチ番号。コモンイベントの自動実行などで使う場合、最後に必ずOFFにしてね。
 * @default ↓スイッチ番号を入力
 * 
 * @param 戦闘中かを格納するスイッチ番号
 * @desc 初期値=O。（53。\V[53]が使いやすいです）。戦闘中だけ指定したスイッチがONになります。
 * @default 0
 * 
 * @param ランダムエンカウント時にONになるスイッチ番号
 * @desc 初期値=0。（5。\V[5]が使いやすいです)。値はイベント戦闘ではOFFになります。適時、敵グループイベントで参照してね。
 * @default 0
 * 
 * @param 戦闘全滅時にONになるスイッチ番号
 * @desc 初期値=0。（2が使いやすいです)。イベント戦闘でも有効ですが、「負けた時」のイベントが総て終わった後に実行されます。
 * @default 0
 * 
 * @param 戦闘逃走時にONになるスイッチ番号
 * @desc 初期値=0。（3が使いやすいです)。イベント戦闘でも有効ですが、「逃げた時」のイベントが総て終わった後に実行されます。
 * @default 0
 * 
 * @param 戦闘勝利時にONになるスイッチ番号
 * @desc 初期値=0。（4が使いやすいです)。イベント戦闘でも有効ですが、「勝った時」のイベントが総て終わった後に実行されます。
 * @default 0
 * 
 * @param 【機能】身代わり条件を変えるか
 * @desc 初期値=OFF。ツクールデフォルト（HPが25％以下だと必ずかばう）にしたい場合は、OFFにしてください。
 * @default OFF
 * 
 *
 * @param ↓身代わり条件の変更
 * @desc 以下は、身代わり条件を変えたい時に使ってください。デフォルトから変更したくなければ、そのままでOKです。
 * @default ↓は上がONの時だけ有効
 *
 * @param かばわれる側の最大HP％0-100
 * @desc 初期値=25。「HPが何％以下の仲間がかばわれるか」の条件を追加します。100なら必ず満たします。
 * @default 25
 * 
 * @param かばわれる側の最大MP％0-100
 * @desc 初期値=100。「MPが何％以下の仲間がかばわれるか」の条件を追加します。100なら必ず満たします。
 * @default 100
 * 
 * @param かばう側の最小HP％0-100
 * @desc 初期値=1。「HPが何％以上の仲間がかばうか」の条件を追加します。0なら、はじめにかばったキャラが死ぬまでかばいます。
 * @default 1
 * 
 * @param かばう側の最小MP％0-100
 * @desc 初期値=1。「MPが何％以上の仲間がかばうか」の条件を追加します。0なら必ず満たします。
 * @default 1
 * 
 * @param 身代わり率％0-100
 * @desc 初期値=99。整数で入力。かばう条件を満たした時に、かばう確率です。100でも、条件を満たしていなければかばいません。
 * @default 99
 *
 * 
 * @param 最後にかばわれたアクターIDを格納する変数番号
 * @desc 初期値=0。（281。\V[281]が使いやすいです)。※一度の戦闘で二回以上身代わりが起こると、最後のものに更新されます。
 * @default 0
 *
 * @param 最後にかばったアクターIDを格納する変数番号
 * @desc 初期値=0。（282。\V[282]が使いやすいです)。※一度の戦闘で二回以上身代わりが起こると、最後のものに更新されます。
 * @default 0
 *
 * @param 最後にかばわれた敵キャラIDを格納する変数番号
 * @desc 初期値=0。（283。\V[283]が使いやすいです)。※一度の戦闘で二回以上身代わりが起こると、最後のものに更新されます。
 * @default 0
 *
 * @param 最後にかばった敵キャラIDを格納する変数番号
 * @desc 初期値=0。（284。\V[284]が使いやすいです)。※一度の戦闘で二回以上身代わりが起こると、最後のものに更新されます。
 * @default 0
 * 
 * @param 味方の身代わり成功時に実行するコモンイベント番号
 * @desc 初期値=0。（280が使いやすいです)。アクター同士がかばう直前に自動実行されるコモンイベント番号です。
 * @default 0
 *
 * @param 敵の身代わり成功時に実行するコモンイベント番号
 * @desc 初期値=0。（281が使いやすいです)。敵キャラ同士がかばう直前に自動実行されるコモンイベント番号です。
 * @default 0
 *
 * @param ＜その他の変更、終わり＞
 * @desc 
 * @default 
 * 
 * 
 */

(function () {
    'use strict'; // javascriptの構文チェックを少しだけ厳密にします。効果があるのなら、変数宣言varの省略もエラーになるはずだが…？ http://analogic.jp/use-strict/

    //=============================================================================
    // ローカル関数
    //=============================================================================

    // ==============================================================================
    // パラメータに制御文字"\V[n]"が使える変数・スイッチを実現するためのメソッド。
    // ※mankindさんのMKR_ControlCharacterEx.jsを参考にしています。感謝。
    // ==============================================================================
    // ■制御文字"\V[n]"が入っている時、その変数の値を返すメソッド
    /** 引数のtextに、'\V[n]'（nは整数）という表記が見つかったら、ゲーム内変数の値に置き換えます。それ以外はtextをそのまま返します。 */
    var ConvertEscapeCharacters = function (text) {
        text = String(text);                    // textは文字列型に治すよ。次の２行は、'\\'を'\'にするための保険の処理（？）だよ。
        text = text.replace(/\\/g, '\x1b');     // '\'というのが見つかったら、'\x1b'というエスケープシーケンスに置き換えるよ。
        text = text.replace(/\x1b\x1b/g, '\\'); // エスケープシーケンスが２つつながってたら、'\'におきかえるよ。

        text = text.replace(/\x1bV\[(\d+)\]/gi, function () {     // '\V[n]'(nは整数)というのが見つかったら、変数値に変えるよ。
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));

        text = text.replace(/\x1bV\[(\d+)\]/gi, function () {     // '\V[\V[n]]'みたいなのがあるから、もう一回やっとくよ。
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));

        return text;                            // じゃなかったら、そのままの文字列を返してね。
    };
    // ■制御文字"\V[n]"が入っている可能性がある変数を、中身を見て、Boolean型で評価して返すメソッド。
    /** 引数のparamに、tureを意味する値が入っているかどうかを返します。
     * ・paramにtrueやfalseのBoolean型、1や0の数値、"1"などの文字列、"V[n]"の制御文字が入っている際もその変数の値を取得して判定します。 
     * ・trueを返す条件は、値が"ON"か"On"か"on"、"TRUE"とか"True"とか"true"とか、"1"(文字列)や1(数値)もtrue。それ以外、"オン"や"0"や0以下の数値、2以上の数値はfalseを返します。*/
    var getVarAsBool = function (param) {
        // 大文字に変更する処理や正規表現が重いかもしれないので、型を見てすぐ判定できるやつはreturnで返して、消去法に持ち込む。
        var isON = false;
        // paramが""やnullやundefinedなら、falseを返すよ。
        if (param === '' || param === null || param === undefined) return false;
        // paramが配列の時、全部falseになる。たぶんparam[index]を忘れているので、一応デバッグ中だけアラートする。
        if (Array.isArray(param)) {
            if (_isDebugMode() === true) {
                alert('getVarAsBool(param)の引数に、配列を渡しています。a[i]などを忘れている可能性が高いです。  falseを返します。');
            }
            return false;
        }
        // paramがBoolean型の時
        if (param === true) return true; // trueなら、大文字に変更する必要はないよ。
        if (param === false) return false; // falseでも、大文字に変更する必要はないよ。
        // paramがNumber型の時
        if (param === 1) return true; // 数値の1ならtrueだよ。
        if (Number.isNaN(param) || param === Infinity || param === -Infinity) return false; // NaN(数えられない数)でも、±Infinity（∞）でも、falseだよ。
        // paramがString型の時
        if (param instanceof String) {              // paramがString型なら、初めて、大文字に変換して、文字列として値を見るよ。
            var upperParam = param.toUpperCase(); // 大文字小文字を分けてみるのが面倒だから、大文字化しちゃうよ。
            isON = (upperParam === 'ON' || upperParam === 'TRUE' || param === '1');
            if (isON === false) { // falseなら、"\V[n]"などが入っている可能性があるから、変数の値を見るよ。
                var varValue = ConvertEscapeCharacters(param); // 変数の値を代入してるよ。
                var upperValue = varValue.toUpperCase();       // 大文字化しちゃうよ。
                isON = (upperValue === 'ON' || upperValue === 'TRUE' || varValue === '1');
            }
        }
        return isON;
    };
    // ■制御文字"\V[n]"が入っている可能性がある変数を、中身を見て、Number型で評価して返すメソッド。
    /** 引数のparamに制御文字"\V[n]"が入っている可能性がある変数を、中身を見て数値で返します。
     * ・paramにtrueやfalseのBoolean型、1や0の数値、"1"などの文字列、"V[n]"の制御文字が入っている際もその変数の値を数値として判定します。 
     * ・trueは1、falseは0、"1"(数字の文字列)は1(数値)、nullやundefinedは0に置き換えられます。
     * ・NaNやInfinity、-Infinityはそのまま返します。*/
    var getVarAsNumber = function (param) {
        // 大文字に変更する処理や正規表現が重いかもしれないので、型を見てすぐ判定できるやつはreturnで返して、消去法に持ち込む。
        var value = 0;
        // paramが""やnullやundefinedなら、0を返すよ。
        if (param === '' || param === null || param === undefined) return 0;
        // paramが配列の時、全部falseになる。たぶんparam[index]を忘れているので、一応デバッグ中だけアラートする。
        if (Array.isArray(param)) {
            if (_isDebugMode() === true) {
                alert('getVarAsNumber(param)の引数に、配列を渡しています。a[i]などを忘れている可能性が高いです。  0を返します。');
            }
            return 0;
        }
        // paramがBoolean型の時
        if (param === true) return 1;   // trueなら、大文字に変更する必要はないよ。
        if (param === false) return 0; // falseでも、大文字に変更する必要はないよ。
        // paramがNumber型の時
        if (Number.isNaN(param) || param === Infinity || param === -Infinity) return param; // NaN(数えられない数)でも、±Infinity（∞）は、そのまま返す。
        // paramがNumber型もしくはString型の数値のみの時
        if (isFinite(param)) return parseInt(param, 10); // 数値に変換できるなら、数値にして返すよ。isFinite("1")はtrue、となります。Number.isFinite("1")はfalseですので、きをつけて。
        // paramがString型の時
        if (param instanceof String) {              // paramがString型なら、初めて、大文字に変換して、文字列として値を見るよ。
            var upperParam = param.toUpperCase(); // 大文字小文字を分けてみるのが面倒だから、大文字化しちゃうよ。
            if (upperParam === 'ON' || upperParam === 'TRUE' || param === '1') return 1;
            // ここまで来ても値が決まらないなら、"\V[n]"などが入っている可能性があるから、変数の値を見て、代入するよ。
            value = Number(ConvertEscapeCharacters(param)); // 変数の値を代入して、数値に変換してるよ。
            if (Number.isNaN(value)) {                        // 変換できない場合はNaNが入るよ。
                value = 0;                                  // 変換できない場合は、一律、0。
            }
        }
        return value;
    };
    // ■制御文字"\V[n]"が入っている可能性がある変数を、中身を見て、String型で評価して返すメソッド。
    /** 引数のparamに制御文字"\V[n]"が入っている可能性がある変数を、中身を見て、その値を文字列で返します。
     * ・paramにtrueやfalseのBoolean型、1や0の数値、"1"などの文字列、"V[n]"の制御文字が入っている際もその変数の値を文字列として判定します。 
     * ・trueは"ON"、falseは"OFF"、1は"1"(数字の文字列)、nullやundefinedは""に置き換えられます。
     * ・NaNやInfinity、-Infinityは""を返します。*/
    var getVarAsString = function (param) {
        // 大文字に変更する処理や正規表現が重いかもしれないので、型を見てすぐ判定できるやつはreturnで返して、消去法に持ち込む。
        var str = '';
        // paramが""やnullやundefinedなら、""を返すよ。
        if (param === '' || param === null || param === undefined) return '';
        // paramが配列の時、全部falseになる。たぶんparam[index]を忘れているので、一応デバッグ中だけアラートする。
        if (Array.isArray(param)) {
            if (_isDebugMode() === true) {
                alert('getVarAsString(param)の引数に、配列を渡しています。a[i]などを忘れている可能性が高いです。  ブランク””を返します。');
            }
            return '';
        }
        // paramがBoolean型の時
        if (param === true) return 'ON';   // trueなら、大文字に変更する必要はないよ。
        if (param === false) return 'OFF'; // falseでも、大文字に変更する必要はないよ。
        // paramがNumber型の時
        if (Number.isNaN(param) || param === Infinity || param === -Infinity) return ''; // NaN(数えられない数)でも、±Infinity（∞）は、""を返す。
        // paramがNumber型もしくはString型の数値のみの時
        if (isFinite(param)) return String(param); // 数値に変換できるなら、文字列にして返すよ。isFinite("1")はtrue、となります。Number.isFinite("1")はfalseですので、きをつけて。
        // paramがString型の時
        if (param instanceof String) {              // paramがString型なら、初めて、大文字に変換して、文字列として値を見るよ。
            var upperParam = param.toUpperCase(); // 大文字小文字を分けてみるのが面倒だから、大文字化しちゃうよ。
            if (upperParam === 'ON' || upperParam === 'TRUE' || param === '1') return 1;
            // ここまで来ても値が決まらないなら、"\V[n]"などが入っている可能性があるから、変数の値を見て、代入するよ。
            str = ConvertEscapeCharacters(param); // 変数の値を代入してるよ。
        }
        return str;
    };
    // ■パラメータに制御文字が入っている時は、そのままおいておく、パラメータ代入メソッド (呼び出す毎にgetVarAs***を呼び出す必要がある)。
    /** パラメータの値paramを厳格に型typeを指定して、代入します。
     * ・'\V[n]'という文字列が入っていたら、'\x1bV[n]'という、エスケープシーケンスを使った表記に置きかえます。こうすることで、変数参照時にgetVarAs***(param)を呼び出すと、"\V[n]"の値を見れます。
     * ・'\V[n]'が見つからなかったら、typeが"bool"の場合は、"ON"か"On"か"on"だけtrue。それ以外はfalseです。paramが定義されてなかったら、defの値、defが定義されていなかったら0です。 
     * ・'\V[n]'が見つからなかったら、typeが"num"の場合は、数値なら十進数に直します。数値でなかったら、defの値、defが定義されていなかったら0です。 
     * */
    var CheckParam = function (type, param, def) {
        var regExp;
        regExp = /^\x1bV\[\d+\]$/i;           // 引数paramの中に、'\V[n]'（nは整数）という文字列がないか、正規表現で探すよ。
        param = param.replace(/\\/g, '\x1b'); // 引数paramの中に、'\'というのが見つかったら、'\x1b'というエスケープシーケンスに置き換えるよ。
        if (regExp.test(param)) {              // 引数paramの中に、'\V[n]'というのがみつかったら、
            return param;                     // paramをそのままを返すよ。値の代入は、あとで、ConvertEscapeCharactersでやるからね。
        }
        // この下の処理は、paramに'\V[n]'というのが見つからなかった時の処理だよ。
        switch (type) {
            case 'bool':     // typeが"bool"なら、trueかfalseをboolean型で返すよ。それもダメなら、def（第三引数）。それも定義されてなかったら、falseを返すよ。
                var isON = false;
                // paramが""かnullかundefinedだったら、paramをdef（デフォルト）に置き換えるよ。
                if (param === '' || param == null) {
                    param = (def) ? def : false; // デフォルトが定義されてなかったら（もしくはfalseだったら）、falseを返すよ。
                }
                // paramが配列の時、全部falseになる。bool[]ではなくここはboolのチェックなので、param[index]を忘れている。必ずアラートする。
                if (Array.isArray(param)) {
                    alert('CheckParam (type, param, def)の引数paramに、配列を渡しています。a[i]などを忘れている可能性が高いです。  falseを返します。');
                    return false;
                }
                // paramがBoolean型の時
                if (param === true) return true;   // trueなら、大文字に変更する必要はないよ。
                if (param === false) return false; // falseでも、大文字に変更する必要はないよ。
                // paramがNumber型の時
                if (param === 1) return true; // 数値の1ならtrueだよ。
                if (Number.isNaN(param) || param === Infinity || param === -Infinity) return false; // NaN(数えられない数)でも、±Infinity（∞）でも、falseだよ。
                // paramがString型の時
                if (param instanceof String) {              // paramがString型なら、初めて、大文字に変換して、文字列として値を見るよ。
                    var upperParam = param.toUpperCase(); // 大文字小文字を分けてみるのが面倒だから、大文字化しちゃうよ。
                    isON = (upperParam === 'ON' || upperParam === 'TRUE' || param === '1');
                }
                return isON;
            case 'num':      // typeが"num"なら、paramがnullか数えられる数値(※nullでもisFiniteはtrue)だったら十進数に置き換えたもの、でなかったら、def（デフォルト値）が設定されていたらデフォルト値、なかったら0を返すよ。
                // paramが配列の時、全部falseになる。Number[]ではなくここはNumberのチェックなので、param[index]を忘れている。必ずアラートする。
                if (Array.isArray(param)) {
                    alert('CheckParam (type, param, def)の引数paramに、配列を渡しています。a[i]などを忘れている可能性が高いです。  0を返します。');
                    return 0;
                }
                return (isFinite(param)) ? parseInt(param, 10) : (def) ? def : 0;
            default:         // typeがそれ以外なら、paramをそのまま返すよ。
                return param;
        }
    };
    // (b)制御文字"\V[n]"が使えるようにした、パラメータ代入メソッド
    /** 引数のparamNames([英語表記名, 日本語表記名]の配列)のパラメータの値を、
     * type（"bool"や"num"やそれ以外のString型やオブジェクト型）を考慮して、代入します。
     * ・エディタのパラメータ値に変な値が入っていると、defaultParam(デフォルト値)が入ります。
     * ・値に"V[n]"などの変数が入っている際は、そのままその文字列を返します。 
     *   →  変数参照時にgetVarAs***(param)と呼び出すと、"\V[n]"の値を任意の型に変換して、返せます。 */
    var getParam_IncludeEscapeCharactors = function (type, paramNames, defaultParam) {
        var value = getParamOther(paramNames);
        return CheckParam(type, value, defaultParam);
    };
    /** 引数のparamNames([英語表記名, 日本語表記名]の配列)のパラメータの値を、
     * Boolean型で、代入します。
     * ・エディタのパラメータ値に変な値が入っていると、defaultParam(デフォルト値)が入ります。
     * ・値に"V[n]"などの変数が入っている際は、そのままその文字列を返します。 
     *  → 変数参照時にgetVarAsBool(param)と呼び出すと、"\V[n]"の値を任意の型に変換して、返せます。 */
    var getParamBool_IncludeEscapeCharactors = function (paramNames, defaultParam) {
        var value = getParamOther(paramNames);
        return CheckParam('bool', value, defaultParam);
    };
    /** 引数のparamNames([英語表記名, 日本語表記名]の配列)のパラメータの値を、
     * Number型で、代入します。
     * ・エディタのパラメータ値に変な値が入っていると、defaultParam(デフォルト値)が入ります。
     * ・値に"V[n]"などの変数が入っている際は、そのままその文字列を返します。 
     *  → 変数参照時にgetVarAsBool(param)と呼び出すと、"\V[n]"の値を任意の型に変換して、返せます。 */
    var getParamNumber_IncludeEscapeCharactors = function (paramNames, defaultParam, min, max) {
        var value = getParamOther(paramNames);
        value = CheckParam('num', value, defaultParam);
        if(value instanceof Number){
            if (arguments.length < 3) min = -Infinity;
            if (arguments.length < 4) max = Infinity;
            value = (parseInt(value, 10) || 0).clamp(min, max); // parseIntできない時は0になるので、valueにnullやundefinedやNaNが入っていても0になるよ。
        }
        return value;
    };
    // ==============================================================================
    // パラメータに制御文字"\V[n]"が使える変数・スイッチを実現するためのメソッド、終わり。
    // ==============================================================================


    //=============================================================================
    // ツクールエディタ上で編集できる、プラグインのパラメータを取得や、プラグインコマンドの取得時に使うメソッド群です。
    // プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします。
    // トリアコンタンさん(http://triacontane.blogspot.jp/)のソースを参考に使わせていただいてます。感謝。
    //=============================================================================
    // ■数値変換出来ない時にエラーを出すメソッド
    /** 引数valueの値を10進数に変換して、その結果がNaN（数値変換できないもの）だったら、一旦、aler出力してから、エラーを吐きます。
     *  ※引数valueに文字列やオブジェクト型を許容する場合は、使わないでください。 */
    var parseIntStrict = function(value, errorMessage) {
        var result = parseInt(value, 10); // parseIntできない時はNaNになるので、valueにnullやundefinedや、±Infinity（無限大もだよ！）や文字列が入っていてもNaNになるよ。
        // (a)エラーを吐くと、プラグインそのものが無効になります。
        // if (isNaN(result)) throw Error('指定した値[' + value + ']が数値ではありません。\n■■■このプラグインを無効にします■■■。' + errorMessage);
        // (b)エラーを吐くと、プラグインそのものが無効になってしまうので、一旦、alertにします。
        if (isNaN(result)){
            alert(errorMessage);
            alert('■■■このプラグインを無効にします。■■■\.詳細はデバッグ出力を見てください');
            throw Error('指定した値[' + value + ']が数値ではありません。\n■■■このプラグインを無効にします■■■。' + errorMessage);
        }
        return result;
    };
    // ■プラグインのパラメータの基本メソッド
    /** 全てのgetParam***が、このメソッドを呼びます。
      * パラメータをを取得する際、複数言語に対応したパラメータ名を参照して、エラーが出ないように、その値を取得します。
      */
    var getParamOther = function (paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];          // 配列じゃないなら、一旦、配列化する。
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]]; // 配列の全ての要素に対して、パラメータ名が存在していれば、
            if (name) return name;                                          // その名前の値を取ってくる。
        }
        return null;
    };
    // ■String型のパラメータ
    /** パラメータが文字列型（String型）の時のチェックです。引数1がnullかundefinedなら空白""とし、引数2がtrueなら大文字に変換して渡します。
      * 引数2がない場合は、大文字に変換せずそのまま渡します。
      */
    var getParamString = function (paramNames, upperFlg) {
        var value = getParamOther(paramNames);
        return value == null ? '' : upperFlg ? value.toUpperCase() : value;
    };
    // ■Number型のパラメータ
    /**  パラメータが数値型（Number型）の時のチェックです。文字列を、引数2～引数3の範囲（min以上～max以下)に収めて、取得します。
      * 引数2や3がない場合は、-InfinityやInfinityまで許容します。
      * ただし、初期値に±Infinityが入っていると、エラーになります。
      * parseIntできない時はエラーになるので、初期値にnullやundefinedや±Infinityや文字列が入っていてもエラーになります。
      * ただ、範囲にはclamp関数を使っているので、
      * もしmaxにminより小さい値を入れてしまってもエラーにならないから、そこも注意してくださいね。
      * clamp関数の中身は、if (x < min) { x = min; return x; } else if (x > max) { x = max; return x; } となります。
      * 
      *（※補足： Infinity は無限を意味し、掛けたものは全て Infinity となり、Infinity で割ったものは全て 0 となります。
      * 0割り時のエラーは防げますが、足し引きや乗除時にどれかが±Infinityだと、計算結果によって±Infinityか0かNaNになり、
      * 後の検出が非常に困難になります。注意してください。）
    */
    var getParamNumber = function (paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseIntStrict(value, 'parseIntStrict: プラグインのパラメータ「'+paramNames+'」に指定した値: '+value+' を数値'+min+'～'+max+'に抑える過程で発生したエラーです。') || 0).clamp(min, max); // parseIntできない時はエラーになるので、valueにnullやundefinedや±Infinity（！）や文字列が入っていてもエラーになるよ。
    };
    // ■bool型のパラメータ
    /**  パラメータがtrue/falseかのチェック型。"ON"か"On"や"on"、"TRUE"や"True"や"true"、1"や1ならtrue。それ以外だとfalseになります。
      * */
    var getParamBoolean = function (paramNames) {
        var value = getParamOther(paramNames);
        // return (value || '').toUpperCase() == 'ON'; // トリアコンタンさんの元ソース。 "true"や"1"だとfalseになるので、変更しました。
        value = (value || '');                // 空文字''.toUpperCase()をやると、落ちるので。
        var upperValue = value.toUpperCase(); // 大文字小文字を分けてみるのが面倒だから、大文字化しちゃうよ。
        var isON = (upperValue === 'ON' || upperValue === 'TRUE' || value === '1');
        return isON;
    };
    // ■String[]型のパラメータ
    /**  複数の文字列パラメータを配列で持つparamNames（例：{"one", "two", "tree"}）を、半角カンマ','で分割して配列にして取得します。
      * （例：getParamArrayString(["one", "two", "tree"], }）
      */
    var getParamArrayString = function (paramNames) {
        var values = getParamString(paramNames);
        return (values || '').split(',');
    };
    // ■Number[]型のパラメータ
    /**  複数の数値パラメータを配列で持つparamNamesを、引数2～引数3の範囲（min以上～max以下)に収めて、取得します。
      * 使用例： var _v1 = getParamArrayNumber(['ParameterEnglishName', 'パラメータ日本語名'], 0, 9999);
      */
    var getParamArrayNumber = function (paramNames, min, max) {
        var values = getParamArrayString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) values[i] = (parseInt(values[i], 10) || 0).clamp(min, max);
        return values;
    };

    /**  ■getCommandName()メソッドについて注意点。
      * ※プラグインコマンドを英字で入力する場合は、スペルミスを防ぐため、名前を必ず大文字にしてチェックします。
      *  新しいプラグインコマンドを作る場合は、英字表記は必ず「全て大文字」にしてください。
      */
    var getCommandName = function (command) { // 例: プラグインコマンドが「initVariables 1 10」なら、command="initVariables"
        // 引数commandが無効な値（NaNやnullやundefined）なら空白""にし、日本語ならそのまま、英語なら大文字化して取得します。
        // （例： getCommandName("変数の初期化")→"変数の初期化"。 getCommandName("initVariables") → "INITVARIABLES"）
        return (command || '').toUpperCase();
    };
    /** ※引数textの「\」が消えるので注意してください。引数evalFlgがfalseの時、任意の引数textがnullかundefinedなら空白""に、そうでなければ文字コードを識別可能なものに統一して取得します。引数evalFlgがtrueのとき、引数textがnullかundefinedなら"0"を返し、そうでなければ、eval(text)を返します。*/
    var convertEscapeCharactersAndEval = function(text, evalFlg) {
        if (text === null || text === undefined) {
            text = evalFlg ? '0' : '';
        }
        var windowLayer = SceneManager._scene._windowLayer;
        if (windowLayer) {
            var result = windowLayer.children[0].convertEscapeCharacters(text);
            return evalFlg ? eval(result) : result;
        } else {
            return text;
        }
    };
    /** 引数argの「\」が消えるので注意してください。任意の引数argをチェックして取得します。引数upperFlgがtrueなら、全てを英字大文字に変換して返します。*/
    var getArgString = function (arg, upperFlg) {
        arg = convertEscapeCharactersAndEval(arg, false);
        return upperFlg ? arg.toUpperCase() : arg;
    };
    /** 任意の引数argを整数値に変換し、引数2～引数3の範囲（min以上～max以下)に収めて、取得します。
     * parseIntできない時は0になるので、valueにnullやundefinedや±Infinity（！）やNaNや文字列が入っていても0になるよ。注意してね。
    */
    var getArgNumber = function (arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharactersAndEval(arg), 10) || 0).clamp(min, max);  // parseIntできない時は0になるので、valueにnullやundefinedや±Infinity（！）やNaNや文字列が入っていても0になるよ。
    };
    /** 任意の引数配列args[]のargs[start]～args[end]までを半角スペース" "で区切って取得します。*/
    var concatArgs = function (args, start, end) {
        if (!start) start = 0;
        if (!end) end = args.length;
        var result = '';
        for (var i = start, n = end; i < n; i++) {
            result += args[i] + (i < n - 1 ? ' ' : '');
        }
        return result;
    };
    // ============ プラグインのパラメータを取得や、プラグインコマンドの取得時に使うメソッドの追加、終 ==========================

    // ============ 任意の変数の値を、値や型を制限して取ってくるメソッド ===============================================
    /** 任意の引数argを整数値に変換し、引数2～引数3の範囲（min以上～max以下)に収めて、取得します。
     * parseIntできない時は0になるので、valueにnullやundefinedや±Infinity（！）やNaNや文字列が入っていても0になるよ。注意してね。
    */
    var getArgNumber = function (arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharactersAndEval(arg), 10) || 0).clamp(min, max);  // parseIntできない時は0になるので、valueにnullやundefinedや±Infinity（！）やNaNや文字列が入っていても0になるよ。
    };
    // ============ 任意の変数の値を、値や型を制限して取ってくるメソッド、終わり。 ===============================================

    // ============ 以下、テストプレイ時や、デバッグ出力するかどうかを判定するメソッド （by メルサイア）====================
    /** テストプレイ中ならtrue、本番プレイ中ならfalseを返します。*/
    var isTestPlaying = function () {
        return (Utils.isOptionValid('test') && Utils.isNwjs());
    };
    // =============================================================================

    // このローカル変数。わかりやすい名前をつけてください。
    // ●開発者用メモ： javascriptの無名関数(function(){...})内に書く変数は、ローカル変数扱いなので、短い名前を使っても、他のプラグインとの競合はしません。
    // var hogehoge;
    /**  ↓プラグインのファイル名から取得したパラメータ。「***.js」を変更した時、ここを更新する忘れないようにしてください。*/
    var pluginName = 'minRPG_CustomizeGameSpeed';

    // ↓エディタで編集可能な、このプラグインのパラメータ名を格納する変数群。
    // ※helpコメント欄の「＠param ***」を変更した時、ここを更新する忘れないように。(['英語のパラメータ名', 日本語のパラメータ名'], 最小値, 最大値)の変更も、忘れないでね。
    // デバッグ出力のON/OFF
    var _isDebugOut = getParamBoolean(['isDebugOut', 'デバッグ出力するか']);
    /** デバッグ出力するならtrue、本番プレイ中ならfalseを返します。テストプレイ中は、デバッグ出力パラメータがONならtrueです。*/
    var _isDebugMode = function () {
        return (isTestPlaying() && _isDebugOut);
    };

    // 【機能】スピード変更のON/OFF
    var _isOnChangeSpeed_inThisPlugin = getParamBoolean(['isNoChangeSpeed_inThisPlugin', '【機能】スピード変更']);
    // 【機能】各種パラメータの限界値変更を禁止するかのON/OFF
    var _isOnChangeParamLimit_inThisPlugin = getParamBoolean(['isNoChangeParamLimit_inThisPlugin', '【機能】ステータス限界値変更']);
    // 【機能】吸収技もダメージエフェクトをつけるかのON/OFF
    //var _isOnEffectDamageDrain = getParamBoolean(['isOnEffectDamageDrain', '【機能】吸収技もダメージエフェクトをつけるか']);
    // 【機能】戦闘を検知するかのON/OFF
    var _isOnControlBattleEncountAndWinLose = getParamBoolean(['isOnControlBattleEncountAndWinLose', '【機能】戦闘を検知するか']);
    // 【機能】かばう条件を変更するかのON/OFF
    var _isOnChangeDefault_Migawari = getParamBoolean(['isChangeDefault_Migawari', '【機能】身代わり条件を変えるか']);

    // このゲーム固有の、ツクールデフォルトスピードに対するスピード倍率
    var _MAPSPEED_DEFAULT = getParamNumber(['MAPSPEED_DEFAULT', '標準イベントスピード'], 1, 100); // 整数
    var _BATTLE_LOGSPEED_DEFAULT = getParamNumber(['BATTLE_LOGSPEED_DEFAULT', '標準戦闘ログスピード'], 1, 100); // 整数
    var _BATTLE_ANIMATIONSPEED_DEFAULT = getParamNumber(['BATTLE_ANIMATIONSPEED_DEFAULT', '標準戦闘アニメーションスピード'], 1, 100); // 整数
    var _BATTLE_ENEMYSPEED_DEFAULT = getParamNumber(['BATTLE_ANIMATIONSPEED_DEFAULT', '標準戦闘敵スプライトスピード'], 1, 100); // 整数
    var _BATTLE_MOTIONSPEED_DEFAULT = getParamNumber(['BATTLE_MOTIONSPEED_DEFAULT', '標準戦闘武器モーションスピード'], 1, 100); // 整数
    var _BATTLE_MOVESPEED_DEFAULT = getParamNumber(['BATTLE_MOVESPEED_DEFAULT', '標準戦闘移動スピード'], 1, 100); // 整数
    var _RAPID_MAPSPEED_DEFAULT = getParamNumber(['RAPID_MAPSPEED_DEFAULT', '早送りイベントスピード'], 1, 100); // 整数
    var _RAPID_BATTLE_LOGSPEED_DEFAULT = getParamNumber(['RAPID_BATTLE_LOGSPEED_DEFAULT', '早送り戦闘ログスピード'], 1, 100); // 整数
    var _RAPID_BATTLE_ANIMATIONSPEED_DEFAULT = getParamNumber(['RAPID_BATTLE_ANIMATIONSPEED_DEFAULT', '早送り戦闘アニメーションスピード'], 1, 100); // 整数
    var _RAPID_BATTLE_ENEMYSPEED_DEFAULT = getParamNumber(['RAPID_BATTLE_ANIMATIONSPEED_DEFAULT', '早送り戦闘敵スプライトスピード'], 1, 100); // 整数
    var _RAPID_BATTLE_MOTIONSPEED_DEFAULT = getParamNumber(['RAPID_BATTLE_MOTIONSPEED_DEFAULT', '早送り戦闘武器モーションスピード'], 1, 100); // 整数
    var _RAPID_BATTLE_MOVESPEED_DEFAULT = getParamNumber(['RAPID_BATTLE_MOVESPEED_DEFAULT', '早送り戦闘移動スピード'], 1, 100); // 整数
    var _SKIPSPEED_DEFAULT = getParamNumber(['_SKIPSPEED_DEFAULT', 'デフォルトスキップ倍数'], 1, 100); // 整数

    // 可変な各種早送りスピードを格納する、スイッチや変数番号。 0は無視（何も実行しない）を意味する。ツクール内変数やスイッチの番号は、1～9999までのはず。
    var _VarNo_Rapid_BattleRate = getParamNumber(['VarNo_Rapid_BattleRate', '可変戦闘早送り倍数を格納する変数番号'], 0, 9999);
    var _VarNo_Rapid_MapRate = getParamNumber(['VarNo_Rapid_MapRate', '可変イベント早送り倍数を格納する変数番号'], 0, 9999);
    // 可変な各種スキップスピードを格納する、スイッチや変数番号
    var _SwitchNo_isSkip = getParamNumber(['SwitchNo_isSkip', 'スキップ中かを格納するスイッチ番号'], 0, 9999);
    var _SwitchNo_isCanNotSkip = getParamNumber(['SwitchNo_isNoSkip', 'スキップ禁止中かを格納するスイッチ番号'], 0, 9999);
    // 可変なゲームスピードを持つ変数番号
    var _VarNo_GameSpeed = getParamNumber(['VarNo_BattleSpeed', '可変ゲームスピードを格納する変数番号'], 0, 9999);
    var _VarNo_MessageWaitEscapeCharacterSpeed = getParamNumber(['VarNo_MessageWaitEscapeCharacterSpeed', '可変メッセージウェイト制御文字スピードを格納する変数番号'], 0, 9999);
    var _VarNo_SkipRate = getParamNumber(['VarNo_SkipRate', '可変スキップ倍数を格納する変数番号'], 0, 9999);
    
    // 戦闘中かを格納するスイッチ番号
    var _SwitchNo_IsBattle = getParamNumber(['SwitchNo_IsBattle', '戦闘中かを格納するスイッチ番号'], 0, 9999);
    // 戦闘開始直後に実行するコモンイベント番号（実装取りやめ。うまくいかないみたい。必要ならターン開始0の敵グループイベントでやってね）
    //var _CommonEventNo_BattleStart = getParamNumber(['CommonEventNo_BattleStart', '戦闘開始直後に実行するコモンイベント番号'], 0, 1000);
    // ランダムエンカウント時にONになるスイッチ番号
    var _SwitchNo_RandomEncount = getParamNumber(['SwitchNo_RandomEncount', 'ランダムエンカウント時にONになるスイッチ番号'], 0, 9999);
    // 戦闘全滅時、逃走or中断時、勝利時、にONになるスイッチ番号
    var _SwitchNo_BattleWin = getParamNumber(['SwitchNo_BattleWin', '戦闘勝利時にONになるスイッチ番号'], 0, 9999);
    var _SwitchNo_BattleEscape = getParamNumber(['SwitchNo_BattleEscape', '戦闘逃走時にONになるスイッチ番号'], 0, 9999);
    var _SwitchNo_BattleLose = getParamNumber(['SwitchNo_BattleLose', '戦闘全滅時にONになるスイッチ番号'], 0, 9999);
    // 最後に戦闘した敵グループIDを格納する変数番号
    var _VarNo_LastBattleTroopID = getParamNumber(['VarNo_LastBattleTroopID', '最後に戦闘した敵グループIDを格納する変数番号'], 0, 9999);
    
    // 各種、早送りボタンを機能させるかの有無
    var _isRapid_MapButton_ok = getParamBoolean(['isRapid_MapButton_ok', '決定ボタンでイベント早送り可能か']);
    var _isRapid_BattleButton_ok = getParamBoolean(['isRapid_BattleButton_ok', '決定ボタンで戦闘早送り可能か']);
    var _isRapid_MapButton_cancel = getParamBoolean(['isRapid_MapButton_cancel', 'キャンセルボタンでイベント早送り可能か']);
    var _isRapid_BattleButton_cancel = getParamBoolean(['isRapid_BattleButton_cancel', 'キャンセルボタンで戦闘早送り可能か']);
    var _isRapid_MapButton_shift = getParamBoolean(['isRapid_MapButton_shift', 'ダッシュボタンでイベント早送り可能か']);
    var _isRapid_BattleButton_shift = getParamBoolean(['isRapid_BattleButton_shift', 'ダッシュボタンで戦闘早送り可能か']);
    // 各種条件下で、スキップを機能させるかの有無
    var _isSkip_Button_ok = getParamBoolean(['isSkipButton_ok', '決定ボタンでスキップ可能か']);
    var _isSkip_Button_cancel = getParamBoolean(['isSkipButton_cancel', 'キャンセルボタンでスキップ可能か']);
    var _isSkip_Button_shift = getParamBoolean(['isSkipButton_shift', 'ダッシュボタンでスキップ可能か']);
    var _isSkip_OnMapEvent = getParamBoolean(['isSkip_OnMapEvent', 'マップイベント中もスキップ可能か']);
    var _isSkip_OnMapMoving = getParamBoolean(['isSkip_OnMapMoving', 'マップ移動中もスキップ可能か']);
    var _isSkip_OnMapNeutral = getParamBoolean(['isSkip_OnMapNeutral', 'マップ無操作中もスキップ可能か']);
    var _isSkip_OnBattle = getParamBoolean(['isSkip_OnBattle', '戦闘中もスキップ可能か']);

    // 各種パラメータの限界値。最小値はMPだけ0、他は最小値1～最大値はNumber.MAX_VALUE(1.7976931348623157e+308)。Infinityにすると表示や計算時にエラーになるので注意。
    var _Limit_MaxHP = getParamNumber(['MaxHPLimit', '最大HPの限界値'], 1, Number.MAX_VALUE); // HPは1以上。
    var _Limit_MaxMP = getParamNumber(['MaxMPLimit', '最大MPの限界値'], 0, Number.MAX_VALUE); // MPだけ0以上。
    var _Limit_MaxAttack_AndOtherParam = getParamNumber(['ATKetcLimit', '攻撃力などの限界値'], 1, Number.MAX_VALUE); // 攻撃力や守備力は0だと困るけど、大丈夫かな？ 念のため、1以上にしておこう。
    // 各種かばう条件
    var _Migawawri_Sareru_MaxHPPercent = getParamNumber(['SubstiutedChara_MaxHPPercent', 'かばわれる側の最大HP％0-100'], 0, 100);
    var _Migawawri_Sareru_MaxMPPercent = getParamNumber(['SubstiutedChara_MaxMPPercent', 'かばわれる側の最大MP％0-100'], 0, 100);
    var _Migawawri_Suru_MinHPPercent = getParamNumber(['SubstiutingChara_MinHPPercent', 'かばう側の最小HP％0-100'], 0, 100);
    var _Migawawri_Suru_MinMPPercent = getParamNumber(['SubstiutingChara_MinMPPercent', 'かばう側の最小MP％0-100'], 0, 100);
    var _Migawawri_Suru_ActPercent = getParamNumber(['SubstiutingRate', '身代わり率％0-100'], 0, 100);
    // 最後にかばったキャラ・かばわれたキャラのIDを格納する変数番号
    var _VarNo_Migawari_Sareta_AcorID = getParamNumber(['VarNo_Migawari_Sareta_AcorID', '最後にかばわれたアクターIDを格納する変数番号'], 0, 9999);
    var _VarNo_Migawari_Shita_AcorID = getParamNumber(['VarNo_Migawari_Shita_AcorID', '最後にかばったアクターIDを格納する変数番号'], 0, 9999);
    var _VarNo_Migawari_Sareta_EnemyID = getParamNumber(['VarNo_Migawari_Sareta_EnemyID', '最後にかばわれた敵キャラIDを格納する変数番号'], 0, 9999);
    var _VarNo_Migawari_Shita_EnemyID = getParamNumber(['VarNo_Migawari_Shita_EnemyID', '最後にかばった敵キャラIDを格納する変数番号'], 0, 9999);
    // 身代わり成功した（かばった）瞬間だけ実行されるコモンイベント番号。0は無視（何も実行しない）を意味する。ツクールコモンイベント番号は、1～1000までのはず。
    var _CommonEventNo_Migawari_Success_Actor = getParamNumber(['CommonEventNo_Migawari_Success_Actor', '味方の身代わり成功時に実行するコモンイベント番号'], 1, 1000);
    var _CommonEventNo_Migawari_Success_Enemy = getParamNumber(['CommonEventNo_Migawari_Success_Enemy', '敵の身代わり成功時に実行するコモンイベント番号'], 1, 1000);
    // 各種メッセージ中の制御文字、ピリオド「\.」、ライン「\|」で待つ時間
    var _WaitPeriodDef = getParamNumber_IncludeEscapeCharactors(['Default_Wait_Period', '「＼.」の待ちフレーム数'], 15, 0, 150);
    var _WaitLineDef = getParamNumber_IncludeEscapeCharactors(['Default_Wait_Line', '「＼|」の待ちフレーム数'], 60, 0, 600);
    // パラメータ変数、終わり。

    // その他、このjsファイル内だけで使う、ローカル変数。
    /** =1。これは変数に代入しないので、少数でも構いません。「\.」や「\|」の待ち時間に割り算します。ウェイトには影響しません。*/
    var _MESSAGESPEED_DEFAULT = 1.0;
    /** =4。どれだけ早くしても、４倍速以上は描画フレームを上書き更新しません。でないと、描画処理に負担がかかると考えられます。 */
    var _FRAME_UPDATENUM_MAX = 4;
    /** スキップ中はtrue、そうでない場合はfalseを返す、スキップを制御するBoolean型変数です。*/
    var _isSkipMode = false;
    //デバッグ用。メソッドが呼ばれた回数を記録。テストプレイ中だけ、200回に一回だけ、デバッグ出力を実行。
    var _calledNum_isFastRapidButton = 0;
    /** デバッグ出力用変数。デバッグ中だと、値がNaNになるときに、警告を出します。*/
    var _debaguVar = 10;
                

    // 以下、ローカルメソッド宣言
    // （という名の、無名関数の値を返す変数宣言。必ず、これらの変数を呼び出す前に、宣言すること。出ないと無効になるよ。エラーは出ない…。）
    // 

    /** 0や±InfinityやNaNではない、メッセージスピードの倍率を0.1～99.0で返します。変数の値を見て、不正な値が入っていれば、調度よいデフォルト値に修正して返します。*/
    var getMessageWaitEscapeCharacterSpeed = function () {
        var _speed = _MESSAGESPEED_DEFAULT;
        // 何の変数番号の値を使うか。
        var _varNo = _VarNo_MessageWaitEscapeCharacterSpeed;
        // 変数番号を格納している、パラメータに変な値が入っていないか、随時チェック。変な値が入っていたら、デフォルトスピードで。
        if (_varNo != null && _varNo >= 1 && _varNo < $dataSystem.variables.length) {
            // 倍数は、 変数値/2.0 でいきましょう。変数値=1のとき0.5倍(1/2の速さ)、変数=9のとき約4倍(9/2の速さ)。
            _speed = $gameVariables.value(_varNo) / 2.0;
            // 変数の値に変な値が入っていないか、随時チェック。.valueメソッド内で、「|| 0」の判定があるので、undefined、null、NaNはすでに0になっています。
            if (_speed === Infinity || _speed === -Infinity) { _speed = _MESSAGESPEED_DEFAULT; } // 無限だったら、デフォルトスピードで。
            if (_speed === 0) { _speed = _MESSAGESPEED_DEFAULT; } // 0が入っていたら、デフォルトスピードで。
        }
        // 1. さらに、ゲームスピードによって、倍率が変わる。
        var _gameSpeedChangeRate = 1;
        // 変数番号を格納している、パラメータに変な値が入っていないか、随時チェック。
        if (_VarNo_GameSpeed != null && _VarNo_GameSpeed >= 1 && _VarNo_GameSpeed < $dataSystem.variables.length) {
            var _gameSpeed = $gameVariables.value(_VarNo_GameSpeed);
            // 変数の値に変な値が入っていないか、随時チェック。.valueで || 0 としているため、nullやundefinedやNaNは0になる。判定は±Infinityだけで十分
            _gameSpeedChangeRate = Number.parseInt(_gameSpeed / 3); // ★ゲームスピード1-9が設定してあれば、それに3を割ったもの。
            if (_gameSpeed === NaN) { _gameSpeedChangeRate = 1; } // NaNなら、1。
            else if (_gameSpeed === Infinity || _gameSpeed === -Infinity) { _gameSpeedChangeRate = 1; } // 無限大なら、1で。
            else if (_gameSpeed === 0) { _gameSpeedChangeRate = 1; } // 0が入っていたら、1で。
            else if (_gameSpeed === 5) { _gameSpeedChangeRate = 1; } // 5が入っていたら、1で。
            else if (_gameSpeed === 6) { _gameSpeedChangeRate = 1.3; }
            else if (_gameSpeed === 7) { _gameSpeedChangeRate = 1.7; }
            else if (_gameSpeed === 9) { _gameSpeedChangeRate = 99; } // 9が入っていたら、9で。
            else if (_gameSpeed === 10) { _gameSpeedChangeRate = 99; } // 最速の10が入っていたら、99で。
            else if (_gameSpeed < 0) { _gameSpeedChangeRate = 0; } // 1未満なら0に。
            else if (_gameSpeed > 99) { _gameSpeedChangeRate = 999; } // 1000以上になっても意味ないと思う。
            // _speedをかける。
            _speed *= Math.max(0.5, _gameSpeedChangeRate);
        }
        // 2. 早送りボタンが押されていたら、ゲーム内変数を取得し、_speedの値を更新。
        if (isFastRapidButton()) {
            // 変数番号を格納している、パラメータに変な値が入っていないか、随時チェック。
            if (_VarNo_Rapid_MapRate != null && _VarNo_Rapid_MapRate >= 1 && _VarNo_Rapid_MapRate < $dataSystem.variables.length) {
                _gameSpeedChangeRate = Number.parseInt($gameVariables.value(_VarNo_Rapid_MapRate));
                // 変数の値に変な値が入っていないか、随時チェック。
                if (_gameSpeedChangeRate === NaN) { _gameSpeedChangeRate = 1; } // NaNなら、1。
                else if (_gameSpeedChangeRate === Infinity || _gameSpeedChangeRate === -Infinity) { _gameSpeedChangeRate = 0; } // 無限大なら、1。
                else if (_gameSpeedChangeRate === 0) { _gameSpeedChangeRate = 1; } // 0が入っていたら、01。
                else if (_gameSpeedChangeRate < 0.5) { _gameSpeedChangeRate = 0.5; }   // 0.5未満なら0.5に。
                else if (_gameSpeedChangeRate > 99) { _gameSpeedChangeRate = 99; } // 100以上になっても意味ないと思う。
            }else{
                _gameSpeedChangeRate = 1;
            }
            // _speedをかける。
            _speed *= _gameSpeedChangeRate;
        }
        // 3. スキップ中だったら飛ばす（このメソッドの呼び出し元がやっています）

        // 割り算をしてエラーにならないことを保証するために、こうしておきましょう。
        if (_speed < 0.1) { _speed = 0.1; } // 0.1未満なら0.1に。
        if (_speed > 999) { _speed = 999; } // 1000以上になっても意味ないと思う。999ならすでに0フレームになります。
        if (_speed === Infinity || _speed === -Infinity) { _speed = 999; } // 無限大なら、999で。
        if (Number.isNaN(_speed)) { _speed = 999; } // 数えられない数なら、999で。これは念のため。
        return _speed;
    };
    /** スキップモードの倍率を返します。*/
    var getSkipRate = function () {
        var _skipRate = _SKIPSPEED_DEFAULT;
        // 変数番号を格納している、パラメータに変な値が入っていないか、随時チェック。変な値が入っていたら、デフォルトスピードで。
        if (_VarNo_SkipRate != null && _VarNo_SkipRate >= 1 && _VarNo_SkipRate < $dataSystem.variables.length) {
            _skipRate = $gameVariables.value(_VarNo_SkipRate);
        }
        // 変数の値に変な値が入っていないか、随時チェック。
        if (_skipRate === Infinity || _skipRate === -Infinity) { _skipRate = _SKIPSPEED_DEFAULT; } // 無限だったら、デフォルトスピードで。
        if (_skipRate === 0) { _skipRate = _SKIPSPEED_DEFAULT; } // 0が入っていたら、デフォルトスピードで。
        if (_skipRate < 1) { _skipRate = 1; } // 1未満なら1に。
        if (_skipRate > 99) { _skipRate = 99; } // 100以上になっても意味ないと思う。100倍なんて目に見えないし、updateを100回呼んでも処理は高速化されない。
        return _skipRate;
    };
    /** スキップモードが、ONかどうかを返します。*/
    var isSkipModeOn = function () {
        // // (a)スキップ中かを格納するスイッチの値を返す。ただ、これだと、スイッチ番号が無効（マイナスや、変数の数の最大値を超えていたら）、判定できないので、怖い。ので、やめる。
        // var _isSkipModeON = false;
        // if ($gameSwitches && _SwitchNo_isSkip > 0) {
        //     if ($gameSwitches.value(_SwitchNo_isSkip) === true) {
        //         _isSkipModeON = true;
        //     }
        // }
        // return _isSkipModeON;

        // (b)すなおに、ローカル関数を返す。これだと、確実に制御できる。
        return _isSkipMode;
    };
    /** スキップモードをONします。*/
   var SkipModeOn = function () {
        // スキップ禁止中かどうかを調べる。
        var _canSkip = true;
        if ($gameSwitches && _SwitchNo_isCanNotSkip > 0) {
            if ($gameSwitches.value(_SwitchNo_isCanNotSkip) === true) {
                _canSkip = false;
            }
        }
        // スキップ禁止中なら、スイッチを自動的にOFFにする。
        if (_canSkip === false) {
            // 内部変数は確実に変更する。
            _isSkipMode = false;
            // スキップ中スイッチがONになっているときだけ、OFFにする。でないと、何回もずっとスイッチ代入処理が無駄に実行される。
            if ($gameSwitches && _SwitchNo_isSkip > 0) {
                if ($gameSwitches.value(_SwitchNo_isSkip) === true) {
                    $gameSwitches.setValue(_SwitchNo_isSkip, false);
                    if (_isDebugMode()) { // テストプレイ中のみ、デバッグ出力します。
                        console.log('SkipModeOnが禁止中: スキップモードを実行しようとしましたが、スキップ禁止中ですので、自動的にOFFになりました。');
                    }
                }
            }
        }
        else {
            // 内部変数は確実に変更する。
            _isSkipMode = true;
            // スキップ中スイッチがOFFになっているときだけ、ONにする。でないと、何回もずっとスイッチ代入処理が無駄に実行される。
            if ($gameSwitches && _SwitchNo_isSkip > 0) {
                if ($gameSwitches.value(_SwitchNo_isSkip) === false) {
                    // スキップ禁止中じゃないので、スキップ中スイッチをONにする。
                    $gameSwitches.setValue(_SwitchNo_isSkip, true);
                    if (_isDebugMode()) { // テストプレイ中のみ、デバッグ出力します。
                        console.log('SkipModeOn: スキップモードがONになりました。');
                    }
                }
            }
        }
    };
    /** スキップモードをOFFします。*/
    var SkipModeOff = function () {
        // 内部変数は確実に変更する。
        _isSkipMode = false;
        // スキップ中スイッチがONになっているときだけ、OFFにする。でないと、何回もずっとスイッチ代入処理が無駄に実行される。
        if ($gameSwitches.value(_SwitchNo_isSkip) === true) {
            $gameSwitches.setValue(_SwitchNo_isSkip, false);
            if (_isDebugMode()) { // テストプレイ中のみ、デバッグ出力します。
                console.log('SkipModeOff: スキップモードがOFFになりました。');
            }
        }
    };
    // ●開発者用メモ： 
    // isFastForward()は、マップ専用で、イベントを早送り中かを判定するメソッドです。
    // 条件は、マップのイベントが動いていて、シーン切替中じゃなくって、かつ決定ボタンか画面タッチ 「長押し」 されているか、で判定します。
    // 実際のデフォルトのソースは、rpg_scenes.jsにあり、以下です。
    // =========================================================================
    // Scene_Map.prototype.isFastForward = function() {
    //    return ($gameMap.isEventRunning() && !SceneManager.isSceneChanging() &&
    //            (Input.isLongPressed('ok') || TouchInput.isLongPressed()));
    //};
    // ==========================================================================
    // つまり、「戦闘中は必ずfalse」ですので、戦闘中の早送りの判定には使えません。
    // また、マップ中でも、「長押し」しか判定しないので、何百ミリ秒かかかりますし、ボタンや画面の短い押しなどは、早送りと判定されません。
    // そのため、tachiさんは、もっと快適な操作を考え、短い押しでも早送りできるように、
    // if(Input.isPressed('ok') || Input.isPressed('shift') || TouchInput.isPressed())などを直打ちしています。
    // ただこれだと、パラメータにより複数のボタンを有効／無効にする際に、
    // ソースが煩雑になりがちですし、更新し忘れる可能性もあります。
    //
    // そこで、複数の箇所で同じ処理を書くのを省略するため、
    // merusaiaは、isRapid_MapButtonOn()と、isRapid_BattleButtonOn()、
    // それらを呼び出す、isFastRapidButton()、という新しいメソッドを作成しています。
    // 
    // ↓ 以下、追加メソッド。
    /**  早送りモードに移行する条件の、早送りボタンが短く押しっぱなしされているかの早送り判定。マップ中、戦闘中問わず、使えます。
      * ・merusaiaによって、各種ボタン（決定ボタン/shiftボタン/画面タッチ）の早送りを有効/無効にする機能が追加されています。
    */
    var isFastRapidButton = function () {
        // merusaiaが、戦闘中、マップ中、タッチ、に分けて、わかりやすく整理して変更。
        var _isFastRapid = false;
        if($gameMap == null || $gameParty == null || $gamePlayer == null){
            return _isFastRapid; // どれかが生成されてなかったら、falseを返す
        }

        // イベント中か
        if ($gameMap.isEventRunning()) {
            // マップ中は、シーン切替中ではなくて、かつ、
            // 各種ボタンの早送りが有効で、かつ短い押しがされていたら、早送りモードとする。
            if (!SceneManager.isSceneChanging() && isRapid_MapButtonOn() === true) {
                _isFastRapid = true;
            }
        } else {
            // 戦闘中は、各種ボタンの早送りが有効で、かつ短い押しがされていたら、早送りモードとする。
            if ($gameParty.inBattle() && isRapid_BattleButtonOn() === true) {
                _isFastRapid = true;
            }
        }

        // 加えて、merusaiaが、スキップモード判定を追加。スキップボタンは、ゲームパッドのダッシュボタン（shiftキー）
        var _isSkip = false;
        if (_isSkip_Button_shift === true && Input.isPressed('shift') ||
            _isSkip_Button_cancel === true && Input.isPressed('cancel') || 
            _isSkip_Button_ok === true && Input.isPressed('ok') ) {
            // スキップボタンが押されていて、かつ、スキップ可能だったら、_isSkip = true;
            if($gameParty.inBattle()){
                // 戦闘イベント中か
                if ($gameMap.isEventRunning()) {
                    if(_isSkip_OnBattle === true) {
                        _isSkip = true; // 戦闘中のイベントスキップ
                        //if(_isDebugMode()){
                        //    console.log('戦闘中: スキップボタンが押されました');
                        //}
                    }
                }
            }else{
                // 戦闘中じゃない。つまり、マップ。
                // イベント中か。
                if ($gameMap.isEventRunning()){
                    if(_isSkip_OnMapEvent === true) {
                        _isSkip = true; // マップ中のスキップ
                        //if(_isDebugMode()){
                        //    console.log('マップ中のイベント: スキップボタンが押されました');
                        //}
                    }
                }else{
                    // 移動中か
                    if($gamePlayer.isMoving()){
                        if(_isSkip_OnMapMoving === true){
                            _isSkip = true; // マップ移動中のスキップ
                            //if(_isDebugMode()){
                            //    console.log('マップ中の移動: スキップボタンが押されました');
                            //}
                        }
                    }else{
                        if(_isSkip_OnMapNeutral === true) {
                            // 制限時間を早くさせたり、マップアニメーションが早くしたいときだけ、スキップはさせておきましょう。
                            _isSkip = true; // マップ中、移動中でもない、イベント中でもない時のスキップ。
                            //if(_isDebugMode()){
                            //    console.log('マップ中のニュートラル: スキップボタンが押されました');
                            //}
                        }
                    }
                }
            }
        }
        if(_isSkip === true){
            // スキップモードONへ移行。スキップ禁止でなければの判定は、このメソッドの内部でやっていますので、不要です。
            SkipModeOn();
        }else{
            // スキップできない状態ならば、スキップモードOFFへ移行。スキップ禁止であっても、この処理はされます。
            SkipModeOff();
        }

        _calledNum_isFastRapidButton++;
        //デバッグ用。テストプレイ中だけ。1000回に一回だけ、実行
        // if (_calledNum_isFastRapidButton % 1000 === 0) {
        //     if (_isDebugMode()) {
        //         var _gameSpeed = $gameVariables.value(_VarNo_GameSpeed);
        //         var _speed = $gameVariables.value(_VarNo_Rapid_BattleRate);
        //         if (_isFastRapid) {
        //             console.log('●早送り中: ' + _speed + '倍: this._waitCount：' + (_debaguVar) + ' 戦闘スピードV[' + _VarNo_GameSpeed + ']: ' + _gameSpeed
        //              + ' 戦闘早送り倍数V[' + _VarNo_Rapid_BattleRate + ']:' + $gameVariables.value(_VarNo_Rapid_BattleRate)
        //              + ' スキップ倍数V[' + _VarNo_SkipRate + ']:' + $gameVariables.value(_VarNo_SkipRate));
        //         } else {
        //             if(_isSkipMode){
        //                 console.log('○スキップ中: ' + getSkipRate() + ':倍: this._waitCount：' + (_debaguVar) + ' ゲームスピードV[' + _VarNo_GameSpeed + ']: ' + _gameSpeed
        //                 + ' 戦闘早送り倍数V[' + _VarNo_Rapid_BattleRate + ']:' + $gameVariables.value(_VarNo_Rapid_BattleRate)
        //                 + ' スキップ倍数V[' + _VarNo_SkipRate + ']:' + $gameVariables.value(_VarNo_SkipRate)+'→修正後'+getSkipRate());
        //             }else{
        //                 console.log('○速度:1倍: this._waitCount：' + (_debaguVar) + ' ゲームスピードV[' + _VarNo_GameSpeed + ']: ' + _gameSpeed
        //                 + ' 戦闘早送り倍数V[' + _VarNo_Rapid_BattleRate + ']:' + $gameVariables.value(_VarNo_Rapid_BattleRate)
        //                 + ' スキップ倍数V[' + _VarNo_SkipRate + ']:' + $gameVariables.value(_VarNo_SkipRate)+'→修正後'+getSkipRate());
        //             }
        //         }
        //     }
        // }
        return _isFastRapid;
    };
    /** マップ上で、それぞれの早送りボタンが有効で、かつそのボタンが「短く」押されていたら、trueを返します。
     * minRPG_CustomizeGameSpeed.jsでしか機能しない、新しくつくったメソッドです。
     */
    var isRapid_MapButtonOn = function () {
        var _isRaid = false; // デフォルトはfalse。

        // それぞれの早送りボタンが有効で、かつそのボタンの、いずれかが、「短く」押されていたら、true。
        if (_isRapid_MapButton_ok === true && Input.isPressed('ok')) { // 決定ボタン（ok/Enter/zキーなど）
            _isRaid = true;
        }
        else if (_isRapid_MapButton_shift === true && Input.isPressed('shift')) { // ダッシュボタン（Shiftキー）
            _isRaid = true;
        }
        // タッチ操作で短く押しなら、問答無用で早送りtrueにする（スマホユーザはそういう仕様のほうが助かる、と考えたため）
        // ※短く押しにすると、二本指のキャンセルや、フリック操作と誤作動を起こしやすいかもしれません。必要に応じてisLongPressedに変更してね。
        else if (TouchInput.isPressed()) {
            _isRaid = true;
        }
        return _isRaid;
    };
    /** 戦闘中に、それぞれの早送りボタンが有効で、かつそのボタンが「短く」押されていたら、trueを返します。
     *  minRPG_CustomizeGameSpeed.jsでしか機能しない、新しくつくったメソッドです。
     */
    var isRapid_BattleButtonOn = function () {
        var _isRaid = false; // デフォルトはfalse。

        // それぞれの早送りボタンが有効で、かつそのボタンの、いずれかが、「短く」押されていたら、true。
        if (_isRapid_BattleButton_ok === true && Input.isPressed('ok')) { // 決定ボタン（ok/Enter/zキーなど）
            _isRaid = true;
        }
        if (_isRapid_BattleButton_cancel === true && Input.isPressed('cancel')) { // 決定ボタン（xキー）
            _isRaid = true;
        }
        else if (_isRapid_BattleButton_shift === true && Input.isPressed('shift')) { // ダッシュボタン（Shiftキー）
            _isRaid = true;
        }
        // タッチ操作で短く押しなら、問答無用で早送りtrueにする（スマホユーザはそういう仕様のほうが助かる、と考えたため）
        // ※短く押しにすると、二本指のキャンセルや、フリック操作と誤作動を起こしやすいかもしれません。必要に応じてisLongPressedに変更してね。
        else if (TouchInput.isPressed()) {
            _isRaid = true;
        }
        return _isRaid;
    };
    //============ ローカル変数（という名の無名関数の値を返すメソッド）の追加、終 ================================================


    // ↓上記のメソッドを、プラグインコマンドとして実装します。
    // トリアコンタンさんのソースを参考に使わせていただいてます。感謝。
    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    // ●ここのメソッド名を、上記の■部分 Game_Interpreter.prototype.pluginCommand_***メソッド名と同じにしてください。
    Game_Interpreter.prototype.pluginCommandAddRead_minRPG_CustomizeGameSpeed = function (command, args) {
        switch (getCommandName(command)) {
            // 表記例:
            //case 'NEW_PLUGINCOMMAND_NAME' :
            //case '新しいプラグインコマンド名':
            //    // 呼び出すメソッド名は、匿名メソッドを利用する場合は、なんでも構いません。
            //    // 引数を取りたい時は、右を参考にしてください。 $gameSystem.plugin_***(getArgNumber(args[0]), getArgString(concatArgs(args, 1)));
            //    // ただし、プラグインコマンドはエラーを自動的にスキップするので、なるべく引数を取らないほうが、ユーザには親切になります。 
            //    ***();
            //    break;

            // ■getCommandName()メソッドについて注意点。
            // ※プラグインコマンドを英字で入力する場合は、スペルミスを防ぐため、名前を必ず大文字にしてチェックします。
            //   新しいプラグインコマンドを作る場合は、英字表記は必ず「全て大文字」にしてください。
            case 'SKIPMODE_ON':
            case 'スキップモードON':
                SkipModeOn(); // 引数を取りたい時は、右を参考にしてください。 (getArgNumber(args[0]), getArgString(concatArgs(args, 1)));
                break;
            case 'SKIPMODE_OFF':
            case 'スキップモードOFF':
                SkipModeOff(); // 引数を取りたい時は、右を参考にしてください。 (getArgNumber(args[0]), getArgString(concatArgs(args, 1)));
                break;
            // このプラグインより下の、他のプラグインもこのメソッドを追加定義して、プラグインコマンドを調べないといけないから、default: のケースは要らない
        }

    };
    // 下記三行の説明：
    //      競合対策のため、(1)デフォルトのGame_Interpreter.prototype.pluginCommandメソッドを別名_***メソッドに置き換え、
    //      それを(2)上書き後のメソッドの中で、(3)applyやcallを使って呼び出すことで、
    //      このプラグインより上でONにされている、同じメソッドを上書きするプラグインとの競合を回避できます。
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand; // (1)
    Game_Interpreter.prototype.pluginCommand = function (command, args) {                // (2)
        _Game_Interpreter_pluginCommand.apply(this, arguments);                          // (3)
        // ↓  この行から、上書き後のメソッドの処理を実行。 
        // (実装a)ここでtry～chatch文を使うと、このプラグインより下のプラグインで例外処理が取れないので、やめておく。
        // ■ここのメソッド名を、下記の●部分 Game_Interpreter.prototype.pluginCommandAddRead_***メソッド名と同じにしてください。
        this.pluginCommandAddRead_minRPG_CustomizeGameSpeed(command, args);
        // (実装b)ここでtry～chatchを使って、プラグインコマンド時のエラーを吐くようにする。
        // try {
        //     // ■ここのメソッド名を、下記の●部分 Game_Interpreter.prototype.pluginCommandAddRead_***メソッド名と同じにしてください。
        //     this.pluginCommandAddRead_minRPG_CustomizeGameSpeed(command, args);
        // } catch (e) {
        //     if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
        //         var window = require('nw.gui').Window.get();
        //         if (!window.isDevToolsOpen()) {
        //             var devTool = window.showDevTools();
        //             devTool.moveTo(0, 0);
        //             devTool.resizeTo(Graphics.width, Graphics.height);
        //             window.focus();
        //         }
        //     }
        //     console.log('プラグインコマンドの実行中にエラーが発生しました。');
        //     console.log('- コマンド名   : ' + command);
        //     console.log('- コマンド引数 : ' + args);
        //     console.log('- エラー原因   : ' + e.toString());
        // }
    };
    //============ プラグインコマンドの追加定義、終 ============================================


    //============ 以下、tachiさん & merusaia による追記 ======================================

    // ※コメント
    //// アイテム数の表示を調整（デフォルトの２桁→３桁に表示を変更している。後にやっている、同じアイテム最大所持数を99→999にするため。）
    //Window_ItemList.prototype.numberWidth = function() {
    //    return this.textWidth('0000');
    //};
    //
    //Window_ItemList.prototype.drawItemNumber = function(item, x, y, width) {
    //    if (this.needsNumber()) {
    //        this.drawText(':', x, y, width - this.textWidth('000'), 'right');
    //        this.drawText($gameParty.numItems(item), x, y, width, 'right');
    //    }
    //};

    // ※コメント
    //// アイテム所持数（デフォルトの99→999にしている）
    //Game_Party.prototype.maxItems = function(item) {
    //    return 999;
    //};


    // ※コメント
    //// 位置調整（ゲーム開始時のタイトル画像がよく見えるように、タイトルウィンドウの幅を調整している。）
    //Window_TitleCommand.prototype.windowWidth = function() {
    //    return 190;
    //};
    //
    //Window_TitleCommand.prototype.updatePlacement = function() {
    //    this.x = (Graphics.boxWidth - this.width) / 2;
    //    this.y = Graphics.boxHeight - this.height - 96 + 50;
    //};

    // ★オプションを触るプラグインとの競合に注意！！  他のオプションを触るプラグインでやっているならば、ここではできるだけやらないほうがいいいよ。
    // コメント
    //// デフォルトのオプション項目（例えば、「常時ダッシュ」や「コマンド記憶」）を非表示にしたいとき、ここをコメントアウトしてください。
    // merusaiaがコメント：
    //   この書き方だと、このプラグインの下にWindow_Options.prototype.addGeneralOptions = function()を上書きするプラグイン
    //   があると、競合してしまう。トリアコンタンさんのソースを参考に、競合しないように編集。
    // ※プラグインのデフォルトでは、これらはコメントされていた。つまり、オプション項目の中の、「常時ダッシュ」と「コマンド記憶」を隠している‥どうしてこうなった！のかは不明。たぶん、TP足りない時に変な挙動になるのが嫌だったのかな‥）
    //Window_Options.prototype.addGeneralOptions = function() {
    //    this.addCommand(TextManager.alwaysDash, 'alwaysDash');
    //    this.addCommand(TextManager.commandRemember, 'commandRemember');
    //};
    // ↓ 上記の代わりに、merusaiaが追記:
    //   トリアコンタンさんのソースを参考に、「新規メソッド.apply(this, arguments)」を使い、同名メソッドが競合しないように改良。
    //=============================================================================
    //  オプション項目に、様々な項目を追加できます。
    //  ※他のプラグインと競合しないように、上書き前に元のメソッドを新しい変数名に代入し、上書き後のメソッド内で最初に呼び出してします。
    //=============================================================================
    //var _Tachi_Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    //Window_Options.prototype.addGeneralOptions = function() {
    //	_Tachi_Window_Options_addGeneralOptions.apply(this, arguments); // 上書き後メソッドの最初に、上書き前メソッドを呼び出す。
    //	// この行から、上書き後のメソッドの処理を実行。 
    //    // 例: this.addCommand('ほげほげ',   'hogehoge'); // 第一引数の表示名で、第二引数の項目を追加。ただし、'hogehoge'のオプション項目をConfigManager.applyDataに認識させないと、意味ないよ。
    //};

    // ★タイトルメニューを触るプラグインとの競合に注意！！
    // タイトルメニュー項目の設定・追加・隠し（追加されていないコマンドは、非表示になる。現時点では、全てが表示されている。）
    // ここでプロトタイプ宣言を上書きすれば、タイトル画面に表示する項目を変更できる。
    // 例えば、普段はメニューからいける「オプション（メニュー名:options）」メニューを消したければ、三行目をコメントアウトすれば良い）
    //Window_TitleCommand.prototype.makeCommandList = function() {
    //    this.addCommand(TextManager.newGame,   'newGame');
    //    this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
    //    this.addCommand(TextManager.options,   'options');
    //};

    // ★メニュー画面を触るプラグインとの競合に注意！！
    //// メニューコマンド隠し（追加されていないコマンドは、非表示になる。例えば、ここでは「セーブ」「設定」「ステータス」などが非表示にされている？）
    //Window_MenuCommand.prototype.makeCommandList = function() {
    //    this.addMainCommands();
    //    this.addFormationCommand();
    //    this.addOriginalCommands();
    //};

    // ★バトルコマンドを触る競合に注意！！  他のプラグインでやっているならば、ここではできるだけやらないほうがいいいよ。
    // ※コメント
    //// バトルコマンド隠し（コメントされたコマンドは、非表示になる。例えば、ここでは「防御」コマンドを非表示にしようとしている。防御コマンドいらない子、て人用。）
    //Window_ActorCommand.prototype.makeCommandList = function() {
    //    if (this._actor) {
    //        this.addAttackCommand();
    //        this.addSkillCommands();
    //        //this.addGuardCommand();
    //        this.addItemCommand();
    //    }
    //};

    if(_isOnChangeParamLimit_inThisPlugin === true){              // パラメータ「【機能】ステータス限界値変更」がONなら
        var _Game_BattlerBase_paramMax = Game_BattlerBase.prototype.paramMax; // 元のメソッドを別変数で宣言して退避。
        /** minRPG_CustomizeGameSpeed.jsの、ステータス限界値の変更。追加宣言で、競合対策済み。
         * ・Ver.1.0（Tachiさん初版）：  限界値（HPやMPの限界値を、HPのデフォルト9999→999999、MPのデフォルト999→9999、その他のパラメータを999→9999に変更している。
        * ・Ver.1.1（現行）：           パラメータ化。開発者が、プラグインのエディタ時で設定できるように。
        * ・今後の課題：               指定した変数番号に持たせて、ストーリーが進むに従って動的に限界突破していくとか面白そうかも…（でもこれ常に呼べるのかよくわからないから、一旦保留）。
        * ※気をつけてください。ダメージ計算式が引き算形式「a.atk-b.def」や割り算形式「a.atk/b.def」だと、他のゲームバランスがむちゃくちゃになる可能性だって有ります‥。運も‥。）
        */
        Game_BattlerBase.prototype.paramMax = function (paramId) {
            if (paramId === 0) {
                return _Limit_MaxHP;    // MaxHP
            } else if (paramId === 1) {
                return _Limit_MaxMP;    // MaxMP
            } else {
                return _Limit_MaxAttack_AndOtherParam; // その他、攻撃力や運などのパラメータ
            }
        };
    }


    if(_isOnChangeSpeed_inThisPlugin === true){              // パラメータ「【機能】スピード変更」がONなら
        // =============================================================================
        // ゲームスピード調整
        // Tachiさんによる、マップ・戦闘メッセージ・戦闘エフェクト・エンカウントエフェクトなど、様々な高速化調整です。一部、merusaiaがコメント＆改変。
        // =============================================================================
        // 
        //
        // ↓ 以下、実際にデフォルトのソース（rpg_***.js）を追加宣言しているメソッド。
        // 
        var _Scene_Map_updateMainMultiply = Scene_Map.prototype.updateMainMultiply;
        /** マップのゲームスピード調整
         * this.updateMain()が書かれてある行数分だけ、何倍にも高速化されます。デフォルトは２倍→ここでは５倍。
        * マップ時のキャラ移動やアニメーションの速さなどに影響します。メッセージ中の制御文字「\.」や「\|」などの待ち時間には影響しません。
        */
        Scene_Map.prototype.updateMainMultiply = function () {        // 元メソッドにreturnはないよ。
            // デフォルトはこの一行。
            this.updateMain(); // 更新処理を一回だけ呼び出す。

            // // tachiさんの追加はこの一行。
            // if (this.isFastForward()) { this.updateMain(); this.updateMain();} // マップ時に早送り状態（決定ボタンや画面が「長押し」）だったら。  ※ダッシュ状態（Shiftボタンおしっぱなし）は判定に含まれていないので注意。

            // merusaiaの追加行は下。
            // 1. スピードのデフォルトは1。マップの移動スピードは、キャラ移動やアニメーションの速さのみ。戦闘スピードやメッセージスピードでは変更しない。
            var _speed = _MAPSPEED_DEFAULT;
            // 2. 早送りボタンが押されていたら、_speedを更新
            if (isFastRapidButton() === true) {
                _speed = _RAPID_MAPSPEED_DEFAULT;
                // // 変数番号を格納している、パラメータに変な値が入っていないか、随時チェック。
                if (_VarNo_Rapid_MapRate != null && _VarNo_Rapid_MapRate >= 1 && _VarNo_Rapid_MapRate < $dataSystem.variables.length) {
                    _speed = Number.parseInt($gameVariables.value(_VarNo_Rapid_MapRate));
                    // 変数の値に変な値が入っていないか、随時チェック。
                    if (_speed === Infinity || _speed === -Infinity) { _speed = _RAPID_MAPSPEED_DEFAULT; } // 無限大なら、デフォルトスピードで。
                    else if (_speed === 0) { _speed = _RAPID_MAPSPEED_DEFAULT; } // 0が入っていたら、デフォルトスピードで。
                    else if (_speed < 1) { _speed = 0; }   // 1未満なら0に。
                    else if (_speed > 99) { _speed = 99; } // 100以上になっても意味ないと思う。100倍なんて目に見えないし、updateを100回呼んでも処理は高速化されない。
                }else{
                    _speed = _RAPID_MAPSPEED_DEFAULT;
                }
            }
            // 3. スキップ中だったら、_speedをスキップ倍率で掛け算する。
            if (isSkipModeOn() === true) {
                _speed *= getSkipRate();
            }
            // 4. マップスピードの限界値を設定する。
            if(_speed > _FRAME_UPDATENUM_MAX * 10){
                _speed = _FRAME_UPDATENUM_MAX * 10;
            }
            // 5. _speed回だけ、更新処理を呼び出す。（体感ゲームスピードが_speed倍になる）
            for (var i = 2; i <= _speed; i++) {
                this.updateMain();
            }
            // merusaiaによる追加行、終。
        };

        // 戦闘メッセージ（バトルログ）の表示スピード高速化です。追加定義で競合対策済み。
        var _Window_BattleLog_updateWaitCount = Window_BattleLog.prototype.updateWaitCount;
        Window_BattleLog.prototype.updateWaitCount = function () {   // 元メソッドの返り値は、this._waitCount>0ならtrue、それ以外ならfalseだよ。
            if (this._waitCount > 0) {
                // // Tachiさんによる追加行、始まり。ここの5行が追加されている。
                // if (Input.isPressed('shift') || this.isFastForward()) // ダッシュ状態（Shiftボタンおしっぱなし）や、早送り状態（決定ボタン押しっぱなし）だったら
                // {
                //    this._waitCount -= 20; // tachiさんのデフォルト。なぜ-20なのかは不明。早過ぎると、ログが目で終えないほど小さくなってしまう可能性があるからです。
                // }
                // else { this._waitCount -= 2; }  // Tachiさんデフォルト。早送りでない場合を、だいぶ早く調整したかったみたいで、2だけ減らす。
                // Tachiさんによる追加行、終。

                // merusaiaの改変後は下。
                // 1. _waitCountを減らすデフォルトは、2。ツクールデフォルトでは、標準は1、早送り時は3。以下が元のメソッドの処理 this._waitCount -= this.isFastForward() ? 3 : 1;
                var _reduceCount = _BATTLE_LOGSPEED_DEFAULT;
                
                // 変数番号を格納している、パラメータに変な値が入っていないか、随時チェック。
                if (_VarNo_GameSpeed != null && _VarNo_GameSpeed >= 1 && _VarNo_GameSpeed < $dataSystem.variables.length) {
                    var _gameSpeed = $gameVariables.value(_VarNo_GameSpeed);
                    // 変数の値に変な値が入っていないか、随時チェック。.valueで || 0 としているため、nullやundefinedやNaNは0になる。判定は±Infinityだけで十分
                    _reduceCount = Number(_gameSpeed / 3); // ★戦闘スピード1-9が設定してあれば、それに3を割ったもの。
                    if (_gameSpeed === Infinity || _gameSpeed === -Infinity) { _reduceCount = _BATTLE_LOGSPEED_DEFAULT; } // 無限大なら、デフォルトスピードで。
                    else if (_gameSpeed === 0) { _reduceCount = _BATTLE_LOGSPEED_DEFAULT; } // 0が入っていたら、デフォルトスピード(2)で。
                    else if (_gameSpeed === 1) { _reduceCount = _BATTLE_LOGSPEED_DEFAULT * 0.5; }
                    else if (_gameSpeed === 2) { _reduceCount = _BATTLE_LOGSPEED_DEFAULT * 0.7; }
                    else if (_gameSpeed === 3) { _reduceCount = _BATTLE_LOGSPEED_DEFAULT * 0.8; }
                    else if (_gameSpeed === 4) { _reduceCount = _BATTLE_LOGSPEED_DEFAULT * 0.9; }
                    else if (_gameSpeed === 5) { _reduceCount = _BATTLE_LOGSPEED_DEFAULT; } // 5が入っていたら、デフォルトスピード(2)で。
                    else if (_gameSpeed === 6) { _reduceCount = _BATTLE_LOGSPEED_DEFAULT * 1.2; } // 6が入っていたら、デフォルトスピード*1.2で。
                    else if (_gameSpeed === 7) { _reduceCount = _BATTLE_LOGSPEED_DEFAULT * 1.5; } // 6が入っていたら、デフォルトスピード*1.5で。
                    else if (_gameSpeed === 10) { _reduceCount = 99; } // 最速の10が入っていたら、99で。
                    else if (_gameSpeed < 1) { _reduceCount = 0.2; } // 1未満なら0.2に。
                    else if (_gameSpeed > 99) { _reduceCount = 99; } // これ以上の高速化は無意味。早くならない。
                }
                // 2. 早送りボタンが押されていたら、ゲーム内変数を取得し、_speedの値を更新。元メソッドのデフォルトは3。
                if (isFastRapidButton()) { // 元メソッドの早送り条件である this.isFastForward() とは、厳密には対応ボタンや長押し設定などが違うので、注意して。
                    // 変数番号を格納している、パラメータに変な値が入っていないか、随時チェック。
                    if (_VarNo_Rapid_BattleRate != null && _VarNo_Rapid_BattleRate >= 1 && _VarNo_Rapid_BattleRate < $dataSystem.variables.length) {
                        _reduceCount = Number.parseInt($gameVariables.value(_VarNo_Rapid_BattleRate));
                        // 変数の値に変な値が入っていないか、随時チェック。
                        if (_reduceCount === Infinity || _reduceCount === -Infinity) { _reduceCount = _RAPID_BATTLE_LOGSPEED_DEFAULT; } // 無限大なら、デフォルトスピードで。
                        else if (_reduceCount === 0) { _reduceCount = _RAPID_BATTLE_LOGSPEED_DEFAULT; } // 0が入っていたら、デフォルトスピード(-2カウント)で。
                        else if (_reduceCount < 1) { _reduceCount = 1; }   // ここだけ、0は許可しない。1未満なら1に。ボタン長押しでゆっくりにしたい時に。
                        else if (_reduceCount > 99) { _reduceCount = 99; } // これ以上の高速化は無意味。早くならない。
                    }else{
                        _reduceCount = _RAPID_BATTLE_LOGSPEED_DEFAULT;
                    }
                }
                // 3. スキップ中だったら、_speedをスキップ倍率で掛け算する。
                if (isSkipModeOn() === true) {
                    _reduceCount *= getSkipRate();
                }
                if(this._waitCount == null){
                    if(_isDebugMode()){
                        console.log('■this._waitCount：' + (this._waitCount) + ' がnullかundefinedになってるから、 初期値に戻すよ。');
                    }
                    this._waitCount = 16;
                }
                // 4. _speedだけ、this._waitCount(次の処理まで待つカウント数。0になったら次へ。)を引く。（体感ゲームスピードが早くなる）。
                // ただし、_speedは1以上を保証する。0だとthis._waitCountがずっと減らず、無限ループするから、注意だよ！。
                // 4.1. speedの例外チェック
                if(Number.isNaN(_reduceCount) || _reduceCount == null || _reduceCount === Infinity || _reduceCount === -Infinity){
                    if(_isDebugMode()){
                        console.log('■_reduceCount：' + (_reduceCount) + ' がおかしいよ。 デフォルト'+ _BATTLE_LOGSPEED_DEFAULT +'に戻すよ。');
                    }
                    _reduceCount = _BATTLE_LOGSPEED_DEFAULT;
                }
                if(_reduceCount < 0.2){
                    if(_isDebugMode()){
                        console.log('■_reduceCount：' + (_reduceCount) + ' が0未満です。0だと止まってしまうので、 0.2にします。');
                    }
                    _reduceCount = 0.2; // 必ず0.2以上は引く。
                }
                // 4.2. 計算元のthis._waitCountの例外チェック
                // ただし、this._waitCountが以下の値になった場合、this._waitCount=0とする。
                // ・0未満:            この変数の意味は「ゲームを再開するまで待つフレーム数」なので、-1とか-2が入っても、意味はない。なので、元のソースでも if(this._waitCount < 0){ this._waitCount = 0; } としている。
                // ・NaN:              数えられない数。や、0/0などで発生する。計算式にundefinedのものが一つでもあると、this._waitCountにNaNが入る。
                // ・Infinity          超小さい値や+∞を使った計算。ゼロ除算などで発生する。ちなみに、Number.isNaN(Infinity)はfalse。Number.isFinite(Infinity)もfalse。isInfinityメソッドは存在しないので、「=== Infinity」と「===-Inifinity」で判定する。
                // ・nullやundefined:  計算式にundefinedやnull、数値に変換できないもの（文字列）が一つでもあると、計算結果にNaNが入る。「==null」でチェックできる。
                if(Number.isNaN(this._waitCount) || this._waitCount == null || this._waitCount === Infinity || this._waitCount === -Infinity){
                    if(_isDebugMode()){
                        console.log('■this._waitCount：' + this._waitCount + ' がおかしいから、 '+_reduceCount+' 引いてもNaNになるよ。 0に初期化します。');
                    }
                    this._waitCount = 0;
                    return false; // もう待たない。
                }else{
                    // ここで、残りウェイトカウントを引く。
                    this._waitCount -= _reduceCount;
                }
                // merusaiaによる追加行、終。
                
                // 元メソッドのソースにもある処理。0未満なら、0にする。ただし、この場合も返り値はtrue（元メソッドとしように合わせる）
                if (this._waitCount < 0) {
                    this._waitCount = 0;
                }
                return true; // 元メソッドの返り値は、this._waitCount>0ならtrue、それ以外ならfalseだよ。

            }else{
                // 0以下なら、もう待たない。
                return false; // 元メソッドの返り値は、this._waitCount>0ならtrue、それ以外ならfalseだよ。
            }
        };

        // 敵エンカウントエフェクトのスピードをあげています。ここはスピード倍率では変化しません。デフォルトは60フレーム(1秒)。追加定義で競合対策済み。
        var _Scene_Map_encounterEffectSpeed = Scene_Map.prototype.encounterEffectSpeed;
        Scene_Map.prototype.encounterEffectSpeed = function () {
            return 20; // デフォルトのソースは60;
        };

        // 敵エンカウント時の画面ズームの処理を省いて、高速化しています。追加定義で競合対策済み。
        var _Scene_Map_updateEncounterEffect = Scene_Map.prototype.updateEncounterEffect;
        Scene_Map.prototype.updateEncounterEffect = function () {    // 元メソッドにreturnはないよ。
            if (this._encounterEffectDuration > 0) {
                this._encounterEffectDuration--;
                var speed = this.encounterEffectSpeed();
                var n = speed - this._encounterEffectDuration; // ここが、上で設定したエフェクトスピードに影響されます。ここはデフォルトと一緒。調整されていない。
                var p = n / speed;
                var q = ((p - 1) * 20 * p + 5) * p + 1;  // ここはデフォルトと一緒。調整されていない。
                var zoomX = $gamePlayer.screenX();
                var zoomY = $gamePlayer.screenY() - 24;
                if (n === 2) {
                    //$gameScreen.setZoom(zoomX, zoomY, 1); // デフォルトと違うのは、ここをコメントしている所。画面ズームの処理を省いて、高速化したかったのかな。
                    this.snapForBattleBackground();
                    this.startFlashForEncounter(speed / 2);
                }
                //$gameScreen.setZoom(zoomX, zoomY, q); // デフォルトと違うのは、ここをコメントしている所。画面ズームの処理を省いて、高速化したかったのかな。
                if (n === Math.floor(speed / 6)) {
                    this.startFlashForEncounter(speed / 2);
                }
                if (n === Math.floor(speed / 2)) {
                    BattleManager.playBattleBgm();
                    this.startFadeOut(10);// this.fadeSpeed()); // デフォルトと違うのは、ここをthis.fadeSpeed()→10としているところ。フェードアウトを早くしたかったんですね。
                }
            }
        };

        //  エンカウントスピードの調整（キャラクターを消すエフェクトを無しにして、エンカウントスピードを上げている）。追加定義で競合対策済み。
        var _Scene_Map_startEncounterEffect = Scene_Map.prototype.startEncounterEffect;
        Scene_Map.prototype.startEncounterEffect = function () {     // 元メソッドにreturnはないよ。
            //this._spriteset.hideCharacters(); // ここだけデフォルトから変更。コメントアウト。マップ敵エンカウント時のキャラクターを消すエフェクトを無効にしている。
            this._encounterEffectDuration = this.encounterEffectSpeed();
        };

        // 以下、戦闘の高速化。スキルエフェクトのアニメーション、敵スプライト、移動速度、武器モーションのスピードを、それぞれ個別に調整。追加定義で競合対策済み。

        // スキルエフェクト、つまり、戦闘アニメーションの高速化。サイドビュー時は、敵味方共通。
        var _Sprite_Animation_update = Sprite_Animation.prototype.update;
        Sprite_Animation.prototype.update = function () {           // 元メソッドにreturnはないよ。
            Sprite.prototype.update.apply(this, arguments); // 元のメソッドを呼び出すよ。.call(this, 引数1, 引数2, ...)よりapplyの方がコピペミスを防げていいよ。
            this.updateMain();

            // // Tachiさんによる追加行、始まり。  ここの6行が追加されている。
            // if(Input.isPressed('ok') || Input.isPressed('shift') || TouchInput.isPressed()){ // ダッシュ状態（Shiftボタンおしっぱなし）や、早送り状態（決定ボタン押しっぱなし）だったら、
            //     this.updateMain(); // ここまでだと２倍
            //     this.updateMain(); // ここまでだと３倍
            //     this.updateMain(); // ここまでだと４倍
            // }
            // // Tachiさんによる追加行、終。

            // merusaiaの追加行は下。
            // 1. 戦闘スピードのデフォルトは1。
            var _speed = _BATTLE_ANIMATIONSPEED_DEFAULT;
            // 変数番号を格納している、パラメータに変な値が入っていないか、随時チェック。
            if (_VarNo_GameSpeed != null && _VarNo_GameSpeed >= 1 && _VarNo_GameSpeed < $dataSystem.variables.length) {
                var _gameSpeed = $gameVariables.value(_VarNo_GameSpeed);
                _speed = Number.parseInt(_gameSpeed / 10); // ★戦闘スピード1-9が設定してあれば、それに4を割ったもの。
                // 変数の値に変な値が入っていないか、随時チェック。
                if (_gameSpeed === Infinity || _gameSpeed === -Infinity) { _speed = _BATTLE_ANIMATIONSPEED_DEFAULT; } // 無限大なら、デフォルトスピードで。
                else if (_gameSpeed === 0) { _speed = _BATTLE_ANIMATIONSPEED_DEFAULT; } // 0が入っていたら、デフォルトスピードで。
                else if (_gameSpeed === 5) { _speed = _BATTLE_ANIMATIONSPEED_DEFAULT; } // 5が入っていたら、デフォルトスピードで。
                else if (_gameSpeed === 10) { _speed = 99; } // 5が入っていたら、最速の99で。
                else if (_gameSpeed < 1) { _speed = 0; } // 1未満なら0に。
                else if (_gameSpeed > 99) { _speed = 99; } // 100以上になっても意味ないと思う。100倍なんて目に見えないし、updateを100回呼んでも処理は高速化されない。
            }
            // 2. 早送りボタンが押されていたら、_speedを更新
            if (isFastRapidButton() === true) {
                // 変数番号を格納している、パラメータに変な値が入っていないか、随時チェック。
                if (_VarNo_Rapid_BattleRate != null && _VarNo_Rapid_BattleRate >= 1 && _VarNo_Rapid_BattleRate < $dataSystem.variables.length) {
                    _speed = Number.parseInt($gameVariables.value(_VarNo_Rapid_BattleRate));
                    // 変数の値に変な値が入っていないか、随時チェック。
                    if (_speed === Infinity || _speed === -Infinity) { _speed = _RAPID_BATTLE_ANIMATIONSPEED_DEFAULT; } // 無限大なら、デフォルトスピードで。
                    else if (_speed === 0) { _speed = _RAPID_BATTLE_ANIMATIONSPEED_DEFAULT; } // 0が入っていたら、デフォルトスピードで。
                    else if (_speed < 1) { _speed = 0; } // 1未満なら0に。
                    else if (_speed > 99) { _speed = 99; } // 100以上になっても意味ないと思う。100倍なんて目に見えないし、updateを100回呼んでも処理は高速化されない。
                }else{
                    _speed = _RAPID_BATTLE_ANIMATIONSPEED_DEFAULT;
                }
            }
            // 3. スキップ中だったら、_speedをスキップ倍率で掛け算する。
            if (isSkipModeOn() === true) {
                _speed *= getSkipRate();
            }
            // 4. 戦闘アニメーションの限界値を設定する。
            if(_speed > _FRAME_UPDATENUM_MAX * 10){
                _speed = _FRAME_UPDATENUM_MAX * 10;
            }
            // 5. _speed回だけ、更新処理を呼び出す。（体感ゲームスピードが_speed倍になる）
            for (var i = 2; i < _speed; i++) {
                this.updateMain();
            }
            // 以下、デバッグ用。ただ、かなりの頻度で高速実行されるので、普段はコメントしておいてください。
            //console.log("■★★★現在のエフェクトスピード★★★: "+_speed);
            // merusaiaによる追加行、終。

            this.updateFlash();
            this.updateScreenFlash();
            this.updateHiding();
            Sprite_Animation._checker1 = {};
            Sprite_Animation._checker2 = {};
        };

        // Tachiさんによる敵スプライト高速化。敵の状態異常付加・解除や、倒れエフェクトなどが高速化される（？）。敵全体攻撃の爽快感に重要（？）。
        var _Sprite_Enemy_update = Sprite_Enemy.prototype.update;
        Sprite_Enemy.prototype.update = function () {               // 元メソッドにreturnはないよ。
            Sprite_Battler.prototype.update.apply(this, arguments); // 元のメソッドを呼び出すよ。.call(this, 引数1, 引数2, ...)よりapplyの方がコピペミスを防げていいよ。
            if (this._enemy) {

                this.updateEffect();

                // // Tachiさんによる追加行、始まり。ここの4行が追加されている。高速モード時は戦闘エフェクトも高速化。まぁ…同じですよね。ただしここは三倍。
                // if(Input.isPressed('ok') || Input.isPressed('shift') || TouchInput.isPressed()){
                //     this.updateEffect(); // ここまでだと２倍
                //     this.updateEffect(); // ここまでだと３倍
                // }
                // // Tachiさんによる追加行、終。

                // merusaiaの追加行は下。
                // 1. 戦闘スプライトスピードのデフォルトは2。
                var _speed = _BATTLE_ENEMYSPEED_DEFAULT;
                // 変数番号を格納している、パラメータに変な値が入っていないか、随時チェック。
                if (_VarNo_GameSpeed != null && _VarNo_GameSpeed >= 1 && _VarNo_GameSpeed < $dataSystem.variables.length) {
                    var _gameSpeed = $gameVariables.value(_VarNo_GameSpeed);
                    _speed = Number.parseInt(_gameSpeed / 3); // ★戦闘スピード1-9が設定してあれば、それに3を割ったもの。
                    // 変数の値に変な値が入っていないか、随時チェック。
                    if (_gameSpeed === Infinity || _gameSpeed === -Infinity) { _speed = _BATTLE_ENEMYSPEED_DEFAULT; } // 無限大なら、デフォルトスピードで。
                    else if (_gameSpeed === 0) { _speed = _BATTLE_ENEMYSPEED_DEFAULT; } // 0が入っていたら、デフォルトスピードで。
                    else if (_gameSpeed === 5) { _speed = _BATTLE_ENEMYSPEED_DEFAULT; } // 5が入っていたら、デフォルトスピードで。
                    else if (_gameSpeed === 10) { _speed = 99; } // 10が入っていたら、最速の99で。
                    else if (_gameSpeed < 1) { _speed = 0; } // 1未満なら0に。
                    else if (_gameSpeed > 99) { _speed = 99; } // 100以上になっても意味ないと思う。100倍なんて目に見えないし、updateを100回呼んでも処理は高速化されない。
                }
                // 2. 早送りボタンが押されていたら、_speedを更新
                if (isFastRapidButton() === true) {
                    // 変数番号を格納している、パラメータに変な値が入っていないか、随時チェック。
                    if (_VarNo_Rapid_BattleRate != null && _VarNo_Rapid_BattleRate >= 1 && _VarNo_Rapid_BattleRate < $dataSystem.variables.length) {
                        _speed = Number.parseInt($gameVariables.value(_VarNo_Rapid_BattleRate));
                        // 変数の値に変な値が入っていないか、随時チェック。
                        if (_speed === Infinity || _speed === -Infinity) { _speed = _RAPID_BATTLE_ENEMYSPEED_DEFAULT; } // 無限大なら、デフォルトスピードで。
                        else if (_speed === 0) { _speed = _RAPID_BATTLE_ENEMYSPEED_DEFAULT; } // 0が入っていたら、デフォルトスピード(2倍)で。
                        else if (_speed < 1) { _speed = 0; } // 1未満なら0に。
                        else if (_speed > 99) { _speed = 99; } // 100以上になっても意味ないと思う。100倍なんて目に見えないし、updateを100回呼んでも処理は高速化されない。
                    }else{
                        _speed = _RAPID_BATTLE_ENEMYSPEED_DEFAULT;
                    }
                }
                // 3. スキップ中だったら、_speedをスキップ倍率で掛け算する。
                if (isSkipModeOn() === true) {
                    _speed *= getSkipRate();
                }
                // 4. 敵スプライト描画スピードの限界値を設定する。
                if(_speed > _FRAME_UPDATENUM_MAX){
                    _speed = _FRAME_UPDATENUM_MAX;
                }
                // 5. _speed回だけ、更新処理を呼び出す。（体感ゲームスピードが_speed倍になる）
                for (var i = 2; i < _speed; i++) {
                    this.updateEffect();
                }
                // merusaiaによる追加行、終。


                this.updateStateSprite(); // デフォルトソースの最後の一行。ステートのスプライトを更新。
            }
        };

        // 武器モーションアニメ高速化。サイドビュー時は、この倍率が、通常攻撃時の爽快感にまずまず影響する。
        var _Sprite_Weapon_animationWait = Sprite_Weapon.prototype.animationWait;
        Sprite_Weapon.prototype.animationWait = function () {        // 元メソッドは待ち回数の整数を返すよ。
            // // Tachiさんによる追加は以下の一行。高速モード時は4倍。デフォルトは return 12;のみ。
            // if(Input.isPressed('ok') || Input.isPressed('shift') || TouchInput.isPressed()){return 3;}else{return 12;}

            // merusaiaの追加行は下。
            // 1. 武器モーションスピードのデフォルトは1。ここが早いとサイドビューのモーションが見れない。
            var _speed = 1;
            // 変数番号を格納している、パラメータに変な値が入っていないか、随時チェック。
            if (_VarNo_GameSpeed != null && _VarNo_GameSpeed >= 1 && _VarNo_GameSpeed < $dataSystem.variables.length) {
                var _gameSpeed = $gameVariables.value(_VarNo_GameSpeed);
                _speed = Number.parseInt(_gameSpeed / 4); // ★戦闘スピード1-9が設定してあれば、それに4を割ったもの。
                // 変数の値に変な値が入っていないか、随時チェック。
                if (_gameSpeed === Infinity || _gameSpeed === -Infinity) { _speed = _BATTLE_MOTIONSPEED_DEFAULT; } // 無限大なら、デフォルトスピードで。
                else if (_gameSpeed === 0) { _speed = _BATTLE_MOTIONSPEED_DEFAULT; } // 0が入っていたら、デフォルトスピードで。
                else if (_gameSpeed === 5) { _speed = _BATTLE_MOTIONSPEED_DEFAULT; } // 5が入っていたら、デフォルトスピードで。
                else if (_gameSpeed === 10) { _speed = 99; } // 10が入っていたら、最速の99で。
                else if (_gameSpeed < 1) { _speed = 1; } // 1未満なら1に。
                else if (_gameSpeed > 99) { _speed = 99; } // 100以上になっても意味ないと思う。100倍なんて目に見えないし、updateを100回呼んでも処理は高速化されない。
            }
            // 2. 早送りボタンが押されていたら、_speedを更新
            if (isFastRapidButton() === true) {
                // 変数番号を格納している、パラメータに変な値が入っていないか、随時チェック。
                if (_VarNo_Rapid_BattleRate != null && _VarNo_Rapid_BattleRate >= 1 && _VarNo_Rapid_BattleRate < $dataSystem.variables.length) {
                    _speed = Number.parseInt($gameVariables.value(_VarNo_Rapid_BattleRate));
                    // 変数の値に変な値が入っていないか、随時チェック。
                    if (_speed === Infinity || _speed === -Infinity) { _speed = _RAPID_BATTLE_MOTIONSPEED_DEFAULT; } // 無限大なら、デフォルトスピードで。
                    else if (_speed === 0) { _speed = _RAPID_BATTLE_MOTIONSPEED_DEFAULT; } // 0が入っていたら、デフォルトスピードで。
                    else if (_speed < 1) { _speed = 1; } // 1未満なら1に。
                    else if (_speed > 99) { _speed = 99; } // 100以上になっても意味ないと思う。100倍なんて目に見えないし、updateを100回呼んでも処理は高速化されない。
                }else{
                    _speed = _RAPID_BATTLE_MOTIONSPEED_DEFAULT;
                }
            }
            // 3. スキップ中だったら、_speedをスキップ倍率で掛け算する。
            if (isSkipModeOn() === true) {
                _speed *= getSkipRate();
            }
            // 4. 武器モーションアニメーションの限界値を設定する。
            if(_speed > _FRAME_UPDATENUM_MAX * 50){
                _speed = _FRAME_UPDATENUM_MAX * 50;
            }
            // 5. _speed回だけ、12を割る。
            var _waitNum = 12 / Math.max(1, _speed); // 1～_speedにすることで、ゼロ割を防いでいる。
            if (_waitNum < 1) _waitNum = 1;
            return _waitNum; // 元メソッドは待ち回数の整数を返すよ。
            // merusaiaによる追加行、終。
        };

        // アクターステートスピード高速化。味方の状態異常付加・解除や、倒れエフェクトなどが高速化される。これは全体攻撃の爽快感に重要。
        var _Sprite_Actor_motionSpeed = Sprite_Actor.prototype.motionSpeed;
        Sprite_Actor.prototype.motionSpeed = function () {           // 元メソッドは待ち回数の整数を返すよ。
            // // Tachiさんによる追加は以下の一行。高速モード時は4倍。デフォルトは return 12;のみ。
            // if(Input.isPressed('ok') || Input.isPressed('shift') || TouchInput.isPressed()){return 3;}else{return 12;}

            // merusaiaの追加行は下。
            // 1. アクターステートスピードのデフォルトは3。個人的に、ここは、ツクールのデフォルトの1でもいいと思う（ほんと？ 要検証）。
            var _speed = _BATTLE_MOTIONSPEED_DEFAULT;
            // 変数番号を格納している、パラメータに変な値が入っていないか、随時チェック。
            if (_VarNo_GameSpeed != null && _VarNo_GameSpeed >= 1 && _VarNo_GameSpeed < $dataSystem.variables.length) {
                var _gameSpeed = $gameVariables.value(_VarNo_GameSpeed);
                _speed = Number.parseInt(_gameSpeed / 2); // ★戦闘スピード1-9が設定してあれば、それに2を割ったもの。
                // 変数の値に変な値が入っていないか、随時チェック。
                if (_gameSpeed === Infinity || _gameSpeed === -Infinity) { _speed = _BATTLE_MOTIONSPEED_DEFAULT; } // 無限大なら、デフォルトスピードで。
                else if (_gameSpeed === 0) { _speed = _BATTLE_MOTIONSPEED_DEFAULT; } // 0が入っていたら、デフォルトスピードで。
                else if (_gameSpeed === 5) { _speed = _BATTLE_MOTIONSPEED_DEFAULT; } // 5が入っていたら、デフォルトスピードで。
                else if (_gameSpeed === 10) { _speed = 99; } // 10が入っていたら、最速の99で。
                else if (_gameSpeed < 1) { _speed = 1; } // 1未満なら1に。
                else if (_gameSpeed > 99) { _speed = 99; } // 100以上になっても意味ないと思う。100倍なんて目に見えないし、updateを100回呼んでも処理は高速化されない。
            }
            // 2. 早送りボタンが押されていたら、_speedを更新
            if (isFastRapidButton() === true) {
                // 変数番号を格納している、パラメータに変な値が入っていないか、随時チェック。
                if (_VarNo_Rapid_BattleRate != null && _VarNo_Rapid_BattleRate >= 1 && _VarNo_Rapid_BattleRate < $dataSystem.variables.length) {
                    _speed = Number.parseInt($gameVariables.value(_VarNo_Rapid_BattleRate));
                    // 変数の値に変な値が入っていないか、随時チェック。
                    if (_speed === Infinity || _speed === -Infinity) { _speed = _RAPID_BATTLE_MOTIONSPEED_DEFAULT; } // 無限大なら、デフォルトスピードで。
                    else if (_speed === 0) { _speed = _RAPID_BATTLE_MOTIONSPEED_DEFAULT; } // 0が入っていたら、デフォルトスピードで。
                    else if (_speed < 1) { _speed = 1; } // 1未満なら1に。
                    else if (_speed > 99) { _speed = 99; } // 100以上になっても意味ないと思う。100倍なんて目に見えないし、updateを100回呼んでも処理は高速化されない。
                }else{
                    _speed = _RAPID_BATTLE_MOTIONSPEED_DEFAULT;
                }
            }
            // 3. スキップ中だったら、_speedをスキップ倍率で掛け算する。
            if (isSkipModeOn() === true) {
                _speed *= getSkipRate();
            }
            // 4. アクターステートスピード描画の限界値を設定する。
            if(_speed > _FRAME_UPDATENUM_MAX){
                _speed = _FRAME_UPDATENUM_MAX;
            }
            // 5. _speed回だけ、12を割る。
            var _waitNum = 12 / Math.max(1, _speed); // 1～_speedにすることで、ゼロ割を防いでいる。
            if (_waitNum < 1) _waitNum = 1;
            return _waitNum; // 元メソッドは待ち回数の整数を返すよ。
            // merusaiaによる追加行、終。
        };

        // 戦闘中キャラクターの移動と動作速度。アクターが、前に出る動作、後ろに下がる動作、息継ぎ、全てを担う。ここの高速化は、アクターの行動の爽快感に重要。だが、息継ぎが早いと変。
        var _Sprite_Actor_updateMove = Sprite_Actor.prototype.updateMove;
        Sprite_Actor.prototype.updateMove = function () {            // 元メソッドにreturnはないよ。
            var bitmap = this._mainSprite.bitmap;
            if (!bitmap || bitmap.isReady()) {
                Sprite_Battler.prototype.updateMove.apply(this, arguments); // 元のメソッドを呼び出すよ。.call(this, 引数1, 引数2, ...)よりapplyの方がコピペミスを防げていいよ。

                // // Tachiさんによる追加行、始まり。ここの4行が追加されている。高速モード時は戦闘エフェクトも高速化。まぁ…同じですよね。ただしここは3倍。
                // if(Input.isPressed('ok') || Input.isPressed('shift') || TouchInput.isPressed()){
                //     Sprite_Battler.prototype.updateMove.call(this); // ここまでだと２倍
                //     Sprite_Battler.prototype.updateMove.call(this); // ここまでだと３倍
                // }
                // // Tachiさんによる追加行、終わり。

                // merusaiaの追加行は下。
                // 1. スピードのデフォルトは1。個人的には、1.5の間がほしい。ツクールデフォルトの1か、ヘイストみたいな倍速の2しかないのは痛い。
                var _speed = _BATTLE_MOVESPEED_DEFAULT;
                // 変数番号を格納している、パラメータに変な値が入っていないか、随時チェック。
                if (_VarNo_GameSpeed != null && _VarNo_GameSpeed >= 1 && _VarNo_GameSpeed < $dataSystem.variables.length) {
                    var _gameSpeed = $gameVariables.value(_VarNo_GameSpeed);
                    _speed = Number.parseInt(_gameSpeed / 4); // ★戦闘スピード1-9が設定してあれば、それに4を割ったもの。
                    // 変数の値に変な値が入っていないか、随時チェック。
                    if (_gameSpeed === Infinity || _gameSpeed === -Infinity) { _speed = _BATTLE_MOVESPEED_DEFAULT; } // 無限大なら、デフォルトスピードで。
                    else if (_gameSpeed === 0) { _speed = _BATTLE_MOVESPEED_DEFAULT; } // 0が入っていたら、デフォルトスピードで。
                    else if (_gameSpeed === 5) { _speed = _BATTLE_MOVESPEED_DEFAULT; } // 5が入っていたら、デフォルトスピードで。
                    else if (_gameSpeed === 10) { _speed = 99; } // 10が入っていたら、最速の99で。
                    else if (_gameSpeed < 1) { _speed = 0; } // 1未満なら0に。
                    else if (_gameSpeed > 99) { _speed = 99; } // 100以上になっても意味ないと思う。100倍なんて目に見えないし、updateを100回呼んでも処理は高速化されない。
                }
                // 2. 早送りボタンが押されていたら、_speedを更新
                if (isFastRapidButton() === true) {
                    // 変数番号を格納している、パラメータに変な値が入っていないか、随時チェック。
                    if (_VarNo_Rapid_BattleRate != null && _VarNo_Rapid_BattleRate >= 1 && _VarNo_Rapid_BattleRate < $dataSystem.variables.length) {
                        _speed = Number.parseInt($gameVariables.value(_VarNo_Rapid_BattleRate));
                        // 変数の値に変な値が入っていないか、随時チェック。
                        if (_speed === Infinity || _speed === -Infinity) { _speed = _RAPID_BATTLE_MOVESPEED_DEFAULT; } // 無限大なら、デフォルトスピードで。
                        else if (_speed === 0) { _speed = _RAPID_BATTLE_MOVESPEED_DEFAULT; } // 0が入っていたら、デフォルトスピードで。
                        else if (_speed < 1) { _speed = 0; } // 1未満なら0に。
                        else if (_speed > 99) { _speed = 99; } // 100以上になっても意味ないと思う。100倍なんて目に見えないし、updateを100回呼んでも処理は高速化されない。
                    }else{
                        _speed = _RAPID_BATTLE_MOVESPEED_DEFAULT;
                    }
                }
                // 3. スキップ中だったら、_speedをスキップ倍率で掛け算する。
                if (isSkipModeOn() === true) {
                    _speed *= getSkipRate();
                }
                // 4. キャラ息継ぎと移動スピード描画の限界値を設定する。
                if(_speed > _FRAME_UPDATENUM_MAX * 10){
                    _speed = _FRAME_UPDATENUM_MAX * 10;
                }
                // 5. _speed回だけ、更新処理を呼び出す。（体感ゲームスピードが_speed倍になる）
                for (var i = 2; i < _speed; i++) {
                    Sprite_Battler.prototype.updateMove.apply(this, arguments); // 元のメソッドを呼び出すよ。.call(this, 引数1, 引数2, ...)よりapplyの方がコピペミスを防げていいよ。
                }
                // merusaiaによる追加行、終。
            }
        };

        var Scene_Map_isFastForward = Scene_Map.prototype.isFastForward;
        /**  Scene_Map.prototype.isFastForwardの上書き。早送りモードに移行する条件の追加。
         * ・tachiさんによって、デフォルトの決定ボタン押しっぱなしだけでなく、shiftボタン/タッチ画面が押しっぱなし、が追加されています。
        * ・merusaiaによって、各種ボタン（決定ボタン/shiftボタン）の早送りを有効/無効にする機能が追加されています。
        */
        Scene_Map.prototype.isFastForward = function () {            // 元メソッドは早送り中かどうかを返すよ。
            // tachiさんのデフォルトは次の二行。
            //   return (  $gameMap.isEventRunning() && !SceneManager.isSceneChanging() &&
            //            (Input.isLongPressed('ok') || Input.isLongPressed('shift') || TouchInput.isLongPressed()));

            // merusaiaが、マップ中、タッチ、に分けて、わかりやすく整理して変更。
            var _isFastForwardButtonPressed = false;
            // マップ中で（シーン切替中ではなくて）、かつ、
            // 各種ボタンの早送りが有効で、かつそのボタンが長押しされていたら、早送りモードとする。
            _isFastForwardButtonPressed =
                ($gameMap.isEventRunning() && !SceneManager.isSceneChanging() &&
                    (
                        (_isRapid_BattleButton_ok === true && Input.isLongPressed('ok'))         // 決定ボタン早送りモードが有効＆長押し
                        || // または
                        (_isRapid_BattleButton_cancel === true && Input.isLongPressed('cancel')) // キャンセルボタン早送りモードが有効＆長押し
                        || // または
                        (_isRapid_BattleButton_shift === true && Input.isLongPressed('shift'))   // ダッシュボタン早送りモードが有効＆長押し
                        || // または
                        TouchInput.isLongPressed()                                               // タッチ画面の長押し
                    )
                );
            return _isFastForwardButtonPressed; // 元メソッドは早送り中かどうかを返すよ。
        };


        //=========================================================================
        // Window_Messge
        //=========================================================================
        //  エスケープコマンドを追加定義して、メッセージスピードによって、「\.」や「\|」の待ち時間を動的に変更できるようにしています。
        //  ※mankind_roboさんのMKR_ControlCharacterEx.jsを参考にしています。感謝。
        var _Window_Message_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter; // 元メソッドにreturnはないよ。
        Window_Message.prototype.processEscapeCharacter = function (code, textState) {
            // メッセージ中の文字列に、「\.」や「\|」がないか調べる。
            // 早送りやゲームスピードで「\.」の待ち時間を変動させたい場合はこうしてね
            var _waitFrameNum = (Number.parseInt(_WaitPeriodDef/getMessageWaitEscapeCharacterSpeed()) || 0);
            // 早送りやゲームスピードで「\.」の待ち時間を変動したくない場合はこれ→ var _waitFrameNum = (Number.parseInt(_WaitPeriodDef) || 0);
            switch (code) {
                case '.':
                    if(isSkipModeOn() === false){                                   // スキップ中だと、待ちません。
                        // 変数番号を格納している、パラメータに変な値が入っていないか、随時チェック。
                        if (_VarNo_GameSpeed != null && _VarNo_GameSpeed >= 1 && _VarNo_GameSpeed < $dataSystem.variables.length) {
                            var _gameSpeed = $gameVariables.value(_VarNo_GameSpeed);
                        }
                        if (_gameSpeed !== 10){                                     // ゲームスピードが10だったら、待ちません。
                            _waitFrameNum = ConvertEscapeCharacters(_WaitPeriodDef);  // 制御文字\N[n]も、変数値にします。
                            // 以下、デバッグ用。制御文字\N[n]も、変数値にきちんと変換されているかどうか。
                            if(_isDebugMode()){
                                console.log('minRPG_CustomizeGameSpeed.js 「\\.」のウェイトフレーム数の変更: _WaitPeriodDef:'+_WaitPeriodDef +' → 変換後:'+_waitFrameNum);
                            }
                            _waitFrameNum = (Number.parseInt(_waitFrameNum)  || 0); // NaNや数値にならない場合も、0になります。±Infinityだけ例外処理が必要です。
                            if(_waitFrameNum === Infinity || _waitFrameNum === -Infinity) _waitFrameNum = 15; // ±Infinityになる理由は、0割りでもしたのかな。とりあえずデフォルト値にします。
                            this.startWait(_waitFrameNum); // 独自の方法で、このパラメータ分だけウェイトするよ（元のツクールもともとの待ち時間は無視するよ）
                        }
                    }
                    break;
                case '|':
                    if(isSkipModeOn() === false){                                   // スキップ中だと、待ちません。
                        // 変数番号を格納している、パラメータに変な値が入っていないか、随時チェック。
                        if (_VarNo_GameSpeed != null && _VarNo_GameSpeed >= 1 && _VarNo_GameSpeed < $dataSystem.variables.length) {
                            var _gameSpeed = $gameVariables.value(_VarNo_GameSpeed);
                        }
                        // ゲームスピードが10でも、「\|」だけは待つようにしました。でないと、自動送りのメッセージが瞬時に次に行ってしまいます。
                        //if (_gameSpeed !== 10){                                     // ゲームスピードが10だったら、待ちません。
                            _waitFrameNum = ConvertEscapeCharacters(_WaitLineDef);    // 制御文字\N[n]も、変数値にします。
                            _waitFrameNum = (Number.parseInt(_waitFrameNum)  || 0); // NaNや数値にならない場合も、0になります。±Infinityだけ例外処理が必要です。
                            if(_waitFrameNum === Infinity || _waitFrameNum === -Infinity) _waitFrameNum = 60; // ±Infinityになる理由は、0割りでもしたのかな。とりあえずデフォルト値にします。
                            this.startWait(ConvertEscapeCharacters(Number.parseInt(_WaitLineDef) ));   // 独自の方法で、このパラメータ分だけウェイトするよ（元のツクールもともとの待ち時間は無視するよ）
                        //}
                    }
                    break;
                default:
                    // それ以外の制御文字が付いている場合は、元のメソッドを呼び出すよ。（追加定義するけど、消さない。これ、すごい競合対策だよ）
                    _Window_Message_processEscapeCharacter.apply(this, arguments); // 元のメソッドを呼び出すよ。.call(this, 引数1, 引数2, ...)よりapplyの方がコピペミスを防げていいよ。
                    break;
            }
        };
        // 以下、メッセージ表示スピードの調整です。
        // ※T.AkatsukiさんのUTA_MessageSkip.jsを参考にしています。感謝。
        // スキップ中だけ、メッセージの文字列を即全表示します。
        var _Window_Message_updateShowFast = Window_Message.prototype.updateShowFast;
        Window_Message.prototype.updateShowFast = function() { // 元メソッドにreturnはないよ。
            _Window_Message_updateShowFast.apply(this, arguments); // 元のメソッドを呼び出すよ。.call(this, 引数1, 引数2, ...)よりapplyの方がコピペミスを防げていいよ。
            // ここから、メソッドの追加処理。
            // スキップ中は、一瞬で全表示して、さらにボタン送りもスキップしてね。
            if (isSkipModeOn() === true){
                this._showFast = true;
                this._pauseSkip = true;
            }else{
                // スキップがOFFでも、ゲームスピードが10だったら、一瞬で全表示して、少しだけ待って、ボタン送りはスキップしないでね。
                if (_VarNo_GameSpeed != null && _VarNo_GameSpeed >= 1 && _VarNo_GameSpeed < $dataSystem.variables.length) {
                   var _gameSpeed = $gameVariables.value(_VarNo_GameSpeed);
                }
                if (_gameSpeed === 10){
                   this._showFast = true;  // これをtrueにすると、すぐに全表示すると、\.\.\^の自動送りメッセージまで一瞬で表示されちゃうよ。ちょっと不便だね。
                   this._pauseSkip = false; // これをtrueにすると、ボタン自動送りされず、文章は全部スキップされちゃうよ。だからfalseだよ。
                }
            }
        };
        // 次のメッセージ送りの入力
        var _Window_Message_updateInput = Window_Message.prototype.updateInput;
        Window_Message.prototype.updateInput = function() {   // 元のメソッドのreturnは複雑だから、返り値をそのまま使うよ。
            var ret = _Window_Message_updateInput.apply(this, arguments); // 元のメソッドを呼び出すよ。.call(this, 引数1, 引数2, ...)よりapplyの方がコピペミスを防げていいよ。
            // ここから、メソッドの追加処理。メッセージ送りの入力待ちの場合でも、スキップ中はそれを飛ばしてどんどん次を表示してね。ゲームスピードが10でもボタン送りはスキップしないよ。
            if(this.pause && isSkipModeOn() === true){
                this.pause = false;
                if (!this._textState) {
                    this.terminateMessage();
                }
                return true; // 元のメソッドのreturnは複雑だけど、メッセージをすっ飛ばす場合は返り値はtrueだよ。
            }
            return ret; // 元のメソッドのreturnは複雑だから、返り値をそのまま使うよ。
        };
        //-----------------------------------------------------------------------------
        // Window_ScrollText
        //-----------------------------------------------------------------------------
        // スキップ中は、スクロールメッセージは一瞬で流れるようにしてね。
        var Window_ScrollText_scrollSpeed = Window_ScrollText.prototype.scrollSpeed;
        Window_ScrollText.prototype.scrollSpeed = function() {  // 元メソッドはスクロールスピードを返すよ。
            var ret = Window_ScrollText_scrollSpeed.apply(this, arguments); // 元のメソッドを呼び出すよ。.call(this, 引数1, 引数2, ...)よりapplyの方がコピペミスを防げていいよ。
            // ここからが、メソッドの追加処理。スキップ中だったら、スクロールスピードを100倍に上げてね。
            if(isSkipModeOn() === true){
                ret *= 100;
            }
            return ret; // 元メソッドはスクロールスピードを返すよ。
        };
        //-----------------------------------------------------------------------------
        // Window_BattleLog
        //-----------------------------------------------------------------------------
        // スキップ中は、バトルログも一瞬で流れるようにしてね。
        var _Window_BattleLog_messageSpeed = Window_BattleLog.prototype.messageSpeed;
        Window_BattleLog.prototype.messageSpeed = function() {   // 元メソッドはバトルログ表示後の待ち時間を返すよ。
            var ret = _Window_BattleLog_messageSpeed.apply(this, arguments); // 元のメソッドを呼び出すよ。.call(this, 引数1, 引数2, ...)よりapplyの方がコピペミスを防げていいよ。
            // ここからが、メソッドの追加処理。スキップ中だったら、バトルログの待ち時間を1フレームにしてね。
            if(isSkipModeOn() === true){
                ret = 1;
            }
            return ret; // 元メソッドはバトルログ表示後の待ち時間を返すよ。
        };

        //===================================================================================
        //■Game_Interpreter.command230 : ウェイトコマンドの追加定義。
        // スキップ中だと、ウェイトを待たないようにする機能を追加しています。（merusaia）
        //====================================================================================
        var _Game_Interpreter_command230 = Game_Interpreter.prototype.command230;
        Game_Interpreter.prototype.command230 = function() {
            var _ret = true;
            // スキップ中は、「ウェイト●●フレーム」の命令を無視します。
            if(isSkipModeOn() === false){
                if (_VarNo_GameSpeed != null && _VarNo_GameSpeed >= 1 && _VarNo_GameSpeed < $dataSystem.variables.length) {
                    var _gameSpeed = $gameVariables.value(_VarNo_GameSpeed);
                }
                if (_gameSpeed !== 10){
                    // 元のメソッドを呼び出します。
                    _ret = _Game_Interpreter_command230.apply(this, arguments);
                }else{
                    // スキップOFFで、ゲームスピードが10の場合は、「ウェイト1フレーム」に変換します。
                    // 無視にしないのは、無視すると顔画像が表示されないなど、画像読み込み失敗が頻繁に起こるからです。スキップON時の弊害。
                    this._params[0] = 1;
                    _ret = _Game_Interpreter_command230.apply(this, arguments);                    
                }

            }
            return _ret; // [メモ]この一行が抜けていたせいで、ウェイトが一つでも入ると無限ループしていた。Trbさんに感謝。
        };
        // =========== ウェイトコマンドの追加定義、終 ===============================================

    }
    // =============================================================================
    // Tachiさんによる、早送りモード時のゲームスピード高速化、終。
    // =============================================================================

    // if(_isOnEffectDamageDrain === true){              // このプラグインで吸収技にもダメージエフェクトをつけるがONなら、
    //     // 戦闘行動の適応処理。吸収技にもダメージエフェクトをつける点だけ変更。※上書きです
    //     //var _Game_Action_apply = Game_Action.prototype.apply;
    //     Game_Action.prototype.apply = function (target) {        // 元メソッドにreturnはないよ。
    //         var result = target.result();
    //         this.subject().clearResult();
    //         result.clear();
    //         result.used = this.testApply(target);
    //         result.missed = (result.used && Math.random() >= this.itemHit(target));
    //         result.evaded = (!result.missed && Math.random() < this.itemEva(target));
    //         result.physical = this.isPhysical();
    //         //result.drain = this.isDrain(); // 元のソースrpg_objects.jsから、ここだけ変更されているよ。
    //         if (result.isHit()) {
    //             if (this.item().damage.type > 0) {
    //                 result.critical = (Math.random() < this.itemCri(target));
    //                 var value = this.makeDamageValue(target, result.critical);
    //                 this.executeDamage(target, value);
    //             }
    //             this.item().effects.forEach(function (effect) {
    //                 this.applyItemEffect(target, effect);
    //             }, this);
    //             this.applyItemUserEffect(target);
    //         }
    //     };
    // }

    // ※コメント
    // クリティカルダメージ率調整（２倍になっているが、コメントしてあるので、デフォルトは３倍）
    //Game_Action.prototype.applyCritical = function(damage) {
    //    return damage * 2; // デフォルトは * 3;
    //};


    // ※コメント
    //// TP制御（バトル開始時の初期値を100にしている。0～100のスキな数字にすることが出来る。デフォルトは、ランダムで0～25位になります。
    //// ※ただし、これを有効にすると、特殊フラグ：「TP持ち越し」がONのキャラも、戦闘開始時にTPをこれにリセットされてしまうので注意！）
    //Game_Battler.prototype.initTp = function() {
    //    //// (デフォルト):0～25のいずれかになる。
    //    this.setTp(Math.randomInt(25));
    //    // (パターンa):初期値は必ず満タンの100から始まる、にする
    //    this.setTp(100);
    //    //// (パターンb):初期値は0～100のどれかで始まる、にする
    //    //this.setTp( Math.floor( Math.random() * 101 ) );
    //};


    if(_isOnControlBattleEncountAndWinLose === true){  // パラメータ「【機能】戦闘を検知するか」がONなら

        // イベントコマンド：戦闘処理。追加定義で競合対策済み。
        var _Game_Interpreter_command301      = Game_Interpreter.prototype.command301; // command301:イベント戦闘処理
        Game_Interpreter.prototype.command301 = function() {

            // 戦闘中かのスイッチを更新するよ。
            var _switchNo = _SwitchNo_IsBattle;
            if (_switchNo != null && _switchNo >= 1 && _switchNo < $dataSystem.switches.length) {
                $gameSwitches.setValue(_switchNo, true); // 戦闘開始時はスイッチON
            } else {
                console.log('minRPG_CustomizeGameSpeed: パラメータ「戦闘中かを格納するスイッチ番号」に変な値が入ってます。: ' + _switchNo);
            }

            // ランダムエンカウントかどうかを格納するスイッチを更新するよ。
            var _isRandomEncount = true;
            if (!$gameParty.inBattle()) {
                if(this._params[0] <= 1){ // パラメータの1番目が2「ランダムエンカウント」以外なら、イベント戦闘
                    _isRandomEncount = false;
                }
            }
            // ランダムエンカウントをON/OFF。スイッチ番号を格納している、パラメータに変な値が入っていないか、随時チェック。
            _switchNo = _SwitchNo_RandomEncount;
            if (_switchNo != null && _switchNo >= 1 && _switchNo < $dataSystem.switches.length) {
                $gameSwitches.setValue(_switchNo, _isRandomEncount);
            }else{
                console.log('minRPG_CustomizeGameSpeed: パラメータ「ランダムエンカウント時にONになるスイッチ番号」に変な値が入っています。: ' + _switchNo);
            }

            // 元メソッドでは、次のようにtroopIdを取得しているよ。代入する変数名だけ変えて、そんままコピペ。
            var _troopId = 0;
            if (this._params[0] === 0) {  // Direct designation                 // 敵グループID直接指定
                _troopId = this._params[1];
            } else if (this._params[0] === 1) {  // Designation with a variable // 敵グループを変数名で指定
                _troopId = $gameVariables.value(this._params[1]);
            } else {  // Same as Random Encounter                               // ランダムエンカウント
                _troopId = $gamePlayer.makeEncounterTroopId();
            }
            // 最後に戦闘した敵グループIDを格納する変数番号の変数を更新するよ。 // パラメータに変な値が入っていないか、随時チェック。
            if (_VarNo_LastBattleTroopID != null && _VarNo_LastBattleTroopID >= 1 && _VarNo_LastBattleTroopID < $dataSystem.variables.length) {
                $gameVariables.setValue(_VarNo_LastBattleTroopID, _troopId); // merusaiaが追加。_VarNo_LastBattleTroopID(Tachi用:最後に戦った敵グループIDを格納する変数番号)を更新。
            } else {
                console.log('minRPG_CustomizeGameSpeed: パラメータ「最後に戦闘した敵グループIDを格納する変数番号」に変な値が入っています。: ' + _VarNo_LastBattleTroopID);
            }
            
            if(_isDebugMode()){ console.log('イベント戦闘発生(敵グループID: '+_troopId+')'); }
            // ここでコモンイベントを呼び出しても、なぜかバトル終了後になっちゃうみたいだよ…。使えないみたいなので、一旦コメントアウトするね。
            // // 戦闘開始直後に実行するコモンイベント番号を呼び出すよ。
            // var _commonEventNo = _CommonEventNo_BattleStart;
            // if (_commonEventNo != null && _commonEventNo >= 1 && _commonEventNo < $dataCommonEvents.length) {
            //     if(_isDebugMode()){ console.log(' → 戦闘開始時コモンイベント '+_commonEventNo+' を実行'); }
            //     $gameTemp.reserveCommonEvent($dataCommonEvents[_commonEventNo].list); // コモンイベントを呼び出します。
            // } else {
            //     console.log('minRPG_CustomizeGameSpeed: パラメータ「戦闘開始直後に実行するコモンイベント番号」に変な値が入っています。: ' + _commonEventNo);
            // }

            // 最後に、元メソッドをそのまま読み出す。
            // 元のメソッドを先に呼び出してからコモンイベントを呼び出すと、コモンイベント呼び出しは、バトル終了後になっちゃうみたいだよ。気をつけて。
            var result = _Game_Interpreter_command301.apply(this, arguments);

            return result;
        };

        // マップ状を歩いて、敵にエンカウントするか／した後の処理。※上書きです。
        // 元のソースから、エンカウント後、戦闘画面にて、自動的に指定されたスイッチがオンされるように変更されている。
        // 元のソースから、エンカウント後、戦闘画面にて、自動的に指定された変数に最後に戦った敵グループIDが格納されるように変更している。
        // ※イベント戦闘（ボス敵）はこのイベントは呼ばれないので、これらの変数を更新したい場合は、敵グループイベントで処理してください。
        var _Game_Player_executeEncounter = Game_Player.prototype.executeEncounter;
        Game_Player.prototype.executeEncounter = function () {      // 元メソッドは、エンカウントしたかを返すよ。
            // このプラグインより上に配置したプラグインは、実行不可になるよ（競合）。気をつけてね。
            // 競合を避けたい時は、パラメータ「【機能】戦闘を検知するか」をOFFにするか、以下の１行を使ってね。
            //return _Game_Player_executeEncounter.apply(this, arguments); // 上書き前のメソッド（元ソース）を呼び出す
            
            // 以下、元のメソッドを、上書き。
            // 返り値は、元メソッドと同じ形式のものを、忘れず返してね。
            var _ret = false;                                   // 元メソッドは、エンカウントしたかを返すよ。この値は使わないけれどね。
            
            if (!$gameMap.isEventRunning() && this._encounterCount <= 0) {
                this.makeEncounterCount();
                var troopId = this.makeEncounterTroopId();
                if ($dataTroops[troopId]) {

                    // 以下、元ソースからの追加箇所

                    // 戦闘中かのスイッチを更新するよ。
                    var _switchNo = _SwitchNo_IsBattle;
                    if (_switchNo != null && _switchNo >= 1 && _switchNo < $dataSystem.switches.length) {
                        if(_isDebugMode()){ console.log('エンカウント戦闘発生(敵グループID: '+troopId+')。 次のエンカウント: '+this._encounterCount+' 歩)'); }
                        $gameSwitches.setValue(_switchNo, true); // 戦闘開始時はスイッチON
                    } else {
                        console.log('minRPG_CustomizeGameSpeed: パラメータ「戦闘中かを格納するスイッチ番号」に変な値が入ってます。: ' + _switchNo);
                    }

                    // ランダムエンカウントをON。スイッチ番号を格納している、パラメータに変な値が入っていないか、随時チェック。
                    _switchNo = _SwitchNo_RandomEncount;
                    if (_switchNo != null && _switchNo >= 1 && _switchNo < $dataSystem.switches.length) {
                        $gameSwitches.setValue(_switchNo, true);
                    }else{
                        console.log('minRPG_CustomizeGameSpeed: パラメータ「ランダムエンカウント時にONになるスイッチ番号」に変な値が入っています。: ' + _switchNo);
                    }
                    // 最後に戦闘した敵グループIDを格納する変数番号の変数を更新するよ。
                    if (_VarNo_LastBattleTroopID != null && _VarNo_LastBattleTroopID >= 1 && _VarNo_LastBattleTroopID < $dataSystem.variables.length) {
                        $gameVariables.setValue(_VarNo_LastBattleTroopID, troopId); // merusaiaが追加。_VarNo_LastBattleTroopID(Tachi用:最後に戦った敵グループIDを格納する変数番号)を更新。
                    } else {
                        console.log('minRPG_CustomizeGameSpeed: パラメータ「最後に戦闘した敵グループIDを格納する変数番号」に変な値が入っています。: ' + _VarNo_LastBattleTroopID);
                    }

                    // ここでコモンイベントを呼び出しても、なぜかバトル終了後になっちゃうみたいだよ…。使えないみたいなので、一旦コメントアウトするね。
                    // // 戦闘開始直後に実行するコモンイベント番号を呼び出すよ。
                    // var _commonEventNo = _CommonEventNo_BattleStart;
                    // if (_commonEventNo != null && _commonEventNo >= 1 && _commonEventNo < $dataCommonEvents.length) {
                    //     if(_isDebugMode()){ console.log(' → 戦闘開始時コモンイベント '+_commonEventNo+' を実行'); }
                    //     $gameTemp.reserveCommonEvent($dataCommonEvents[_commonEventNo].list); // コモンイベントを呼び出します。
                    // } else {
                    //     console.log('minRPG_CustomizeGameSpeed: パラメータ「戦闘開始直後に実行するコモンイベント番号」に変な値が入っています。: ' + _commonEventNo);
                    // }

                    // ランダムエンカウント処理を設定して、戦闘スタート。
                    BattleManager.setup(troopId, true, false);
                    BattleManager.onEncounter();
                    _ret = true; // エンカウントした。
                } else {
                    _ret = false; // 元メソッドそのまま。エンカウントしなかった
                }
            } else {
                _ret = false; // 元メソッドそのまま。エンカウントしなかった
            }
            return _ret; //エンカウントしたかを返すよ。
        };

        // 戦闘終了をした瞬間に呼ばれるメソッド。追加定義で競合対策済み。
        // ※スイッチON時の自動実行イベントは、戦闘終了直後に呼ばれるのではなく、シナリオ（戦闘後のイベント）が全て終了した後に呼ばれます。注意してくださいね。
        var _BattleManager_endBattle = BattleManager.endBattle;
        BattleManager.endBattle = function(result) {
            // 以下、元ソースの前に実行する部分。

            // 1. 戦闘終了時にOFFにするスイッチをONにします。
            var _switchNo = _SwitchNo_IsBattle;
            if (_switchNo != null && _switchNo >= 1 && _switchNo < $dataSystem.switches.length) {
                $gameSwitches.setValue(_switchNo, false); // 戦闘終了後はスイッチOFF
            } else {
                console.log('minRPG_CustomizeGameSpeed: パラメータ「戦闘中かを格納するスイッチ番号」に変な値が入ってます。: ' + _switchNo);
            }

            // 2. それぞれの戦闘結果に合わせて、各種スイッチをONにします。
            if (this._eventCallback) {
                // イベントが呼ばれる。元ソースは以下を実行。this._eventCallback(result);
            }
            if (result === 0) {
                // 0:勝った時。元ソースは以下を実行。$gameSystem.onBattleWin();
                // 特定スイッチをON
                _switchNo = _SwitchNo_BattleWin;
                if (_switchNo != null && _switchNo >= 1 && _switchNo < $dataSystem.switches.length) {
                    $gameSwitches.setValue(_switchNo, true);
                } else {
                    console.log('minRPG_CustomizeGameSpeed: パラメータ「戦闘勝利時にONになるスイッチ番号」に変な値が入ってます。: ' +_switchNo);
                }

            }else if (result === 1) {
                // 1:戦闘を中断した、もしくは逃げた時。
                // 事前に、特定スイッチをON
                var _switchNo = _SwitchNo_BattleEscape;
                if (_switchNo != null && _switchNo >= 1 && _switchNo < $dataSystem.switches.length) {
                    $gameSwitches.setValue(_switchNo, true);
                } else {
                    console.log('minRPG_CustomizeGameSpeed: パラメータ「戦闘逃走時にONになるスイッチ番号」に変な値が入ってます。: ' +_switchNo);
                }
                if (this._escaped) {
                    // 逃げた時。元ソースは、以下を実行。$gameSystem.onBattleEscape();
                }else{                                    // 逃げていない。つまり、戦闘参加メンバーが０人か、イベントコマンド「戦闘の中断」をした時。
                    // 中断した時。元ソースはなにもしない。
                }
            }else if(result === 2){
                // 2:負けた（殲滅した）時。元ソースはなにもしない。
                // ここに0や1のときのように特定スイッチをONにすると、予期しないタイミングで全滅処理が呼ばれてしまうので、全滅処理はupdateBattleEndのほうでやります。
            }
            
            // 最後に。
            _BattleManager_endBattle.apply(this, arguments); // 上書き前のメソッド（元ソース）を呼び出す
        };

        // 戦闘終了時の全滅に関する処理。※下記条件のゲームオーバー制御だけ、上書きです。
        // 　→　ランダムエンカウントやイベント「戦闘」での敗北可能チェック（全滅分岐）がない戦闘の場合でも、ゲームオーバーにしない処理を、ここでやっています。 
        //   　　→  これらの戦闘の場合、デフォルトのゲームオーバーに遷移させず、全滅分岐に同じように、戦闘不能パーティをHP1で復活させてシナリオを継続させている。
        // ※戦闘に逃走した時と、中断した時は、このメソッドは呼ばれないようです。
        //   →  BattleManager.endBattleメソッドを参照してください。
        var _BattleManager_updateBattleEnd = BattleManager.updateBattleEnd;
        BattleManager.updateBattleEnd = function () {          // 元メソッドにreturnはないよ。

            if (this.isBattleTest()) {                // バトルテストならそこでシナリオ強制終了（元ソースを呼び出す）
                _BattleManager_updateBattleEnd.apply(this, arguments); // 上書き前のメソッド（元ソース）を呼び出す
            } else if ($gameParty.isAllDead()) {      // 味方キャラが全員戦闘不能になっていたら。全員マヒとかで全滅っていうがこれに含まれるかは、今のところは未検証。
                // 味方キャラが全員戦闘不能になっていたら、この戦闘が負けた時の分岐があるか、ないかを調べる。
                if (this._canLose) {                  // 負けた時の分岐が在る戦闘（負けても大丈夫なボス戦等）だったら、全滅スイッチはOFFです。戦闘不能のメンバーを蘇らせ、シナリオを継続。
                    _BattleManager_updateBattleEnd.apply(this, arguments); // 上書き前のメソッド（元ソース）を呼び出す
                } else {                              // 負けた時の分岐が無い戦闘だったら、
                    // デフォルトのソースは以下の一行。 
                    // SceneManager.goto(Scene_Gameover); // デフォルトはゲームオーバーに遷移する（シナリオは継続しない）
                    
                    // 上記を以下に変更
                    $gameParty.reviveBattleMembers(); // 戦闘不能のメンバーをHP1で蘇らせます。これをしないと、次で即ゲームオーバーに遷移してしまうので、注意。
                    // 全滅スイッチをON
                    var _switchNo = _SwitchNo_BattleLose;
                    if (_switchNo != null && _switchNo >= 1 && _switchNo < $dataSystem.switches.length) {
                        $gameSwitches.setValue(_switchNo, true);
                    } else {
                        console.log('minRPG_CustomizeGameSpeed: パラメータ「戦闘全滅時にONになるスイッチ番号」に変な値が入ってます。: ' + _switchNo);
                    }
                    // シナリオを継続。スイッチONで自動実行されるコモンイベントがあれば、そのイベントが実行されます。
                    SceneManager.pop();
                }
            } else { // 全滅じゃなく（味方キャラが１人は生きていて）、かつ逃走でも、中断でもない（このメソッドは中断時は呼び出されないはず）。すなわち、戦闘に勝ったとき
                _BattleManager_updateBattleEnd.apply(this, arguments); // 上書き前のメソッド（元ソース）を呼び出す
            }
            this._phase = null;
        };
    }

    if(_isOnChangeDefault_Migawari === true){                  // パラメータ「【機能】身代わり条件を変更するか」がONなら、
        // =================================================================================
        // 身代わり時(substitute:代わり、代替という意味)の条件変更
        // 特殊フラグ：身代わり時で、味方をかばう際の条件の変更、効果音を追加しています。
        // =================================================================================
        // かばわれる側（target）の身代わり条件の変更を、上書き。上書きのため、競合する場合はパラメータをOFFにしてください。
        var _BattleManager_checkSubstitute = BattleManager.checkSubstitute;
        BattleManager.checkSubstitute = function (target) {
            // (a)デフォルトはこれ一行。idDying()がHP25％以下（this.isAlive() && this._hp < this.mhp / 4）。で、かつ、相手の攻撃が必中でない時。
            // return target.isDying() && !this._action.isCertainHit(); // HP25％以下で生きていて、かつ必中攻撃じゃなかったらかばう。

            // (b)Tachiさんの元のやつはこれ。idDying()が消えたので、必中じゃなかったら、確実にかばう。
            //return !this._action.isCertainHit(); // 必中じゃなかったらtrue。つまり、必中攻撃だったらfalseで、かばえない。

            // (a)や(b)では、以下の点において、不便。
            // ・対象を見ていない。
            //     つまり、対象が「自分自身」の、MP割合ダメージを受けるHP回復スキル（例えば使用効果に「MP-50%」と書いたHP回復スキル）でも、
            //    「かばった味方が代わりにHPを回復し、MPダメージを受ける」。なんか変。
            //     →  対象を相手側だけに絞ったほうが良いかも。一旦保留。
            // ・ステートを見ていない。
            //     反撃率が高いステート中、回避率が高いステート中でも、反撃率が低い・回避率が低い仲間に、かばわれてしまう。がっかり。
            //     →  かばられる側が特定のステートIDだったら、かばわない、て条件付けがいるかも。一旦保留。
            // ・かばわれる対象の回避率が飛躍的に高い状態（例えば100％回避ステート中）でも、かばう。
            //     自分より回避率が低い味方にかばわれると、ある意味がっかり‥かも。
            //     →  かばられる側の回避率が一定以上だったら、かばわない、て条件付けがいるかも。一旦保留。
            // ・防御力・魔法防御力を見ていない。
            //     つまり、かばう方がダメージが大きくても、かばう。自分より守備力が低い仲間にかばわれると、ある意味残念‥かも。
            //     →  かばられる側の防御力や魔法防御力 - かばう側の防御力や魔法防御力が一定以上だったら、かばわない、て条件付けがいるかも。一旦保留。
            // ・HPを見ていない。
            //     かばわれる側のHP > かばう側のHP でも、かばってかばう側死んでしまう。まぁ、自己犠牲の精神もなんとやら…ですが、なんだかアホくさい…。
            //     →  かばう側(target.hp)・かばわれる側()の残りHPを見るオプションを付ける（パラメータで変更可能）
            // ・MPを見ていない。
            //     これは残りMPが受けるダメージに関係しているシステムでしか使わないと思うが、
            //     HPが少なくMPが高い仲間はその攻撃を受けても無事なのに、
            //     MPが少ない味方がかばうと、代わりに大ダメージを受けて倒れてしまう。なんだか残念…。
            //     →  かばう側・かばわれる側のMPを見るオプションを付ける（パラメータで変更可能）

            // 以下がデフォルトからの変更点。
            // 処理として必要ないので、コメントアウト。var _isDefaultCheck = _BattleManager_checkSubstitute.apply(this, arguments); // 元メソッドを呼び出すけれど、返り値は使わないよ。

            // かばわないといけない状況か（targetがピンチか）
            var _isTargetPinch = false;
            // 条件1. 必中攻撃じゃなかったら（スキルの命中率が「必中」だと、どうあがいても、かばえない）
            if (!this._action.isCertainHit()) { // 必中でも守るようにしたらダメだよ。回復とか補助効果でも守っちゃう。
                // 条件2. かばわれる側(target)が生きていて、HPが指定％以下だったら、
                if (target != null && target.isAlive() && target._hp <= target.mhp * _Migawawri_Sareru_MaxHPPercent / 100) {
                    // 条件2. かばわれる側(target)のMPが指定％以下だったら、
                    if (target._mp <= target.mmp * _Migawawri_Sareru_MaxMPPercent / 100) {
                        // デバッグ用。テストプレイ中だけ。実行。
                        if(_isDebugMode()){
                            console.log('身代わり条件の変更：\n'+target.name()+'のHP％ '+Math.floor(target._hp/target.mhp*100)+' が '+_Migawawri_Sareru_MaxHPPercent+'％以下で、かつMP％ '+Math.floor(target._mp/target.mmp*100)+' が '+_Migawawri_Sareru_MaxMPPercent+'％以下です。');
                        }
                        _isTargetPinch = true;
                    }
                }
            }
            return _isTargetPinch; // かばわないといけない状況か（targetがピンチか）を返す。
        };

        // かばう側（substitute）の身代わりする条件の変更を、上書き。上書きのため、競合する場合はパラメータをOFFにしてください。
        var _BattleManager_applySubstitute = BattleManager.applySubstitute;
        BattleManager.applySubstitute = function (target) {
            // 以下がrpg_managers.jsに書いてあるデフォルト。がばられる側の身代わり条件がtrueなら（1行目）、
            // かばう側（パーティ番号1番、2番、..の順）は自分が死ぬまで１００％かばう。
            // if (this.checkSubstitute(target)) {
            //     var substitute = target.friendsUnit().substituteBattler();
            //     if (substitute && target !== substitute) {
            //         this._logWindow.displaySubstitute(substitute, target);
            //         return substitute;
            //     }
            // }
            // return target;

            // 以下がデフォルトからの変更点。
            // 元メソッドを呼び出すと、二回メッセージが呼び出されてしまうよ。なのでコメントアウト。var _isDefaultCheck = _BattleManager_applySubstitute.apply(this, arguments); // 元メソッドを呼び出すけれど、返り値は使わないよ。

            // 元メソッドの返り値の、ダメージを受けるバトラー。デフォルトは、かばわれる側（target）
            var _DamageHitBattler = target;
            // かばう側（パーティ番号1番、2番、..の順）は自分のHP率・MP率が一定以下で、かつ乱数が一定以下であれば、かばう。1番がかばわないなら、2番もかばう可能性がある。
            if (target != null && target.friendsUnit() != null && target.friendsUnit().substituteBattler() != null && 
            this.checkSubstitute(target)) {
                // ここから、かばう側（substitute）の条件
                var substitute = target.friendsUnit().substituteBattler(); // 制御フラグ:身代わりがついている、パーティ番号が1番若い仲間
                // 制御フラグ:身代わりがついている仲間を、パーティ番号が若い順から、１つずつ見ていく。
                var _isDamagedCharaActor = target.isActor();
                var _members = target.isActor() ? $gameParty.members() : $gameTroop.members();
                if(substitute && _members != null){
                    for (var i = 0; i < _members.length; i++) {
                        // 前提条件: その仲間が、制御フラグ：身代わりステートになっている。
                        if (_members[i]!= null && _members[i].isSubstitute()) {
                            substitute = _members[i]; // 制御フラグ:身代わりがついている、パーティ番号が i 番目に若い仲間。
                            // 条件0. かばう側とかばわれる側が違う（自分自身はかばわない）。
                            if (target !== substitute) {

                                // 条件1. かばう側(substitute)が生きていて、HPが指定％以上だったら、
                                if (substitute.isAlive() && substitute._hp >= substitute.mhp * _Migawawri_Suru_MinHPPercent / 100) {
                                    // 条件2. かばう側(substitute)のMPが指定％以上だったら、
                                    if (substitute._mp >= substitute.mmp * _Migawawri_Suru_MinMPPercent / 100) {
                                        // 条件3. 乱数が一定以下だったら、
                                        if (Math.random() * 100 <= _Migawawri_Suru_ActPercent) {
                                            // ダメージを受けるバトラーを、かばう側とする
                                            _DamageHitBattler = substitute;

                                            // かばわれた・かばったバトラーのキャラID(アクターID、または敵キャラID）を、パラメータで指定した変数に格納
                                            if(_isDamagedCharaActor){  // 敵なのか、味方なのかで、格納する変数を分岐
                                                // デバッグ用。テストプレイ中だけ。実行。
                                                if(_isDebugMode()){
                                                    console.log('★かばう成功: '+substitute.name()+'のHP％ '+Math.floor(substitute._hp/substitute.mhp*100)+' が '+_Migawawri_Suru_MinHPPercent
                                                    +'％以上で、MP％ '+Math.floor(substitute._mp/substitute.mmp*100)+' が '+_Migawawri_Suru_MinMPPercent
                                                    +'％以上で、かつ'+_Migawawri_Suru_ActPercent+'％の確率を満たしたので、\n'+substitute.name()+'が'+target.name()+'をかばいました。');
                                                }

                                                // 変数番号を格納している、パラメータに変な値が入っていないか、随時チェック。
                                                if (_VarNo_Migawari_Sareta_AcorID != null && _VarNo_Migawari_Sareta_AcorID >= 1 && _VarNo_Migawari_Sareta_AcorID < $dataSystem.variables.length) {
                                                    $gameVariables.setValue(_VarNo_Migawari_Sareta_AcorID, substitute.actorId());
                                                } else {
                                                    console.log('minRPG_CustomizeGameSpeed: パラメータ「身代わりされたアクターIDを格納する変数番号」に変な値が入っています。: ' + _VarNo_Migawari_Sareta_AcorID);
                                                }
                                                // 変数番号を格納している、パラメータに変な値が入っていないか、随時チェック。
                                                if (_VarNo_Migawari_Shita_AcorID != null && _VarNo_Migawari_Shita_AcorID >= 1 && _VarNo_Migawari_Shita_AcorID < $dataSystem.variables.length) {
                                                    $gameVariables.setValue(_VarNo_Migawari_Shita_AcorID, target.actorId());
                                                } else {
                                                    console.log('minRPG_CustomizeGameSpeed: パラメータ「身代わりしたアクターIDを格納する変数番号」に変な値が入っています。: ' + _VarNo_Migawari_Shita_AcorID);
                                                }
                                                
                                                // 成功時、パラメータで指定したコモンイベント番号を実行する。
                                                var _commonEventNo = _CommonEventNo_Migawari_Success_Actor;
                                                if (_commonEventNo != null && _commonEventNo >= 1 && _commonEventNo < $dataCommonEvents.length) {
                                                    if(_isDebugMode()){ console.log(' → 味方身代わり成功時コモンイベント '+_commonEventNo+' を実行'); }
                                                    $gameTemp.reserveCommonEvent($dataCommonEvents[_commonEventNo].list); // コモンイベントを呼び出します。
                                                } else {
                                                    console.log('minRPG_CustomizeGameSpeed: パラメータ「味方の身代わり成功時に実行するコモンイベント番号」に変な値が入っています。: ' + _commonEventNo);
                                                }
                                            }else{
                                                // 変数番号を格納している、パラメータに変な値が入っていないか、随時チェック。
                                                if (_VarNo_Migawari_Sareta_EnemyID != null && _VarNo_Migawari_Sareta_EnemyID >= 1 && _VarNo_Migawari_Sareta_EnemyID < $dataSystem.variables.length) {
                                                    $gameVariables.setValue(_VarNo_Migawari_Sareta_EnemyID, substitute.enemyId());
                                                } else {
                                                    console.log('minRPG_CustomizeGameSpeed: パラメータ「身代わりされた敵キャラIDを格納する変数番号」に変な値が入っています。: ' + _VarNo_Migawari_Sareta_EnemyID);
                                                }
                                                // 変数番号を格納している、パラメータに変な値が入っていないか、随時チェック。
                                                if (_VarNo_Migawari_Shita_EnemyID != null && _VarNo_Migawari_Shita_EnemyID >= 1 && _VarNo_Migawari_Shita_EnemyID < $dataSystem.variables.length) {
                                                    $gameVariables.setValue(_VarNo_Migawari_Shita_EnemyID, target.enemyId());
                                                } else {
                                                    console.log('minRPG_CustomizeGameSpeed: パラメータ「身代わりした敵キャラIDを格納する変数番号」に変な値が入っています。: ' + _VarNo_Migawari_Shita_EnemyID);
                                                }

                                                // 成功時、パラメータで指定したコモンイベント番号を実行する。
                                                var _commonEventNo = _CommonEventNo_Migawari_Success_Enemy;
                                                if (_commonEventNo != null && _commonEventNo >= 1 && _commonEventNo < $dataCommonEvents.length) {
                                                    if(_isDebugMode()){ console.log(' → 敵身代わり成功時コモンイベント '+_commonEventNo+' を実行'); }
                                                    $gameTemp.reserveCommonEvent($dataCommonEvents[_commonEventNo].list); // コモンイベントを呼び出します。
                                                } else {
                                                    console.log('minRPG_CustomizeGameSpeed: パラメータ「敵の身代わり成功時に実行するコモンイベント番号」に変な値が入っています。: ' + _commonEventNo);
                                                }
                                            }
                                            break; // かばう仲間が決まったので、forループを抜ける
                                        }
                                    }
                                }
                            }

                        }
                    }
                    // かばう側とかばわれる側が違えば、「～はかばった」みたいな戦闘ログメッセージを表示して、かばう側のGame_Battlerを返す。
                    if (substitute && target !== substitute) {
                        this._logWindow.displaySubstitute(substitute, target);
                    }
                }
            }
            // ダメージを受けるバトラーを返す。
            return _DamageHitBattler;
        };
    }

    // 身代わり時に音を鳴らす（Reflection音を鳴らしているだけ。これ、個人的には結構重要だと思う。誰がダメージを受けたか、わかりやすい。）
    var _Tachi_Game_Battler_performSubstitute = Game_Battler.prototype.performSubstitute;// 元メソッドにreturnはないよ。
    Game_Battler.prototype.performSubstitute = function (target) {    // 元メソッドにreturnはないよ。
        _Tachi_Game_Battler_performSubstitute.apply(this, arguments); // 上書き後メソッドの最初に、上書き前メソッドを呼び出す。
        // この行から、上書き後のメソッドの処理を実行。 
        SoundManager.playReflection(); // Reflectionの音を鳴らす。なぜこの効果音だけ専用メソッドがあるのかは謎。要調査かも。
    };
    // =================================================================================
    // 身代わり時の変更、終
    // =================================================================================


    // ================ merusaia追記、終================================================


})();
