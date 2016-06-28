const config = require('../config/config'),
      Package = require('../models/package.js'),
      normalizeURL = require('../helper/normalizeURL'),
      validate = require('../helper/validations'),
      elastic = require('../workers/elastic-worker.js'),
      r = require('rethinkdb'),
      thinky = require('../config/thinky.js'),
      Errors = thinky.Errors;


/* =============================================
* create new package
*
* @param {string} packName
* @returns {object} model
* @returns {object} error (if invalid URL, name or duplicate)
*
* =========================================== */
function createPackage(packName, packURL){
  return new Promise(function (done, reject){

    var name = packName,
        url = normalizeURL(packURL),
        validName = validate.validateName(name);

    if (validName.error) {
        reject({$type: "error", value: "The provided name contains illegal characters."});
    }
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

                var model = {},
                    innermodel = {};
                    innermodel.url = packURL;
                    model.packName = innermodel;
                done(model);
            });
          } else {
            reject({$type: "error", value: "A package with the provided name already exists."});
          }
        });

  });
};

function updatePackage(packName, metadata){
  Package.get(packName).run().then(function(package) {
      package.merge(metadata).save().then(function(result) {
          elastic.updateDocument(packName, metadata);
      });
  }).catch(Errors.DocumentNotFound, function(err){
    if(err){
      console.log(err);
    }
    return;
  });
}

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
  removePackage: removePackage,
  updatePackage: updatePackage
};