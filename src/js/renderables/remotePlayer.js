import * as me from 'melonjs/dist/melonjs.module.js';
import { globalSharedData } from 'js/stage/levelEditor.js';
import { skinIndexes } from 'js/renderables/player.js';


var RemotePlayerEntity = me.Entity.extend({
	init: function (x, y, settings) {
        this._super(me.Entity, 'init', [x, y , settings]);
		
		this.onResetEvent(settings);
	},
	
	onResetEvent: function(settings)
	{
		console.log(this);
		//BUG: after reusing a pooled object, we don't have a body!
		
		this.body.setCollisionMask(me.collision.types.NO_OBJECT);
		
		var playerId = settings.playerId;
		this.playerId = settings.playerId;
		
		var playerDataMap = globalSharedData.getPlayerDataMap();

		//this.renderable.addAnimation("default", [skinIndexes[settings.skin] + 1, skinIndexes[settings.skin]]);
		//this.renderable.setCurrentAnimation("default");
		this.renderable.animationspeed = 0;
		this.renderable.setAnimationFrame(settings.animationFrame);
		this.renderable.addAnimation("walk",  [skinIndexes[settings.skin] + 1, skinIndexes[settings.skin]]);
		this.renderable.addAnimation("stand",  [skinIndexes[settings.skin]]);
		this.renderable.addAnimation("jump",  [skinIndexes[settings.skin] + 1]);
		this.renderable.setCurrentAnimation("stand");
		//console.log(settings.r);
		//this.renderable.tint.setColor(new me.Color(settings.tintR, settings.tintG, settings.tintB, 1));
		
		var onSharedValueChanged = (valueChangedArgs) =>
		{
			var playerDataMap = globalSharedData.getPlayerDataMap();
			if (valueChangedArgs.key == playerId)
			{
				var playerData = playerDataMap.get(valueChangedArgs.key);
				//console.log(playerData);
				this.pos.x = playerData.x;
				this.pos.y = playerData.y;
				if (!this.renderable.isCurrentAnimation(playerData.animation))
				{
					this.renderable.setCurrentAnimation(playerData.animation);
				}
				this.renderable.setAnimationFrame(playerData.animationFrame);
				this.renderable.flipX(playerData.flipX);
				
				me.game.repaint();
			}
		};
		
		playerDataMap.on("valueChanged", onSharedValueChanged);
		me.game.repaint();
	},
	
	update: function (dt) {
	},
	
	onCollision: function (response, other) {
		
	},
	
	onDeactivateEvent: function () {
		var playerDataMap = globalSharedData.getPlayerDataMap();
		// TODO: remove listener
	}
	
	/*onSharedValueChanged: function (valueChangedArgs)
	{
		console.log("RemotePlayerEntity onSharedValueChanged");
		console.log(valueChangedArgs);
		var playerDataMap = globalSharedData.getPlayerDataMap();
		if (valueChangedArgs.key == this.playerId)
		{
			var playerData = playerDataMap.get(valueChangedArgs.key);
			console.log(valueChangedArgs);
			this.pos.x = playerData.x;
			this.pos.y = playerData.y;
		}
	}*/
});

export default RemotePlayerEntity;