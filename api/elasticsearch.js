var config = require('../config/config'),
    Package = require('../models/package.js'),
    elastic = require('../config/elasticClient'),
    isValidURL = require('../helper/validURL'),
    isValidName = require('../helper/validName');



/* =============================================
* GET count all packages
* =========================================== */
exports.countAllPackages = function(callback) {
  // currently using rethink for counts
  Package.count().execute().then(function(total) {
    callback(null, total);
  });
};

/* =============================================
* GET all packages
* =========================================== */
exports.getAllPackages = function(callback) {
  elastic.search({
    index: 'packages',
    type: 'pkg',
    size: 1000,
    body: {
      query: {
        "match_all" : {}
      }
    }
  }).then(function(searchresult) {
    console.log(searchresult.hits.hits);
    callback(null, searchresult.hits.hits);
  }, function(error) {
    console.trace(error.message);

  });
};

/* =============================================
* GET package by name
* =========================================== */
exports.getPackageByName = function(name, callback) {
  elastic.search({
    index: 'packages',
    type: 'pkg',
    body: {
      query: {
        "term" : {
          "name" : name
        }
      }
    }
  }).then(function(searchresult) {
    console.log(searchresult.hits.hits);
    callback(null, searchresult.hits.hits);
  }, function(error) {
    console.trace(error.message);

  });
};


/* =============================================
* GET package by ID
* =========================================== */
exports.getPackageByID = function(id, callback) {
  elastic.search({
    index: 'packages',
    body: {
      query: {
        "bool": {
          "must":
          {
            "match": {"_id": id}
          }
        }
      }
    }
  }).then(function(searchresult) {
      console.log(searchresult.hits.hits);
      callback(null, searchresult.hits.hits);
    }, function(error) {
      console.trace(error.message);
  });
};


/* =============================================
* GET search for packages
* =========================================== */
exports.searchForPackages = function(searchquery, callback) {
  elastic.search({
      index: 'packages',
      size: config.defaultSize,
      body: {
        query: {
          "multi_match" : {
            "query": searchquery,
            "type": "best_fields",
            "fields": ["new_val.name", "new_val.description", "new_val.keywords", "new_val.owner"],
            "minimum_should_match": "25%",
            "fuzziness" : 2,
          }
        }
      }
    }).then(function(res) {
      // This is what we get as actual JSON:
      // res.hits.hits[0]._source.new_val

      var packages = [];
      res.hits.hits.forEach(function(package, index) {
        packages.push(package._source.new_val);
      });

      callback(null, packages);
    }, function(error) {
      console.trace(error.message);
  });
};

