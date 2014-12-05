var path = require('path'),
    name = path.basename(module.filename, ".js");

module.exports = {
    name: name,
    description: "Execute scheduler for user jobs",
    priority: 0,
    on: 1,
    condition: function(job, cb) {
        cb(job && job.result && job.user && job.user.jobs && job.user.rules);
    },
    consequence: function(cb) {
        var schedule = require('node-schedule'),
            RuleEngine = require('node-rules'),
            data = this;

        var Rules = new RuleEngine(data.user.rules);
        data.user.jobs.forEach(function (job) {
            schedule.scheduleJob(job.schedule, function() {
                Rules.execute(job, function(payload) {
                    // console.log(payload)
                });
            });
        });

        data.lastrule = name;
        cb(data);
    }

};