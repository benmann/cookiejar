// var env = require('../config/local.env.js'),
//     got = require('got'),
//     api = require('../api/rethinkDB.js'),
//     collect = require('./collect/github.js'),
//     downloader = require('./download/github.js');

// function analyze(package) {


// // function proccessNpmPackage(package, done) {
// //   var npmEndpoint = "https://registry.npmjs.org/",
// //       singlePkgUrl = npmEndpoint + package.name;

// //   got(singlePkgUrl).then(res => {

// //     var pkg = JSON.parse(res.body),
// //         pkgName = pkg.name,
// //         pkgDesc = pkg.description;

// //         // this needs figuring out...
// //         if(pkg.repository){
// //           var pkgUrl = pkg.repository.url;
// //         } else if(pkg.repository && pkg.dist){
// //           var pkgUrl = pkg.dist.tarball;
// //         } else{
// //           var pkgUrl = null;
// //         }
// //     api.createPackage(pkgName, pkgUrl);

// //     }).catch(error => {
// //       // throw error
// //       console.log(error.res.body);
// //     });

// //     done();
// // }

// }

// module.exports = {
//   analyze: analyze
// };
