var interval = setInterval(function () {
	console.log("Doing some stuff");
}, 9000);

function onProcessInterrupted () {
	clearInterval(interval);
	process.exit(0);
}

process.on('SIGINT', onProcessInterrupted);
process.on('SIGTERM', onProcessInterrupted);