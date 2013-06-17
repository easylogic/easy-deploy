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


exports.index = function(req, res){
  res.render('project', { title: 'Express2' });
};

exports.findAll = function(req, res) {
   db.collection('projects', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
}

exports.findById = function(req, res) {
	var id = req.params.id;
	
	db.collection('projects', function(err, collection){
		collection.findOne({'_id' : new BSON.ObjectID(id)}, function(err, item){
			res.send(item);
		})
	})
}

exports.addProject = function(req, res) {
    var project = req.body;
    db.collection('projects', function(err, collection) {
        collection.insert(project, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(result[0]);
            }
        });
    });
}

exports.updateProject = function(req, res) {
    var id = req.params.id;
    var project = req.body;
    db.collection('projects', function(err, collection) {
    	delete project._id;
        collection.update({'_id':new BSON.ObjectID(id)}, project, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(project);
            }
        });
    });
}

exports.deleteProject = function(req, res) {
   var id = req.params.id;
    db.collection('projects', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                res.send(req.body);
            }
        });
    });
}
