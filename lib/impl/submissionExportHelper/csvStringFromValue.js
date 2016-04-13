var _ = require('underscore');
/**
 * csvStringFromValue - returns the 'csv' version of the string - see CSV 'specification': http://tools.ietf.org/html/rfc4180
 *
 * @param  {string} val Value to return as a CSV entry
 * @return {type}     description
 */
module.exports = function csvStringFromValue(val) {
  if(val === null || val === undefined) {
    return '';
  }
  if(_.isNumber(val)) {
    return val;
  }
  if(_.isArray(val)) {
    val = val.join(',');
  } else if(_.isObject(val)) {
    var ret = '';
    for(var p in val) {
      if(ret !== '') {
        ret = ret + ',';
      }
      ret = ret + val[p];
    }
    val = ret;
  }

  var quoteStr = false;
  if(val.indexOf(',') !== -1) {
    quoteStr = true;
  }
  if(val.indexOf('"') !== -1) {
    quoteStr = true;
    val = val.replace(/"/g, '""');
  }

  if(quoteStr === true) {
    val = '"' + val + '"';
  }

  val = val.replace(/\r?\n|\r/g, " ");
  return val;
};
