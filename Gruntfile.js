module.exports = function (grunt) {

    grunt.initConfig({
        jshint: {
            files: [
                'Gruntfile.js',
                'package.json',
                'src/**/*.js'
            ],
            options: {
            }
        },
        karma: {
            options: {
                frameworks: ['jasmine'],
                files: [
                    'lib/jquery-1.10.2.js',
                    'lib/angular-1.2.6/angular.js',
                    'lib/moment.js',
                    'lib/angular-1.2.6/angular-mocks.js',
                    'lib/jasmine-matchers.js',
                    'src/**/*.js',
                    'src/**/*.html'
                ],
                exclude: [
                    'src/**/index.html',
                    'src/**/demo.html'
                ],
                browsers: process.env.TRAVIS ? ['Firefox'] : ['Chrome'],
                ngHtml2JsPreprocessor: {
                    prependPrefix: '/',
                    // setting this option will create only a single module that contains templates
                    // from all the files, so you can load them all with module('templates')
                    moduleName: 'templates'
                }
            },
            tdd: {
                autoWatch: true,
                singleRun: false
            },
            ci: {
                autoWatch: false,
                singleRun: true
            }
        },
        html2js: {
            options: {
                module: 'templates',
                rename: function(moduleName) {
                    return '/src/' + moduleName;
                }
            },
            main: {
                src: ['src/**/*.html', '!src/**/index.html', '!src/**/demo.html'],
                dest: 'tmp/templates.js'
            }
        },
        connect: {
            server: {
                options: {
                    port: 8000,
                    base: '.',
                    keepalive: true,
                    middleware: function (connect, options) {
                        return [
                            connect.static(options.base),
                            connect.directory(options.base)
                        ];
                    }
                }
            }
        }
    });

    grunt.registerTask('default', ['jshint', 'karma:ci']);
    grunt.registerTask('tdd', ['karma:tdd']);
    grunt.registerTask('www', ['connect:server']);

    // load standard Grunt tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-html2js');

    // load supporting tasks for workshop preparation
    grunt.loadTasks('grunt');
};
