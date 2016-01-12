var config = require('../config/config'),
    Package = require('../models/package.js'),    
    normalizeURL = require('../helper/normalizeURL');
    isValidURL = require('../helper/validURL'),
    isValidName = require('../helper/validName');

var thinky = require('thinky')(),
    Errors = thinky.Errors;


/* =============================================
* create new package
*
* @param {string} packName
* @returns {object} model
* @returns {object} error (if invalid URL, name or duplicate)
*
* =========================================== */
function createPackage(packName, packURL) {

  var name = packName,
      url = normalizeURL(packURL),
      validName = isValidName(name);

  if (validName.error) {
    return {$type: "error", value: "The provided name contains illegal characters."};
  }

  isValidURL(url, function(isValid) {
    if (isValid) {
      var newPackage = new Package({
        name: name,
        url: url
      });
      
      packageNameExists(packName, function(isDuplicate){
        if(!isDuplicate){
          newPackage.save().then(function(doc) {
            var packagesByName = {packName:{"url": packURL}};
            return packagesByName;
          });
        } else {
          var err = {$type: "error", value: "A package with the provided name already exists."}
          return err;
        }
      });
      
    } else {      
      var err = {$type: "error", value: "The provided URL is not a valid URL."};
      return err;
    }
  });
};



/* =============================================
* remove existing package by name
*
* @param {string} packName
* @returns {object} model
* @returns {object} error (error, pkg doesn't exist)
* =========================================== */
function removePackage(packName) {
  Package.get(packname).then(function(pkg) {
    pkg.delete().then(function(result) {
      // var packagesByName = {packName:{"url": packURL}};
      // return packagesByName;
    });    
  });
};


function packageNameExists(name, callback) {
  Package.get(name).run().then(function(pkg) {
    callback(true);
  }).catch(Errors.DocumentNotFound, function(err) {
    callback(false);
  });
};



module.exports = {
  createPackage: createPackage,
  removePackage: removePackage
};