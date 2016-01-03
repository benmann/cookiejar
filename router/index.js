var Falcor = require("falcor-express"),
    Router = require("falcor-router"),
    config = require("../config/config"),
    Package = require("../models/package.js"),
    elastic = require("../api/elasticsearch"),
    isValidURL = require("../helper/validURL"),
    isValidName = require("../helper/validName");

var Model  = require("falcor").Model,
    $ref   = Model.ref,
    $atom  = Model.atom,
    $error = Model.error;

var router = Router.createClass([
  { 
    // Get basic info about the registry
    route: "registryInfo",
    get: function(req) {
      return { path: ["registryInfo"], value:  $atom(elastic.getRegistryInfo())};
    }
  },
  {
    // Get total amount of packages in registry
    route: "packages.length",
    get: function(req) {
      return Package.count().execute().then(function(total) {
        return { path: ["packages", "length"], value: total };
      });
    }
  },
  {
    // Get multiple packages by (similar) name, keyowrd, description or owner
    route: "packagesByName[{keys:name}]",
    get: function(req) {
      // TOOD: this route can later be extended to also return results for search by keywords only etc.
      // by reading the property given by the client and forward it as the field(s) ES actually queries.
      // We can even differentiate between returning one or multiple packages and whether we return only
      // the matching package or loosely matching ones by providing more parameters to this route.
      var packName = req.name[0];
      return elastic.getPackagesByName(packName).then(function(model){
        return {path:["packagesByName", packName], value: $atom(model.packagesByName)};
      });
    }
  },  
  {
    // Get package by ID
    route: "packageById[{keys:id}]",
    get: function(req) {      
      var packID = req.id[0];
      return elastic.getPackageById(packID).then(function(model){
        return {path:["packageById", packID], value: $atom(model.packageById[packID])};
      });      
    }
  }
]);

module.exports = router;
