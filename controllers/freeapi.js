var environment_type='Development' // 'Development' or ''Production'

var mysqlHostSettings = {
	host     : 'localhost',
	user     : 'hungsing_mcms',
	password : 'hala0204',
	database : 'hungsing_mcms'
	};
	
var ACS = require('acs').ACS;

if (environment_type=='Development') {
	//Development
	ACS.init('pEn5tvLeSD8v1QaC3UAW74tXKE2KiNJI', '9uGJIEhrwBBK0BK3Tkd6KpxRyVYq4ldZ');
	mysqlHostSettings = {
		host     : 'localhost',
		user     : 'hungsing_mcms',
		password : 'hala0204',
		database : 'hungsing_mcms'
		};	
} else {
	//Production
	ACS.init('tfV8s02WZEqv3qDhZUSHolwMu0ToO2fl', 'G9hDIrjjAWUaRqvBwEpXxmUls8zYKM70');
	mysqlHostSettings = {
		host     : 'qr-apps.com',
		user     : 'hungsing_mcms',
		password : 'hala0204',
		database : 'hungsing_mcms'
		};
}

function test(req, res){
	 try {
	 	console.log('Up!'+req)
        // var obj = JSON.parse(req);
        console.log('req :'+req.path)
        console.log('.param.id :'+req.params.id)
        console.log('params :'+req.params)

		console.log('Test Done!')
      } catch (err){ 
        res.send(202,{error:"Processing error: "+err}); 
        console.log("Processing error: "+err)
      }
}

//create qr code
function freeqr(req, res){
	var qr=require('qrpng');
	var linkURI
	if (typeof req.params.link == undefined ){
		var linkURI = 'Welcome QR App Open API!'
	} else {
		linkURI = req.params.link
	}	
		
	res.render('qr', { title: 'Creare a Free QR APP!',linkText: linkURI, freeqr:true, qrtype:'/qr'});
}

//create qr code
function freeqrjson(req, res){
	var qr=require('qrpng');
	var linkURI
	if (typeof req.body.link == undefined ){
		var linkURI = 'Welcome QR App Open API!'
	} else {
		linkURI = req.body.link
	}
	res.send(200,{link:linkURI})
}

