import * as me from 'melonjs/dist/melonjs.module.js';
import TouchCanvas from 'js/stage/touchCanvas.js';
import SharedData from 'js/stage/sharedData.js';
import LevelEditor from 'js/stage/levelEditor.js';
import { sharedData } from 'index.js'

/*
import { SharedMap } from "fluid-framework";
import { TinyliciousClient } from "@fluidframework/tinylicious-client";

const containerSchema = {
    initialObjects: { tileLayer: SharedMap }
};

const createNewSharedTileLayer = async (client) => {
	const { container } = await client.createContainer(containerSchema);
	const id = await container.attach();
	return id;
};

const loadExistingSharedTileLayer = async (client, id) => {
	const { container } = await client.getContainer(id, containerSchema);
	// todo: populate TMXLayer
};

const tinyliciousClient = new TinyliciousClient();
async function launchFluid() {
    if (location.hash) {
        await loadExistingSharedTileLayer(tinyliciousClient, location.hash.substring(1))
    } else {
        const id = await createNewSharedTileLayer(tinyliciousClient);
        location.hash = id;
    }
}

export const updateTile = (tileLayer, sharedTileMap, tileCoords) => {
	const tileData = sharedTileMap.get(tileCoords);
	if (tileData != null)
	{
		var tile = tileLayer.getTile(tileData.tileId, tileCoords.x, tileCoords.y);
		tileLayer.setTile(tile, tileCoords.x, tileCoords.y);
	}
	else
	{
		tileLayer.clearTile(tileCoords.x, tileCoords.y);
	}
};
*/

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
		//this.touchCanvas.onTileClicked = (tileCoords) => { console.log(tileCoords); }
		
		//var sharedData = new SharedData();
		//sharedData.start();
		
		console.log("about to construct levelEditor");
		console.log(sharedData);
		var levelEditor = new LevelEditor(this.touchCanvas, sharedData);
		
    },
	
	onDestroyEvent: function() {
		me.game.world.removeChild(this.touchCanvas);
	}
})

export default PlayScreen;
