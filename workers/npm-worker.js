var config = require('../config/config.js'),
    elasticsearch = require('elasticsearch'),
    Package = require('../models/package.js'),
    elastic = require('../workers/elastic-worker.js');


var registryUrl = "https://skimdb.npmjs.com/registry";


function fetchFromNpm () {

  // In async processes, spawn:
  // 1) fetch all package names from: https://skimdb.npmjs.com/registry/_all_docs
  // 2) for each package query: https://registry.npmjs.org/<packagename>
  

};


module.exports = {
  fetchFromNpm: fetchFromNpm
};
