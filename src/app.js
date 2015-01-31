//「グローバル変数」はここに定義しよう
var size;
var bird;
var scoreLabel;
var bg1;
var bg2;
var block1;
var block2;
var bgm;
var gameoverImg;
var vSpeed = 0;
var score = 0; // 初期化
var game_state = "game";

var Game = cc.Layer.extend({
	init:function(){
		this._super();
		size = cc.winSize;

		// キャラクターを登場させよう
		bird = cc.Sprite(res.bird_png);
		bird.setPosition(size.width/2, size.height/2);
		this.addChild(bird,10);

		// 回転しながら登場
		bird.runAction(cc.Sequence(cc.ScaleTo(0.01,4.0,4.0),cc.Spawn(cc.RotateBy(0.3,360),cc.ScaleTo(0.3,1.0,1.0))));

		// 点数ラベルをつくろう
		scoreLabel = cc.LabelTTF("","Arial",20);
		scoreLabel.setAnchorPoint(0,0);
		scoreLabel.setPosition(50,400);
		this.addChild(scoreLabel, 8);

		// 背景画面をつくろう（その１）
		bg1 = cc.Sprite(res.bg_star_png);
		bg1.setAnchorPoint(0,0);
		bg1.setPosition(0,0);
		this.addChild(bg1,1);

		// 背景画面をつくろう（その２）
		bg2 = cc.Sprite(res.bg_star_png);
		bg2.setAnchorPoint(0,0);
		bg2.setPosition(800,0);
		this.addChild(bg2,1);

		// 障害物（ブロック）をつくろう（下に設置）
		block1 = cc.Sprite(res.block_png);
		block1.setAnchorPoint(0,0);
		block1.setPosition(700,0);
		this.addChild(block1, 2)

		// 障害物（ブロック）をつくろう（上に設置）
		block2 = cc.Sprite(res.block_png);
		block2.setAnchorPoint(0,1);
		block2.setScale(1,0.8);
		block2.setPosition(1000,450);
		this.addChild(block2, 2);

		// BGMを再生しよう
		bgm = cc.audioEngine;
		bgm.playMusic(res.bgm_mp3, true); // trueで永久リピート

		// このレイヤーでタッチイベントを実行できるようにする
		cc.eventManager.addListener({
			event:cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches:true,
			onTouchBegan:this.onTouchBegan,
			onTouchMoved:this.onTouchMoved,
			onTouchEnded:this.onTouchEnded
		}, this);

		// FPSごとにupdate関数を呼び出す。
		this.scheduleUpdate();

		return true;
	},

	update:function(){
		// game_stateが「gameover」の時、return以降の処理を停止する。
		if (game_state == "gameover") {
			return false;
		}

		// 鳥の動きをコントロールする
		var pos = bird.getPosition();
		vSpeed -= 0.1;
		if (vSpeed < -7) { vSpeed = -7}
		bird.setPosition(pos.x, pos.y + vSpeed);

		// 地面に落ちたらゲームオーバー
		if (pos.y <= 0) {
			this.onGameover();
		}

		// 点数をコントロールする
		score++;
		scoreLabel.setString("SCORE:" + score + "点");

		// 背景画面を横スクロールさせる
		bg1.setPosition(bg1.getPosition().x - 1, bg1.getPosition().y);
		bg2.setPosition(bg2.getPosition().x - 1, bg2.getPosition().y);

		// 背景画面をループさせる
		if (bg1.getPosition().x < -800) {
			bg1.setPosition(800,0);
		}
		if (bg2.getPosition().x < -800) {
			bg2.setPosition(800,0);
		}

		// ブロック（障害物）を横スクロールさせる
		block1.setPosition(block1.getPosition().x - 2, block1.getPosition().y);
		block2.setPosition(block2.getPosition().x - 2, block2.getPosition().y);

		// ブロック（障害物）をループさせる
		if (block1.getPosition().x < -50) {
			block1.setPosition(900,0);
		}
		if (block2.getPosition().x < -50) {
			block2.setPosition(1200,450);
		}

		this.checkCollision(); // あたり判定の関数を実行する
	},

	// タッチイベントの関数
	onTouchBegan:function(touch,event){
		log("タッチされた");

		// 効果音（羽の音）
		var sound = cc.audioEngine;
		sound.playEffect(res.swing_mp3);

		//  鳥に動きを付ける
		bird.runAction(cc.Sequence(cc.RotateTo(0.01,-10),cc.RotateTo(1.0,20)));

		vSpeed = 5;

		return true; // この一行がないとエラーになるので注意！
	},

	// あたり判定の関数
	checkCollision:function(){
		var birdRect = bird.getBoundingBox();
		var block1Rect = block1.getBoundingBox();
		var block2Rect = block2.getBoundingBox();
		if (cc.rectIntersectsRect(birdRect, block1Rect)) {
			this.onGameover();
		}
		if (cc.rectIntersectsRect(birdRect, block2Rect)) {
			this.onGameover();
		}
	},

	// ゲームオーバーの関数
	onGameover:function(){

		// ゲームオーバーの表示
		gameoverImg = cc.Sprite(res.gameover_png);
		gameoverImg.setPosition(size.width/2, size.height/2);
		this.addChild(gameoverImg,10);

		// 衝突の効果音
		var sound = cc.audioEngine;
		sound.playEffect(res.hit_sound_mp3);

		// BGMを止める
		bgm.stopMusic();

		// ゲームの状態をgameoverに変更する
		game_state = "gameover";
	},
});

var GameScene = cc.Scene.extend({
	onEnter:function(){
		this._super();
		var layer = new Game();
		layer.init();
		this.addChild(layer);
	}
});