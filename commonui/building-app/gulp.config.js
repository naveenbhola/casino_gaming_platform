module.exports = function (client) {
    var server = client + 'server/';
    var clientApp = client + 'app/';
    var report = client + 'report/';
    var specRunnerFile = client + 'specs.html';
    var wiredep = require('wiredep');
    var bowerFiles = wiredep({devDependencies: true})['js'];
    var bower = {
        json: require('./bower.json'),
        directory: './bower_components/',
        ignorePath: '../..'
    };
    var nodeModules = './node_modules';

    var config = {
        /**
         * File paths
         */
        // all javascript that we want to vet
        alljs: [
            './app/**/*.js',
            './*.js'
        ],
        baseCSS: require('./vendor.base.css.json'),
        baseCSSApp: require(client + 'vendor.base-app.css.json'),
        baseFonts: [bower.directory + 'bootstrap/fonts/*'],
        client: client,
        dist: client + 'dist/',
        fonts: bower.directory + 'font-awesome/fonts/**/*.*',
        fontsDist: client + 'fonts/',
        html: client + '**/*.html',
        htmltemplates: clientApp + '**/*.html',
        images: client + 'bower_components/wdts-common-ui/assets/img/**/*.*',
        index: client + 'index.html',
        // app js, with no specs
        js: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js'
        ],
        jsOrder: [
            '**/app.module.js',
            '**/*.module.js',
            '**/*.js'
        ],
        report: report,
        sass: client + 'styles/styles.scss',
        sassFiles: client + 'styles/**/*.scss',
        server: server,

        stubsjs: [
            bower.directory + 'angular-mocks/angular-mocks.js',
            client + 'stubs/**/*.js'
        ],
        styles: client + 'styles/**/*',

        /**
         * optimized files
         */
        optimized: {
            app: 'app.min.js',
            lib: 'lib.min.js',
            libOrder: require('./vendor.base.js.json'),
            libAppOrder: require(client + 'vendor.base-app.js.json'),
            jsOrder: [
                '../release/wdts-common-ui-client.js',
                clientApp + '**/*.module.js',
                clientApp + '**/*.js',
                '!' + clientApp + '**/*.spec.js'
            ],
            webWorkerOrder: [
                '../src/client/app/blocks/logger/web-worker-logger.js'
            ],
            webWorkerBuild: 'web-worker-logger.js'
        },

        /**
         * plato
         */
        plato: {js: clientApp + '**/*.js'},

        /**
         * browser sync
         */
        browserReloadDelay: 1000,

        /**
         * template cache
         */
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'app.core',
                root: 'app/',
                standalone: false
            }
        },

        /**
         * Bower and NPM files
         */
        bower: bower,
        packages: [
            './package.json',
            './bower.json'
        ],

        /**
         * specs.html, our HTML spec runner
         */
        specRunner: client + specRunnerFile,
        specRunnerFile: specRunnerFile,

        /**
         * The sequence of the injections into specs.html:
         *  1 testlibraries
         *      mocha setup
         *  2 bower
         *  3 js
         *  4 spechelpers
         *  5 specs
         *  6 templates
         */
        testlibraries: [
            nodeModules + '/mocha/mocha.js',
            nodeModules + '/chai/chai.js',
            nodeModules + '/sinon-chai/lib/sinon-chai.js'
        ],
        specHelpers: [client + 'test-helpers/*.js'],
        specs: [clientApp + '**/*.spec.js'],
        serverIntegrationSpecs: [client + '/tests/server-integration/**/*.spec.js'],

        /**
         * Node settings
         */
        nodeServer: server + 'app.js',
        defaultPort: '8001',
        xlDeployConfig: client + 'xl-deploy.config.json'
    };

    /**
     * wiredep and bower settings
     */
    config.getWiredepDefaultOptions = function () {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };

    /**
     * karma settings
     */
    config.karma = getKarmaOptions();

    return config;

    ////////////////

    function getKarmaOptions() {
        var options = {
            files: [].concat(
                bowerFiles,
                config.specHelpers,
                clientApp + '**/*.module.js',
                clientApp + '**/*.js',
                config.dist + config.templateCache.file,
                config.serverIntegrationSpecs
            ),
            exclude: [],
            coverage: {
                dir: report + 'coverage',
                reporters: [
                    // reporters not supporting the `file` property
                    {type: 'html', subdir: 'report-html'},
                    {type: 'lcov', subdir: 'report-lcov'},
                    {type: 'text-summary'} //, subdir: '.', file: 'text-summary.txt'}
                ]
            },
            preprocessors: {}
        };
        options.preprocessors[clientApp + '**/!(*.spec)+(.js)'] = ['coverage'];
        return options;
    }
};
