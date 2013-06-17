var config = require('../config');
var mongo = require('mongodb');

var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;
	
var server = new Server(config.db.host, config.db.port, { auto_reconnect : true });

db = new Db('deploy', server);

db.open(function(err, db){

	
})

exports.log = function(issue, data, type) {
	type = type || 'success'
	db.collection('logs', function(err, logs){
		var log_data = {
			create_at : new Date(),
			issue : issue,
			data : data,
			type : type 
		};
		logs.insert(log_data, {safe:true}, function(err, result) {
            if (err) {
                //console.log({'error':'An error has occurred'}, err);
            } else {
                //console.log('log : ' + JSON.stringify(result[0]));
            }
		});
	})		
}

exports.findAll = function(issuce, limit) {
	
}
