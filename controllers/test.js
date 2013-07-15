var ACS = require('acs').ACS;
ACS.init('tfV8s02WZEqv3qDhZUSHolwMu0ToO2fl', 'G9hDIrjjAWUaRqvBwEpXxmUls8zYKM70');

function test(req, res){
	 try {
	 	console.log('Up!'+req)
        // var obj = JSON.parse(req);
        console.log('req :'+req.path)
        console.log('.param.id :'+req.params.id)
        console.log('params :'+req.params)

        //res.send(200,"Parameter ID:"+req.params.id); 
        
		var EasyMySQL = require('easy-mysql')
		var settings = {
			  host     : 'qr-apps.com',
		      user     : 'hungsing_mcms',
		      password : 'hala0204',
		      database : 'hungsing_mcms'
		};
		var easy_mysql = EasyMySQL.connect(settings);
		var QRAppID = 9
		var sql_test = 'select * from uc_users where id= ?';
	    easy_mysql.get_one(sql_test, [3], function (err, result) {
	    	res.send(200,result.display_name)
      	})
        
      } catch (err){ 
        // res.send(202,{error:"Processing error: "+err}); 
         console.log("Processing error: "+err)
      }
} 

function mysqldb(req, res){
	 try {
	 	console.log('Up!'+req)
        // var obj = JSON.parse(req);
        console.log('req :'+req.path)
        console.log('.param.id :'+req.params.cloudkey_id)
        console.log('params :'+req.params)
		var cloudkey = 1
		if (typeof req.params.cloudkey_id != undefined){
			cloudkey = req.params.cloudkey_id
		}
		var EasyMySQL = require('easy-mysql')
		var settings = {
		      user     : 'hungsing_mcms',
		      password : 'hala0204',
		      database : 'hungsing_mcms'
		};
		var easy_mysql = EasyMySQL.connect(settings);

		var sql = 'select * from cloudkeys where cloudkey_id = ?';
	    easy_mysql.get_one(sql, [cloudkey], function (err, result) {
	    	if (err){
	    		console.log(err)
	    	} else {
	    		console.log('Fetched:'+result.user_email)
	    	}
		    
		});

	    // easy_mysql.get_all(sql, [0], function (err, results) {
	    	// if (err){
	    		// console.log(err)
	    	// } else {
	    		// // console.log('Fetched:'+result.account_type)
	    		// console.log('Fetched:'+results.length)
	    	// }		    
		// });

        res.send("MySQL Query Executed!"); 
      } catch (err){ 
        // res.send(202,{error:"Processing error: "+err}); 
         console.log("Processing error: "+err)
      }
}      
     
function json(req, res){
	 try {
	 	console.log('Up!'+req)
        // var obj = JSON.parse(req);
        console.log('req :'+req.path)
        console.log('.param.id :'+req.params.id)
        console.log('params.imagetype :'+req.params.type)
        console.log('params :'+req.params)

		res.contentType('application/json');

		// Normally, the would probably come from a database, but we can cheat:
		var people = [
			{ name: 'Dave', location: 'Atlanta' },
			{ name: 'Santa Claus', location: 'North Pole' },
			{ name: 'Man in the Moon', location: 'The Moon' }
		];
		
		// Since the request is for a JSON representation of the people, we
		//  should JSON serialize them. The built-in JSON.stringify() function
		//  does that.
		var peopleJSON = JSON.stringify(people);
		
		// Now, we can use the response object's send method to push that string
		//  of people JSON back to the browser in response to this request:
		res.send(peopleJSON);

      } catch (err){ 
        // res.send(202,{error:"Processing error: "+err}); 
         console.log("Processing error: "+err)
      }
} 

//create qr code
function freeqr(req, res){
	var qr=require('qrpng');
	var linkURI
	if (typeof req.params.link == undefined ){
		var linkURI = 'Welcome Node QR'
	} else {
		linkURI = req.params.link
	}
		
	qr( linkURI ,6, function(err, png) {
		// png contains the PNG as a buffer. You can write it to a file for example.
		res.render('qr', { title: 'Welcome to Node QR!',linkText: linkURI, imagebuffer:"data:image/png;base64,"+png.toString('base64')});
	})
	
}

function acs_user(req, res){
	ACS.Users.login({
        login: 'defaultui@fuihan.com', 
        password: 'fuihan168'
    }, function(data) {
    	if(data.success) {   		
            res.send(data.users[0].last_name);
            res.send(data);
        } else {
            res.send(
                'Error occured. Error code: ' + data.error + '. Message: ' + data.message);
        }
        // // res.send('Login session is: ' + data.meta.session_id);
        // res.send('Login session is: ' + data[0].meta.id);
    });
}

function createpng(req,res){
	var qr=require('qrpng');
	var linkURI
	if (typeof req.params.link == undefined ){
		var linkURI = 'Welcome to QR APP open API!'
	} else {
		linkURI = req.params.link
	}
		
	qr( linkURI ,6, function(err, png) {
		
		// Method 1: png contains the PNG as a buffer. You can write it to a file for example.
		res.render('qr', { title: 'Welcome to QR APP open API!',linkText: linkURI, imagebuffer:"data:image/png;base64,"+png.toString('base64')});
		
		// Method 2
		// res.sendfile('public/images/mail.png')
		
		// Method 3
		// var buf = new Buffer(png, 'base64');
		// res.writeHead(200,{'Content-Type': 'image/png','Content-Length':buf.length})
		// res.write(buf)
		// res.end();
	})	
}

function createjsonlink(req,res){
	 try {

		var EasyMySQL = require('easy-mysql')
		var easy_mysql = EasyMySQL.connect(mysqlHostSettings);
		var QRAppID = 9
		var sql_insert = 'insert into uc_user_apps (user_id,title,description) value ("5","QR APP", "QR APP - Great Content App");';
	    easy_mysql.get_one(sql_insert, [], function (err, result) {
	    	if (err){
	    		console.log(err)
	    	} else {
	    		var sql_findID = 'SELECT max (app_id) as appid from uc_user_apps';
			    easy_mysql.get_one(sql_findID, [], function (err, result) {
			    	if (err){
			    		console.log(err)
			    	} else {
			    		console.log('Created ID:'+result.appid)
			    		QRAppID = result.appid
						
						linkTarget = req.body.windows
						qrappTitle = req.body.qrtitle?req.body.qrtitle:'My Free QR App'		    		
			    	}			    	
					//Send Link URL bacj to frontEnd
					var linkURI = QRAppID
					var qr_png_link = new Buffer('&content='+linkURI+'.test@fuihan.com').toString('base64')					
					console.log('QR APP Link ID = '+ qr_png_link)					
					res.send(200,{link:'http://code.qrapp.com.tw/'+qr_png_link})		    
				});
	    	}  
		});
	} catch (err){ 
		res.send(202,{error:"Processing error: "+err}); 
		console.log("Processing error: "+err)
	}
}
