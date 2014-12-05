var schedule = require('node-schedule'),
	RuleEngine = require('node-rules'),
	walk = require('walk');

(function(fileJobs, fileRules, RE, JT) {

	var jobs = [],
		rules = [];

	fileJobs.on('file', function(root, stat, next) {
		if (stat.type == "file" && stat.name.match(/\.json$/gi)) {
			var thisJob = require(root + '/' + stat.name);
			if (thisJob && thisJob.schedule) {
				Object.keys(thisJob.schedule).forEach(function(key) {
					var item = thisJob.schedule[key];
					thisJob.schedule[key] = (item != null && item.hasOwnProperty('start')) ? new schedule.Range(parseFloat(item.start), parseFloat(item.end), parseFloat(item.step) || 1) : item;
				})
			}
			jobs[thisJob.id] = thisJob;
		}
		next();
	});

	fileRules.on('file', function(root, stat, next) {
		if (stat.type == "file" && stat.name.match(/\.js$/gi)) {
			var thisRule = require(root + '/' + stat.name);
			rules.push(thisRule);
		}
		next();
	});

	fileRules.on('end', function() {
		RE = new RuleEngine(rules);
		if (JT) {
			jobExecution(jobs);
		}
	});

	fileJobs.on('end', function() {
		JT = true;
		if (RE) {
			jobExecution(jobs);
		}
	});

	var jobExecution = function(jobs) {
		jobs.forEach(function(job) {
			RE.execute(job, function(payload) {
				// console.log(payload)
			});
		});
	};

})(
	// var fileJobs
	walk.walk('./jobs/default', {
		followLinks: false
	}),
	// var fileRules
	walk.walk('./rules/default', {
		followLinks: false,
		filters: ["node_modules"]
	})
);