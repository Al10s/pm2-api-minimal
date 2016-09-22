var pm2 = require("pm2");
var Q = require("q");

Q.nbind(pm2.connect, pm2)()
.then(function () {
	return Q.nbind(pm2.start, pm2)('server.js', { name: 'server', watch: false });
})
.then(function () {
	return Q.nbind(pm2.start, pm2)('scheduled-tasks.js', { name:'scheduled-tasks', watch: false });
})
.done();

function onSignal () {
	console.log("Signal received ; Stopping processes");
	Q.all([
		Q.nbind(pm2.stop, pm2)('server'),
		Q.nbind(pm2.stop, pm2)('scheduled-tasks'),
	])
	.then(function () {
		return Q.nbind(pm2.disconnect, pm2)();
	})
	.then(function () {
		return Q.nbind(pm2.destroy, pm2)();
	})
	.then(function () {
		process.exit(0);
	});
}

process.on("SIGTERM", onSignal);
process.on("SIGINT", onSignal);