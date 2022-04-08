//==============================================================================
// MpiTitleMovie.js
//==============================================================================

/*:
 * @plugindesc タイトル画面で動画再生
 * @author 奏ねこま（おとぶき ねこま）
 * 
 * @param Movie File Name
 * @desc 動画ファイル名
 * （拡張子不要：movie_file.webm -> movie_file）
 * @type string
 * @defualt
 * 
 * @param Extension
 * @desc 動画ファイルの拡張子
 * （auto:自動判別/.webm /.mp4）
 * @type select
 * @option auto
 * @option .webm
 * @option .mp4
 * @default auto
 * 
 * @param X-coord
 * @desc 動画を再生する位置（X座標）
 * @type number
 * @min -999
 * @default 0
 * 
 * @param Y-coord
 * @desc 動画を再生する位置（Y座標）
 * @type number
 * @min -999
 * @default 0
 * 
 * @param Priority
 * @desc 背景画像やウインドウに対する動画の優先度
 * （0で背景画像よりも後ろ/数字が大きいほど手前で再生）
 * @type number
 * @default 0
 * 
 * @help
 * [概要]
 *  タイトル画面で動画を再生します。
 * 
 * [仕様]
 *  ・動画はループ再生になります。
 *  ・オプション画面を開くと動画は停止します。
 *  ・オプション画面からタイトル画面に戻ると最初からの再生となります。
 *  ・音声付き動画の場合、環境や動作条件によっては無音になることがあります。
 *  ・音声付き動画の音量はBGMの音量設定に従います。
 * 
 * [利用規約] ..................................................................
 *  - 本プラグインの利用は、RPGツクールMV/RPGMakerMVの正規ユーザーに限られます。
 *  - 商用、非商用、有償、無償、一般向け、成人向けを問わず、利用可能です。
 *  - 利用の際、連絡や報告は必要ありません。また、製作者名の記載等も不要です。
 *  - プラグインを導入した作品に同梱する形以外での再配布、転載はご遠慮ください。
 *  - 本プラグインにより生じたいかなる問題についても、一切の責任を負いかねます。
 * [改訂履歴] ..................................................................
 *   Version 1.00  2018/12/27  初版
 * -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
 *  Web Site: http://makonet.sakura.ne.jp/rpg_tkool/
 *  Twitter : https://twitter.com/koma_neko
 *  Copylight (c) 2018 Nekoma Otobuki
 */

var Imported = Imported || {};
var Makonet = Makonet || {};

(function(){
    'use strict';

    const plugin_name = 'MpiTitleMovie';

    Imported[plugin_name] = true;
    Makonet[plugin_name] = {};

    let _plugin = Makonet[plugin_name];
    _plugin.parameters = PluginManager.parameters(plugin_name);

    _plugin.file_name       = _plugin.parameters['Movie File Name'];
    _plugin.extension       = _plugin.parameters['Extension'];
    _plugin.x        = Number(_plugin.parameters['X-coord']);
    _plugin.y        = Number(_plugin.parameters['Y-coord']);
    _plugin.priority = Number(_plugin.parameters['Priority']);

    //==========================================================================
    // Scene_Title
    //==========================================================================

    {
        let __create = Scene_Title.prototype.create;
        Scene_Title.prototype.create = function() {
            __create.apply(this, arguments);
            let extension = (_plugin.extension === 'auto') ? Game_Interpreter.prototype.videoFileExt.call(null) : _plugin.extension;
            let sprite = new Sprite_Video('./movies/' + _plugin.file_name + extension, true);
            sprite.x = _plugin.x;
            sprite.y = _plugin.y;
            sprite.volume = ConfigManager.bgmVolume / 100;
            this.addChildAt(sprite, _plugin.priority);
            this._video_sprite = sprite;
        };

        let __terminate = Scene_Title.prototype.terminate;
        Scene_Title.prototype.terminate = function() {
            __terminate.apply(this, arguments);
            if (this._video_sprite) {
                this.removeChild(this._video_sprite);
            }
        };

        let __fadeOutAll = Scene_Title.prototype.fadeOutAll;
        Scene_Title.prototype.fadeOutAll = function() {
            __fadeOutAll.apply(this, arguments);
            if (this._video_sprite) {
                this._video_sprite.setFadeVolume(-1.0 / this.slowFadeSpeed());
            }
        };
    }

    //==========================================================================
    // Sprite_Video
    //==========================================================================
    
    class Sprite_Video extends Sprite {
        constructor(source, loop) {
            super();
            this._volume = 1.0;
            this._fade_volume = 1.0;
            this._fade_step = 0.0;
            this.setVideo(source, !!loop);
            this.on('added', () => this.playVideo());
            this.on('removed', () => this.stopVideo());
        }

        set volume(value) {
            this._volume = value;
            this._fade_volume = 1.0;
            this._fade_step = 0.0;
        }

        setVideo(source, loop) {
            let video = document.createElement('video');
            video.addEventListener('loadeddata', (e) => {
                let bitmap = new Bitmap(video.videoWidth, video.videoHeight);
                bitmap.addLoadListener(() => {
                    if (this.bitmap) {
                        this.bitmap.baseTexture.source.pause();
                    }
                    video.volume = this._volume;
                    let texture = bitmap.__baseTexture = PIXI.VideoBaseTexture.fromVideo(video);
                    texture.autoPlay = false;
                    if (this.parent) {
                        video.play();
                        if (video.paused) {
                            video.muted = true;
                            video.play();
                        }
                    } else {
                        video.pause();
                    }
                    this.bitmap = bitmap;
                });
            });
            video.addEventListener('ended', (e) => {
                this.stopVideo();
            });
            video.loop = loop;
            video.src = source;
        }

        playVideo() {
            if (this.bitmap) {
                let source = this.bitmap.baseTexture.source;
                source.muted = false;
                source.play();
                if (source.paused) {
                    source.muted = true;
                    source.play();
                }
            }
            this.visible = true;
        }

        pauseVideo() {
            if (this.bitmap) {
                this.bitmap.baseTexture.source.pause();
            }
        }

        stopVideo() {
            this.pauseVideo();
            this.visible = false;
        }

        setFadeVolume(step) {
            this._fade_step = step;
            this._fade_volume = 1.0;
        }

        update() {
            super.update();
            this.updateVideo();
            this.updateVolume();
        }

        updateVideo() {
            if (this.bitmap && !this.bitmap.baseTexture.source.paused) {
                this.bitmap._setDirty();
            }
        }

        updateVolume() {
            this._fade_volume += this._fade_step;
            if (this._fade_volume < 0) {
                this._fade_volume = 0;
            } else if (this._fade_volume > 1.0) {
                this._fade_volume = 1.0;
            }
            if (this.bitmap) {
                this.bitmap.baseTexture.source.volume = this._volume * this._fade_volume;
            }
        }
    }
}());
