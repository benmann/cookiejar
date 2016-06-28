const config = require('../config/config'),
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
          "fields": ["name", "description", "keywords", "owner"],
          "minimum_should_match": "25%",
          "fuzziness" : 0.6,
        }
      }
    }
  }).then(function(searchresult) {
    var model = {};
    searchresult.hits.hits.forEach(function(package, index) {
      var pkgName = package._source.name,
          pkgVals = package._source;
      model[pkgName] = pkgVals;
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
function getPackageBy(method, identifier) {

  var toMatch = {};
  toMatch[method] = identifier;

  return elastic.search({
    index: 'packages',
    size: 1,
    body: {
      query: {
        "bool": {
          "must":
          {
            "match": toMatch
          }
        }
      }
    }
  }).then(function(searchresult) {
    var model = {packageBy:{}};
    var pkgVals = searchresult.hits.hits[0]._source;

    model.packageBy[method] = pkgVals;
    return model;
  });
};



module.exports = {
  getRegistryInfo: getRegistryInfo,
  getPackages: getPackages,
  getPackageBy: getPackageBy,
};
