module.exports = {
    name: "Job Action",
    description: "Execute job action",
    priority: 1,
    on:1,
    condition:
        function(job,cb) {
            cb(job && job.date && job.action == "log");
        },
    consequence:
        function(cb) {
            console.log("action job[" + this.id + "] test", this.date)
            cb();
        }
};