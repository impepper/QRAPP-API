function Hellowithpython(req, res){
	 try {
	 	console.log('Up!'+req)
        // var obj = JSON.parse(req);
        console.log('req :'+req.path)
        console.log('.param.id :'+req.params.id)
        console.log('params :'+req.params)


		var zerorpc = require("zerorpc");
		
		var client = new zerorpc.Client();
		client.connect("tcp://192.168.163.140:4242");
		
		client.invoke("hello", "RPC", function(error, res, more) {
		    console.log(res);
		});

		console.log('Test Done!')


      } catch (err){ 
        res.send(202,{error:"Processing error: "+err}); 
        console.log("Processing error: "+err)
      }
}

function createAPK(req, res){
	 try {
	 	console.log('Up!'+req)
        // var obj = JSON.parse(req);
        console.log('req :'+req.path)
        console.log('.param.id :'+req.params.id)
        console.log('params :'+req.params)
		var i=0
		for (var i=0;i<10li++){
			var zerorpc = require("zerorpc");
			
			var client = new zerorpc.Client();
			client.connect("tcp://192.168.163.140:4242");
			
			client.invoke("createAPK", i, function(error, res, more) {
			    console.log(res);
			});		
		}
		console.log('Test Done!')

      } catch (err){ 
        res.send(202,{error:"Processing error: "+err}); 
        console.log("Processing error: "+err)
      }
}