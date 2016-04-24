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
    * @return {JSONG} graph
    */
    route: "packages[{keys:name}]",
    get: function(req) {
      // TODO: this route can later be extended to also return results for search by keywords only etc.
      // by reading the property given by the client and forward it as the field(s) ES actually queries.
      // We can even differentiate between returning one or multiple packages and whether we return only
      // the matching package or loosely matching ones by providing more parameters to this route.
      var packName = req.name[0];
      return elastic.getPackages(packName).then(function(model){
        return {path:["packages", packName], value: $atom(model)};
      });
    }
  },
  {
    /*
    * @param {string} id
    * @return {JSONG} packagesById graph
    */
    route: "packages.byId[{keys:id}]",
    get: function(req) {
      var packID = req.id[0];
      return elastic.getPackageById(packID).then(function(model){
        return {path:["packages", "byId", packID], value: $atom(model.packageById[packID])};
      });
    }
  },
  {
    /*
    * @param {string} name
    * @param {string} url
    * @return {JSONG} with either $atom: updated graph or $error if invalid
    */
    route: "packages.create[{keys:name}][{keys:url}]",
    call: function(req) {
      var packName = req.name[0],
          packURL = req.url[0];
      return rethink.createPackage(packName, packURL).then(function(model){
        return {path:["packages", packName], value: model["$type"] ? $error(model.value) : $atom(model)};
      });

    }
  },
  {
    /*
    * @param {string} name
    * @return {JSONG} invalidated package
    */
    route: "packages.remove[{keys:name}]",
    call: function(req) {
      var packName = req.name[0];
      return rethink.removePackage(packName).then(function(res){
        return {path:["packages", packName], invalidated: true};
      });
    }
  }
]);

module.exports = router;
