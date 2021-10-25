import * as me from 'melonjs/dist/melonjs.module.js';
import * as ct from 'js/stage/calculateTile.js';

export var globalTouchCanvas = null;
export var globalSharedData = null;
export var globalTileBodyRendererMap = new Map();
export var globalTileBodyRendererContainer;


class LevelEditor {
	constructor (touchCanvas, sharedData) {
		//console.log("LevelEditor constructor");
		
		this.touchCanvas = touchCanvas;
		globalTouchCanvas = touchCanvas;
		this.touchCanvas.onTileClicked = this.tileClicked;
		
		this.sharedData = sharedData;
		globalSharedData = sharedData;
		this.sharedData.getTileLayerMap().on("valueChanged", this.tileChanged);
		
		globalTileBodyRendererContainer = new me.Container();
		globalTileBodyRendererContainer.name = "collision";
		me.game.world.addChild(globalTileBodyRendererContainer);
		console.log(me.game.world.getChildren());
		
		var c = 0;
		// read any existing state
		// BUG NOTES: I think something is wrong with loading the existing
		// data because the fluid server will eventually convert wet changes
		// into dry changes, and this query only looks at wet changes.
		// BUG NOTES: There is also an issue with the data being load correctly
		// but the screen not repainting until next update.
		globalSharedData.getTileLayerMap().forEach((value, key, map) => {
			//console.log("foreach " + c + " " + key.toString());
			//console.log(key);
			//console.log(value);
			c++;
			var x = key.x;
			var y = key.y;
			var tileLayer1 = me.game.world.getChildByName("Tile Layer 1")[0];
			if (x != undefined && value != ct.TILE_NONE)
			{
				var tile = tileLayer1.getTileById(value, x, y);
				//tileLayer1.setTile(tile, x, y);
				ct.calculateTile(key, value, true);
			}
			else if (x != undefined && value == ct.TILE_NONE && tileLayer1.cellAt(x,y) != null)
			{
				//tileLayer1.clearTile(x, y);
				ct.calculateTile(key, value, true);
			}
		});
		
		var tileLayerMap = globalSharedData.getTileLayerMap();
		//console.log(tileLayerMap.keys());
		//console.log(tileLayerMap.values());
		//console.log(tileLayerMap.entries());
		
		/*var tileLayerMap = globalSharedData.getTileLayerMap();
		console.log(tileLayerMap.keys());
		var keyIter = tileLayerMap.keys();
		console.log(keyIter);
		while (!keyIter.done)
		{
			var key = keyIter.value;
			//console.log("foreach " + c + " " + key.toString());
			c++;
			var x = key.x;
			var y = key.y;
			var value = tileLayerMap.get(key);
			if (x != undefined && value != 0)
			{
				var tileLayer1 = me.game.world.getChildByName("Tile Layer 1")[0];
				var tile = tileLayer1.getTileById(value, x, y);
				tileLayer1.setTile(tile, x, y);
				me.game.repaint();
			}
			
			keyIter.next();
		}*/
		
		me.game.repaint();
	}
	
	tileClicked (tileCoords) {
		console.log(tileCoords.toString());
		var tileLayer1 = me.game.world.getChildByName("Tile Layer 1")[0];
		var x = tileCoords.x;
		var y = tileCoords.y;
		var tile = tileLayer1.cellAt(x, y);
		if (tile == null)
		{
			var tileLayerMap = globalSharedData.getTileLayerMap();
			if (tileLayerMap.has(tileCoords))
			{
				tileLayerMap.delete(tileCoords);
			}
			tileLayerMap.set(tileCoords, ct.TILE_LAND);
		}
		else
		{
			var tileLayerMap = globalSharedData.getTileLayerMap();
			if (tileLayerMap.has(tileCoords))
			{
				tileLayerMap.delete(tileCoords);
			}
			tileLayerMap.set(tileCoords, ct.TILE_NONE); // set because delete isn't triggering onValueChanged?
		}
	}
	
	tileChanged (arg) {
		//console.log(arg);
		var tileLayer1 = me.game.world.getChildByName("Tile Layer 1")[0];
		var key = arg.key; // tileCoords
		var value = globalSharedData.getTileLayerMap().get(key);
		var x = key.x;
		var y = key.y;
		//console.log("value for key");
		//console.log(value);
		/*if (value != 0)
		{
			var tileId = calculateTile(key, value, true);
			var tile = tileLayer1.getTileById(tileId, x, y);
			tileLayer1.setTile(tile, x, y);
		}
		else
		{
			tileLayer1.clearTile(x, y);
		}*/
		ct.calculateTile(key, value, true);
		me.game.repaint();
	}
}

export default LevelEditor;