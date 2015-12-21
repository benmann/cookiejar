var config = require('../config/config'),
    Package = require('../models/package.js'),
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







function handleError(err) {
  console.log(err);
}