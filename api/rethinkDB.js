var config = require('../config/config'),
    Package = require('../models/package.js'),    
    normalizeURL = require('../helper/normalizeURL'),
    validate = require('../helper/validations'),
    q = require("q"),
    deferred = q.defer();


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
      validName = validate.validateName(name);

  if (validName.error) {    
    return q.fcall(function () {
      // TODO: output the concrete error given by validate.validateName() here
      return {$type: "error", value: "The provided name contains illegal characters."};
    });
  }

  return validate.validateUrl(url).then(function(exitCode){

    if (exitCode == 0) {
      var newPackage = new Package({
        name: name,
        url: url
      });

      return validate.packageNameExists(packName).then(function(isDuplicate){
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






module.exports = {
  createPackage: createPackage,
  removePackage: removePackage
};