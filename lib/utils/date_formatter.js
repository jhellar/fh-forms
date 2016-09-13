var moment = require('moment');
var FORMAT_WITH_OFFSET = "YYYY-MM-DD HH:mm:ss [GMT]ZZ";


module.exports = {
  localWithOffset: function(date) {
    return new moment(date).format(FORMAT_WITH_OFFSET);
  }
};
