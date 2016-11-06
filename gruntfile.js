module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass:{
            dist:{
                files:[{
                    expand:true,
                    cwd:'app/scss/',
                    src:'./*.scss',
                    dest:'./app/css',
                    ext:'.css'
                }]
            }
        },
        watch:{
            dist:{
                files:['app/scss/*.scss'],
                tasks:['sass:dist']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 默认被执行的任务列表。
    grunt.registerTask('default', ['watch']);

};