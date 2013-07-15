// initialize app
function start(app, express) {
	app.use(express.favicon(__dirname + '/public/images/favicon_qrapp.ico'));		//set favicon
	app.use(express.static(__dirname + '/public'));
	app.listen(2000)
}

// release resources
function stop() {
	
}