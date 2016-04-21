var express = require('express'),
    route = express.Router(),
    registry = require('../workers/registry-worker'),
    elastic = require('../api/elasticsearch'),
    config = require('../config/config'),
    BowerData = require('../data/16-04-21-BowerPackages.json');


/* =============================================
* Initialize empty registy
* This is redundant in production, as workers
* will provide the data, this is just to get some data.
* =========================================== */
route.get('/', function(req, res, next) {
  registry.init(BowerData, function(err, result){
    if(err){
      console.log(err);
    }
    console.log(result);
  });
});

module.exports = route;
