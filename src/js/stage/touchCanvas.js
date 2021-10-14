import * as me from 'melonjs/dist/melonjs.module.js';

// create a basic GUI Object
var TouchCanvas = me.GUI_Object.extend(
{
	init:function ()
	{
		var settings = {}
		settings.image = "Empty1x1.png";
		settings.framewidth = 960;
		settings.frameheight = 432;
		// super constructor
		this._super(me.GUI_Object, "init", [0, 0, settings]);
		// define the object z order
		this.pos.z = 10000;
		this.name = "TouchCanvas"
		this.anchorPoint._x = 0;
		this.anchorPoint._y = 0;
	},

	// output something in the console
	// when the object is clicked
	onClick:function (event)
	{
		var tileLayer1 = me.game.world.getChildByName("Tile Layer 1")[0];
		var gameCoords = new me.Vector2d(event.gameX / tileLayer1.tilewidth, event.gameY / tileLayer1.tileheight);
		console.log(gameCoords.floorSelf());
		
		var x = gameCoords.x;
		var y = gameCoords.y;
		var tile = tileLayer1.cellAt(x, y);
		console.log(tile);
		if (tile == null)
		{
			tile = tileLayer1.getTileById(48, x, y);
			tileLayer1.setTile(tile, x, y);
		}
		else
		{
			//tileLayer1.cellAt(x, y).tileId = 48;
			tileLayer1.clearTile(gameCoords.x, gameCoords.y);
		}
		// don't propagate the event
		return false;
	}
});

export default TouchCanvas;