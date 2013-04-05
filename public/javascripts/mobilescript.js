/**
 * New node file
 */
window.onload = init;

var mobileCanvas = null;
var mobileCanvasCtx = null;

var buffCanvas = null;
var buffCanvasCtx = null;

var lineStartX = 50;
var lineStartY = 0;

var lineWidth = 200;
var lineHeight = 400;

var socket = null;

var touchObjs = [];

// To store the object touch (to keep track of the current touch) and also the 
// initial (X,Y) position of the touch.
function touchDetails(touch) {
	this.touch = touch;
	this.startX = touch.pageX;
	this.startY = touch.pageY;	
	
	this.endX = touch.pageX;
	this.endY = touch.pageY;
}

function init() {
	mobileCanvas = document.getElementById("mobilecanvas");	
	
	if (mobileCanvas == null) {
		console.log("Not able to get the mobilecanvas handle");
	}
	
	if (mobileCanvas && mobileCanvas.getContext) {
		mobileCanvasCtx = mobileCanvas.getContext("2d");
	}
	
	if (mobileCanvasCtx == null) {
		console.log("Couldn't get handle to the mobilecanvas context");
	}
	
	draw();	
	
	socket = io.connect('http://playwithmobile.azurewebsites.net:3000');
	
	// Call preventDefault on touchmove or touchstart
	
	document.addEventListener("touchmove", function(event) 
						{ event.preventDefault(); }, 
							false);
							
	mobileCanvas.addEventListener("touchstart",handleStart, false);
	mobileCanvas.addEventListener("touchend", handleEnd, false);

}

function handleStart(event) {
	event.preventDefault();
	
	var touches = event.changedTouches;
	
	for (var i = 0; i < touches.length; i++) {
		var temp = new touchDetails(touches[i]);
		touchObjs.push(temp);
		console.log("Creating an obj. with x " + temp.startX + " and y " + temp.startY );
	}
}

function handleEnd(event) {
	event.preventDefault();
	
	var touches = event.changedTouches;
	
	var lengthTouched = 0;
	
	for (var i = 0; i < touches.length; i++) {
		var idx = getIndex(touches[i].identifier);
		var temp = touchObjs[idx];
				
		temp.endX = touches[idx].pageX;
		temp.endY = touches[idx].pageY;
		console.log("idx is " + idx + " x is " + touches[idx].pageX +" y is " + touches[idx].pageY);
		
		if (temp.endX >= lineStartX && temp.endX <= lineStartX + lineWidth) {
			if (temp.endY >= lineStartY) {
				lengthTouched += (temp.endY - temp.startY);
			}
		}
		
		touchObjs.splice(idx,1);		
	}
	
	console.log("length touched is " + lengthTouched);
	
	lengthTouched /= lineHeight;
	
	if (lengthTouched >= 1) {
		lengthTouched = 1;	
	}
	
	sendTouchEvent(lengthTouched);	
}

function getIndex(id) {
	
	for (var i = 0; i < touchObjs.length; i++) {
		if (touchObjs[i].touch.identifier == id) {
			return i;
		}
	}
	
	return -1;	
}

function sendTouchEvent(length) {
	socket.emit('mobiletouch', {message: length});
}

function update() {
	
}

function blank() {
	mobileCanvasCtx.fillStyle = "#330033";
	mobileCanvasCtx.fillRect(0,0, mobileCanvasCtx.canvas.width, mobileCanvasCtx.canvas.height);
}

function draw() {
	
	blank();
	
	mobileCanvasCtx.beginPath();
	mobileCanvasCtx.lineWidth = 5;
	mobileCanvasCtx.strokeStyle = "red";

	mobileCanvasCtx.moveTo(lineStartX, lineStartY);
	mobileCanvasCtx.lineTo(lineStartX, lineStartY+lineHeight);
	
	mobileCanvasCtx.moveTo(lineStartX + lineWidth, lineStartY);
	mobileCanvasCtx.lineTo(lineStartX + lineWidth, lineStartY + lineHeight);
	
	mobileCanvasCtx.stroke();		
	
}

function animate() {
	update();
	draw();
}
