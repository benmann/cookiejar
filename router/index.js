var Falcor = require("falcor-express"),
    Router = require("falcor-router"),
    Package = require("../models/package.js"),
    elastic = require("../api/elasticsearch"),
    rethink = require("../api/rethinkDB.js");

var Model  = require("falcor").Model,
    $ref   = Model.ref,
    $atom  = Model.atom,
    $error = Model.error;

var router = Router.createClass([
  { 
    /*
    * Get basic info about the registry
    * @return {JSON} version and name of registry
    */
    route: "registryInfo",
    get: function(req) {
      return { path: ["registryInfo"], value:  $atom(elastic.getRegistryInfo())};
    }
  },
  {
    /*
    * Get total amount of packages in registry
    * @return {int} number of packages in DB
    */
    route: "packages.length",
    get: function(req) {
      return Package.count().execute().then(function(total) {
        return { path: ["packages", "length"], value: total };
      });
    }
  },
  {
    /*
    * Get multiple packages by (similar) name, keyowrd, description or owner
    * @param {string} name
    * @return {JSONG} packagesByName graph
    */
    route: "packagesByName[{keys:name}]",
    get: function(req) {
      // TODO: this route can later be extended to also return results for search by keywords only etc.
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
    /*
    * @param {string} id
    * @return {JSONG} packagesById graph
    */
    route: "packageById[{keys:id}]",
    get: function(req) {
      var packID = req.id[0];
      return elastic.getPackageById(packID).then(function(model){
        return {path:["packageById", packID], value: $atom(model.packageById[packID])};
      });
    }
  },
  {
    /*
    * @param {string} name
    * @param {string} url
    * @return {JSONG} with either $atom: updated graph or $error if invalid
    */
    route: "createPackage[{keys:name}][{keys:url}]",
    get: function(req) {
      var packName = req.name[0],
          packURL = req.url[0];
      return rethink.createPackage(packName, packURL).then(function(model){        
        return {path:["createPackage", packName, packURL], value: model["$type"] ? $error(model.value) : $atom(model.packagesByName)};
      });

    }
  }
]);

module.exports = router;
