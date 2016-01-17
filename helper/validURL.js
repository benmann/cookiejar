var config = require('../config/config'),
    spawn = require('child-process-promise').spawn,
    q = require("q"),
    deferred = q.defer();

/*
* validateUrl
* @param {string} url
* @return {int} exitCode (0 if valid or 128)
*/
function validateUrl(url) {
  if (config.skipValidation) {
    return 0;
  }

  spawn('git', ['ls-remote',  url], {stdio: 'ignore'}).progress(function (childProcess) {
    childProcess.on('close', function (exitCode) {
      deferred.resolve(exitCode);
    });
  });
  
  return deferred.promise;
};



module.exports = {
  validateUrl: validateUrl
};
