import * as me from 'melonjs/dist/melonjs.module.js';
//import * from 'js/stage/calculateTile.js';

export var globalTouchCanvas = null;
export var globalSharedData = null;

const TILE_UNKNOWN = -1;
const TILE_NONE = 0;
const TILE_LAND = 1;

const tileFamilyFromTileId = (tileId) =>
{
	switch (tileId)
	{
		case 0:
			return TILE_NONE;
		case 1:
		case 2:
		case 3:
		case 4:
		case 21:
		case 22:
		case 23:
		case 24:
		case 121:
		case 122:
		case 123:
		case 124:
		case 141:
		case 142:
		case 143:
		case 144:
			return TILE_LAND;
		default:
			return TILE_UNKNOWN;
	}
}

const calculateTile = (tileCoords, tileFamily, ripple) =>
{
	//console.log("======================== calculateTile =====================");
	//console.log(tileCoords);
	var tileLayer1 = me.game.world.getChildByName("Tile Layer 1")[0];
	var rows = tileLayer1.rows;
	var cols = tileLayer1.cols;
	
	var tileLayerMap = globalSharedData.getTileLayerMap();
	// neighbor directions
	var xs = new Array (-1, 0, 1, 1, 1, 0, -1, -1);
	var ys = new Array (-1, -1, -1, 0, 1, 1, 1, 0);
	
	//var myTileFamily = tileLayerMap.get(tileCoords);
	var neighborTileFamilies = new Array();
	var recalcCoords = new Array();
	
	for (var i = 0; i < 8; i++)
	{
		var x = xs[i];
		var y = ys[i];
		var neighborTileCoords = new me.Vector2d(tileCoords.x + x, tileCoords.y + y);
		//console.log("neighborTileCoords");
		//console.log(neighborTileCoords);
		
		if (neighborTileCoords.x < 0 || neighborTileCoords.x >= cols
			|| neighborTileCoords.y < 0 || neighborTileCoords.y >= rows)
		{
			//console.log("neighbor OOB");
			neighborTileFamilies.push(TILE_NONE);
		}
		else
		{
			var neighborTile = tileLayer1.cellAt(neighborTileCoords.x, neighborTileCoords.y);
			if (neighborTile == null || neighborTile.tileId == 0)
			{
				neighborTileFamilies.push(TILE_NONE);
				//console.log("no neighbor");
				continue;
			}
			
			// WHY IS THIS BROKEN? var neighborTileFamily = tileLayerMap.get(neighborTileCoords);
			// BUG NOTES: I ought to be able to get the tileFamily value
			// from the SharedMap, but my get request is getting undefined.
			// Could it be that I need to do a wait instead of a get?
			var neighborTileFamily = tileFamilyFromTileId(neighborTile.tileId);
			//console.log(neighborTile);
			//console.log(tileLayerMap);
			//console.log(tileLayerMap.keys());
			//console.log(neighborTileFamily);
			if (neighborTileFamily != null)
			{
				neighborTileFamilies.push(neighborTileFamily);
				if (ripple)
				{
					recalcCoords.push(neighborTileCoords);
				}
			}
			else
			{
				neighborTileFamilies.push(TILE_NONE);
			}
		}
	}
	
	var myTileId = 0;
	
	// land
	if (tileFamily == TILE_LAND)
	{
		// no neighbor
		if (neighborTileFamilies[1] != TILE_LAND
			&& neighborTileFamilies[3] != TILE_LAND
			&& neighborTileFamilies[5] != TILE_LAND
			&& neighborTileFamilies[7] != TILE_LAND)
		{
			myTileId = 1;
		}
		
		// one neighbor
		else if (neighborTileFamilies[1] == TILE_LAND
			&& neighborTileFamilies[3] != TILE_LAND
			&& neighborTileFamilies[5] != TILE_LAND
			&& neighborTileFamilies[7] != TILE_LAND)
		{
			myTileId = 141;
		}
		
		else if (neighborTileFamilies[1] != TILE_LAND
			&& neighborTileFamilies[3] == TILE_LAND
			&& neighborTileFamilies[5] != TILE_LAND
			&& neighborTileFamilies[7] != TILE_LAND)
		{
			myTileId = 2;
		}
		
		else if (neighborTileFamilies[1] != TILE_LAND
			&& neighborTileFamilies[3] != TILE_LAND
			&& neighborTileFamilies[5] == TILE_LAND
			&& neighborTileFamilies[7] != TILE_LAND)
		{
			myTileId = 21;
		}
		
		else if (neighborTileFamilies[1] != TILE_LAND
			&& neighborTileFamilies[3] != TILE_LAND
			&& neighborTileFamilies[5] != TILE_LAND
			&& neighborTileFamilies[7] == TILE_LAND)
		{
			myTileId = 4;
		}
		
		// oposite ends
		else if (neighborTileFamilies[1] != TILE_LAND
			&& neighborTileFamilies[3] == TILE_LAND
			&& neighborTileFamilies[5] != TILE_LAND
			&& neighborTileFamilies[7] == TILE_LAND)
		{
			myTileId = 3;
		}
		
		else if (neighborTileFamilies[1] == TILE_LAND
			&& neighborTileFamilies[3] != TILE_LAND
			&& neighborTileFamilies[5] == TILE_LAND
			&& neighborTileFamilies[7] != TILE_LAND)
		{
			myTileId = 121;
		}
		
		// corners
		else if (neighborTileFamilies[1] != TILE_LAND
			&& neighborTileFamilies[3] == TILE_LAND
			&& neighborTileFamilies[5] == TILE_LAND
			&& neighborTileFamilies[7] != TILE_LAND)
		{
			myTileId = 22;
		}
		
		else if (neighborTileFamilies[1] != TILE_LAND
			&& neighborTileFamilies[3] != TILE_LAND
			&& neighborTileFamilies[5] == TILE_LAND
			&& neighborTileFamilies[7] == TILE_LAND)
		{
			myTileId = 24;
		}
		
		else if (neighborTileFamilies[1] == TILE_LAND
			&& neighborTileFamilies[3] == TILE_LAND
			&& neighborTileFamilies[5] != TILE_LAND
			&& neighborTileFamilies[7] != TILE_LAND)
		{
			myTileId = 142;
		}
		
		else if (neighborTileFamilies[1] == TILE_LAND
			&& neighborTileFamilies[3] != TILE_LAND
			&& neighborTileFamilies[5] != TILE_LAND
			&& neighborTileFamilies[7] == TILE_LAND)
		{
			myTileId = 144;
		}
		
		// three neighbors
		else if (neighborTileFamilies[1] == TILE_LAND
			&& neighborTileFamilies[3] == TILE_LAND
			&& neighborTileFamilies[5] == TILE_LAND
			&& neighborTileFamilies[7] != TILE_LAND)
		{
			myTileId = 122;
		}
		
		else if (neighborTileFamilies[1] != TILE_LAND
			&& neighborTileFamilies[3] == TILE_LAND
			&& neighborTileFamilies[5] == TILE_LAND
			&& neighborTileFamilies[7] == TILE_LAND)
		{
			myTileId = 23;
		}
		
		else if (neighborTileFamilies[1] == TILE_LAND
			&& neighborTileFamilies[3] != TILE_LAND
			&& neighborTileFamilies[5] == TILE_LAND
			&& neighborTileFamilies[7] == TILE_LAND)
		{
			myTileId = 124;
		}
		
		else if (neighborTileFamilies[1] == TILE_LAND
			&& neighborTileFamilies[3] == TILE_LAND
			&& neighborTileFamilies[5] != TILE_LAND
			&& neighborTileFamilies[7] == TILE_LAND)
		{
			myTileId = 143;
		}
		
		// four neighbors
		else if (neighborTileFamilies[1] == TILE_LAND
			&& neighborTileFamilies[3] == TILE_LAND
			&& neighborTileFamilies[5] == TILE_LAND
			&& neighborTileFamilies[7] == TILE_LAND)
		{
			myTileId = 123;
		}
		
		else
		{
			console.log("tile picking error for land");
			myTileId = 1;
		}
	}
	
	if (tileFamily != TILE_NONE)
	{
		var myTile = tileLayer1.getTileById(myTileId, tileCoords.x, tileCoords.y);
		tileLayer1.setTile(myTile, tileCoords.x, tileCoords.y);
	}
	else
	{
		tileLayer1.clearTile(tileCoords.x, tileCoords.y);
	}
	
	recalcCoords.forEach((coords) => {
		//console.log("recalcTile");
		//console.log(coords);
		var neighborTileFamily = tileFamilyFromTileId(tileLayer1.cellAt(coords.x, coords.y).tileId);
		calculateTile(coords, neighborTileFamily, false);
	});
}

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
			if (x != undefined && value != 0)
			{
				var tile = tileLayer1.getTileById(value, x, y);
				tileLayer1.setTile(tile, x, y);
			}
			else if (value == 0 && tileLayer1.cellAt(x,y) != null)
			{
				tileLayer1.clearTile(x, y);
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
			tileLayerMap.set(tileCoords, TILE_LAND);
		}
		else
		{
			var tileLayerMap = globalSharedData.getTileLayerMap();
			if (tileLayerMap.has(tileCoords))
			{
				tileLayerMap.delete(tileCoords);
			}
			tileLayerMap.set(tileCoords, 0); // set because delete isn't triggering onValueChanged?
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
		calculateTile(key, value, true);
		me.game.repaint();
	}
	
	/*calculateTile (tileCoords, ripple)
	{
		var tileLayer1 = me.game.world.getChildByName("Tile Layer 1")[0];
		var rows = tileLayer1.rows;
		var cols = tileLayer1.cols;
		
		var tileLayerMap = globalSharedData.getTileLayerMap();
		// neighbor directions
		var xs = new Array (-1, 0, 1, 1, 1, 0, -1, -1);
		var ys = new Array (1, 1, 1, 0, -1, -1, -1, 0);
		
		var myTileFamily = tileLayerMap.get(tileCoords);
		var neighborTileFamilies = new Array();
		
		for (var i = 0; i < 8; i++)
		{
			var x = xs[i];
			var y = xs[i];
			var neighborTileCoords = new Vector2d(tileCoords.x + x, tileCoords.y + y);
			
			if (neighborTileCoords.x < 0 || neighborTileCoords.x >= cols
				|| neighborTileCoords.y < 0 || neighborTileCoords.y >= rows)
			{
				neighborTileFamilies.push(TILE_NONE);
			}
			else
			{
				if (tileLayer1.cellAt(neighborTileCoords.x, neighborTileCoords.y).tileId == 0)
				{
					continue;
				}
				
				var neighborTileFamily = tileLayerMap.get(neighborTileCoords);
				
				if (neighborTileFamily != null)
				{
					neighborTileFamilies.push(neighborTileFamily);
					if (ripple)
					{
						//this.calculateTile(neighborTileCoords, false);
					}
				}
				else
				{
					neighborTileFamilies.push(TILE_NONE);
				}
			}
		}
		
		// land
		if (myTileFamily == TILE_LAND)
		{
			if (neighborTileFamilies[1] != TILE_LAND
				&& neighborTileFamilies[3] != TILE_LAND
				&& neighborTileFamilies[5] != TILE_LAND
				&& neighborTileFamilies[7] != TILE_LAND)
			{
				return 1;
			}
			
			if (neighborTileFamilies[1] == TILE_LAND
				&& neighborTileFamilies[3] != TILE_LAND
				&& neighborTileFamilies[5] != TILE_LAND
				&& neighborTileFamilies[7] != TILE_LAND)
			{
				return 141;
			}
			
			if (neighborTileFamilies[1] != TILE_LAND
				&& neighborTileFamilies[3] == TILE_LAND
				&& neighborTileFamilies[5] != TILE_LAND
				&& neighborTileFamilies[7] != TILE_LAND)
			{
				return 2;
			}
			
			if (neighborTileFamilies[1] != TILE_LAND
				&& neighborTileFamilies[3] != TILE_LAND
				&& neighborTileFamilies[5] == TILE_LAND
				&& neighborTileFamilies[7] != TILE_LAND)
			{
				return 21;
			}
			
			if (neighborTileFamilies[1] != TILE_LAND
				&& neighborTileFamilies[3] != TILE_LAND
				&& neighborTileFamilies[5] != TILE_LAND
				&& neighborTileFamilies[7] == TILE_LAND)
			{
				return 4;
			}
		}
	}*/
}

export default LevelEditor;