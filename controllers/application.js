function index(req, res) {
	res.render('index', { title: 'Welcome to Node.ACS!' });
	console.log('Done!')
}

function index_new(req, res) {
	res.render('index_new', { title: 'Welcome to Node.ACS!' });
	console.log('Done!')
}