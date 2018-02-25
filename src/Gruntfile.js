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

    grunt.registerTask('createDemoDataForSQL', 'Create the necessary sql data for the demo', function() {
      var done = this.async();
      var db = require('./models/db');
      const demoData = require('./models/demoData');
      db.sequelizeConnection.sync({force: true})
      .then(() =>demoData.initializeSqlDB(db,done));
      //.then(() => demoData.initializeElasticDB(db, done));
    });

    grunt.registerTask('putDemoImages', 'copy demo images from demoImages', function() {
      var fs = require('fs');
      var db = require('./models/db');
      var demoData = require('./models/demoData');

      var i;
      for (i = 1; i <= 13; i++) {
          if (!fs.existsSync('./public/files/events/' + i)) 
              fs.mkdirSync('./public/files/events/' + i);
            
      
            var j;
            for (j = 0; j< parseInt(demoData.events[i-1].pictures); j++) {
              let id = i;
              let num = j;
              fs.symlinkSync('../../../../demoImages/' + id + '/' + num,'public/files/events/' + id + '/' + num);
            }
          
      }

      if (!fs.existsSync('./public/files/providers/')) 
          fs.mkdirSync('./public/files/providers/');

      for (i = 1; i<=3; i++) {
          if (!fs.existsSync('./public/files/providers/' + i)) 
              fs.mkdirSync('./public/files/providers/' + i);
          
          fs.symlinkSync('../../../../demoImages/deko.jpg','public/files/providers/' + i + '/deko');
      }


      // var myVar = setInterval(function (){done(); clearInterval(myVar);}, 2000);
    });

    grunt.registerTask('createDemoDataForElastic', 'Create the necessary elastic data for the demo', function() {
      var done = this.async();
      var db = require('./models/db');
      const demoData = require('./models/demoData');
      demoData.initializeElasticDB(db,done);
    });

    grunt.registerTask('createDemoData', 'Create the necessary data for the demo', ['createDemoDataForSQL', 'createDemoDataForElastic', 'putDemoImages']);

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