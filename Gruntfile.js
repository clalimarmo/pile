module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-react');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    bower: {
      install: {
        options: {
          targetDir: 'build/dev/lib',
        }
      },
    },

    connect: {
      options: {
        port: grunt.option('port') || 3333,
        keepalive: grunt.option('keepalive') || false,
      },
      dev: {
        options: {
          base: 'build/dev',
        },
      },
      dist: {
        options: {
          base: 'build/dist',
        },
      },
    },

    jshint: {
      options: {
        bitwise: true,
        curly: true,
        eqeqeq: true,
        forin: true,
        freeze: true,
        immed: true,
        indent: 2,
        latedef: true,
        noarg: true,
        nonbsp: true,
        sub: true,
        trailing: true,
        undef: true,
        unused: true,
      },
      infrastructure: {
        src: [
          'package.json',
          'Gruntfile.js',
          'karma.conf.js',
        ],
        options: {
          globals: {
            module: false,
          },
        },
      },
      app: {
        src: [
          'app/**/*.js',
        ],
        options: {
          globals: {
            define: false,
            window: false,
            requirejs: false,
            require: false,
            console: false,
            setInterval: false,
            clearInterval: false,
          },
        },
      },
      tests: {
        src: [
          'test/**/*.js',
        ],
        options: {
          expr: true, //permit chai matchers like `expect(something).to.be.ok;`
          globals: {
            assert: false,
            beforeEach: false,
            context: false,
            define: false,
            describe: false,
            expect: false,
            it: false,
            requirejs: false,
            window: false,
            console: false,
          },
        },
      },
    },

    clean: ['build'],

    copy: {
      dev: {
        files: [
          {src: 'app/index.html', dest: 'build/dev/index.html'},
          {expand: true, cwd: 'app', src: ['**/*.js'], dest: 'build/dev'},
        ],
      },
      dist: {
        files: [
          {src: 'app/index.html', dest: 'build/dist/index.html'},
          {src: 'build/dev/lib/requirejs/require.js', dest: 'build/dist/lib/requirejs/require.js'},
        ]
      },
    },

    react: {
      dev: {
        files: [
          {expand: true, cwd: 'app', src: ['**/*.jsx'], dest: 'build/dev', ext: '.js'},
        ],
      }
    },

    sass: {
      dev: {
        files: [
          {expand: true, cwd: 'app/styles', src: ['**/*.scss'], dest: 'build/dev/styles', ext: '.css'}
        ],
      },
      dist: {
        files: [
          {expand: true, cwd: 'app/styles', src: ['**/*.scss'], dest: 'build/dist/styles', ext: '.css'}
        ],
      },
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      },
    },

    watch: {
      build: {
        files: [
          'app/**/*.html',
          'app/**/*.js',
          'app/**/*.jsx',
          'test/**/*.js',
          'package.json',
          'Gruntfile.js',
        ],
        tasks: ['build:dev', 'karma', 'jshint'],
      },
      sass: {
        files: ['app/styles/**/*.scss'],
        tasks: ['sass:dev'],
      },
      bower: {
        files: [
          'bower.json',
        ],
        tasks: ['clean', 'build:dev', 'test', 'jshint'],
      },
    },

    requirejs: {
      compile: {
        options: {
          name: 'main',
          mainConfigFile: 'build/dev/main.js',
          out: 'build/dist/main.js',
        },
      },
    },
  });

  grunt.registerTask(
    'default',
    ['build:dev', 'karma', 'jshint']
  );

  grunt.registerTask(
    'dev',
    'automatically rebuild and test site on change, and start local server for build',
    ['build:dev', 'connect:dev', 'watch']
  );

  grunt.registerTask(
    'build:dev',
    'build the source, install third party libs, yield client side app, in full',
    ['clean', 'copy', 'react', 'sass:dev', 'bower:install']
  );

  grunt.registerTask(
    'build:dist',
    'build the app for production',
    ['build:dev', 'requirejs', 'sass:dist', 'copy:dist']
  );
};
