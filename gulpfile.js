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
var stylus = require('gulp-stylus');
var through = require('through2');
var preprocessify = require('preprocessify');

// KARMA
var KarmaServer = require('karma').server;
var karmaConfigParser = require('karma/lib/config').parseConfig;

var banner = [
'/**',
' * Toast UI Colorpicker',
' * @version {{version}}',
' */\n',
].join('\n');

gulp.task('default', function(done) {
    var config = karmaConfigParser(path.resolve('karma.conf.js'), {});
    config.singleRun = true;

    KarmaServer.start(config, function(exitCode) {
        gutil.log('Karma has exited with ' + exitCode);
        done();
        process.exit(exitCode);
    });
});

gulp.task('connect', function() {
    connect.server({
        livereload: true,
        port: 8090
    });
    gulp.watch([
        './src/**/*',
        './index.js',
        './demo/**/*.html',
        './demo-dev/**/*.html'
    ], ['bundle-dev']);
});

function bundle(outputPath, isProduction) {
    var pkg = require('./package.json');
    var versionHeader = banner.replace('{{version}}', pkg.version);

    if (isProduction) {
        gutil.log(gutil.colors.yellow('<< Bundling for Production >>'));
    }

    outputPath = outputPath || 'dist';

    gulp.src('./src/styl/**/*.styl')
        .pipe(stylus())
        .pipe(insert.prepend(versionHeader))
        .pipe(gulp.dest(outputPath))
        .pipe(isProduction ? rename({extname: '.min.css'}) : gutil.noop())
        .pipe(isProduction ? gulp.dest(outputPath) : gutil.noop());

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
        .transform(preprocessify({ENV: (isProduction ? 'RELEASE' : 'DEBUG')}))
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
    var config = karmaConfigParser(path.resolve('karma.conf.local.js'), {});

    KarmaServer.start(config, function(exitCode) {
        gutil.log('Karma has exited with ' + exitCode);
        done();
        process.exit(exitCode);
    });
});

