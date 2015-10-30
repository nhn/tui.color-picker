/* eslint vars-on-top:0 no-console:0 */
'use strict';
var path = require('path');
var gulp = require('gulp');
var connect = require('gulp-connect');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var insert = require('gulp-insert');
var through = require('through2');
var KarmaServer = require('karma').Server;

var banner = [
'/** _____               _     _   _ ___    ____      _                  _      _',
' * |_   _|__   __ _ ___| |_  | | | |_ _|  / ___|___ | | ___  _ __ _ __ (_) ___| | _____ _ __',
' *   | |/ _ \\ / _` / __| __| | | | || |  | |   / _ \\| |/ _ \\| \'__| \'_ \\| |/ __| |/ / _ \\ \'__|',
' *   | | (_) | (_| \\__ \\ |_  | |_| || |  | |__| (_) | | (_) | |  | |_) | | (__|   <  __/ |',
' *   |_|\\___/ \\__,_|___/\\__|  \\___/|___|  \\____\\___/|_|\\___/|_|  | .__/|_|\\___|_|\\_\\___|_|',
' *                                                               |_|',
' * @version {{version}}',
' */\n',
].join('\n');

gulp.task('default', function(done) {
    new KarmaServer({
        configFile: path.join(__dirname, 'karma.conf.js'),
        singleRun: true
    }, done).start();
});

gulp.task('connect', function() {
    connect.server({
        livereload: true
    });
    gulp.watch([
        './src/**/*',
        './index.js',
        './demo/**/*.html'
    ], ['bundle-dev']);
});

function bundle(outputPath, isProduction) {
    var pkg = require('./package.json');
    var versionHeader = banner.replace('{{version}}', pkg.version);

    if (isProduction) {
        gutil.log(gutil.colors.yellow('<< Bundling for Production >>'));
    }

    outputPath = outputPath || 'dist';

    // gulp.src([
    //         'src/css/common.css',
    //         'src/css#<{(||)}>#*.css'
    //     ])
    //     .pipe(concat('calendar.css'))
    //     .pipe(insert.prepend(versionHeader))
    //     .pipe(gulp.dest(outputPath))
    //     .pipe(isProduction ? cssmin() : gutil.noop())
    //     .pipe(isProduction ? rename({extname: '.min.css'}) : gutil.noop())
    //     .pipe(insert.prepend(versionHeader))
    //     .pipe(isProduction ? gulp.dest(outputPath) : gutil.noop());

    var b = browserify({
        entries: 'index.js',
        debug: true
    });

    var added = false;
    function prependTransform() {
        return through(function (buf, enc, next) {
            if (!added) {
                this.push(versionHeader + buf.toString('utf8'));
                added = true;
            } else {
                this.push(buf.toString('utf8'));
            }
            next();
        });
    }

    if (isProduction) {
        b.ignore('tui-code-snippet');
    }

    return b.transform(prependTransform)
        .bundle()
        .on('error', function(err) {
            console.log(err.message);
            this.emit('end');
        })
        .pipe(source('colorpicker.js'))
        .pipe(buffer())
        .pipe(gulp.dest(outputPath))
        .pipe(isProduction ? uglify({compress:{}}) : gutil.noop())
        .pipe(isProduction ? rename({extname: '.min.js'}) : gutil.noop())
        .pipe(isProduction ? insert.prepend(versionHeader) : gutil.noop())
        .pipe(isProduction ? gulp.dest(outputPath) : gutil.noop())
        .pipe(connect.reload());
}

gulp.task('bundle-dev', function() {
    return bundle('build', false);
});

gulp.task('bundle', function() {
    return bundle('dist', gutil.env.production);
});

gulp.task('dev', function() {
    gulp.watch(['index.js', 'src/**/*.js'], ['bundle']);
});

gulp.task('test-w', function(done) {
    new KarmaServer({
        configFile: path.join(__dirname, 'karma.conf.local.js')
    }, done).start();
});

