import * as me from 'melonjs/dist/melonjs.module.js';

var globalTouchCanvas = null;
var globalSharedData = null;

class LevelEditor {
	constructor (touchCanvas, sharedData) {
		//console.log("LevelEditor constructor");
		
		this.touchCanvas = touchCanvas;
		globalTouchCanvas = touchCanvas;
		this.touchCanvas.onTileClicked = this.tileClicked;
		
		this.sharedData = sharedData;
		globalSharedData = sharedData;
		this.sharedData.getTileLayerMap().on("valueChanged", this.tileChanged);
		
		var c = 0;
		// read any existing state
		
		globalSharedData.getTileLayerMap().forEach((value, key, map) => {
			console.log("foreach " + c + " " + key.toString());
			c++;
			var x = key.x;
			var y = key.y;
			if (x != undefined && value != 0)
			{
				var tileLayer1 = me.game.world.getChildByName("Tile Layer 1")[0];
				var tile = tileLayer1.getTileById(value, x, y);
				tileLayer1.setTile(tile, x, y);
				me.game.repaint();
			}
		});
		
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
			tileLayerMap.set(tileCoords, 48);
		}
		else
		{
			var tileLayerMap = globalSharedData.getTileLayerMap();
			if (tileLayerMap.has(tileCoords))
			{
				tileLayerMap.delete(tileCoords);
			}
			tileLayerMap.set(tileCoords, 0);
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
		if (value != 0)
		{
			var tile = tileLayer1.getTileById(48, x, y);
			tileLayer1.setTile(tile, x, y);
		}
		else
		{
			tileLayer1.clearTile(x, y);
		}
		me.game.repaint();
	}
}

export default LevelEditor;