var path = require('path'),
    name = path.basename(module.filename, ".js");

module.exports = {
    name: name,
    description: "Create scheduler for user job",
    priority: 10,
    on: 1,
    condition: function(job, cb) {
        cb(job && job.result && job.user && job.user.jobs && job.lastrule == "LoadUserJobs");
    },
    consequence: function(cb) {
        var schedule = require('node-schedule'),
            data = this;

        data.user.jobs.forEach(function (job) {
            if (job && job.schedule) {
                Object.keys(job.schedule).forEach(function(key) {
                    var item = job.schedule[key];
                    job.schedule[key] = (item != null && item.hasOwnProperty('start')) ? new schedule.Range(parseFloat(item.start), parseFloat(item.end), parseFloat(item.step) || 1) : item;
                });
            }
        });

        data.lastrule = name;
        cb(data);
    }

};