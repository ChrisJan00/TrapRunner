var Level = function() {
	var self=this;
	self.tiles = new Image();
    self.tiles.src = "graphics/Tiles.png";
	
	self.blockSide = 32;
	
	// fill up an image
	self.init = function() {
		self.canvas = document.createElement("canvas");
		self.ctxt = self.canvas.getContext("2d");
		self.canvas.width = graphics.width;
		self.canvas.height = graphics.height;
		
		self.rows = levelMap.length;
		self.cols = levelMap[0].length;
		
		//self.draw(0);
	}
	
	
	self.update = function(dt) {
		// nothing to do
	}
	
	self.draw = function(dt) {
		// nothing to do because we are using the game background
		var bs = self.blockSide;
		for (var jj=0;jj<levelMap.length;jj++)
			for (var ii=0;ii<levelMap[jj].length;ii++) {
				var a = levelMap[jj][ii];
				// remove this
				if (jj*bs > graphics.width) continue;
				self.ctxt.drawImage(self.tiles, a*bs, 0, bs, bs,
					ii*bs,jj*bs,bs,bs);
			}
		
		var gCtxt = graphics.getContext(graphics.bgLayer);
		gCtxt.drawImage(self.canvas, 0, 0, graphics.width, graphics.height);
		gCtxt.drawImage(self.canvas, 0, 0, graphics.width, graphics.height);
		graphics.mark(0,0, graphics.width, graphics.height);
		graphics.redraw();
	}
	
	self.collided = function( x,y,w,h ) {
		// returns true if sprite collides with the map
		
		var sX1 = Math.max(Math.floor(x/self.blockSide), 0);
		var sY1 = Math.max(Math.floor(y/self.blockSide), 0);
		var sX2 = Math.min(Math.floor((x+w-1)/self.blockSide), self.cols-1);
		var sY2 = Math.min(Math.floor((y+h-1)/self.blockSide), self.rows-1);
		
		for (var jj=sY1; jj<=sY2; jj++)
			for (var ii=sX1; ii<=sX2; ii++)
				if ( levelMap[jj][ii] > 0 )
					return true;
		
		return false;
	}
	
	self.ready = function() {
		return self.tiles.complete;
	}
};