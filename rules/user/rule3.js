module.exports = {
    id: 2,
    name: "End rule",
    description: "End rule execution",
    priority: 999999,
    on:1,
    condition:
        function(job,cb) {
            cb(job && job.date && !job.end);
        },
    consequence:
        function(cb) {
            this.end = true;
            cb();
        }
};