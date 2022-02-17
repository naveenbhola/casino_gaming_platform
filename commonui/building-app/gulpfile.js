var base = '../../../';
var fs = require('fs');
var args = require('yargs').argv;
var browserSync = require('browser-sync');
var config = require('./gulp.config')(base);
var del = require('del');
var glob = require('glob');
var path = require('path');
var _ = require('lodash');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: true});
var shell = require('gulp-shell');
var runSequence = require('run-sequence');
var gulpsync = $.sync(gulp);
var protractor = $.protractor.protractor;
var port = process.env.PORT || config.defaultPort;

/**
 * yargs variables can be passed in to alter the behavior, when present.
 * Example: gulp serve-dev
 *
 * --verbose  : Various tasks will produce more output to the console.
 * --nosync   : Don't launch the browser with browser-sync when serving code.
 * --debug    : Launch debugger with node-inspector.
 * --debug-brk: Launch debugger and break on 1st line with node-inspector.
 * --startServers: Will start servers for midway tests on the test task.
 */

/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing);

gulp.task('default', $.shell.task(['gulp ' + args.gulptask]));

/**
 * vet the code and create coverage report
 * @return {Stream}
 */
gulp.task('vet', function () {
    log('Analyzing source with JSHint and JSCS');

    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.jshint.reporter('fail'))
        .pipe($.jscs());
});

/**
 * Create a visualizer report
 */
gulp.task('plato', function (done) {
    log('Analyzing source with Plato');
    log('Browse to /report/plato/index.html to see Plato results');

    startPlatoVisualizer(done);
});

gulp.task('styles', ['styles:base', 'styles:main']);

gulp.task('styles:base', function () {
    return $.merge(gulp.src(config.baseCSS), gulp.src(setBasePathToApp(config.baseCSSApp)))
        .pipe($.plumber()) // exit gracefully if something fails after this
        .pipe($.minifyCss())
        .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
        .pipe($.concat('lib.css'))
        .pipe(gulp.dest(config.dist));
});

gulp.task('styles:main', function () {
    log('Compiling Sass --> CSS');

    return gulp.src(config.sass)
        .pipe($.plumber()) // exit gracefully if something fails after this
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
        .pipe(gulp.dest(config.dist));
});

gulp.task('custom-fonts', function () {
    log('Copying fonts');

    return gulp.src(config.baseFonts)
        .pipe(gulp.dest(config.fontsDist));
});

/**
 * Copy fonts
 * @return {Stream}
 */
gulp.task('fonts', ['clean-fonts'], function () {
    log('Copying fonts');

    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.fontsDist));
});

/**
 * Compress images
 * @return {Stream}
 */
gulp.task('images', ['clean-images'], function () {
    log('Compressing and copying images');

    return gulp
        .src(config.images)
        .pipe($.imagemin({optimizationLevel: 4}))
        .pipe(gulp.dest(config.build + 'images'));
});

/**
 * Create $templateCache from the html templates
 * @return {Stream}
 */
gulp.task('templatecache', ['clean-code'], function () {
    log('Creating an AngularJS $templateCache');

    return gulp
        .src(config.htmltemplates)
        .pipe($.if(args.verbose, $.bytediff.start()))
        .pipe($.minifyHtml({empty: true}))
        .pipe($.if(args.verbose, $.bytediff.stop(bytediffFormatter)))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
        ))
        .pipe(gulp.dest(config.dist));
});

gulp.task('custom-scripts', ['custom-scripts:base', 'custom-scripts:main', 'webworker']);

gulp.task('custom-scripts:base', function () {
    return $.merge(gulp.src(config.optimized.libOrder), gulp.src(setBasePathToApp(config.optimized.libAppOrder)))
        .pipe($.concat(config.optimized.lib))
         .pipe($.uglify({
             mangle: false,
             compress: {
                 sequences:false
             }
         }))
        .pipe(gulp.dest(config.dist));
});

gulp.task('custom-scripts:main', function () {
    return gulp.src(config.optimized.jsOrder)
        .pipe($.replace(/#@(.*)@#/g, function (match, variable) {
            if (fs.existsSync(config.xlDeployConfig)) {
                var xlDeployConfig = require(config.xlDeployConfig);
                var val = xlDeployConfig[variable];
                if (val) {
                    return val;
                }
            }
            return match;
        }))
        .pipe($.babel({
            presets: "es2015",
            compact: false
        }))
        .pipe($.concat(config.optimized.app))
         .pipe($.uglify({
             mangle: false,
             compress: {
                 sequences:false
             }
         }))
        .pipe(gulp.dest(config.dist));
});

gulp.task('webworker', function () {
    return gulp.src(config.optimized.webWorkerOrder)
        .pipe($.concat(config.optimized.webWorkerBuild))
        .pipe($.babel({
            presets: "es2015",
            compact: false
        }))
        .pipe($.uglify({
            mangle: false,
            compress: {
                sequences:false
            }
        }))
        .pipe(gulp.dest(config.dist));
});


gulp.task('inject', ['styles', 'fonts', 'custom-fonts', 'templatecache', 'custom-scripts']);

/**
 * Run the spec runner
 * @return {Stream}
 */
gulp.task('serve-specs', ['build-specs'], function (done) {
    log('run the spec runner');
    serve(true /* isDev */, true /* specRunner */);
    done();
});

/**
 * Remove all files from the dist and reports folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean', function (done) {
    var delconfig = [].concat(config.dist, config.report);
    log('Cleaning: ' + $.util.colors.blue(delconfig));
    del(delconfig, done);
});

/**
 * Remove all fonts from the build folder
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-fonts', function (done) {
    clean(config.dist + 'fonts/**/*.*', done);
});

/**
 * Remove all images from the build folder
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-images', function (done) {
    clean(config.dist + 'images/**/*.*', done);
});

/**
 * Remove all styles from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-styles', function (done) {
    var files = [].concat(
        config.dist + '**/*.css',
        config.dist + 'styles/**/*.css'
    );
    return clean(files, done);
});

/**
 * Remove all js and html from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-code', function (done) {
    var files = [].concat(
        config.dist + '**/*.js',
        config.dist + 'js/**/*.js',
        config.dist + '**/*.html'
    );
    return clean(files, done);
});

/**
 * Run specs once and exit
 * To start servers and run midway specs as well:
 *    gulp test --startServers
 * @return {Stream}
 */
gulp.task('test', ['vet', 'templatecache'], function (done) {
    startTests(true /*singleRun*/, done);
});

/**
 * Run specs and wait.
 * Watch for file changes and re-run tests on each change
 * To start servers and run midway specs as well:
 *    gulp autotest --startServers
 */
gulp.task('autotest', function (done) {
    startTests(false /*singleRun*/, done);
});

/**
 * serve the dev environment
 * --debug-brk or --debug
 * --nosync
 */
gulp.task('serve-dev', ['inject'], function () {
    console.log(1);
    serve(true /*isDev*/);
});

/**
 * serve the build environment
 * --debug-brk or --debug
 * --nosync
 */
gulp.task('serve-build', ['build'], function () {
    serve(false /*isDev*/);
});

gulp.task('set-npm-cache', shell.task(
    [
        "echo 'Setting npm cache'",
        "cd ../../../"
    ]
));

gulp.task('remove-dist', ['set-npm-cache'], function () {
    return clean(config.dist);
});

gulp.task('prepare-build', function (cb) {
    runSequence('remove-dist', ['custom-scripts', 'styles', 'custom-fonts', 'fonts'], cb);
});

//copying assets through gulp tasks would be hard due to their async nature
gulp.task('copy-assets', ['prepare-build'], shell.task(
    [
        "echo 'Copying assets...'",
        "cd ../../../ && " +
        "pwd && " +
        "mkdir dist/dist/ && " +
        "mv -i dist/*.* dist/dist/ && " +
        "cp -rf index.html dist/ && " +
        "cp -rf app dist/ && " +
        "cd dist/app/ && find . -name '*.js' -delete && cd ../../ && " +
        "cp -rf fonts dist/ && " +
        "mkdir -p dist/bower_components/wdts-common-ui/ && " +
        "cp -rf bower_components/wdts-common-ui/assets dist/bower_components/wdts-common-ui/ && " +
        "cp -rf bower_components/wdts-common-ui/src dist/bower_components/wdts-common-ui/ && " +
        "cd dist/bower_components/wdts-common-ui/src/ && find . -name '*.js' -delete"
    ]
));

gulp.task('build-dev', shell.task(
    ["pwd && cd ../ && pwd && npm i && gulp build-dev"]
));

gulp.task('build-jenkins', function(cb){
    runSequence('build-dev', ['copy-assets'], cb)
});

/**
 * Bump the version
 * --type=pre will bump the prerelease version *.*.*-x
 * --type=patch or no flag will bump the patch version *.*.x
 * --type=minor will bump the minor version *.x.*
 * --type=major will bump the major version x.*.*
 * --version=1.2.3 will bump to a specific version and ignore other flags
 */
gulp.task('bump', function () {
    var msg = 'Bumping versions';
    var type = args.type;
    var version = args.ver;
    var options = {};
    if (version) {
        options.version = version;
        msg += ' to ' + version;
    } else {
        options.type = type;
        msg += ' for a ' + type;
    }
    log(msg);

    return gulp
        .src(config.packages)
        .pipe($.print())
        .pipe($.bump(options))
        .pipe(gulp.dest(config.client));
});

gulp.task('e2e', function (done) {
    var args = ['--baseUrl', 'http://localhost:3000'];
    gulp.src([base + 'tests/e2e/*.js'])
        .pipe(protractor({
            configFile: 'tests/protractor.conf.js',
            args: args
        }))
        .on('error', function (e) {
            throw e;
        });
});

/**
 * Re-load browserSync
 */
gulp.task('browserSyncReload', browserSync.reload);

/**
 * When files change, log it
 * @param  {Object} event - event that fired
 */
function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
    log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

/**
 * Delete all files in a given path
 * @param  {Array}   path - array of paths to delete
 * @param  {Function} done - callback when complete
 */
function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, {force: true}, done);
}

/**
 * serve the code
 * --debug-brk or --debug
 * --nosync
 * @param  {Boolean} isDev - dev or build mode
 * @param  {Boolean} specRunner - server spec runner html
 */
function serve(isDev, specRunner) {

    var debugMode = '--debug';
    var debug = args.debug;
    var nodeOptions = getNodeOptions(isDev);

    nodeOptions.nodeArgs = [debugMode + '=5858'];

    if (debug) {
        runNodeInspector();
        nodeOptions.nodeArgs = [debugMode + '=5858'];
    }

    if (args.verbose) {
        console.log(nodeOptions);
    }
    return $.nodemon(nodeOptions)
        .on('restart', ['vet'], function (ev) {
            log('*** nodemon restarted');
            log('files changed:\n' + ev);
            setTimeout(function () {
                browserSync.notify('reloading now ...');
                browserSync.reload({stream: false});
            }, config.browserReloadDelay);
        })
        .on('start', function () {
            log('*** nodemon started');
            startBrowserSync(isDev, specRunner);
        })
        .on('crash', function () {
            log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function () {
            log('*** nodemon exited cleanly');
        });
}

function getNodeOptions(isDev) {
    return {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [config.server]
    };
}

function runNodeInspector() {
    log('Running node-inspector.');
    log('Browse to http://localhost:8080/debug?port=5858');
    var exec = require('child_process').exec;
    exec('node-inspector');
}

/**
 * Start BrowserSync
 * --nosync will avoid browserSync
 */
function startBrowserSync(isDev, specRunner) {
    if (args.nosync || browserSync.active) {
        return;
    }

    log('Starting BrowserSync on port ' + port);

    // If build: watches the files, builds, and restarts browser-sync.
    // If dev: watches sass, compiles it to css, browser-sync handles reload
    if (isDev) {
        gulp.watch([config.sassFiles], gulpsync.sync(['styles:main', 'browserSyncReload']))
            .on('change', changeEvent);
        gulp.watch([config.optimized.jsOrder], gulpsync.sync(['custom-scripts:main', 'browserSyncReload']))
            .on('change', changeEvent);
        gulp.watch([config.html], ['browserSyncReload'])
            .on('change', changeEvent);
    }

    var options = {
        server: {
            baseDir: config.client
        },
        ghostMode: { // these are the defaults t,f,t,t
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'info',
        logPrefix: 'wdtspoc',
        notify: true,
        reloadDelay: 0 //1000
    };
    if (specRunner) {
        options.startPath = config.specRunnerFile;
    }

    browserSync(options);
}

/**
 * Start Plato inspector and visualizer
 */
function startPlatoVisualizer(done) {
    log('Running Plato');

    var files = glob.sync(config.plato.js);
    var excludeFiles = /.*\.spec\.js/;
    var plato = require('plato');

    var options = {
        title: 'Plato Inspections Report',
        exclude: excludeFiles
    };
    var outputDir = config.report + '/plato';

    plato.inspect(files, outputDir, options, platoCompleted);

    function platoCompleted(report) {
        var overview = plato.getOverviewReport(report);
        if (args.verbose) {
            log(overview.summary);
        }
        if (done) {
            done();
        }
    }
}

/**
 * Start the tests using karma.
 * @param  {boolean} singleRun - True means run once and end (CI), or keep running (dev)
 * @param  {Function} done - Callback to fire when karma is done
 * @return {undefined}
 */
function startTests(singleRun, done) {
    var child;
    var excludeFiles = [];
    var fork = require('child_process').fork;
    var karma = require('karma').server;
    var serverSpecs = config.serverIntegrationSpecs;

    if (args.startServers) {
        log('Starting servers');
        var savedEnv = process.env;
        savedEnv.NODE_ENV = 'dev';
        savedEnv.PORT = 8888;
        child = fork(config.nodeServer);
    } else {
        if (serverSpecs && serverSpecs.length) {
            excludeFiles = serverSpecs;
        }
    }

    karma.start({
        configFile: __dirname + '/karma.conf.js',
        exclude: excludeFiles,
        singleRun: !!singleRun
    }, karmaCompleted);

    function karmaCompleted(karmaResult) {
        log('Karma completed');
        if (child) {
            log('shutting down the child process');
            child.kill();
        }
        if (karmaResult === 1) {
            done('karma: tests failed with code ' + karmaResult);
        } else {
            done();
        }
    }
}

/**
 * Formatter for bytediff to display the size changes after processing
 * @param  {Object} data - byte data
 * @return {String}      Difference in bytes, formatted
 */
function bytediffFormatter(data) {
    var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
    return data.fileName + ' went from ' +
        (data.startSize / 1000).toFixed(2) + ' kB to ' +
        (data.endSize / 1000).toFixed(2) + ' kB and is ' +
        formatPercent(1 - data.percent, 2) + '%' + difference;
}

/**
 * Format a number as a percentage
 * @param  {Number} num       Number to format as a percent
 * @param  {Number} precision Precision of the decimal
 * @return {String}           Formatted perentage
 */
function formatPercent(num, precision) {
    return (num * 100).toFixed(precision);
}

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

/**
 * Show OS level notification using node-notifier
 */
function notify(options) {
    var notifier = require('node-notifier');
    var notifyOptions = {
        sound: 'Bottle',
        contentImage: path.join(__dirname, 'gulp.png'),
        icon: path.join(__dirname, 'gulp.png')
    };
    _.assign(notifyOptions, options);
    notifier.notify(notifyOptions);
}


function setBasePathToApp(files) {
    var arr = [];
    files.map(function (i) {
        arr.push(base + i);
    });
    return arr;
}

module.exports = gulp;
