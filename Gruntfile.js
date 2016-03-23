'use strict';
module.exports = function (grunt) {
  grunt.initConfig({
    concat: {
      app: {
        src: [
          'app/app.js',
          'app/authApp/**/*.js'
        ],
        dest: 'app/authApp/app.joint.js'
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask('build', ['concat:app']);
};
