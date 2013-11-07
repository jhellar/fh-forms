module.exports = function (passed){

  return{
    "has": function (){
      var cb;
      var failed = undefined;
      if(!passed || ('object' != typeof passed)){
        failed = {"message":"there were no params passed"};
      }
      for(var i=0; i<arguments.length; i++){
        if("function" == typeof arguments[i]){
          cb = arguments[i];
        }
        else if(passed && !passed.hasOwnProperty(arguments[i])){
          failed = (failed) ? failed : {"code":400};
          failed[arguments[i]]  = "missing param";
        }
      }
      if(failed && ! failed.message){
        failed.message = "validation failed";
      }
      cb(failed);
    },
    "hasno" : function (){
      var cb;
      var failed = undefined;
      for(var i=0; i<arguments.length; i++){
        if("function" == typeof arguments[i]){
          cb = arguments[i];
        }
        else if(passed.hasOwnProperty(arguments[i])){
          failed = (failed) ? failed : {"code":400};
          failed[arguments[i]]  = "param " + arguments[i] + "should not be present";
        }
      }
      if(failed && ! failed.message){
        failed.message = "params validation failed";
      }
      cb(failed);
    },
    "param":function (paramName){
      return {
        "is":function (type){
          return (passed.hasOwnProperty(paramName) && type === typeof passed[paramName]);
        }
      };
    },
    "checkFileFieldParms": function(cb){

      if(passed.id){// If an id exists in the params, check it for
        if(!(typeof(passed.id) === "string")){
          if(!(passed.id.toString().length === 24)){
            return cb(new Error("Field Id specified but is invalid format. Id specified: " + passed.id));
          }
        }

        return cb();

      } else { //No id, validate list
        //If id is not specified, the request must contain section and field entries
        if(!(passed.section && passed.field)){
          return cb(new Error("Incorrect parameters for referencing a section and field."));
        }

        return cb();

      }

      function checkListfields(){
        if((passed.listFields === null || passed.listFields === undefined)){
          return false;
        }

        if((passed.listFields.index === null || passed.listFields.index === undefined)){
          return false;
        }

        if((passed.listFields.name === null || passed.listFields.name === undefined)){
          return false;
        }

        if(passed.listFields.name.length === 0){
          return false;
        }

        return true;
      }
    }
  };

};
