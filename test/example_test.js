define(function(require) {
  var exampleModule = require('example');

  it('exists', function() {
    expect(exampleModule.helloworld).to.be.true;
  });
});
