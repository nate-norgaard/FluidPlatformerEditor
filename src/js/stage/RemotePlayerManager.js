import * as me from 'melonjs/dist/melonjs.module.js';
import { globalSharedData } from 'js/stage/levelEditor.js';
import { globalPlayerId } from 'js/renderables/player.js';

var connectedRemotePlayersMap = new Map();

var RemotePlayerManager = me.Entity.extend({
	init: function (x, y, settings)
	{
        this._super(me.Entity, 'init', [x, y , settings]);
		
		console.log("RemotePlayerManager init");
		this.body.setCollisionMask(me.collision.types.NO_OBJECT);
		connectedRemotePlayersMap = new Map();
		
		// TODO: should already connected player be loaded before or after subscribing for updates?
		// load any already connected players
		
		// subscribe for map updates
		var playerDataMap = globalSharedData.getPlayerDataMap();
		playerDataMap.on("valueChanged", this.onSharedValueChanged);
		
		var remotePlayerContainer = new me.Container();
		remotePlayerContainer.name = "remotePlayerContainer";
		me.game.world.addChild(remotePlayerContainer);
	},
	
	onResetEvent: function() {
		
	},
	
	update: function (dt)
	{
		removeIdleRemotePlayers();
	},
	
	onCollision: function (response, other) {
		return false;
	},
	
	onSharedValueChanged: function (valueChangedArgs)
	{
		var playerDataMap = globalSharedData.getPlayerDataMap();
		playerDataMap.forEach((value, key, map) =>
		{
			var playerId = key;
			if (playerId != globalPlayerId)
			{
				if (!connectedRemotePlayersMap.has(playerId))
				{
					console.log("Creating remote player for player: " + playerId);
					var settings = value;
					settings.playerId = playerId;
					settings.image = "characters";
					settings.framewidth = 24;
					settings.frameheight = 24;
					settings.width = 24;
					settings.height = 24;
					console.log(settings);
					var remotePlayerEntity = me.pool.pull("remotePlayerEntity", settings.x, settings.y, settings);
					connectedRemotePlayersMap.set(playerId, settings);
					
					var remotePlayerContainer = me.game.world.getChildByName("remotePlayerContainer")[0];
					//console.log(remotePlayerContainer)
					remotePlayerContainer.addChild(remotePlayerEntity);
				}
			}
		});
	},
	
	removeIdleRemotePlayers: function()
	{
		// TODO...
	}		
});

export default RemotePlayerManager;