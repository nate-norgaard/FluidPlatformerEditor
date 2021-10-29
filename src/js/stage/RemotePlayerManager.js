import * as me from 'melonjs/dist/melonjs.module.js';
import { globalSharedData } from 'js/stage/levelEditor.js';
import { globalPlayerId } from 'js/renderables/player.js';

//var connectedRemotePlayersMap = new Map();

var RemotePlayerManager = me.Entity.extend({
	init: function (x, y, settings)
	{
        this._super(me.Entity, 'init', [x, y , settings]);
		
		console.log("RemotePlayerManager init");
		this.body.setCollisionMask(me.collision.types.NO_OBJECT);
		this.connectedRemotePlayersMap = new Map();
		this.localPlayerPresenceMap = new Map();
		
		// TODO: should already connected player be loaded before or after subscribing for updates?
		// load any already connected players
		
		var createRemotePlayer = (playerId) =>
		{
			var playerDataMap = globalSharedData.getPlayerDataMap();
			console.log("Creating remote player for player: " + playerId);
			var settings = playerDataMap.get(playerId);
			settings.playerId = playerId;
			settings.image = "characters";
			settings.framewidth = 24;
			settings.frameheight = 24;
			settings.width = 24;
			settings.height = 24;
			//console.log(settings);
			var remotePlayerEntity = me.pool.pull("remotePlayerEntity", settings.x, settings.y, settings);
			remotePlayerEntity.name = "RemotePlayer" + playerId;
			this.connectedRemotePlayersMap.set(playerId, remotePlayerEntity);
			
			var remotePlayerContainer = me.game.world.getChildByName("remotePlayerContainer")[0];
			//console.log(remotePlayerContainer)
			remotePlayerContainer.addChild(remotePlayerEntity);
		}
		
		var onSharedValueChanged = (valueChangedArgs) =>
		{
			var playerId = valueChangedArgs.key;
			if (playerId != globalPlayerId)
			{
				if (!this.localPlayerPresenceMap.has(playerId))
				{
					this.localPlayerPresenceMap.set(playerId, Date.now());
				}
				
				if (!this.connectedRemotePlayersMap.has(playerId))
				{
					createRemotePlayer(playerId);
				}
			}
		}
		
		// subscribe for map updates
		var playerDataMap = globalSharedData.getPlayerDataMap();
		playerDataMap.on("valueChanged", onSharedValueChanged);
		
		var remotePlayerContainer = new me.Container();
		remotePlayerContainer.name = "remotePlayerContainer";
		me.game.world.addChild(remotePlayerContainer);
		
		var onPresenceChanged = (valueChangedArgs) =>
		{
			var playerPresenceMap = globalSharedData.getPlayerPresenceMap();
			var playerId = valueChangedArgs.key;
			if (playerId != globalPlayerId)
			{
				var timeStamp = playerPresenceMap.get(playerId);
				//console.log(playerId);
				//console.log(timeStamp);
				this.localPlayerPresenceMap.set(playerId, timeStamp);
				
				if (!this.connectedRemotePlayersMap.has(playerId))
				{
					var playerDataMap = globalSharedData.getPlayerDataMap();
					if (playerDataMap.get(playerId) != undefined)
					{
						createRemotePlayer(playerId);
					}
				}
			}
		};
		
		var playerPresenceMap = globalSharedData.getPlayerPresenceMap();
		playerPresenceMap.on("valueChanged", onPresenceChanged);
		
		var sweepForDisconnectedPlayers = () => 
		{
			this.localPlayerPresenceMap.forEach((timeStamp, playerId) =>
			{
				var timeout = 7000; // 7 seconds
				var now = Date.now();
				//console.log("player " + playerId + " was last heard from at " + timeStamp + "; now it is " + now + "; that means it has been thi slong since we last heard from them: " + (now - timeStamp));
				if (timeStamp + timeout < now)
				{
					console.log("player " + playerId + " disconnected");
					//console.log(this.localPlayerPresenceMap);
					this.localPlayerPresenceMap.delete(playerId);
					//console.log(this.connectedRemotePlayersMap);
					var remotePlayerEntity = this.connectedRemotePlayersMap.get(playerId);
					if (remotePlayerEntity)
					{
						//console.log(remotePlayerEntity);
						this.connectedRemotePlayersMap.delete(playerId);
						var remotePlayerContainer = me.game.world.getChildByName("remotePlayerContainer")[0];
						remotePlayerContainer.removeChild(remotePlayerEntity);
						me.pool.push(remotePlayerEntity);
					}
				}
			});
		};
		
		this.presenceIntervalId = setInterval(sweepForDisconnectedPlayers, 3000);
	},
	
	onResetEvent: function() {
		
	},
	
	update: function (dt)
	{
	},
	
	onCollision: function (response, other) {
		return false;
	}	
});

export default RemotePlayerManager;