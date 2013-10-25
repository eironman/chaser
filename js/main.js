(function(){

	var stage;
	var myCanvas = $('#stageCanvas').get(0);
	
	// Ball props
	var ball;
	var posX 	= 60;
	var posY 	= 60;
	var defaultSpeed = 5;
	
	// Buttons
	var startB;
	var restartB;
	
	// Messages
	var message;
	
	// Chrono
	var chrono;
	var timesTable = new Array('00:00.000', // First
								'00:00.000', // Second
								'00:00.000', // Third
								'00:00.000');// Current time
	
	// Canvas limits
	var limitX = $('#stageCanvas').width();
	var limitY = $('#stageCanvas').height();
	
	this.init = function() {
		
		// Action screen
		stage = new createjs.Stage(myCanvas);
		stage.enableMouseOver();
		
		// Ball
		ball = new Chaser(posX, posY, limitX, limitY, defaultSpeed);
	    
		// Start button
		startB = new createjs.Text('START', "40px Verdana");
		startB.x = (limitX/2)-(startB.getMeasuredWidth()/2);
		startB.y = (limitY/2)-(startB.getMeasuredHeight()/2);
		
		// Hack to clic the text
		// http://www.ajohnstone.com/test/hackday/CreateJS-EaselJS-b262a85/tutorials/Mouse%20Interaction/hitArea.html
		var hit = new createjs.Shape();
		hit.graphics.beginFill("#000")
					.drawRect(0, 0, startB.getMeasuredWidth(), 
									startB.getMeasuredHeight());
		startB.hitArea = hit;
		startB.onClick = function(evt){
			start(evt);
		}
		startB.onMouseOver = function(e){
			document.body.style.cursor='pointer';
		}
		startB.onMouseOut = function(e){
			document.body.style.cursor='default';
		}
		
		// Message
		message = new createjs.Text();
		message.font = "20px Verdana";
		message.x = (limitX/2);
		message.y = (limitY/2)-100;
		message.textAlign = 'center';
		
	    // Chrono
	    chrono = new Chrono();
	    
	    createjs.Ticker.setFPS(60);
	    createjs.Ticker.addEventListener('tick', presentation);
	    
	}
	
	/**
	 * Initial screen
	 */
	this.presentation = function(){
		stage.addChild(ball);
	    stage.addChild(startB);
	    stage.addChild(message);
	    stage.update();
	}
	
	/**
	 * Starts the game
	 */
	this.start = function(evt){
		
		stage.removeChild(startB);
		stage.removeChild(message);
		createjs.Ticker.removeEventListener('tick', presentation);
		createjs.Ticker.removeEventListener('tick', reset);
		createjs.Ticker.addEventListener('tick', movement);
	    
		// Ball moves where the mouse has clicked
		ball.moveTo(evt.stageX, evt.stageY, true);
	}
	
	/**
	 * Chase the cursor
	 */
	this.movement = function(){
	
		// The count starts
		chrono.start();
		
		// The time count is updated
		updateTime();
		updateSpeed();
		
		// Mouse moves?
		stage.onMouseMove = function(evt) {
			
			// Out of bounds?
			if ( !stage.mouseInBounds ) finish('Out of bounds!');
			
			// Ball follows the cursor
			if ( ball.moveTo(evt.stageX, evt.stageY) ) finish('Caught!');
			
		}
		
		// Even if mouse stops, move the ball to the last known position of the cursor
		if ( ball.moveTo(ball.getXFuturePosition(), ball.getYFuturePosition()) ){
			finish('Caught!');
		}
		
		stage.update();
	}
	
	/**
	 * Updates the time count
	 */
	this.updateTime = function(){
		
		var seconds = chrono.getSeconds() > 9 ? 
						chrono.getSeconds() : '0' + chrono.getSeconds();
		var minutes = chrono.getMinutes() > 9 ? 
						chrono.getMinutes() : '0' + chrono.getMinutes();
		
		$("#timeCount").html(minutes + ':' + seconds + '.' + chrono.getMiliseconds());
	}
	
	/**
	 * More time, more speed
	 */
	this.updateSpeed = function(){
		
		if ( chrono.getSeconds() > defaultSpeed ){
			ball.speed = chrono.getSeconds();
		}
		
	}
	
	/**
	 * Game finished
	 */
	this.finish = function(text){
		
		// Stop the chrono
		chrono.stop();
		ball.speed = defaultSpeed;
		
		// Remove events
		stage.onMouseMove = null;
		createjs.Ticker.removeEventListener('tick', movement);
		
		// Update table times
		updateTimetable($("#timeCount").html());
		
		// Finish message
		message.text = text;
		
		createjs.Ticker.addEventListener('tick', reset);
	}
	
	/**
	 * Reset the screen
	 */
	this.reset = function(){
		
		// Ball to starting position
		ball.moveTo(posX, posY);
		
		// Show start button and message
		stage.addChild(startB);
		stage.addChild(message);
		
		stage.update();
	}
	
	/**
	 * Updates the times accomplished
	 */
	this.updateTimetable = function(time){
		
		var timeDate	= new Date();
		timesTable[3] 	= time; // Current time in the array
		
		// Order the table
		timesTable.sort(function(a,b){
            
			a = a.replace(':', '').replace('.', '');
			b = b.replace(':', '').replace('.', '');
            
            // Add zeros, if not, 1.869 seconds will be greater than 3.86 seconds
			a = strpadzeros(a.toString(), 7);
			b = strpadzeros(b.toString(), 7);
			return b - a;
		});
		
		// Update table
		$('#first span').html(strpadzeros(timesTable[0], 9));
		$('#second span').html(strpadzeros(timesTable[1], 9));
		$('#third span').html(strpadzeros(timesTable[2], 9));
	}
	
    /**
     * Adds zeros to the right
     */
    this.strpadzeros = function(str, len){
        return String(str + '000').slice(0,len);
    }
    
	window.onload = init();
})();
