var path = require('path');

module.exports = function(grunt) {
  grunt.initConfig({
    asyncpkg: grunt.file.readJSON('node_modules/async/package.json'),
    rulespkg: grunt.file.readJSON('package.json'),
    meta: {},
    lint: {
      files: ['lib/common/forms-rules-engine.js']
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        sub: true,
        loopfunc: true
      },
      globals: {
        browser: true
      }
    },
    concat: {
      options: {
        banner: '/*! <%= rulespkg.name %> - v<%= rulespkg.version %> -  */\n' +
          '/*! <%= asyncpkg.name %> - v<%= asyncpkg.version %> -  */\n' +
          '/*! <%= grunt.template.today("yyyy-mm-dd") %> */\n',
      },
      dist: {
        src: [
          "client/prefix.js",
          "node_modules/async/lib/async.js",
          "lib/common/forms-rule-engine.js",
          "client/suffix.js"
        ],
        dest: 'dist/rulesengine.js',
        nonull: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask('default', 'concat');
};
