require('./Fixtures/env.js');
var forms = require('../lib/forms.js');

var options = {'uri': process.env.FH_DOMAIN_DB_CONN_URL};

module.exports.setUp = function(test, assert){
  test.finish();
}

module.exports.tearDown = function(test, assert){
  console.log('tearDown');
  forms.tearDownConnection(options, function(err) {
    assert.isNull(err);
    test.finish();
  });
};

module.exports.testGetForm = function(test, assert){
  //console.log(forms);
  forms.getForms(options, function(err){
    console.log("meh");
    assert.isUndefined(err);
    test.finish();
  });
};