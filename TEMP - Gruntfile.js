module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-injector');

    var webAppBuildPath = 'target/warsource/';

    grunt.initConfig({
        // Injects JS and CSS files from src/main/webapp/assets and /src/main/webapp/directives folders into src/main/webapp/index.html
        injector: {
            options: {},
            local_dependencies: {
                options: {
                    template: 'src/main/webapp/index.html',
                    ignorePath: ['src/main/webapp/'],
                    addRootSlash: false
                },
                files: {
                    'src/main/webapp/index.html': ['src/main/webapp/assets/js/**/*.js', 'src/main/webapp/assets/css/**/*.css',
                            'src/main/webapp/directives/**/*.js', '!src/main/webapp/assets/js/cockpit.module.js']
                }
            }
        },

        // Injects Bower dependencies into src/main/webapp/index.html
        wiredep: {
            task: {
                src: ['src/main/webapp/index.html']
            }
        },

        // Automatically creates task configurations for concat, uglify and cssmin
        useminPrepare: {
            html: webAppBuildPath + 'index.html',
            options: {
                dest: webAppBuildPath
            }
        },

        uglify: {
            ASCIIOnly: true,
            ascii_only: true
        },

        // Replaces JS and CSS file references in index.html with minified versions (only in target folder)
        usemin: {
            html: webAppBuildPath + 'index.html'
        },

        uglify: {
            ASCIIOnly: true,
            ascii_only: true
        },

        // Copies the content of src/main/webapp to webAppBuildPath
        copy: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'src/main/webapp/',
                    src: ['**/*'],
                    dest: webAppBuildPath
                }]
            }
        },

        // Deletes files or directories
        clean: {
            // Delete files which are not needed in the .war (all files that have been concatenated/minified) and .tmp folder which usemin
            // creates
            build: ['.tmp/', webAppBuildPath + 'assets/css/*', webAppBuildPath + 'assets/js/*', webAppBuildPath + 'directives/**/*.js',
                    webAppBuildPath + 'vendor/', "!" + webAppBuildPath + 'assets/js/**.min.js',
                    "!" + webAppBuildPath + 'assets/css/**.min.css'],
            // Remove the webAppBuildPath folder after building the .war
            postbuild: [webAppBuildPath]
        },

        /*
         * Angular transformation. E.g. module.controller("controller", function($scope) {...}); => module.controller("controller",
         * ['$scope', function($scope) {...}]);
         */
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            build: {
                files: {
                    '.tmp/concat/assets/js/scripts.min.js': '.tmp/concat/assets/js/scripts.min.js'
                }
            }
        },

        // Runs 'bower install'
        bower: {
            install: {
                options: {
                    targetDir: 'src/main/webapp/vendor',
                    // https://github.com/yatskevich/grunt-bower-task/issues/134 Task might fail for certain bower packages if copy is not
                    // explicitly set to false (false should be default but somehow isn't)
                    copy: false,
                    prune: true
                }
            }
        }
    });

    grunt.registerTask('default', ['bower:install', 'wiredep', 'injector:local_dependencies']);

    // Run on every maven 'generate-sources' phase
    grunt.registerTask('wire', ['wiredep', 'injector:local_dependencies'])

    // Run when packaging on gitlab-ci master branch
    grunt.registerTask('build', ['bower:install', 'wiredep', 'injector:local_dependencies', 'copy:build', 'useminPrepare',
            'concat:generated', 'cssmin:generated', 'ngAnnotate:build', 'uglify:generated', 'usemin', 'clean:build']);
};
