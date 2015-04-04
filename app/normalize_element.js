define(function() {
  return function(element) {
    if (element.get instanceof Function) {
      return element.get(0);
    } else if (element instanceof window.HTMLElement) {
      return element;
    }

    throw 'element should be jquery result set or HTMLElement';
  };
});
