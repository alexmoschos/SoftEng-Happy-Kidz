module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
      express: {
        options: {
          // Override defaults here
        },
        web: {
          options: {
            //what to run for the express server
            script: 'bin/www',
          }
        },
      },
      jshint : {
        options: {
            jshintrc: '.jshintrc'
        },
        gruntfile: {
            src: 'Gruntfile.js'
        },
        lib: {
            src: ['routes/*.js','models/*.js','*.js']
        },

      },
      watch: {
        frontend: {
          options: {
            livereload: true
          },
          files: [
            //watch files in public for change
            'public/**',
          ]
        },
        web: {
          files: [
            //watch source files for change
            'routes/*.js',
            'views/*.ejs',
            'models/*',
            'apis/*'
          ],
          tasks: [
            'express:web'
          ],
          options: {
            nospawn: true, //Without this option specified express won't be reloaded
            atBegin: true,
          }
        }
      },
      parallel: {
        web: {
          options: {
            stream: true
          },
          tasks: [{
            grunt: true,
            args: ['watch:frontend']
          },  {
            grunt: true,
            args: ['watch:web']
          }]
        },
      }
    });
    grunt.registerTask('web', 'launch webserver and watch tasks', [
      'parallel:web',
    ]);
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['web']);


    grunt.registerTask('seedDB', 'Create DBs and seed fake data', function() {
      var done = this.async();
      var db = require('./models/db');
      const seedDB = require('./models/seedfaker');
      db.sequelizeConnection.sync({force: true})
      .then(() =>seedDB.seedDatabase(db, done));
    });

    grunt.registerTask('cleanDB', 'remove relations from psql and drop the elastic index.', function () {
      var done = this.async();
      var db = require('./models/db');
      var elastic = require('./apis/elastic_interface');
      db.sequelizeConnection.sync({force: true})
      .then(() => {
        elastic.client.indices.delete({index:'events'})
        .then(() => {done();});
      });
    });
  };