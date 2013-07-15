var environment_type='Production' // 'Development' or ''Production'
var ACS = require('acs').ACS;
// 'Development' 
ACS.init('pEn5tvLeSD8v1QaC3UAW74tXKE2KiNJI', '9uGJIEhrwBBK0BK3Tkd6KpxRyVYq4ldZ');

//''Production'
// ACS.init('tfV8s02WZEqv3qDhZUSHolwMu0ToO2fl', 'G9hDIrjjAWUaRqvBwEpXxmUls8zYKM70');

var mysqlHostSettings = {
	host     : 'localhost',
	user     : 'hungsing_mcms',
	password : 'hala0204',
	database : 'hungsing_mcms'
	};
	


if (environment_type =='Development') {
	//Development
	
	mysqlHostSettings = {
		host     : 'localhost',
		user     : 'hungsing_mcms',
		password : 'hala0204',
		database : 'hungsing_mcms'
		};	
} else {
	//Production
	
	mysqlHostSettings = {
		host     : 'qr-apps.com',
		user     : 'hungsing_mcms',
		password : 'hala0204',
		database : 'hungsing_mcms'
		};
}

function createlink(req,res){
	var linkURI
	if (typeof req.body.id[0] == undefined ){
		var linkURI = 'Welcome Node QR'
	} else {
		linkURI = req.body.id[0]
	}		
	var qr_png_link = linkURI
	res.send(200,{title: 'Creare a Free QR APP!' ,linkText: '', imagebuffer:'', qrPng: qr_png_link, qrtype:req.path, link:qr_png_link})
}

function emptyform(req,res){
	console.log('path:'+req.path)
	res.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true })
	if (req.path == '/qrapp') {
		res.render('qr', { title: 'Welcome to QR APP open API!' ,linkText: '', imagebuffer:'', qrtype:req.path});
	} else {
		res.render('qr', { title: 'Welcome to QR!' ,linkText: '', imagebuffer:'', qrtype:req.path});
	}
}



function createqrapplink(req,res){
	 try {

		var EasyMySQL = require('easy-mysql')
		// var settings = {
			  // //host     : 'qr-apps.com',
		      // user     : 'hungsing_mcms',
		      // password : 'hala0204',
		      // database : 'hungsing_mcms'
		// };
		var easy_mysql = EasyMySQL.connect(mysqlHostSettings);
		var QRAppID = 9
		var sql_insert = 'insert into uc_user_apps (user_id,title,description) value ("5","QR APP", "QR APP - Great Content App");';
	    easy_mysql.get_one(sql_insert, [], function (err, result) {
	    	if (err){
	    		console.log(err)
	    	} else {
	    		var sql_findID = 'SELECT max (app_id) as appid from uc_user_apps';
	    		// var sql_findID = 'SELECT LAST_INSERT_ID()  as appid';
	    		// console.log('result:'+result)
			    easy_mysql.get_one(sql_findID, [], function (err, result) {
			    	if (err){
			    		console.log(err)
			    	} else {
			    		console.log('Created ID:'+result.appid)
			    		QRAppID = result.appid
						
						linkTarget = req.body.windows
						console.log('LOgging : ----'+req.body.qrtitle)
						qrappTitle = req.body.qrtitle?req.body.qrtitle:'My Free QR App'

						
						//create ACS Users & Contents
						acs_freeuser_create('','user','Free','hala0204','hala0204',false,QRAppID+'.test@fuihan.com','app_admin.php',6,qrappTitle,linkTarget)			    		
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

function acs_freeuser_create(user_email,user_firstname,user_lastname,user_password,user_password_confirmation,msg,user_username,ref_location,user_role,user_content_title,linkTarget){
	user_username = typeof user_username !== 'undefined' ? user_username : '';
	ref_location = typeof ref_location !== 'undefined' ? ref_location : 'main.php';
	user_role = typeof user_role !== 'undefined' ? user_role : 0;
	user_content_title = typeof user_content_title !== 'undefined' ? user_content_title : 'QR App';
	
	linkTarget = typeof linkTarget !== 'undefined' ? linkTarget : '';
	
	console.log('ready to create ACS USer')
	
	var _stored_session_id
	
	var data = {
	    email: user_username,
		username: user_username,
	    first_name: user_firstname,
	    last_name: user_lastname,
	    password: user_password,
	    password_confirmation: user_password_confirmation,
		role:user_role,
		custom_fields:'{"contactinfo":""}',
		session_id:_stored_session_id
		};

	ACS.Users.create(data,function(responseData){
		
		console.log("Session: %j", responseData);
		if(responseData && responseData.meta && responseData.meta.code == 200) {
			console.log('ACS USer created')
			_stored_session_id = responseData.meta.session_id
			var contetn_UserID= responseData.users[0].id;
			console.log('Content USer ID :'+ contetn_UserID)
			//create first object - TabGroup
			var firstdata = {
				classname:'windows',
				fields:{"win_id" : 0,"win_root_id": 0,"win_title":"",	"win_icon":"about","win_type": "TYPE_TABBEDGROUP", "win_parameters": [true, true, "", ""],"win_published": true},
				session_id:_stored_session_id
				};
				
			ACS.Objects.create(firstdata,function(responseData){
				
				console.log("Session: %j", responseData);
				if (responseData && responseData.meta && responseData.meta.code == 200) {
					//create last object - QR account
					var lastdata = {
						classname:'windows',
						fields:{"win_id" : 999,"win_root_id": 0,"win_title":"Content QR",	"win_icon":"about","win_type": "TYPE_QRACCOUNT", "win_parameters": [true, true, "", ""],"win_published": true},
						session_id:_stored_session_id
						};
						
					ACS.Objects.create(lastdata,function(responseData){
						
						console.log("Session: %j", responseData);
						if (responseData && responseData.meta && responseData.meta.code == 200) {
							
							console.log('Prepare to create custom window objects - Length:'+linkTarget.length)
				
							checkLinkType(linkTarget,_stored_session_id)
							
							//Wait for 30 sec before timeout
							console.log('prepare to logout')
							
							console.log('Usert Logout')
							// LOGOUT MAIN USER, THEN CREATER VIEWER USER
							ACS.Users.logout(function(responseData){
								
								console.log("Session: %j", responseData);
								if(responseData && responseData.meta && responseData.meta.code == 200) {
									//create viewer account
									var viewerdata = {
										email: 'viewer.'+user_username,
										username:  'viewer.'+user_username,
										first_name: user_firstname,
										last_name: user_lastname,
										password: 'viewerInPub',
										password_confirmation: 'viewerInPub',
										role:user_role,
										custom_fields:'{"content_user_id":"'+contetn_UserID+'","content_title":"'+user_content_title+'"}'
										};	
									ACS.Users.create( viewerdata, function(responseData){
										console.log('Viewr Created')
									})
								}
							})
						} else  {
							// console.log('error:'+responseData.meta.message)
							console.log("Session: %j", responseData);
						}				
					})
			
				} else  {
					// console.log('error:'+responseData.meta.message)
					console.log("Session: %j", responseData);
				}
			})
		} else  {
			// console.log('error:'+responseData.meta.message)
			console.log("Session: %j", responseData);
		}
	})

}

//Checking Link URL Types in case to use suitable TYPE modules like TYEP_WEBVIDEO or TYPE_RSS
function checkLinkType(link,_stored_session_id){
		var header ;
		
		var pattern_youtube = /^(https?\:\/\/)?\w{0,3}.?youtube+\.\w{2,3}\/.*[\?|\&]v=([\w-]{11})/
		var pattern_url_1 = /^(http(s)?\:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- 0-9./?%&=]*)?/
		
		var pattern_url_2 = /^([https|http]?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
		var pattern_rss = /^(https?:\/\/)?.*[feed|xml|rss|feeds](.*)?/

		var matching = []
		var matchingStr
		var regexRes = []
		var match = []
		for (var i =0; i<link.length; i++){			
			var win_link = link[i].link
			var win_title = link[i].title
		
			console.log('Processing Text '+i+'  : '+win_title+' / '+win_link)
			
			if (pattern_youtube.test(win_link)){
				match = pattern_youtube.exec(win_link)
				matchingStr = ['RegEx:YOUTUBE',win_title,'TYPE_WEBVIDEO','Youtube',match[2]]
				put2Acs(matching,i,matchingStr,_stored_session_id)			
			} else if (pattern_url_1.test(win_link)){
				if (win_link.substring(0,7) != 'http://'){
					win_link = "http://"+win_link;
				}				
				match = pattern_url_1.exec(win_link)
				matchingStr = ['RegEx:URL',win_title,match[0]]
				checkContentType(win_link,matching,i,matchingStr,_stored_session_id)													
			}  else {
				matchingStr = ['RegEx:TEXT',win_title,'TYPE_CUSTOMPAGE',win_link,'']
				put2Acs(matching,i,matchingStr,_stored_session_id)
			}				
		}
}

//create ACS Objects
function put2Acs(matching,index_array,matchingStr,_stored_session_id){
	var icons = ['about','web','star','link']
	var acs_icon = 'about'
	switch (matchingStr[2]) {
		case 'TYPE_RSS' :
		case 'TYPE_RSS2' :
			acs_icon = 'rss'
			break;
		case 'TYPE_WEBVIDEO' :
			acs_icon = 'MD-camera-video'
			break;
		default:
			acs_icon = icons[index_array]
	}
	var windata = {
		classname:'windows',
		fields:{"win_id" : index_array+1,"win_root_id": 0,"win_title":(matchingStr[1]?matchingStr[1]:matchingStr[2]),	"win_icon":acs_icon,"win_type": matchingStr[2], "win_parameters": [true, true, matchingStr[1], matchingStr[3],matchingStr[4]],"win_published": true},
		session_id:_stored_session_id
		};
	ACS.Objects.create(windata,function(responseData){		
		console.log("Session: %j", responseData);						
		})
}

//目Using Agent to check Content-Type from the link, then create ACS Object
function checkContentType(link,matching,index,matchParams,_stored_session_id){
	try {
		var request = require('superagent')
		request
		.get(link, function(res){
			console.log('got statuscode:'+res.status);
			console.log('got content Type:'+res.type)
			matchingStr = [matchParams[0],matchParams[1],(res.type == 'text/xml')? 'TYPE_RSS':'TYPE_WEB',matchParams[2],'']
			put2Acs(matching,index,matchingStr,_stored_session_id)
	    })
	} catch (err) {
		matchingStr = ['RegEx:TEXT',matchParams[1],'TYPE_CUSTOMPAGE',link,'']
		put2Acs(matching,i,matchingStr,_stored_session_id)	
	}		
}