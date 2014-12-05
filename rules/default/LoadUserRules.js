var path = require('path'),
    name = path.basename(module.filename, ".js");

module.exports = {
    name: name,
    description: "Load user rules",
    priority: 0,
    on: 1,
    condition: function(job, cb) {
        cb(job && job.result && job.user && !job.user.rules);
    },
    consequence: function(cb) {
        var walk = require('walk'),
            files = walk.walk('./rules/user', {
                followLinks: false
            }),
            data = this;

        data.user.rules = data.user.rules || [];

        data.lastrule = name;

        files.on('file', function(root, stat, next) {
            if (stat.type == "file" && stat.name.match(/\.js$/gi)) {
                var thisRule = require(path.resolve(process.cwd(), root, stat.name));
                data.user.rules.push(thisRule);
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