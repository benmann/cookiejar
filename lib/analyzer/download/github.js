const got = require('got'),
    fs = require('fs'),
    exec = require('exec');


/**
* We can get the entire repo without using the API by fetching the tarball from
* http://github.com/repo/repo/archive/master.tar.gz
* This is awesome because it works without API tokens and provides a lot of data :D
* URL can also be configured to fetch different versions than master..
*/
function fromGithub(package, callback) {
  return new Promise(function (done, reject){

    var tmpDir = "./tmp",
        tarballUrl = "http://github.com/"+package.repository+"/archive/master.tar.gz",
        tarballFile = tmpDir+"/"+package.name+".tar.gz";

    var curlPackage = "mkdir ./tmp/"+package.name+"; cd ./tmp/"+package.name+"; curl -sL https://github.com/"+package.repository+"/tarball/master | tar xz --strip-components=1";

    exec(curlPackage, function(err, out, code) {
      if (err instanceof Error){
        // process.exit(0);
        // return;
      }
      done();
    });

  });
}

module.exports = {
  fromGithub: fromGithub
};