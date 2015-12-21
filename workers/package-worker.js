var mongoosastic = require('mongoosastic'),
    Package = require('../models/package').Package;


/* =============================================
* GET Package by name
* =========================================== */
exports.getPackageByName = function(name, callback) {
  var getPackageByName = {
    "bool": {
       "must":
          {
            "match": {"name": name}
          }
      }
    };

  Package.search(getPackageByName, {hydrate:true, hydrateOptions: {lean: false}}, function(err, searchresult) {
    if(err){
      console.log(err);
    } else {
      callback(null, searchresult.hits.hits);
    }
  });
};


/* =============================================
* GET Package by ID
* =========================================== */
exports.getPackageByID = function(id, callback) {
  var getPackageByID = {
    "bool": {
       "must":
          {
            "match": {"_id": id}
          }
      }
    };

  Package.search(getPackageByID, {hydrate:true, hydrateOptions: {lean: false}}, function(err, searchresult) {
    if(err){
      console.log(err);
    } else {
      callback(null, searchresult.hits.hits);
    }
  });
};
