var config = require('../config/config'),
    Package = require('../models/package.js'),
    normalizeURL = require('../helper/normalizeURL');
    isValidURL = require('../helper/validURL'),
    isValidName = require('../helper/validName');

// TODO: rewrite to use with falcor

/* =============================================
* POST create new package
*
* 200 - all good, pkg created
* 400 - invalid name / url / connection error
* 403 - already registered
*
* =========================================== */
exports.createPackage = function(req, callback) {

  var name = req.body.name,
      url = normalizeURL(req.body.url),
      validName = isValidName(name);

  if (validName.error) {
    return callback(null, 400, "Package name contains illegal characters. Package not created!");
  }

  isValidURL(url, function(isValid) {
    if (isValid) {
      var newPackage = new Package({
        name: name,
        url: url
      });

      newPackage.save().then(function(doc) {
        callback(null, 200, "Package "+newPackage.name+" saved...");
      }).error(handleError("Database error. Couldn't create package."));
    } else {
      callback(null, 400, "URL is not valid. Package not created!");
    }
  });
};



/* =============================================
* DELETE remove existing package
*
* 200 - all good, pkg deleted
* 400 - package not found / connection error
*
* =========================================== */
exports.removePackage = function(req, callback) {
  var name = req.body.name;

  Package.get(name).run().then(function(pkg) {
    if(!pkg){
      // return 400
      console.log("Package not found in registry.");
      callback(null, 400, "Package not found in registry.");
    }
    pkg.delete().then(function(result) {
      callback(null, 200, "Package "+name+" successfully removed...");
    });
  }).error(handleError("failed to delete package: "+name));
};





function handleError(err) {
  console.log(err);
}