var environment_type='Development' // 'Development' or ''Production'

var mysqlHostSettings = {
	host     : 'localhost',
	user     : 'hungsing_mcms',
	password : 'hala0204',
	database : 'hungsing_mcms'
	};
	
var ACS = require('acs').ACS;

if (environment_type='Development') {
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