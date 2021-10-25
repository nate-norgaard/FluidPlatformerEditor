import * as me from 'melonjs/dist/melonjs.module.js';
import {
	globalTouchCanvas,
	globalSharedData,
	globalTileBodyRendererMap,
	globalTileBodyRendererContainer
	} from 'js/stage/levelEditor.js';

export const TILE_UNKNOWN = -1;
export const TILE_NONE = 0;
export const TILE_LAND = 1;

export const tileFamilyFromTileId = (tileId) =>
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

export const calculateTile = (tileCoords, tileFamily, ripple) =>
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
	
	// BUG NOTES: SharedMap doesn't get anything without wait, for some reason
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
			
			// WHY IS THIS BROKEN?
			//var neighborTileFamilyTest = tileLayerMap.get(neighborTileCoords.toString());
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
		
		var previousRenderable = globalTileBodyRendererMap.get(tileCoords.toString());
		if (previousRenderable != null)
		{
			globalTileBodyRendererContainer.removeChild(previousRenderable);
			globalTileBodyRendererContainer.recalc();
			globalTileBodyRendererMap.delete(tileCoords.toString());
			//console.log(me.game.world.getChildren());
		}
		
		var tileWidth = 18;
		var tileHeight = 18;
		
		var rect = new me.Rect(0, 0, tileWidth, tileHeight);
		//console.log(rect);
		
		var renderable = new me.Renderable(tileCoords.x * tileWidth, tileCoords.y * tileHeight, tileWidth, tileHeight);
		
		var body = new me.Body(renderable, rect);
		body.collisionType = me.collision.types.WORLD_SHAPE;
		body.setCollisionMask(me.collision.types.ALL_OBJECT);
		body.ignoreGravity = true;
		//console.log(body);
		
		renderable.body = body;
		renderable.recalc();
		renderable.name = "collision tile rect body";
		//console.log(renderable);
		globalTileBodyRendererContainer.addChild(renderable);
		globalTileBodyRendererContainer.recalc();
		globalTileBodyRendererMap.set(tileCoords.toString(), renderable);
		//console.log(me.game.world.getChildren());
		//console.log(globalTileBodyRendererContainer.getChildren());
	}
	else
	{
		var tile = tileLayer1.cellAt(tileCoords.x, tileCoords.y);
		console.log(tileCoords);
		console.log(tileLayer1);
		console.log(tile);
		if (tileLayer1.cellAt(tileCoords.x, tileCoords.y) != null)
		{
			tileLayer1.clearTile(tileCoords.x, tileCoords.y);
			
			// BUG: sometimes we are overzealously deleting collision boxes
			var renderable = globalTileBodyRendererMap.get(tileCoords.toString());
			globalTileBodyRendererContainer.removeChild(renderable);
			globalTileBodyRendererContainer.recalc();
			globalTileBodyRendererMap.delete(tileCoords.toString());
			//console.log(me.game.world.getChildren());
			//console.log(globalTileBodyRendererContainer.getChildren());
		}
	}
	
	recalcCoords.forEach((coords) => {
		var neighborTileFamily = tileFamilyFromTileId(tileLayer1.cellAt(coords.x, coords.y).tileId);
		calculateTile(coords, neighborTileFamily, false);
	});
}