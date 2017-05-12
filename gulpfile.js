/*global __dirname*/
const gulp = require("gulp");
const Server = require("karma").Server;
const eslint = require("gulp-eslint");
const concat = require("gulp-concat-util");
const gulpSync = require("gulp-sync")(gulp);
const del = require("del");
const os = require("os");
const fs = require("fs");
const pkg = require("./package.json");
const src = [
    "./src/shim.js",
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
gulp.task("clean", function(){
    return del([pkg.name + ".js"]);
});
gulp.task("concat", function(){
    return gulp.src(src)
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
            " (function(exports){ " +
             os.EOL +
            "  function SelectorGenerator(options){" +
             os.EOL + os.EOL))
        .pipe(concat.footer(os.EOL + os.EOL +
            "  return new SelectorGenerator(options);" +
            os.EOL +
            " }" +
            os.EOL +
            "  exports.SelectorGenerator = SelectorGenerator;" +
            os.EOL +
            " } (exports));" +
            os.EOL + os.EOL +
            "for(var key in exports){ if(exports.hasOwnProperty(key)){ exports.SelectorGenerator[key] = exports[key]; }}" + os.EOL +
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
    return gulp.watch(["./src/**/*.js", "./tests/*.spec.js"], gulpSync.sync(["clean","concat","test"]));
});