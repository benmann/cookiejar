var express = require('express'),
    router = express.Router(),
    registry = require('../workers/registry-worker'),
    elastic = require('../api/elasticsearch'),
    config = require('../config/config'),
    BowerData = require('../data/15-12-19-BowerPackages.json');


/* =============================================
* GET general registry info
* =========================================== */
router.get('/', function(req, res, next) {
  registry.getRegistryInfo(function(err, result){
    if(err){
      console.log(err);
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  });
});



/* =============================================
* Initialize empty registy
* This is redundant in production, as workers
* will provide the data, this is just to get some data.
* =========================================== */
router.get('/init', function(req, res, next) {
  registry.init(BowerData, function(err, result){
    if(err){
      console.log(err);
    }
    console.log(result);
  });
});

module.exports = router;
