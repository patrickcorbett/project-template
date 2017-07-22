module.exports = function(grunt) {
	
	grunt.loadNpmTasks('grunt-bower-task');
	
	grunt.initConfig({
		
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
	
	grunt.registerTask('default',['bower:install']);
};
