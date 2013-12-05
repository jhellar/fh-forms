/* This is the infix file */    
  }

  var asyncLoader = {};  // used as "this" for async
  function require() {
    loadAsync.call(asyncLoader);
    return asyncLoader.async;
  }

  module.exports = function(){};  // add an exports for our normal formsRulesEngine so we can retrieve and put into our closure param

/* End of infix file */
