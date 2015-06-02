var hapi = require('hapi');
var routes = require('./routes');

var config = { docs: true };
var http = new hapi.Server('0.0.0.0', 8080, config); // 8080 is the port to listen on

http.addRoutes(routes);

http.start();
