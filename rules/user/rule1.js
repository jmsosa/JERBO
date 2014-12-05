module.exports = {
    name: "Add date",
    description: "Add date",
    priority: 2,
    on:1,
    condition:
        function(job,cb) {
            cb(job && job.schedule);
        },
    consequence:
        function(cb) {
            this.date = new Date();
            cb();
        }
};