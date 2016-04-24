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
function getPackages(packName) {
  return elastic.search({
    index: "packages",
    type: "package",
    size: config.defaultSize,
    body: {
      query: {
        "multi_match" : {
          "query": packName,
          "type": "best_fields",
          "fields": ["name", "description", "keywords", "owner"],
          "minimum_should_match": "25%",
          "fuzziness" : 2,
        }
      }
    }
  }).then(function(searchresult) {
    var model = {};
    searchresult.hits.hits.forEach(function(package, index) {
// console.log(package._source.name);
      var pkgName = package._source.name,
          pkgVals = package._source;
      model[pkgName] = pkgVals;
    });
    console.log(model);
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
            "match": {"id": packID}
          }
        }
      }
    }
  }).then(function(searchresult) {
    var model = {packageById:{}};
    var matchingID = searchresult.hits.hits[0]._source.id,
        pkgVals = searchresult.hits.hits[0]._source;

    model.packageById[matchingID] = pkgVals;
    return model;
  });
};



module.exports = {
  getRegistryInfo: getRegistryInfo,
  getPackages: getPackages,
  getPackageById: getPackageById,
};
