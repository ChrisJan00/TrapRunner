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
		self.frameBuffer = document.createElement("canvas");
		self.frameCtxt = self.frameBuffer.getContext("2d");
		self.frameBuffer.width = self.canvas.width;
		self.frameBuffer.height = self.canvas.height;
		
		self.rows = levelMap.length;
		self.cols = levelMap[0].length;
		
		self.x0 = 0;
		self.x1 = 0;
		self.availableWidth = self.cols * self.blockSide;
		//self.draw(0);
		self.dumpMap();
	}
	
	self.flip = function() {
		var tmpCanvas = self.canvas;
		var tmpCtxt = self.ctxt;
		self.canvas = self.frameBuffer;
		self.ctxt = self.frameCtxt;
		self.frameBuffer = tmpCanvas;
		self.frameCtxt = tmpCtxt;
	}
	
	self.update = function(dt) {
		// scroll
		if (player.x - self.x1 > graphics.width/2) {
			self.x1 = player.x - graphics.width/2;
			if (self.x1 + graphics.width > self.availableWidth)
				self.x1 = self.availableWidth - graphics.width;
		}
		if (player.x - self.x1 < graphics.width/4) {
			self.x1 = player.x - graphics.width/4;
			if (self.x1 < 0)
				self.x1 = 0;
		}
	}
	
	self.dumpMap = function() {
		self.ctxt.clearRect(0,0,self.canvas.width, self.canvas.height);
		var bs = self.blockSide;
		var jjlimit = Math.min(levelMap.length, graphics.height / bs);
		var iilimit = Math.min(self.cols, graphics.width / bs);
		for (var jj = 0; jj < jjlimit; jj++)
			for (var ii = 0; ii<iilimit; ii++) {
				var a = levelMap[jj][ii];
				self.ctxt.drawImage(self.tiles, a*bs, 0, bs, bs,
					ii*bs,jj*bs,bs,bs);
			}
		self.forceUpdate = true;
	}
	
	self.draw = function(dt) {
		if (self.x1 != self.x0 || self.forceUpdate) {
			// blip scrolling part
			var bs = self.blockSide;
			self.frameCtxt.clearRect(0,0,graphics.width, graphics.height);
		
			if (self.x0 < self.x1) {
				var w = graphics.width - (self.x1 - self.x0);
				self.frameCtxt.drawImage(self.canvas, self.x1 - self.x0, 0, w, graphics.height, 0, 0, w, graphics.height);
		
				var colCount = Math.ceil((self.x1 - self.x0) / self.blockSide);
				var colOrigin = Math.floor((self.x0 + graphics.width) / self.blockSide);
				var newColOrigin = Math.floor((self.x1 + graphics.width) / self.blockSide);
				var extra = 0;
				if ( newColOrigin != colOrigin ) {
					//colCount++;
					//colOrigin--;
					extra = bs;
				}
				var xExcess = (self.x1 + graphics.width) % self.blockSide;
				var jjlimit = Math.min(self.rows, graphics.height / bs);
				for (var jj = 0; jj < jjlimit; jj++)
					for (var ii = 0; ii < colCount; ii++) {
						var a = levelMap[jj][ii + colOrigin];
						var xdest = graphics.width + (ii - colCount + 1)*bs - xExcess;
						self.frameCtxt.drawImage(self.tiles, a*bs, 0, bs, bs,
							xdest,jj*bs,bs,bs);
					}
			} else {
				var w = graphics.width - (self.x0 - self.x1);
				self.frameCtxt.drawImage(self.canvas, 0, 0, w, graphics.height, self.x0 - self.x1, 0, w, graphics.height);
				var colCount = Math.ceil(Math.abs((self.x0 - self.x1) / self.blockSide));
				var colOrigin = Math.floor(self.x0 / self.blockSide);
				var newColOrigin = Math.floor((self.x1 + graphics.width) / self.blockSide);
				var extra = 0;
				if ( newColOrigin != colOrigin ) {
					colCount++;
					colOrigin--;
					extra = -bs;
				}
				var xExcess = self.x1 % self.blockSide;
				var jjlimit = Math.min(self.rows, graphics.height / bs);
				for (var jj = 0; jj < jjlimit; jj++)
					for (var ii = 0; ii < colCount; ii++) {
						var a = levelMap[jj][ii + colOrigin];
						var xdest = extra + ii * bs - xExcess;
						self.frameCtxt.drawImage(self.tiles, a*bs, 0, bs, bs,
							xdest,jj*bs,bs,bs);
					}
			}
			
		
			self.flip();
			
			// draw in game canvas
			var gCtxt = graphics.getContext(graphics.mapLayer);
			gCtxt.clearRect(0,0, graphics.width, graphics.height);
			gCtxt.drawImage(self.canvas, 0, 0, graphics.width, graphics.height);
			graphics.mark(0,0, graphics.width, graphics.height);
			graphics.redraw();
		
			self.x0 = self.x1;
			self.forceUpdate = false;
		}
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