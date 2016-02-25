var config = require('../config/config.js'),
    elasticsearch = require('elasticsearch'),
    Package = require('../models/package.js'),
    elastic = require('../workers/elastic-worker.js'),
    spawn = require('child-process-promise').spawn,
    request = require('request'),
    JSONStream = require('JSONStream'),
    es = require('event-stream');

// Basically this need to be done, to get all the npm packages into cookiejar:
// 1) fetch all package names from: https://skimdb.npmjs.com/registry/_all_docs
// 2) for each package query: https://registry.npmjs.org/<packagename>
// 3) write data from 2) to DB and smile
var npmEndpointNames = "https://skimdb.npmjs.com/registry/_all_docs",
    npmEndpointAll = "https://registry.npmjs.org/";


function fetchFromNpm () {
  // first get every package name inside npm's registry
  // could later cache this list, as it is pretty huge
  request({url: npmEndpointNames}).pipe(JSONStream.parse('rows.*')).pipe(es.mapSync(function (data) {    
    var pkgID = data.id,
        singlePkgUrl = npmEndpointAll + pkgID;

    // then get the respective package's info and write to DB
    // this could be dispatched into a separate job per package
    request(singlePkgUrl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var pkg = JSON.parse(body),
            pkgName = pkg.name,
            pkgDesc = pkg.description;

            // this needs figuring out...
            if(pkg.repository){
              var pkgUrl = pkg.repository.url;
            } else if(pkg.repository && pkg.dist){
              var pkgUrl = pkg.dist.tarball;
            } else{
              var pkgUrl = null;
            }

        console.log("NAME: "+pkgName);
        console.log("URL: "+pkgUrl);
        console.log("DESC: "+pkgDesc);
        console.log("=======================");
      };
    });

  }));
    
};


module.exports = {
  fetchFromNpm: fetchFromNpm
};
