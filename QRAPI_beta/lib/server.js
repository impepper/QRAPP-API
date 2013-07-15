//
// index.js — QRAPI
// today is 11/15/12, it is now 08:25 PM
// created by TotenDev
// see LICENSE for details.
//


//Helpers
var mysqlConnector = require('mysql'),
    util = require('util');
//QRAPI
module.exports = function (options,onConnectCallBack) { return new QRAPI(options,onConnectCallBack); }
//QRAPI
function QRAPI (options,onConnectCallBack) {
  QRAPIServerInstance = this;
  QRAPIServerInstance.options = options;
  console.log("starting rest server");
  //Start rest server
  QRAPIServerInstance.restServer = require('./restServer')(options.restServer.user,options.restServer.password,function (path,body,fromIp,response) {
    if (path == '/postMessage' || path == '/postMessage/') {
      if (body && body.length > 0) {
         //Archieve into db
         QRAPIServerInstance.archieveNewIrcMessage(body,QRAPIServerInstance.options.irc.channelName,fromIp,'RESTSERVER');
         //response
         response.send(200,{de:"de"});
      } else { 
        response.send(202,{error:"No message on body."});
      }
    } else if (path == '/list/' || path == '/list'){
      try {
        var obj = JSON.parse(body);
        if (obj["startDate"] && obj["endDate"]) {

          //initializing query parameters
          var startRange = new Date(obj["startDate"] + " 00:00:01"),
              endRange = new Date(obj["endDate"] + " 23:59:59");
          startRange = startRange.getFullYear() + "-" + (startRange.getMonth()+1) + "-" + startRange.getDate() + " " + startRange.getHours() + ":" + startRange.getMinutes() + ":" + startRange.getSeconds() ;
          endRange = endRange.getFullYear() + "-" + (endRange.getMonth()+1) + "-" + endRange.getDate() + " " + endRange.getHours() + ":" + endRange.getMinutes() + ":" + endRange.getSeconds() ;
          
          // Call Mysql querying function
          QRAPIServerInstance.searchMessagesBetween(startRange,endRange,function (err,string) {
            if (err) { 
              response.send(202,{error:string}); 
            } else { 
              response.send(string); }
          });
        } else { 
          response.send(202,{error:"Missing keys on JSON."}); 
        }
      } catch (err){ 
        response.send(202,{error:"Processing error: "+err}); 
      }
    } else { 
      return false; 
    }
    return true;
  });
}

/*
Private Methods
*/

//Database util
//Connect to database
QRAPI.prototype.defaultDatabaseConnection = function defaultDatabaseConnection(successCb,errorCb) {
  var mysqlOptions = QRAPIServerInstance.options.database;
  var connection = mysqlConnector.createConnection(mysqlOptions);
  var errorCount = 0;
  function handleDisconnect(connection) {
    connection.on('error', function(err) {
      errorCount++;
      if (errorCount >= 3) {
        connection.destroy();       

      }else {
        console.log('re-connecting lost mysql connection: '+err.stack); 
        connection = mysqlConnector.createConnection(mysqlOptions);
        handleDisconnect(connection);
        var connectionTimeout = setTimeout(function () { connection.destroy(); },10000);
        connection.connect(function(err) {
          if (err) console.log(err);
          clearTimeout(connectionTimeout);
        });
      }
    });
  }
  handleDisconnect(connection);
  var connectionTimeout = setTimeout(function () { connection.destroy(); },1000);
  connection.connect(function(err) {
    if (err) { console.log(err); errorCb(err); }
    else { successCb(connection); }
    clearTimeout(connectionTimeout);
  });
}

//insert record into database
QRAPI.prototype.archieveNewIrcMessage = function archieveNewIrcMessage(ircMessage,channelName,fromIp,fromNickname) {
   var responsed = false;
   //create database connection for creating
   this.defaultDatabaseConnection(function (connection) {
     if (!responsed) {
      var strQuery = util.format('INSERT INTO `%s` (`id`, `message`, `channel`, `from`, `fromIP`, `timeStamp`) VALUES (NULL,\'%s\',\'%s\',\'%s\',\'%s\',CURRENT_TIMESTAMP)','messages',ircMessage,channelName,fromNickname,fromIp);
      var query = connection.query(strQuery, function(err, result) { /*console.log(result.insertId);*/ connection.destroy(); });
     }else { connection.destroy(); }
    },function (err) { console.log('internal database error ', err); });
}

//query in database
QRAPI.prototype.searchMessagesBetween = function searchMessagesBetween(startDate,endDate,callback) {
   var responsed = false;
   //create database connection for creating
   this.defaultDatabaseConnection(function (connection) {
     if (!responsed) {
      var strQuery = util.format('SELECT * FROM `%s` WHERE `%s` >= \'%s\' AND `%s` <= \'%s\'','messages','timeStamp',startDate,'timeStamp',endDate);
      var query = connection.query(strQuery, function(err,result) {  callback(false,result); connection.destroy(); });
     }else { connection.destroy(); }
    },function (err) {
    //Cannot connect
    if (!responsed) { callback(true,'internal database error ', err); }
   });
}