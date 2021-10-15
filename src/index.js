import * as me from 'melonjs/dist/melonjs.module.js';
import 'index.css';

import TitleScreen from 'js/stage/title.js';
import PlayScreen from 'js/stage/play.js';
import PlayerEntity from 'js/renderables/player.js';

import SharedData from 'js/stage/sharedData.js';

import DataManifest from 'manifest.js';

var gameReady = false;
var fluidReady = false;
export var sharedData = new SharedData();

me.device.onReady(function () {

    // initialize the display canvas once the device/browser is ready
    if (!me.video.init(960, 432, {parent : "screen", scale : "auto"})) {
        alert("Your browser does not support HTML5 canvas.");
        return;
    }

    // Initialize the audio.
    me.audio.init("mp3,ogg");

    // allow cross-origin for image/texture loading
    me.loader.crossOrigin = "anonymous";

	var onReady = () => {
		console.log("Ready? " + gameReady + ", " + fluidReady);
		if (gameReady && fluidReady) {
			console.log("LET'S GOOOO! Game starting in 1 seconds...");
			setTimeout(function() {
				me.state.change(me.state.PLAY);
			}, 1000);
		}
	};
	
	//sharedData = new SharedData();
	sharedData.start(() => {
		fluidReady = true;
		onReady();
	});

    // set and load all resources.
    me.loader.preload(DataManifest, function() {
        // set the user defined game stages
        me.state.set(me.state.MENU, new TitleScreen());
        me.state.set(me.state.PLAY, new PlayScreen());

        // add our player entity in the entity pool
        me.pool.register("mainPlayer", PlayerEntity);

        // Start the game.
        //me.state.change(me.state.PLAY);
		console.log("gameReady 1");
		gameReady = true;
		onReady();
    });
});
