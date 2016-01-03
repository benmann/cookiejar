var config = require('../config/config.js'),
    elasticsearch = require('elasticsearch'),
    Package = require('../models/package.js'),
    elastic = require('../workers/elastic-worker.js');

/* =============================================
* GET general registry info
* =========================================== */
exports.getRegistryInfo = function(callback) {
  var registryInfo = {
      version: config.version,
      name: config.name,
      description: config.description
    }
    callback(null, registryInfo);
};


/* =============================================
* GET populate registry with dummy data
* =========================================== */
exports.init = function(packages, callback) {
  // reset index
  elastic.deleteIndex();
  // elastic.initIndex().then(elastic.initMapping)

  // basically skipLogstash() ...
  // elastic.deleteIndex().then(
    // cerate index and mapping
    // elastic.initIndex().then(elastic.initMapping).then(
    //   packages.forEach(function(package, index) {
    //     elastic.addDocument({
    //         name: package.name,
    //         owner: "test",
    //         description: "test",
    //         keywords: "test",
    //         url: package.url,
    //         hits: package.hits,
    //         stars: "test",
    //       })
    //     callback(null, "package "+package.name+" saved...");
    //   })
    // )
  // );

  //rethink
  packages.forEach(function(package, index) {
    var newPackage = new Package({
      name: package.name,
      url: package.url,
      hits: package.hits
    });

    newPackage.save().then(function(doc) {
      callback(null, "package "+newPackage.name+" saved...");
    });
  });

};