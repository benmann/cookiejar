var config = require('../config/config'),
    Package = require('../models/package.js'),
    elastic = require('../config/elasticClient');




/* =============================================
* Return basic registry info
* =========================================== */
function getRegistryInfo(){
  var registryInfo = {
    name: config.name,
    version: config.version
  };
  return registryInfo;
};


/* =============================================
* GET search for packages by name
*
* @param {string} packName
* @returns {object} model (contains multiple packages)
* =========================================== */
function getPackagesByName(packName) {
  return elastic.search({
    index: "packages",
    type: "package",
    size: config.defaultSize,
    body: {
      query: {
        "multi_match" : {
          "query": packName,
          "type": "best_fields",
          "fields": ["new_val.name", "new_val.description", "new_val.keywords", "new_val.owner"],
          "minimum_should_match": "25%",
          "fuzziness" : 2,
        }
      }
    }
  }).then(function(searchresult) {

    var model = {packagesByName:{}};
    searchresult.hits.hits.forEach(function(package, index) {
      var pkgName = package._source.new_val.name,
          pkgVals = package._source.new_val;
      model.packagesByName[pkgName] = pkgVals;
    });
    return model;
  });
};


/* =============================================
* GET search for packages by ID
*
* @param {string} packID
* @returns {object} model (contains single package)
* =========================================== */
function getPackageById(packID) {

  return elastic.search({
    index: 'packages',
    size: 1,
    body: {
      query: {
        "bool": {
          "must":
          {
            "match": {"new_val.id": packID}
          }
        }
      }
    }
  }).then(function(searchresult) {

    var model = {packageById:{}};
    var matchingID = searchresult.hits.hits[0]._source.new_val.id,
        pkgVals = searchresult.hits.hits[0]._source.new_val;
      
    model.packageById[matchingID] = pkgVals;   
    return model;
  });
};


module.exports = {
  getRegistryInfo: getRegistryInfo,  
  getPackagesByName: getPackagesByName,
  getPackageById: getPackageById
};