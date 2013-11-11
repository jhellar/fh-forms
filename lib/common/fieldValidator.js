var async = require('async');

module.exports = function (fieldDefinition, fieldSubmission){

  return{
    "validate" : function(cb){


      //console.log("About to validate " + JSON.stringify(fieldSubmission) + " against " + JSON.stringify(fieldDefinition));
      fieldDefinition = JSON.parse(JSON.stringify(fieldDefinition));
      fieldSubmission = JSON.parse(JSON.stringify(fieldSubmission));

      if(fieldDefinition._id !== fieldSubmission.fieldId){
        return cb(new Error("The Id of the field definition does not match the id of the field submitted. Aborting."));
      }

      if(!fieldSubmission.fieldValues){
        return cb(new Error("No field values submitted for field " + fieldDefinition.name + ". Submission: " + JSON.stringify(fieldSubmission)));
      }

      if(fieldDefinition.fieldOptions === undefined || fieldDefinition.fieldOptions === null){
        return cb();
      }

      var submissionLength = 0;

      if(Array.isArray(fieldSubmission.fieldValues)){
        submissionLength = fieldSubmission.fieldValues;
      } else {
        submissionLength = 1;
      }

      if(fieldDefinition.fieldOptions.definition){
        if(fieldDefinition.fieldOptions.definition.minRepeat){
          if(submissionLength < fieldDefinition.fieldOptions.definition.minRepeat){
            return cb(new Error("Expected min of " + fieldDefinition.fieldOptions.definition.minRepeat + " values for field " + fieldDefinition.name + " but got " + submissionLength));
          }
        }


        if (fieldDefinition.fieldOptions.definition.maxRepeat){
          if(submissionLength > fieldDefinition.fieldOptions.definition.maxRepeat){
            return cb(new Error("Expected max of " + fieldDefinition.fieldOptions.definition.maxRepeat + " values for field " + fieldDefinition.name + " but got " + submissionLength));
          }
        }
      }

      var self = this;

      //console.log("DEFINITION", fieldDefinition);
      if(self[fieldDefinition.type]){
        if(Array.isArray(fieldSubmission.fieldValues)){
          async.eachSeries(fieldSubmission.fieldValues, function(fieldValue, cb){
            self[fieldDefinition.type](fieldValue, function(err){
              cb(err);
            });
          }, cb);
        } else {
          self[fieldDefinition.type](fieldSubmission.fieldValues, function(err){
            cb(err);
          });
        }
      } else {
        return cb(new Error("Invalid Field Type " + fieldDefinition.type));
      }
    },
    "text" : function(fieldValue, cb){
      //Validating text Entry
      var self = this;
      //console.log("In validate text");
      return self.checkString(fieldValue, cb);
    },
    "textarea" : function(fieldValue, cb){
      //Validating textarea Entry
      var self = this;
      return self.checkString(fieldValue, cb);
    },
    "number" : function(fieldValue, cb){
      var self = this;

      fieldValue = fieldValue.values;
      //console.log("MEHHHH",fieldValue);


      if(typeof(fieldValue) !== "number"){
        return cb(new Error("Expected number but got " + typeof(fieldValue)));
      }

      if(fieldDefinition.fieldOptions.validation.min){
        if(fieldValue < fieldDefinition.fieldOptions.validation.min){
          return cb(new Error("Expected minimum Number " + fieldDefinition.fieldOptions.validation.min + " but submission is " + fieldValue + ". Submitted number: " + fieldValue));
        }
      }

      if (fieldDefinition.fieldOptions.validation.max){
        if(fieldValue > fieldDefinition.fieldOptions.validation.max){
          return cb(new Error("Expected maximum Number " + fieldDefinition.fieldOptions.validation.max + " but submission is " + fieldValue + ". Submitted number: " + fieldValue));
        }
      }

      return cb();
    },
    "emailAddress" : function(fieldValue, cb){
      //Check email format.
      var self = this;
      if(typeof(fieldValue) !== "string"){
        return cb(new Error("Expected string but got" + typeof(fieldValue)));
      }

      if(fieldValue.match("/[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/") === null){
        return cb(new Error("Invalid email address format for value" + fieldValue));
      } else {
        cb();
      }
    },
    "select" : function(fieldValue, cb){
      //Should be a single (selectName: val) //TODO Functionalise this
      //console.log("IN Select CHECK: " + fieldValue);
      var self = this;
      self.checkObject("selectChoices", 1, fieldValue, function(err){
        if(err) return cb(err);

        if(fieldValue.values){
          if(Array.isArray(fieldValue.values)){
            self.checkSubmissionSize(1, 1, fieldValue.values, function(err){
              if(err) return cb(err);


              self.checkObject("selectChoices", 2, fieldValue.values[0], function(err){
                if(err) return cb(err);

                self.checkKeyValExistsInFormDefinition("selectChoices", fieldValue.values[0].key, fieldValue.values[0].value, cb);
              });
            });
          } else {
            return cb(new Error("Expected submission values array. Got none."));
          }
        } else {
          return cb(new Error("Expected submission values array. Got none."));
        }
      });
    },
    "radio" : function(fieldValue, cb){
      //Should be a single (selectName: val) //TODO Functionalise this
      //console.log("IN RADIO CHECK: " + fieldValue);
      var self = this;
      self.checkObject("radio", 1, fieldValue, function(err){
        if(err) return cb(err);

        if(fieldValue.values){
          if(Array.isArray(fieldValue.values)){
            self.checkSubmissionSize(1, 1, fieldValue.values, function(err){
              if(err) return cb(err);


              self.checkObject("radio", 2, fieldValue.values[0], function(err){
                if(err) return cb(err);

                 self.checkKeyValExistsInFormDefinition("radioChoices", fieldValue.values[0].key, fieldValue.values[0].value, cb);
              });
            });
          } else {
            return cb(new Error("Expected submission values array. Got none."));
          }
        } else {
          return cb(new Error("Expected submission values array. Got none."));
        }
      });
    },
    "checkbox" : function(fieldValue, cb){
      var self = this; //TODO Functionalise this
      self.checkObject("checkbox", 1, fieldValue, function(err){
          if(err) return cb(err);

        if(fieldValue.values){
          if(Array.isArray(fieldValue.values)){

            var min = fieldDefinition.fieldOptions.validation.min || 0;
            var max = fieldDefinition.fieldOptions.validation.max || undefined;
            self.checkSubmissionSize(min, max, fieldValue.values, function(err){
              if(err) return cb(err);


              async.eachSeries(fieldValue.values, function(checkSelection, cb){
                self.checkObject("checkbox", 2, checkSelection, function(err){
                  if(err) return cb(err);

                   self.checkKeyValExistsInFormDefinition("checkboxChoices", checkSelection.key, checkSelection.value, cb);
                });
              }, cb);
            });
          } else {
            return cb(new Error("Expected submission values array. Got none."));
          }
        } else {
          return cb(new Error("Expected submission values array. Got none."));
        }
      });
    },
    "locationLatLong" : function(fieldValue, cb){
      var self = this;
      self.checkObject("locationLatLong", 1, fieldValue, function(err){
        if(err) return cb(err);

        if(fieldValue.values){
          if(Array.isArray(fieldValue.values)){

            var min = 2;
            var max = 2;
            self.checkSubmissionSize(min, max, fieldValue.values, function(err){
              if(err) return cb(err);

              async.eachSeries(fieldValue.values, function(keyVal, cb){
                if(keyVal.key === "lat" || keyVal.key === "long"){
                  if(isNaN(parseFloat(keyVal.value))){
                    return cb(new Error("Invalid "+ keyVal.key +" value " + keyVal.value));
                  } else {
                    return cb();
                  }
                } else {
                  return cb(new Error("Invalid latitude or longitude value keys " + key));
                }
              }, cb);
            });
          } else {
            return cb(new Error("Expected submission values array. Got none."));
          }
        } else {
          return cb(new Error("Expected submission values array. Got none."));
        }
      });
    },
    "locationNorthEast" : function(fieldValue, cb){
      var self = this;
      self.checkObject("locationNorthEast", 1, fieldValue, function(err){
        if(err) return cb(err);

        if(fieldValue.values){
          if(Array.isArray(fieldValue.values)){

            var min = 2;
            var max = 2;
            self.checkSubmissionSize(min, max, fieldValue.values, function(err){
              if(err) return cb(err);

              async.eachSeries(fieldValue.values, function(keyVal, cb){ //TODO Functionalise this
                if(keyVal.key === "northings" || keyVal.key === "eastings"){
                  if(typeof(keyVal.value) === "number"){
                    return cb();
                  } else {
                    return cb(new Error("Invalid "+ keyVal.key +" value " + keyVal.value));
                  }
                  return cb();
                } else {
                  return cb(new Error("Invalid northings or eastings value keys " + key));
                }
              }, cb);
            });
          } else {
            return cb(new Error("Expected submission values array. Got none."));
          }
        } else {
          return cb(new Error("Expected submission values array. Got none."));
        }
      });
    },
    "locationMap" : function(fieldValue, cb){
      var self = this;
      self.locationLatLong(fieldValue, cb);
    },
    "photo" : function(fieldValue, cb){
      var self = this;
      self.checkFilePlaceholder(fieldValue,cb);
    },
    "signature" : function(fieldValue, cb){
      var self = this;
      self.checkFilePlaceholder(fieldValue,cb);
    },
    "file" : function(fieldValue, cb){
      var self = this;
      self.checkFilePlaceholder(fieldValue,cb);
    },
    "date" : function(fieldValue, cb){
      var self = this;

      var testDate = new Date(fieldValue);

      if(testDate.toString() === "Invalid Date"){
        return cb(new Error("Invalid date string " + fieldValue));
      } else {
        cb();
      }
    },
    "time" : function(fieldValue, cb){
      var self = this;

      var testDate = new Date(fieldValue);

      if(testDate.toString() === "Invalid Date"){
        return cb(new Error("Invalid time string " + fieldValue));
      } else {
        cb();
      }
    },
    "dateTime" : function(fieldValue, cb){
      var self = this;

      var testDate = new Date(fieldValue);

      if(testDate.toString() === "Invalid Date"){
        return cb(new Error("Invalid dateTime string " + fieldValue));
      } else {
        cb();
      }
    },
    "sectionBreak" : function(fieldValue, cb){
      var self = this;
      return cb(new Error("Should not submit section breaks."));
    },
    "checkString" : function(fieldValue, cb){
      var self = this;
      ////console.log("In checkString for " + fieldValue);
      if(typeof(fieldValue) !== "string"){
        return cb(new Error("Expected string but got" + typeof(fieldValue)));
      }
      ////console.log(fieldValue.length);
      if(fieldDefinition.fieldOptions.validation.min){
        if(fieldValue.length < fieldDefinition.fieldOptions.validation.min){
          return cb(new Error("Expected minimum string length of " + fieldDefinition.fieldOptions.validation.min + " but submission is " + fieldValue.length + ". Submitted val: " + fieldValue));
        }
      }

      if (fieldDefinition.fieldOptions.validation.max){
        if(fieldValue.length > fieldDefinition.fieldOptions.validation.max){
          return cb(new Error("Expected maximum string length of " + fieldDefinition.fieldOptions.validation.max + " but submission is " + fieldValue.length + ". Submitted val: " + fieldValue));
        }
      }

      return cb();
    },
    "checkKeyValExistsInFormDefinition" : function(fieldName, keyToCheck, valToCheck, cb){
      var self = this;
      var definitionOptions = fieldDefinition.fieldOptions.definition[fieldName];

      var definitionFilteredOptions = definitionOptions.filter(function(option){
        //console.log(option);
        for(var key in option){
          //console.log(key, typeof(key), keyToCheck);
          return key === keyToCheck;
        }
      });



      if(definitionFilteredOptions.length === 1){
        var valDefn;

        if(fieldName === "checkboxChoices"){
          valDefn = definitionFilteredOptions[0][keyToCheck].value;
        } else {
          valDefn = definitionFilteredOptions[0][keyToCheck]
        }

        if(valDefn === valToCheck){
          return cb();
        } else {
          return cb(new Error("Invalid value: " + valToCheck + " submitted for key " + keyToCheck));
        }
      } else {
        return cb(new Error("Invalid number of keys match radioChoice key " + keyToCheck + ". Num found: " + definitionFilteredOptions.length));
      }
    },
    "checkObject": function(fieldType, maxKeys, fieldValue, cb){
      var self = this;
      //console.log(typeof(fieldValue));
      if(typeof(fieldValue) !== "object"){
        return cb(new Error("Invalid format for " + fieldType + " button submission. "));
      }

      var keys = [];
      var numKeys = 0;
      for(var key in fieldValue){
        numKeys += 1;
        keys.push(key);
      }

      if(numKeys === 0){
        return cb(new Error("Invalid format for " + fieldType + " submission. Keys " + maxKeys + "  " + JSON.stringify(fieldValue)));
      }

      if(numKeys > maxKeys){
        return cb(new Error("Invalid format for " + fieldType + " submission. Keys " + maxKeys + "  " + JSON.stringify(fieldValue)));
      }

      return cb();

    },
    "checkSubmissionSize" : function(min, max, submissions, cb){
      var self = this;
      if(submissions.length < min){
        return cb(new Error("Expected minimum number of entries to be " + min + " but got " + submissions.length));
      }

      if(max){
        if(submissions.length > max){
          return cb(new Error("Expected maximum number of entries to be " + max + " but got " + submissions.length));
        }
      }

      return cb();
    },
    "checkFilePlaceholder" : function(fileEntry, cb){
      var self = this;
      if(typeof(fileEntry) !== "string"){
        return cb(new Error("Expected string but got" + typeof(fileEntry)));
      }

      if(fileEntry.indexOf("filePlaceHolder") > -1){//TODO abstract out to config
        return cb();
      } else {
        return cb(new Error("Invalid file placeholder text" + fileEntry));
      }
    }
  };
};