var config = require('../config/config'),
    Package = require('../models/package.js'),    
    normalizeURL = require('../helper/normalizeURL'),
    validate = require('../helper/validations'),
    elastic = require('../workers/elastic-worker.js'),
    q = require("q"),
    r = require('rethinkdb'),
    deferred = q.defer(),
    shortid = require('shortid');


/* =============================================
* create new package
*
* @param {string} packName
* @returns {object} model
* @returns {object} error (if invalid URL, name or duplicate)
*
* =========================================== */
function createPackage(packName, packURL){
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
      var newID = shortid.generate();
      var newPackage = new Package({
        name: name,
        url: url,
        id: newID
      });

      return validate.packageNameExists(packName).then(function(isDuplicate){
        if(!isDuplicate){
          return newPackage.save().then(function(doc){
              // also save in ES
              elastic.addDocument({
                name: name,
                url: url,
                id: newID
              });
            return q.fcall(function () {
              var model = {},
                  innermodel = {};

              innermodel.url = packURL;
              model.packName = innermodel;
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
function removePackage(packName){
  return Package.get(packName).delete().run().then(function(res){
    elastic.removeDocument(packName);
    return "deleted";
  }).catch(Errors.DocumentNotFound, function(err){
    console.log(err);
    return q.fcall(function(){
      return false;
    });
  });
};




module.exports = {
  createPackage: createPackage,
  removePackage: removePackage
};