var config = require('../config/config'),
    Package = require('../models/package.js'),
    normalizeURL = require('../helper/normalizeURL');
    isValidURL = require('../helper/validURL'),
    isValidName = require('../helper/validName');


/* =============================================
* GET count all packages
* =========================================== */
exports.countAllPackages = function (callback) {
  Package.count().execute().then(function(total) {
    callback(null, total);
  });
};

/* =============================================
* GET all packages
* =========================================== */
exports.getAllPackages = function(callback) {
  Package.orderBy('name').execute().then(function(allPackages) {
    callback(null, allPackages);
  }).error(handleError("failed to retrieve all packages."));
};

/* =============================================
* GET package by name
* =========================================== */
exports.getPackageByName = function(name, callback) {
  Package.get(name).run().then(function(pkg) {
    callback(null, pkg);
  }).error(handleError("failed to get package: "+name));
};


/* =============================================
* GET package by ID
* =========================================== */
exports.getPackageByID = function(id, callback) {
  Package.filter({"id": id}).run().then(function(pkg) {
    callback(null, pkg);
  }).error(handleError("failed to get package with id: "+id));
};


/* =============================================
* GET search for packages
* =========================================== */
// not exposing this in RethinkDB yet, as it wouldn't
// really match elasticsearch's fulltext search (multi_match)


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
    console.log("url: "+url);
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






function handleError(err) {
  console.log(err);
}