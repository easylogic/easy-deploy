var config = require('../config');
var Rsync = require('rsync');
var log = require('./log')
var fs = require('fs');
var exec = require('child_process').exec;


var auth = " --username " + config.svn.id + " --password \"" + config.svn.password + "\" ";

function deploy_rsync(log, id, rsync_opt, dist_dir, callback) {
	
	var rsync = Rsync.build(rsync_opt);
	
	rsync.set('rsync-path', '/usr/bin/rsync');
	rsync.set('delete');
	
	console.log(rsync.command()); 
		
	rsync.execute(function(error, stdout) {
		if (error) {
			log.push("error : " + rsync_opt.source , error+""); 
		} else {
			log.push("success : " + rsync_opt.source.replace(dist_dir + "/", "")); 
			log.push(stdout); 
		}
		
		callback();
	})
}

function deploy_flow (log, project, issue, target, opt) {
		var dist_dir = config.root + project._id;
		var servers = project.server[target];
		var files = issue.files.split("\n");
		
		var temp = [];
		var dist_list = [];
        var run  = "svn update " + auth + "  "+ dist_dir;


        if (issue.fullsync) {

        } else {
    		for(var key in files) {
		    	var file = files[key].trim();
	    		
    			if (file == "") continue;
	    		if (file.indexOf("#") == 0) continue;
			
    			temp.push(file);
	    		dist_list.push(dist_dir + "/" + file);
		    }
		
    		files = temp;
	    	dist_files = dist_list;
		
		// log svn update
    		var run = "svn update " + auth + " "+ dist_list.join(" ");
		
	        if (issue.revision) {
    			run = "svn update " + auth + "  -r" + issue.revision + " "+ dist_dir;
	    	} else {
		    	run = "svn update " + auth + " "+ dist_list.join(" ");
    		}

        }
		
		
		log.push(run.replace(auth, ""));

		exec(run, function(err, stdout, stderr){
			
			if (!err) {
				// success
				log.push(stdout, "") 
				
				log.push("rsync start : " + target);
				
				var log_count = 0;
				var log_max = servers.length * files.length;
                var log_max_2 = servers.length;

				for(var i in servers) {
					var arr = servers[i].split(":");

					log.push("target : " + servers[i], "");
				
                    if (issue.fullsync) {
        					var rsync_opt = {
		    				  source:      dist_dir + "/" ,
			    			  destination: servers[i] ,
				    		  exclude:     ['.git', '.svn'],
					    	  flags:       'avz',
    						  shell:       'ssh'
	    					}
						
		    				deploy_rsync(log, issue._id, rsync_opt, dist_dir, function() {
			    				log_count++;
							
				    			if (log_count == log_max_2) {
					    			//console.log('end')
						    		opt.success();
							    }							
    						});
                    
                    } else {
                        
                     	
    					for (var j in files) {
						
	    					var rsync_opt = {
		    				  source:      dist_dir + "/" + files[j],
			    			  destination: servers[i] + "/" + files[j],
				    		  exclude:     ['.git', '.svn'],
					    	  flags:       'avz',
    						  shell:       'ssh'
	    					}
						
		    				deploy_rsync(log, issue._id, rsync_opt, dist_dir, function() {
			    				log_count++;
							
				    			if (log_count == log_max) {
					    			//console.log('end')
						    		opt.success();
							    }							
    						});
												
	    				}

                    }
			
				}		
			} else {
				opt.error();
			}

		})
	
}

exports.deploy = function(log, project, issue, target, opt) {

	// log start
	log.push("deploy start : " + target ); 
	// start svn update
	
	// dist temp directory
	var dist_dir = config.root + project._id;
	
	if (!fs.existsSync(dist_dir)) {
		
		if (project.type == 'svn') {
			var run = "svn checkout " + auth + "  " + project.location + " " + dist_dir;
			
			exec(run, function(err, stdout, stderr) {
				if (!err) {
					log.push('run : ' + run + stdout);
	
					// rsync files 
					deploy_flow(log, project, issue, target ,opt)					
				} else {
					opt.error();
				}

			})
			
				
		} else if (project.type == 'git') {
			opt.error();
		}
		
	} else {
		// rsync files 
		deploy_flow(log, project, issue, target ,opt) 
	}
	
}

exports.svnlog = function(project, opt) {
	var data = {}; 
	var dist_dir = config.root + project._id;
	
	var info = "svn info --no-auth-cache --non-interactive " + auth + "  --xml " + project.location;
	var run = "svn log --limit 100 --verbose --no-auth-cache --non-interactive " + auth + " --xml " + project.location;

	exec(info, function(err, stdout, stderr){
		if (!err) {
			data.info = stdout;
			exec(run, function(err, stdout, stderr) {
				
				if (!err) {
					data.log = stdout;
					opt.success(data);
				} else {
					opt.success(data);
				}
		
			})
		} else {
			opt.success(data);
		}
	})
}

exports.svnRevision = function(project, opt) {
	var data = { log : ''}; 
	var dist_dir = config.root + project._id;
	
	var run = "svn log --limit 100 --no-auth-cache --non-interactive " + auth + " --xml " + project.location;

	exec(run, function(err, stdout, stderr){
		if (!err) {
			data.log = stdout;
			opt.success(data);
		} else {
			opt.success(data);
		}
	
	})
}
