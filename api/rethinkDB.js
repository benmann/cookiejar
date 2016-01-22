var config = require('../config/config'),
    Package = require('../models/package.js'),    
    normalizeURL = require('../helper/normalizeURL'),
    validate = require('../helper/validations'),
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
              var model = {byName:{}},
                  innermodel = {};

              innermodel.url = packURL;
              model.byName[packName] = innermodel;
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
  return Package.get(packName).then(function(pkg) {
    return pkg.delete().then(function(result) {
  //     var res = {byName:{}};
  //     res.byName[packName] = {
  //       created_at: result["created_at"],
  //       id: result["id"],
  //       isPublic: result["isPublic"],
  //       name: result["name"],
  //       type: result["type"],
  //       url: result["url"]
  //     };
  //     return res;
      return "deleted";
    });
  }).catch(Errors.DocumentNotFound, function(err) {
    return q.fcall(function () {
      return {$type: "error", value: "A package with the specified name does not exist."};
    });
  });
};






module.exports = {
  createPackage: createPackage,
  removePackage: removePackage
};