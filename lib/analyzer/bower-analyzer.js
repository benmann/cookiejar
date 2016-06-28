const env = require('./config/local.env.js'),
      got = require('got'),
      fs = require('fs'),
      exec = require('exec'),
      jsonValidator = require('./helper/validateJSON.js'),
      collect = require('./collect/github.js'),
      download = require('./download/github.js');

function analyze(package) {
  return new Promise(function (done, reject){

    var newMetadata = {};

    var metadata = collect.fromGithub(package.name, package.repository)
    .then((metadata) => {
      newMetadata = metadata;
    })
    .then(download.fromGithub(package).then((res) => {
      var pathToBowerJSON = "./tmp/"+package.name+"/package.json";
        fs.readFile(pathToBowerJSON, "utf8", function(err, data) {
          if (err) {
            console.log(err);
          }

          if (jsonValidator.validate(data)) {
            var jsondata = JSON.parse(data);
            newMetadata.dependencies = jsondata.dependencies || "";
            newMetadata.keywords = jsondata.keywords;
            newMetadata.license = jsondata.license;
            newMetadata.jsonDescription = jsondata.jsonDescription;
            newMetadata.version = jsondata.version;
          }

        var deletePackage = "rm -rf './tmp/"+package.name+"'";
        exec(deletePackage, function(err, out, code) {
          if (err instanceof Error){
            // ...
          }
        });

        console.log(newMetadata);
        // api.updatePackage(package.name, metadata);
      });
    })
    .then(() => {
      done();
    }));
  });
}


module.exports = {
  analyze: analyze
};