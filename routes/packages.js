var express = require('express'),
    router = express.Router(),
    elastic = require('../api/elasticsearch'),
    rethink = require('../api/rethinkDB'),
    config = require('../config/config');


// SWITCH APIs: rethinkDB or elasticsearch.
// Each API could expose the exactly same functions for the diff DBs :)
// TODO: however we need a river.. GET/POST/DELETE > rethink > elastic
var api  = elastic;


router.get('/', function(req, res, next) {
  res.send();
});


// All these endpoints need to be replicated as currently implemented
// returns must match the current ones..

// app.get('/packages', routes.packages.list);
// app.get('/packages/:name', routes.packages.fetch);
// app.get('/packages/search/', routes.packages.search);
// app.get('/packages/search/:name', routes.packages.search);
// app.post('/packages', routes.packages.create);
// app.delete('/packages/:name', routes.packages.remove);

/* =============================================
* GET Package count
* api.countAllPackages()
* =========================================== */
router.get('/count', function(req, res) {
  api.countAllPackages(function(err, result){
    if(err){
      console.log(err);
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  });
});

/* =============================================
* GET Package by name
* api.getAllPackages()
* =========================================== */
router.get('/list', function(req, res) {
  api.getAllPackages(function(err, result){
    if(err){
      console.log(err);
    }
    console.log(result);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  });
});


/* =============================================
* GET Package by name
* api.getPackageByName()
* =========================================== */
router.get('/:name', function(req, res) {
  api.getPackageByName(req.params.name, function(err, result){
    if(err){
      console.log(err);
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  });
});


/* =============================================
* GET Package by whatever is passed
* api.searchForPackages()
* =========================================== */
router.get('/search/:query', function(req, res) {
  api.searchForPackages(req.params.query, function(err, result){
    if(err){
      console.log(err);
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  });
});


/* =============================================
* POST create package
* =========================================== */
router.post('/', function(req, res) {
  api.createPackage(req, function(err, result){
    if(err){
      console.log(err);
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  });
});


/* =============================================
* POST remove package
* =========================================== */
router.delete('/:name', function(req, res) {
  if(err){
      console.log(err);
    }
});





module.exports = router;
