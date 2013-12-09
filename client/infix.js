/* This is the infix file */    

  var asyncLoader = module.exports;  // async has updated this, now save in our var, to that it can be returned from our dummy require
  function require() {
    return asyncLoader;
  }

/* End of infix file */