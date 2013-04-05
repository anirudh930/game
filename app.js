
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , mobile = require('./routes/mobile')
  , http = require('http')
  , path = require('path');

var io = require('socket.io');
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/**
We don't need any routing here.
**/

app.get('/', routes.index);
//app.get('/users', user.list);
//app.get('/mobile', mobile.display);



var server = http.createServer(app)

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var socketsHandle = io.listen(server);

socketsHandle.sockets.on('connection', function(socket){
	/**
	var isMobile = false;
	if (/mobile/i.test(isMobile))
		isMobile = true;
    
    if (isMobile == true) {
    }
	else {**/
		//setInterval(function(){socket.emit('move', {x:50, y:0})}, 5000);	
	//}
	console.log("Recvd. a connection!");	
	socket.on('mobiletouch', function  (data) {
  		console.log("Received a touch " + data.message);
  		var dist = 50 * data.message
  		socketsHandle.sockets.emit('move', {x:dist, y:0});
  	});
  
});
