var config = require('../config/config.js'),
    elasticsearch = require('elasticsearch'),
    r = require('rethinkdb'),
    Package = require('../models/package.js'),
    shortid = require('shortid'),
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


  console.log("Filling DB with packages...");
  elastic.deleteIndex();
  elastic.initIndex().then(elastic.initMapping);

  //rethink
  packages.forEach(function(package, index) {
    var newPackage = new Package({
      name: package.name,
      url: package.url,
      hits: package.hits
    });

    elastic.addDocument({
      name: package.name,
      url: package.url,
      id: shortid.generate()
    });

    newPackage.save().then(function(doc) {
      callback(null, "package "+newPackage.name+" saved...");
    });

  });

};
