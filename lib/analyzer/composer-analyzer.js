// var env = require('../config/local.env.js'),
//     got = require('got'),
//     api = require('../api/rethinkDB.js'),
//     collect = require('./collect/github.js'),
//     downloader = require('./download/github.js');

// function analyze(package) {

//   // For returned data see: https://packagist.org/apidoc
//   var singlePkgUrl = "https://packagist.org/packages/"+package.repository+".json";

//   got(singlePkgUrl).then(res => {
//     var res = JSON.parse(res.body);

//     var metadata = {};
//         metadata.name = package.name;
//         metadata.description = res.package.description;
//         metadata.updated_at = res.package.time;
//         metadata.maintainers = res.package.maintainers;
//         metadata.versions = res.package.versions;
//         metadata.type = res.package.type;
//         metadata.url = res.package.repository;
//         metadata.downloads = res.package.downloads.total;
//         metadata.favers = res.package.favers;

//         api.createPackage(package.name, res.package.repository).then(function(model){
//           api.updatePackage(package.name, metadata);
//         });

//     // if is on gh, pass metadata to runner, so we only write once
//     if(package.isOnGitHub) {
//     // collect.fromGithub(packName, repository);
//     }
//   });

// }


// module.exports = {
//   analyze: analyze
// };
