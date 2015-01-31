var res = {
		bg_star_png : "res/bg_star.png",
		bird_png : "res/bird.png",
		block_png : "res/block.png",
		gameover_png : "res/gameoverIMG.png",
		bgm_mp3 : "res/bgm.mp3",
		hit_sound_mp3: "res/hit_sound.mp3",
		swing_mp3: "res/swing.mp3"
};

var g_resources = [
                   res.bg_star_png,
                   res.bird_png,
                   res.block_png,
                   res.gameover_png,
                   res.bgm_mp3,
                   res.hit_sound_mp3,
                   res.swing_mp3
                   ];
for (var i in res) {
	g_resources.push(res[i]);
}