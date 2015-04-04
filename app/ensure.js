// utility for constructor dependency injection pattern
define(function() {

  return function(dependencyNames, dependencies) {
    var onlyDependencies = {};

    if (!dependencyNames instanceof Array) {
      throw new Error('dependency declaration expects first argument to be Array');
    }
    if (typeof(dependencies) !== 'object') {
      throw new Error('dependency declaration expects dependencies to be passed in as object');
    }

    for(var i = 0; i < dependencyNames.length; i++) {
      var expectedDependency = dependencyNames[i];
      var injectedDependency = dependencies[expectedDependency];
      if (injectedDependency === undefined || injectedDependency === null) {
        throw new Error('missing dependency:' + expectedDependency);
      } else {
        onlyDependencies[expectedDependency] = injectedDependency;
      }
    }

    return onlyDependencies;
  };
});
