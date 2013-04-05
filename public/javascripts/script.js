window.onload = init;

var theCanvas = null;
var theCanvasCtx = null;

var buffCanvas = null;
var buffCanvasCtx = null;

var startWidth = 10;
var startHeight = 220;

/**
 * The runner (moving) object.
 */

var runner = null;

/**
 * The socket io object.
 */
var socket = null; 

function init() {
	theCanvas = document.getElementById("game");
	
	if (theCanvas == null) {
		console.log("Couldn't get reference to basic canvas!");
	}
	
	if (theCanvas && theCanvas.getContext) {
		theCanvasCtx = theCanvas.getContext("2d");
	}
	
	if (theCanvasCtx == null) {
		console.log("The canvas ctx couldn't be set up.");	
	}	
	
	buffCanvas = document.createElement("canvas");
	
	buffCanvas.setAttribute("width", theCanvasCtx.canvas.width);
	buffCanvas.setAttribute("height", theCanvasCtx.canvas.height);
	
	buffCanvasCtx = buffCanvas.getContext("2d");
	
	if (buffCanvas == null || buffCanvasCtx == null) {
		console.log("The buffer canvas couldn't be set up.");
	}
	
	runner = new Runner();
	
	socket = io.connect('http://playwithmobile.azurewebsites.net');
	
	socket.on('move', function(data) {
		animate(data);	
	});
	
	draw();
}

/**
 * Describes properties of the runner (the moving object).
 */
function Runner() {
	this.x = startWidth;
	this.y = startHeight;
	
	this.width = 5;
	this.height = this.width;
}

function update(deltaPosition) {
	runner.x += deltaPosition.x;
	runner.y += deltaPosition.y;
	
	if (runner.x > theCanvasCtx.canvas.width) {
		runner.x = startWidth;
	}
	
	if (runner.y > theCanvasCtx.canvas.height) {
		runner.y = startHeight;
	}
}

function draw() {
	blank();
	
	buffCanvasCtx.beginPath();
	buffCanvasCtx.lineWidth = 5;
	buffCanvasCtx.strokeStyle="red";

	buffCanvasCtx.moveTo(0, buffCanvasCtx.canvas.height/2);
	buffCanvasCtx.lineTo(buffCanvasCtx.canvas.width, buffCanvasCtx.canvas.height/2);

	buffCanvasCtx.moveTo(0, buffCanvasCtx.canvas.height * 0.6);
	buffCanvasCtx.lineTo(buffCanvasCtx.canvas.width, buffCanvasCtx.canvas.height * 0.6);

	buffCanvasCtx.stroke();
	
	// Draw the rectangle.
	buffCanvasCtx.fillStyle = "white";
	buffCanvasCtx.fillRect(runner.x,runner.y,runner.width,runner.height);
				    
	// Copy to the main canvas.
	theCanvasCtx.drawImage(buffCanvas, 0,0,buffCanvasCtx.canvas.width, buffCanvasCtx.canvas.height);	
}

function blank() {
	buffCanvasCtx.fillStyle = "#330033";
	buffCanvasCtx.fillRect(0,0, buffCanvasCtx.canvas.width, buffCanvasCtx.canvas.height);
}


function animate(deltaPosition) {
	update(deltaPosition);
	draw();
}
