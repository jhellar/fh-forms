var async = require('async');

module.exports = function (fieldDefinition, fieldSubmission){

  return{
    "validate" : function(cb){


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
        submissionLength = fieldSubmission.fieldValues.length;
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
      return self.checkString(fieldValue, cb);
    },
    "textarea" : function(fieldValue, cb){
      //Validating textarea Entry
      var self = this;
      return self.checkString(fieldValue, cb);
    },
    "number" : function(fieldValue, cb){
      var self = this;

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

      if(fieldValue.match(/[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/g) === null){
        return cb(new Error("Invalid email address format for value" + fieldValue));
      } else {
        return cb();
      }
    },
    "dropdown" : function(fieldValue, cb){
      //Dropdown returns a single string value.
      var self = this;

      if(typeof(fieldValue) !== "string"){
        return cb(new Error("Expected dropdown submission to be string but got " + typeof(fieldValue)));
      }

      //Check value exists in the field definition
      if(!fieldDefinition.fieldOptions.definition.options){
        return cb(new Error("No dropdown options exist for field " + fieldDefinition.name));
      }

      var matchingOptions = fieldDefinition.fieldOptions.definition.options.filter(function(dropdownOption){
        return dropdownOption.label === fieldValue;
      });

      if(matchingOptions.length !== 1){
        return cb(new Error("Invalid number of dropdown options found: " + matchingOptions.length));
      }

      return cb();

    },
    "radio" : function(fieldValue, cb){
      var self = this;

      if(typeof(fieldValue) !== "string"){
        return cb(new Error("Expected radio submission to be string but got " + typeof(fieldValue)));
      }

      //Check value exists in the field definition
      if(!fieldDefinition.fieldOptions.definition.options){
        return cb(new Error("No radio options exist for field " + fieldDefinition.name));
      }

      var matchingOptions = fieldDefinition.fieldOptions.definition.options.filter(function(radioOption){
        return radioOption.label === fieldValue;
      });

      if(matchingOptions.length !== 1){
        return cb(new Error("Invalid number of radio options found: " + matchingOptions.length));
      }

      return cb();

    },
    "checkboxes" : function(fieldValue, cb){
      var self = this;
      var minVal = fieldDefinition.fieldOptions.validation.min;
      var maxVal = fieldDefinition.fieldOptions.validation.max;

      if(minVal){
        if(fieldValue.selections === null || fieldValue.selections === undefined || fieldValue.selections.length < minVal){
          return cb(new Error("Expected a minimum number of selections " + minVal + " but got " + fieldValue.selections.length));
        }
      }

      if(maxVal){
        if(fieldValue.selections){
          if(fieldValue.selections.length > maxVal){
            return cb(new Error("Expected a maximum number of selections " + maxVal + " but got " + fieldValue.selections.length));
          }
        }
      }

      var optionsInCheckbox = [];

      async.eachSeries(fieldDefinition.fieldOptions.definition.checkboxChoices, function(choice, cb){
        for(var choiceName in choice){
          optionsInCheckbox.push(choiceName);
        }
        return cb();
      }, function(err){
        async.eachSeries(fieldValue.selections, function(selection, cb){
          if(typeof(selection) !== "string"){
            return cb(new Error("Expected checkbox submission to be string but got " + typeof(selection)));
          }

          if(optionsInCheckbox.indexOf(selection) === -1){
            return cb(new Error("Checkbox Option " + selection + " does not exist in the field."));
          }

          return cb();
        }, cb);
      });
    },
    "location" : function(fieldValue, cb){
      var self = this;

      if(fieldDefinition.fieldOptions.locationUnit === "latLong"){
        if(fieldValue.lat && fieldValue.long){
          if(isNaN(parseFloat(fieldValue.lat)) || isNaN(parseFloat(fieldValue.lat))){
            return cb(new Error("Invalid latitude and longitude values"));
          } else {
            return cb();
          }
        } else {
          return cb(new Error("Invalid object for latitude longitude submission"));
        }
      } else {
        if(fieldValue.zone && fieldValue.eastings && fieldValue.northings){
          //Zone must be 3 characters, eastings 6 and northings 9
          return validateNorthingsEastings(fieldValue, cb);
        } else {
          return cb(new Error("Invalid object for northings easting submission. Zone, Eastings and Northings elemets are required"));
        }
      }

      function validateNorthingsEastings(fieldValue, cb){
        if(typeof(fieldValue.zone) !== "string" || fieldValue.zone.length !== 3){
          return cb(new Error("Invalid zone definition for northings and eastings location. " + fieldValue.zone));
        }

        if(typeof(fieldValue.eastings) !== "string" || fieldValue.eastings.length !== 6){
          return cb(new Error("Invalid eastings definition for northings and eastings location. " + fieldValue.eastings));
        }

        if(typeof(fieldValue.northings) !== "string" || fieldValue.northings.length !== 7){
          return cb(new Error("Invalid northings definition for northings and eastings location. " + fieldValue.northings));
        }

        return cb();
      };
    },
    "locationMap" : function(fieldValue, cb){
      var self = this;
      self.location(fieldValue, cb); // The map position will either be in latitudeLongitude or eastings and northings
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
    "dateTime" : function(fieldValue, cb){
      var self = this;

      var testDate = new Date(fieldValue);

      if(testDate.toString() === "Invalid Date"){
        return cb(new Error("Invalid dateTime string " + fieldValue));
      } else {
        return cb();
      }
    },
    "sectionBreak" : function(fieldValue, cb){
      var self = this;
      return cb(new Error("Should not submit section breaks."));
    },
    "checkString" : function(fieldValue, cb){
      var self = this;

      if(typeof(fieldValue) !== "string"){
        return cb(new Error("Expected string but got" + typeof(fieldValue)));
      }

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