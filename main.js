var graphics = new GraphicsManager();
var gameControl = new GameControl();
//var keyManager = new KeyManager();
var player = new Player(200, 200);

function loaderProgress() {
	return player.complete() ? 100 : 0;
}

function prepareGame() {
	graphics.init();
	graphics.bgLayer = graphics.createLayer();
	//graphics.shapesLayer = graphics.createLayer();
	graphics.peopleLayer = graphics.createLayer();
	//lightsManager.drawShapes();
	//graphics.redraw();
	graphics.clearAll("#AAAAAA");
	
	player.init();
	player.keys = KeyManager.appendMapping([
		["up", 38],
		["down", 40],
		["left", 37],
		["right", 39],
		["jump", 68], // D
		["trap", 83], // S
		["select", 65] // A
	] );
}

function launchGame() {
	gameControl.start();
}

function update(dt) {
	player.update(dt);
}

function draw(dt) {
	player.undraw(dt);
	player.draw(dt);
}
