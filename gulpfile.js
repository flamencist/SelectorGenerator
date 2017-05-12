/*global __dirname*/
const gulp = require("gulp");
const Server = require("karma").Server;
const eslint = require("gulp-eslint");
const concat = require("gulp-concat-util");
const gulpSync = require("gulp-sync")(gulp);
const os = require("os");
const fs = require("fs");
const pkg = require("./package.json");
const shim = "./src/shim.js";
const src = [
    "./src/dom-node-path-step.js",
    "./src/css-escaper.js",
    "./src/selector-generator.js"
];

gulp.task("test", function (done) {
    return new Server({
        configFile: __dirname + "/karma.conf.js",
        singleRun: true
    }, done).start();
});
gulp.task("clean", function(){});
gulp.task("concat", function(){
    return gulp.src(src.concat(["./src/no-conflict.js"]))
        .pipe(concat(pkg.name + ".js", {
            sep: os.EOL + os.EOL,
            process: function (src, filepath) {//eslint-disable-line no-unused-vars
                var lines = src.split(os.EOL);
                for (var i = 0; i < lines.length; i++) {
                    lines[i] = "	 " + lines[i];
                }
                return lines.join(os.EOL);
            }
        }))
        .pipe(concat.header("/* selector-generator (ver. " + pkg.version + "). https://github.com/flamencist/SelectorGenerator */" + os.EOL + os.EOL +
            "(function () {" + os.EOL + os.EOL +
            "  \"use strict\";" + os.EOL + os.EOL +
            "  var exports = {};" + os.EOL + os.EOL +
            "  if (!(\"version\" in exports)) {" + os.EOL +
            "    exports.version = \"" + pkg.version + "\";" + os.EOL +
            "  }" + os.EOL + os.EOL +
            "  " + fs.readFileSync(shim) + os.EOL + os.EOL +
            " (function(exports, _){"
            + os.EOL + os.EOL))
        .pipe(concat.footer(os.EOL + os.EOL +
            "	} (exports, shim));" +
            os.EOL + os.EOL +
            " exports.SelectorGenerator.version = exports.version;" + os.EOL +
            " exports.SelectorGenerator.noConflict = exports.noConflict;" + os.EOL +
            " window.SelectorGenerator = exports.SelectorGenerator;" +
            os.EOL + os.EOL +
            "} ());" +
            os.EOL + os.EOL))
        .pipe(gulp.dest("./"));
});

gulp.task("eslint", function () {
    return gulp.src(["./src/**/*.js", "./tests/*.spec.js"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});
gulp.task("default", gulpSync.sync(["clean","concat","test"]));

gulp.task("watch-test",function(){
    return gulp.watch(["./src/**/*.js"], gulpSync.sync(["clean","concat","test"]));
});