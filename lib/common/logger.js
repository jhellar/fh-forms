var util = require('util');
var _ = require('underscore');

function Logger(){
  var self = this;
  self.ERROR=0;
  self.WARNING=1;
  self.INFO=2;
  self.DEBUG=3;
 
  self.level = self.DEBUG;

  self.log = function (){
    var thisLevel = _.first(arguments) || self.ERROR;
    if(thisLevel <= self.level) {
      var args = _.rest(arguments);
      var strs = _.map(args, function(item) {return util.inspect(item);});
      console.log("" + thisLevel + ": ", strs.join(', '));
    }
  };
}

module.exports = new Logger();