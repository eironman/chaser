(function (window) {
	
	/**
	 * The sprite chasing the cursor
	 */
	function Chaser(posX, posY, limitX, limitY, speed){
		this.initialize(posX, posY, limitX, limitY, speed);
	}
	
	// Extends container class
	Chaser.prototype = new createjs.Container();
	Chaser.prototype.Container_initialize = Chaser.prototype.initialize;
	
	// Chaser initialization
	Chaser.prototype.initialize = function(posX, posY, limitX, limitY, speed){
		
		
		// Parent init
		this.Container_initialize();
		var self = this;
		
		// Radius
		var radius	= 50;

		// Sprite
		var spriteSheet = new createjs.SpriteSheet({
		    // Image to use
		    images: ["img/pacman.png"], 
		    // Width, height & registration point
		    frames: {width: radius*2, height: radius*2, regX: radius, regY: radius}, 
		    animations: {
		         move: {
		             frames: [0,1,2,3],
		             frequency: 6
		         },
		         stand: 1
		     }
		});
		
		// BitmapAnimation
		self.chaser = new createjs.BitmapAnimation(spriteSheet);
		self.chaser.gotoAndPlay("stand");
		
		// Chaser starting position
		self.chaser.x = posX;
		self.chaser.y = posY;
		
		self.addChild(self.chaser);
		
		// Represents the future position
		// Even if mouse stops chaser will know where to move
		// We need to store it because there is no action such as onMouseStop
		self.future = {x: -1, y: -1}
		
		// Default chasing speed
		self.speed = speed || 5;
		
		/**
		 * Displacement
		 * @param integer posX
		 * @param integer posY
		 */
		self.moveTo = function(posX, posY){
			
			var c = self.chaser;
			
			// Begin animation
			if (c.currentAnimation == 'stand') {
				c.gotoAndStop('stand');
				c.gotoAndPlay('move');
			}
			
			// Store future position
			self.setFuturePosition(posX, posY);
			
			// Normalize the new position of the chaser
			self.normalizeNewPosition(posX, posY);
			createjs.Tween.get(c, {override:true})
							.to({x: self.newX, y: self.newY}, self.speed);
			
			// Chaser rotation
			var angle = Math.atan2(self.newY - c.y, self.newX - c.x );
			c.rotation = angle * (180/Math.PI); // Rads to degrees
			
			return self.reachDestiny();
			
		}
		
		/**
		 * Normalizes coordinates of the new position
		 */
		self.normalizeNewPosition = function(posX, posY){
			
			// New chaser position
			self.newX = posX;
			self.newY = posY;
			
			// Avoid chaser out of the canvas
			if ( self.newX < radius ) self.newX = radius;
			if ( self.newY < radius ) self.newY = radius;
			if ( self.newX > (self.limitX-radius) ) self.newX = self.limitX-radius;
			if ( self.newY > (self.limitY-radius) ) self.newY = self.limitY-radius;
			
			// Operation to make the chaser has a constant speed,
			// otherwise it will accelerate far from the cursor
			// and decelerate close to it
			// https://forum.processing.org/topic/help-with-chasing-the-mouse-cursor-at-a-constant-speed
			var c = self.chaser;
			if (Math.abs(c.x - self.newX) > 7 || Math.abs(c.y - self.newY) > 7) {
				var angle = Math.atan2(self.newY - c.y, self.newX - c.x);
				self.newX = c.x + Math.round(self.speed * Math.cos(angle));
				self.newY = c.y + Math.round(self.speed * Math.sin(angle));
			}
		}
		
		/**
		 * Checks if the chaser reaches destination
		 * @returns {Boolean}
		 */
		self.reachDestiny = function(){

			var c = self.chaser;
			var f = self.future;
			
			// Chaser reaches point
			if ( f.x >= c.x-radius && f.x <= c.x+radius &&
				 f.y >= c.y-radius && f.y <= c.y+radius ){
				
				// Stop animation
				if (c.currentAnimation == 'move') {
					c.gotoAndStop('move');
					c.gotoAndPlay('stand');
				}
				
				return true;
			}
			
			return false;
		}
		
		/**
		 * Updates future position
		 * @param posx
		 * @param posy
		 */
		self.setFuturePosition = function(posX, posY){
			self.future.x = posX;
			self.future.y = posY;
		}
		
		/**
		 * Returns last X stored position
		 * @returns integer
		 */
		self.getXFuturePosition = function(){
			return self.future.x;
		}
		
		/**
		 * Returns last Y stored position
		 * @returns integer
		 */
		self.getYFuturePosition = function(){
			return self.future.y;
		}
		
		/**
		 * Rotates the chaser
		 * @param angle
		 */
		self.rotate = function(angle){
			self.chaser.rotation = angle;
		}
		
	}
	
	window.Chaser = Chaser;
} (window));
