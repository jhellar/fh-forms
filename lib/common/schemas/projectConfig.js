var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var CONSTANTS = require('../constants');

var default_config = {
  "client": {
    "sent_save_min": 5,
    "sent_save_max": 100,
    "sent_items_to_keep_list": [5, 10, 20, 30, 40, 50, 100],
    "targetWidth": 480,
    "targetHeight": 640,
    "quality": 75,
    "debug_mode": false,
    "logger" : false,
    "max_retries" : 0,
    "timeout" : 30,
    "log_line_limit": 300,
    "log_email": ""
  },
  "cloud": {
    "logging": {
      "enabled":false
    }
  }
};

module.exports = function(){
  return new Schema({
    "appId": {type: String, required: true, unique: true},
    "client": {
      "sent_save_min": {type : Number, required: false, default: default_config.client.sent_save_min},
      "sent_save_max": {type : Number, required: false, default: default_config.client.sent_save_max},
      "sent_items_to_keep_list": [{type : Number, required: false, default: default_config.client.sent_items_to_keep_list}],
      "targetWidth": {type : Number, required: false, default: default_config.client.targetWidth},
      "targetHeight": {type : Number, required: false, default: default_config.client.targetHeight},
      "quality": {type : Number, required: false, default: default_config.client.quality},
      "debug_mode": {type: Boolean, required: false, default: default_config.client.debug_mode},
      "logger" : {type: Boolean, required: false, default: default_config.client.logger},
      "max_retries" : {type : Number, required: false, default: default_config.client.max_retries},
      "timeout" : {type : Number, required: false, default: default_config.client.timeout},
      "log_line_limit": {type : Number, required: false, default: default_config.client.log_line_limit},
      "log_email": {type: String, default: default_config.client.log_email},
      "config_admin_user": [{type: String}],
      "log_level": {type:String,required:true, default:1},
      "log_levels": {type:Array, required: false, default:["error", "warning", "log", "debug"]}
    },
    "cloud": {
      "logging": {
        "enabled": {type: Boolean, required: false, default: default_config.cloud.logging.enabled}
      }
    }
  }, CONSTANTS.SCHEMA_OPTIONS);
};