var config = require('../config');
var command = require('../utils/command');
var mongo = require('mongodb');

var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;
	
var server = new Server(config.db.host, config.db.port, { auto_reconnect : true });

db = new Db('deploy', server);

db.open(function(err, db){
	
})


exports.run = function(req, res){
	var data = req.body;

	var log = [];
	
	db.collection('issues', function(err, issues){
		issues.findOne({'_id' : new BSON.ObjectID(data.issue_id)}, function(err, collection){
			var issue = collection;
			
			db.collection('projects', function(err, projects){
				projects.findOne({ _id : new BSON.ObjectID(issue.project)}, function(err, project) {
					
					command.deploy(log, project, issue, data.target, {
						success : function() {
							addLog(issue._id, log.join("\r\n"));
							res.send({ error : false, msg : 'ok ', log : log.join("\r\n")});							
						},
						
						error : function() {
							addLog(issue._id, log.join("\r\n"));
							res.send({ error : true, msg : 'fail.', log : log.join("\r\n") });
						}
					});

				})
			})
		})
	})
};

function addLog (id, log) {
   db.collection('logs', function(err, collection) {

		if (!err) {
			var data = {}; 
			
			data.data = log;
	   		data.create_at = new Date();
	   		data.issue = id + "";
	   		data.type = 'success';
	   		
	        collection.insert(data, {safe:true}, function(err, result) {

	        });			
		} else {

		}
    });
}

exports.addLog = function(req, res) {
   var id = req.params.id;
   var data = req.body;
   
   db.collection('logs', function(err, collection) {

		if (err) {
			res.send({'error':'An error has occurred'});
		} else {
	   		data.create_at = new Date();
	   		data.issue = id+"";
	   		data.type = 'success';
	   		
	        collection.insert(data, {safe:true}, function(err, result) {
	            if (err) {
	                res.send({'error':'An error has occurred'});
	            } else {
	            	res.send('success')
	            }
	        });			
		}
   	

    });
}

exports.findAll = function(req, res) {
   var id = req.params.id;
   var limit = parseInt(req.query.limit || 1000);
   db.collection('logs', function(err, collection) {
        collection.find({issue : id}).sort({ _id : -1}).limit(limit).toArray(function(err, items) {
            res.send(200, items);
        });
    });
}

exports.findSvnLog = function(req, res) {
   var id = req.params.id;

	db.collection('projects', function(err, projects){
		projects.findOne({ _id : new BSON.ObjectID(id)}, function(err, project) {
			
			command.svnlog(project, {
				success : function(data) {
					res.send(data);							
				}
			});

		})
	})
}

exports.findSvnRevision = function(req, res) {
   var id = req.params.id;

	db.collection('projects', function(err, projects){
		projects.findOne({ _id : new BSON.ObjectID(id)}, function(err, project) {
			
			command.svnRevision(project, {
				success : function(data) {
					res.send(data);							
				}
			});

		})
	})
}

