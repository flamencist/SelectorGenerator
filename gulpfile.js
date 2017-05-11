/*global __dirname*/
const gulp = require("gulp");
const Server = require("karma").Server;
const eslint = require("gulp-eslint");

gulp.task("test", function (done) {
    return new Server({
        configFile: __dirname + "/karma.conf.js",
        singleRun: true
    }, done).start();
});

gulp.task("eslint", function () {
    return gulp.src(["./selectorGenerator.js", "./tests/*.spec.js"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});
gulp.task("default", ["test"]);