
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , issue = require('./routes/issue')
  , project = require('./routes/project')
  , deploy = require('./routes/deploy')
  , http = require('http')
  , path = require('path');

var app = express(); 

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/project', project.index)

app.get('/issues', issue.findAll)
app.get('/issues/:id', issue.findById)
app.post('/issues', issue.addIssue)
app.put('/issues/:id', issue.updateIssue)
app.delete('/issues/:id', issue.deleteIssue)

app.post('/deploy', deploy.run);
app.get('/deploy/logs/:id', deploy.findAll);
app.post('/deploy/logs/:id', deploy.addLog);
app.get('/deploy/files/:id', deploy.findSvnLog);
app.get('/deploy/revision/:id', deploy.findSvnRevision);

app.get('/projects', project.findAll)
app.get('/projects/:id', project.findById)
app.post('/projects', project.addProject)
app.put('/projects/:id', project.updateProject)
app.delete('/projects/:id', project.deleteProject)

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
