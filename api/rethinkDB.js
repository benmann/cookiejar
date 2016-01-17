var config = require('../config/config'),
    Package = require('../models/package.js'),    
    normalizeURL = require('../helper/normalizeURL'),
    validate = require('../helper/validURL'),
    isValidName = require('../helper/validName'),
    q = require("q"),
    deferred = q.defer();

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
    return q.fcall(function () {
      return {$type: "error", value: "The provided name contains illegal characters."};
    });
  }

  return validate.validateUrl(url).then(function(exitCode){

    if (exitCode == 0) {
      var newPackage = new Package({
        name: name,
        url: url
      });

      return packageNameExists(packName).then(function(isDuplicate){
        if(!isDuplicate){
          return newPackage.save().then(function(doc) {
            return q.fcall(function () {
              var model = {packagesByName:{}},
                  innermodel = {};

              innermodel.url = packURL;
              model.packagesByName[packName] = innermodel;
              return model;              
            });
          });
        } else {
          return q.fcall(function () {
            return {$type: "error", value: "A package with the provided name already exists."};
          });
        }
      });

    }else{
      return q.fcall(function () {
        return {$type: "error", value: "The provided URL is not a valid URL."};
      });
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


function packageNameExists(name) {
  return Package.get(name).run().then(function(pkg) {
    return q.fcall(function () {
      return true
    });
  }).catch(Errors.DocumentNotFound, function(err) {
    return q.fcall(function () {
      return false;
    });
  });
};



module.exports = {
  createPackage: createPackage,
  removePackage: removePackage
};