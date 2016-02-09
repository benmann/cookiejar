var config = require('../config/config.js'),
    elasticsearch = require('elasticsearch'),
    Package = require('../models/package.js'),
    elastic = require('../workers/elastic-worker.js'),
    spawn = require('child-process-promise').spawn; 


var npmPackageNames = "https://skimdb.npmjs.com/registry",
    allNpmPackages = "https://skimdb.npmjs.com/registry";


function fetchFromNpm () {

  // In async processes, spawn:
  // 1) fetch all package names from: https://skimdb.npmjs.com/registry/_all_docs
  // 2) for each package query: https://registry.npmjs.org/<packagename>
  
  // spawn('curl', ['https://skimdb.npmjs.com/registry/_all_docs']).progress(function (childProcess) {
  spawn('curl', ['https://skimdb.npmjs.com/registry/_all_docs']).progress(function (childProcess) {
    childProcess.on('close', function (data) {
      console.log(data);
    });
  });

  

};


module.exports = {
  fetchFromNpm: fetchFromNpm
};
