var config = require('../config/config'),
    Package = require('../models/package').Package,
    isValidURL = require('../helper/validURL'),
    isValidName = require('../helper/validName');

/* =============================================
* GET count all packages
* =========================================== */
exports.countAllPackages = function(callback) {
  // goes right to mongo, needs caching
  Package.count({}, function(err, count){
    callback(null, {"amount": count});
  });
};

/* =============================================
* GET all packages
* =========================================== */
exports.getAllPackages = function(callback) {
  var getAllPackages = {
    "query" : {
      "match_all" : {}
    }
  };

  Package.search(getAllPackages, {size: 50000, hydrate:true, hydrateOptions: {lean: false}}, function(err, searchresult) {
    if(err){
      console.log(err);
    } else {
      callback(null, searchresult.hits.hits);
    }
  });
};

/* =============================================
* GET package by name
* =========================================== */
exports.getPackageByName = function(name, callback) {
  var getPackageByName = {
     "term" : {
        "name" : name
    }
  };

  Package.search(getPackageByName, {size: 1, hydrate:true, hydrateOptions: {lean: false}}, function(err, searchresult) {
    if(err){
      console.log(err);
    } else {
      callback(null, searchresult.hits.hits);
    }
  });
};


/* =============================================
* GET package by ID
* =========================================== */
exports.getPackageByID = function(id, callback) {
  var getPackageByID = {
    "bool": {
      "must":
      {
        "match": {"_id": id}
      }
    }
  };

  Package.search(getPackageByID, {size: config.defaultSize, hydrate:true, hydrateOptions: {lean: false}}, function(err, searchresult) {
    if(err){
      console.log(err);
    } else {
      callback(null, searchresult.hits.hits);
    }
  });
};


/* =============================================
* GET search for packages
* =========================================== */
exports.searchForPackages = function(query, callback) {

  var searchSpecific = {
    "multi_match" : {
      "query": query,
      "type": "best_fields",
      "fields": ["name", "description", "keywords", "owner"],
      "minimum_should_match": "25%",
      "fuzziness" : 2,
    }
  };

  Package.search(searchSpecific, {size: config.defaultSize, hydrate:true, hydrateOptions: {lean: false}}, function(err, searchresult) {
    if(err){
      console.log(err);
    } else {
      callback(null, searchresult.hits.hits);
    }
  });
};


/* =============================================
* POST create new package
*
* 200 - all good, pkg created
* 400 - invalid name / url / connection error
* 403 - already registered
*
* =========================================== */
exports.createPackage = function(request, callback) {
  var name = request.body.name,
      url = normalizeURL(request.body.url),
      validName = isValidName(name),
      validURL = isValidURL(url);

  if (validName.error) {
    // return status 400
    console.log("Package name is not valid");
  }

  if (validURL.error) {
    // return status 400
    console.log("Package name is not valid");
  }

  // all good, return 200 and add pkg
  var newPackage = new Package({
        name: name,
        url: url
      });

   newPackage.save(function(err) {
      if (err) {
        return callback(err);
      }
      callback();
    });
};
