import * as me from 'melonjs/dist/melonjs.module.js';

import { globalSharedData } from 'js/stage/levelEditor.js';

export var globalPlayerId = 0;
export const skinIndexes = [ 0, 2, 4, 6, 9 ];

 // Note : Jay Inheritance to be replaced with standard ES6 inheritance in melonjs 10+
var PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
        // call the parent constructor
        this._super(me.Entity, 'init', [x, y , settings]);
		
		this.startX = x;
		this.startY = y;
		
		// max walking & jumping speed
		this.body.setMaxVelocity(3, 15);
		this.body.setFriction(0.4, 0);
		this.body.setCollisionType = me.collision.types.PLAYER_OBJECT;
		this.body.setCollisionMask(me.collision.types.ALL_OBJECT);
		//this.body.ignoreGravity = true;
		console.log(this.body);
		console.log(me.game.world.getChildren());

		// set the display to follow our position on both axis
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4);

		// ensure the player is updated even when outside of the viewport
		this.alwaysUpdate = true;

		var skin = me.Math.random(0, 5);
		this.skin = skin;

		// define a basic walking animation (using all frames)
		this.renderable.addAnimation("walk",  [skinIndexes[skin] + 1, skinIndexes[skin]]);

		// define a standing animation (using the first frame)
		this.renderable.addAnimation("stand",  [skinIndexes[skin]]);
		
		// define a standing animation (using the first frame)
		this.renderable.addAnimation("jump",  [skinIndexes[skin] + 1]);

		// set the standing animation as default
		this.renderable.setCurrentAnimation("stand");
		
		this.playerId = me.Math.random(0, 10000000);
		globalPlayerId = this.playerId;
		
		this.renderable.tint.random(155, 255);
		
		this.lastUpdateSharedDataTime = me.timer.getTime();
		this.updateSharedDataTimeInterval = 0;
		this.prevPos = this.pos;
		this.updateSharedPlayerData();
		
		this.prevX = this.pos.x;
		this.prevY = this.pos.y;
    },

    /**
     * update the entity
     */
    update : function (dt) {
		
		if (me.input.isKeyPressed('reset'))
		{
			this.pos.x = this.startX;
			this.pos.y = this.startY;
			//this.body.setVelocity(0, 0);
			//this.vel = new me.Vector2d(0, 0);
		}
		
		if (me.input.isKeyPressed('left'))
		{
			// flip the sprite on horizontal axis
			this.renderable.flipX(false);
			// update the default force
			this.body.force.x = -this.body.maxVel.x;
			// change to the walking animation
			if (!this.renderable.isCurrentAnimation("walk")) {
				this.renderable.setCurrentAnimation("walk");
			}
		}
		else if (me.input.isKeyPressed('right')) {

			// unflip the sprite
			this.renderable.flipX(true);
			// update the entity velocity
			this.body.force.x = this.body.maxVel.x;
			// change to the walking animation
			if (!this.renderable.isCurrentAnimation("walk"))
			{
				this.renderable.setCurrentAnimation("walk");
			}
		}
		else
		{
			this.body.force.x = 0;
			// change to the standing animation
			if (!this.body.jumping && !this.body.falling)
			{
				this.renderable.setCurrentAnimation("stand");
			}
			else
			{
				this.renderable.setCurrentAnimation("jump");
			}
		}

		if (me.input.isKeyPressed('jump'))
		{
			if (!this.body.jumping && !this.body.falling)
			{
				// set current vel to the maximum defined value
				// gravity will then do the rest
				this.body.force.y = -this.body.maxVel.y * 3 / 4;
				if (!this.renderable.isCurrentAnimation("jump"))
				{
					this.renderable.setCurrentAnimation("jump");
				}
			}
		}
		else
		{
			this.body.force.y = 0;
		}

        // apply physics to the body (this moves the entity)
		this.body.update(dt);

        // handle collisions against other shapes
		me.collision.check(this);
		
		this.updateSharedPlayerData();
		
		this.prevX = this.pos.x;
		this.prevY = this.pos.y;

        // return true if we moved or if the renderable was updated
		return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
		//console.log("BOOM COLLISION");
	/* 	if (response.b.body.collisionType === me.collision.types.WORLD_SHAPE)
		{
			// makes the other object solid, by substracting the overlap vector to the current position
			this.pos.sub(response.overlapV);
			// not solid
			return false;
		} */
		
		// BUG: when landing, if there is horizontal momentum left over after colliding with the floor,
		// the player can clip through a objects horizontally. I don't know if this is my fault or a
		// quirk/bug of melon's physics engine
		
        // Make all other objects solid
        return true;
    },
	
	updateSharedPlayerData : function()
	{	
		if (this.prevX == this.pos.x && this.prevY == this.pos.y)
		{
			return;
		}
	
		if (this.lastUpdateSharedDataTime + this.updateSharedDataTimeInterval < me.timer.getTime())
		{
			this.lastUpdateSharedDataTime = me.timer.getTime();
			
			if (globalSharedData != null)
			{
				var playerDataMap = globalSharedData.getPlayerDataMap();
				if (playerDataMap != null)
				{
					var playerData = {
						skin: this.skin,
						animationFrame: this.renderable.getCurrentAnimationFrame(),
						x: this.pos.x,
						y: this.pos.y,
						flipX: this.renderable.isFlippedX,
						tintR: this.renderable.tint.r,
						tintG: this.renderable.tint.g,
						tintB: this.renderable.tint.b
					};
					playerDataMap.set(this.playerId, playerData);
				}
			}
		}
	}
});

export default PlayerEntity;
