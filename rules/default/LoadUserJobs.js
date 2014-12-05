var path = require('path'),
    name = path.basename(module.filename, ".js");

module.exports = {
    name: name,
    description: "Load user jobs",
    priority: 0,
    on: 1,
    condition: function(job, cb) {
        cb(job && job.result && job.user && !job.user.jobs);
    },
    consequence: function(cb) {
        var schedule = require('node-schedule'),
            walk = require('walk'),
            files = walk.walk('./jobs/user', {
                followLinks: false
            }),
            data = this;

        data.user.jobs = data.user.jobs || [];

        data.lastrule = name;

        files.on('file', function(root, stat, next) {
            if (stat.type == "file" && stat.name.match(/\.json$/gi)) {
                var thisJob = require(path.resolve(process.cwd(), root, stat.name));
                data.user.jobs[thisJob.id] = thisJob;
            }
            next();
        });

        files.on("errors", function(root, nodeStatsArray, next) {
            data.errors = nodeStatsArray;
        });

        files.on('end', function() {
            cb(data);
        });
    }
};