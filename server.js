var pm2 = require('pm2');
var Q = require("q");

var LISTENING_PORT = 9999;

var express = require('express');
var app = express();

app.get('/pm2/list', function (req, res) {
	Q.nbind(pm2.connect, pm2)()
	.then(function () {
		return Q.nbind(pm2.list, pm2)()
		.then(function (informations) {
			res.send(informations);
		});
	})
	.catch(function (e) {
		res.send("Error");
		throw e;
	})
	.finally(function () {
		return Q.nbind(pm2.disconnect, pm2)();
	})
	.done();
});


var server = app.listen(LISTENING_PORT, function () {
	console.log("Listening on port " + LISTENING_PORT);
});

function onProcessInterrupted () {
	server.close(function () {
		process.exit(0);
	});
}

process.on('SIGINT', onProcessInterrupted);
process.on('SIGTERM', onProcessInterrupted);