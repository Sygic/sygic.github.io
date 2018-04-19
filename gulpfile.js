var gulp = require('gulp'),
    print = require('gulp-print').default,
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    change = require('gulp-change');

gulp.task('clear-demos', function () {
    return gulp.src("./documentation-demos/")
        .pipe(clean());
});

gulp.task('prepare-demos', ['clear-demos'], function () {
    gulp.src([
        "**/index.html",
        "**/styles.css",
        "**/script.js"
    ])
    .pipe(change(function (content) {
        content = content.replace('<link rel="stylesheet" href="styles.css" />', "");
        content = content.replace('api-key.js', "demo-api-key.js");
        return content.replace('<script src="script.js"></script>', "");
    }))
    .pipe(rename(function (path) {
        if (path.basename === "index" && path.extname === ".html") {
            path.basename = "demo";
        }
        if (path.basename === "styles" && path.extname === ".css") {
            path.basename = "demo";
        }
        if (path.basename === "script" && path.extname === ".js") {
            path.basename = "demo";
        }
    }))
    .pipe(gulp.dest("./documentation-demos/"))
    .pipe(print());
});

gulp.task('default', ['prepare-demos']);