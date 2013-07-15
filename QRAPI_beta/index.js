//
// index.js — IrcMan
// today is 11/15/12, it is now 08:25 PM
// created by TotenDev
// see LICENSE for details.
//


//Helpers
var defaultIRCNick = "botNickname";
var server = require('./lib/server.js')({ 
      database: {
        host:"localhost",
        user:"root",
        password:"",
        database:"ircMan",
        port:3306,
        debug:false
       },
      restServer: {
        user:'testUser',
        password:'testPassword'
      }
    },function () {
      console.log("UP");
    });