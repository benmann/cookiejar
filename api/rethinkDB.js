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
function createPackage(packName, packURL) {

  var name = packName,
      url = normalizeURL(packURL),
      validName = isValidName(name);

  if (validName.error) {
    return "Package name contains illegal characters. Package not created!";
  }

  isValidURL(url, function(isValid) {
    console.log("isValid: "+isValid);
    if (isValid) {
      var newPackage = new Package({
        name: name,
        url: url
      });

      console.log("isValid");

      newPackage.save().then(function(doc) {
        // 200
        return "Package "+name+" created.";
      });
    } else {
      // 400
      console.log("isValid NOT");
      return "Package "+name+" could not be created.";
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
function removePackage(req) {
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
  });
};



module.exports = {
  createPackage: createPackage,
  removePackage: removePackage
};