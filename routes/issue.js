var config = require('../config');
var mongo = require('mongodb');

var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;
	
var server = new Server(config.db.host, config.db.port, { auto_reconnect : true });

db = new Db('deploy', server);

db.open(function(err, db){
	if (!err) {
		console.log("Connected to 'deploy' database");
	}
	
})

exports.findAll = function(req, res) {
   var limitPage = 20;
   db.collection('issues', function(err, collection) {
        collection.find().sort({create_at : -1}).skip(limitPage*(parseInt(req.query.page || 1) - 1)).limit(limitPage).toArray(function(err, items) {
            res.send(items);
        });
    });
}

exports.findById = function(req, res) {
	var id = req.params.id;
	
	db.collection('issues', function(err, collection){
		collection.findOne({'_id' : new BSON.ObjectID(id)}, function(err, item){
			res.send(item);
		})
	})
}

exports.addIssue = function(req, res) {
    var issue = req.body;
    issue.create_at = new Date();
    db.collection('issues', function(err, collection) {
        collection.insert(issue, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(result[0]);
            }
        });
    });
}

exports.updateIssue = function(req, res) {
    var id = req.params.id;
    var issue = req.body;

    issue.update_at = new Date();
    db.collection('issues', function(err, collection) {
    	delete issue._id;
        collection.update({'_id':new BSON.ObjectID(id)}, issue, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(issue);
            }
        });
    });
}

exports.deleteIssue = function(req, res) {
   var id = req.params.id;
    db.collection('issues', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                res.send(req.body);
            }
        });
    });
}
