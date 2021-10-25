import * as me from 'melonjs/dist/melonjs.module.js';
import TouchCanvas from 'js/stage/touchCanvas.js';
import SharedData from 'js/stage/sharedData.js';
import LevelEditor from 'js/stage/levelEditor.js';
import { sharedData } from 'index.js'


// Note : Jay Inheritance to be replaced with standard ES6 inheritance in melonjs 10+
export var PlayScreen = me.Stage.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        // add a gray background to the default Stage
        //me.game.world.addChild(new me.ColorLayer("background", "#202020"));

		me.level.load("level02");
		
		var touchCanvas = new TouchCanvas();
		this.touchCanvas = touchCanvas;
		me.game.world.addChild(this.touchCanvas);
		
		console.log("about to construct levelEditor");
		console.log(sharedData);
		var levelEditor = new LevelEditor(this.touchCanvas, sharedData);
		
		var remotePlayerManagerSettings = {
			width: 1,
			height: 1
		};
		var remotePlayerManager = me.pool.pull("remotePlayerManager", 0, 0, remotePlayerManagerSettings);
		this.remotePlayerManager = remotePlayerManager;
    },
	
	onDestroyEvent: function() {
		me.game.world.removeChild(this.touchCanvas);
	}
})

export default PlayScreen;
