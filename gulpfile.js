var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var babelify = require("babelify");
var browserify = require('browserify');
var watchify = require('watchify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var serve = require('gulp-serve');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');

/**
 * JavaScript bundling with browserify
 */

var b = browserify({ entries: 'src/app.js', cache: {}, packageCache: {} });
var w = watchify(b);

// Build the bundle for development
function buildDev() {
    return w.transform(babelify)
        .bundle()
        .pipe(source('bundle.js')) // gives streaming vinyl file object
        .pipe(buffer())
        .pipe(gulp.dest('src/'));
}

// Build the bundle once for development
gulp.task('browserify', buildDev);

// Build the bundle once for development and watch for source changes to trigger a rebuild
gulp.task('browserify:watch', ['browserify'], function() {
    w.on('update', function() {
        return buildDev();
    });
});

// Buld the bundle once for production
gulp.task('browserify:production', function() {
    return browserify({ entries: 'src/app.js', cache: {}, packageCache: {} })
        .transform(babelify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('build/'));
});

gulp.task('serve', serve('src'));

gulp.task('serve:production', serve('build'));

/**
 * Less compilation
 */

gulp.task('less', function() {
    return gulp.src('src/style.less')
        .pipe(less())
        .pipe(gulp.dest('src/'));
});

gulp.task('less:watch', ['less'], function() {
    return gulp.watch(['src/*.less', 'src/**/*.less'], ['less']);
});

gulp.task('less:production', function() {
    gulp.src('src/style.less')
        .pipe(less())
        .pipe(minifyCss())
        .pipe(gulp.dest('build/'));
});

gulp.task('build', ['browserify:production', 'less:production']);

gulp.task('default', ['browserify:watch', 'less:watch', 'serve']);
