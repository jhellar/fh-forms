function resultHandler(type, req, next){
  return function(err, result){
    if(err){
      return next(err);
    }

    result = result || {};

    req.appformsResultPayload = {
      data: result,
      type: type
    };

    return next(err);
  };
}

module.exports = resultHandler;