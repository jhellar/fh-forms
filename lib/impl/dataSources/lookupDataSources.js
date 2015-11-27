var models = require('../../common/models.js')();

module.exports = function lookUpDataSources(connections, params, cb){
  if(!params){
    return cb(new Error("No Search Parameterss For Finding Data Sources"));
  }

  //Some queries don't want a document, just want a Javascript Object.
  var lean = params.lean ? params.lean : false;

  var DataSource = models.get(connections.mongooseConnection, models.MODELNAMES.DATA_SOURCE);

  //Looking To Find A Data Source -- Using lean if just want an Object instead of a document
  DataSource.find(params.query).lean(lean).exec(function(err, dataSources){
    if(err){
      return cb(err);
    }

    return cb(undefined, dataSources);
  });
};