(function (window) {
	
	/**
	 * "Class" to calculate the time passed
	 */
	function Chrono(){
		this.initialize();
	}
	
	// Chrono initialization
	Chrono.prototype.initialize = function(){
		
		var self = this;
		self.timeStart, self.timeEnd = null;
		self.days = self.hours = self.minutes = self.seconds = self.miliseconds = 0;
		
		self.start = function(){
			
			// Counters are started
			if ( self.timeStart == null ) self.timeStart = new Date();
			self.timeEnd = new Date();
			
			// We get time difference between counters
			var timeDifference = self.timeEnd.getTime() - self.timeStart.getTime();
			
			self.days = Math.floor(timeDifference/1000/60/60/24);
			timeDifference -= self.days*1000*60*60*24;
		 
			self.hours = Math.floor(timeDifference/1000/60/60);
			timeDifference -= self.hours*1000*60*60;
    
			self.minutes = Math.floor(timeDifference/1000/60);
			timeDifference -= self.minutes*1000*60;
 
			self.seconds = Math.floor(timeDifference/1000);
			timeDifference -= self.seconds*1000;
    
			self.miliseconds = timeDifference;
		    
		}
		
		self.getDays = function(time){
			return self.days;
		}
		
		self.getHours = function(time){
			return self.hours;
		}

		self.getMinutes = function(time){
			return self.minutes;
		}
		
		self.getSeconds = function(time){
			return self.seconds;
		}
		
		self.getMiliseconds = function(time){
			return self.miliseconds;
		}
		
		self.stop = function(){
			self.timeStart = null;
		}
		
		self.reset = function(){
			self.timeStart, self.timeEnd = null;
			self.days = self.hours = self.minutes = self.seconds = self.miliseconds = null;
		}
	}
	
	window.Chrono = Chrono;
} (window));
