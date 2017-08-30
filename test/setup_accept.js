var setup = require('./setup');
var assert = require('assert');

module.exports.before = function (finish) {

  setup.initDatabase(assert, function (err) {
    assert.ok(!err);

    finish();
  });

}

module.exports.after = function (finish) {
  setup.cleanDatabase(assert, function (err) {
    if (err) console.log(err);
    finish();
  });
}