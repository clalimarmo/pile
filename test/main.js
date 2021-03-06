// based on https://github.com/kjbekkelund/karma-requirejs
var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/spec\.js$/.test(file)) {
      tests.push(file);
    }
    if (/test\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

requirejs.config({
  // Karma serves files from '/base'
  baseUrl: '/base/build/dev',

  paths: {
    'jquery': 'lib/jquery/dist/jquery',
    'react': 'lib/react/react-with-addons',
  },

  shim: {
  },

  deps: tests,

  // start test run, only after Require.js is done
  callback: window.__karma__.start
});
