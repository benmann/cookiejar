var config = require('../config/config.js'),
    Package = require('../models/package.js');


exports.init = function(packages, callback) {

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