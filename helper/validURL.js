var config = require('../config/config'),
    spawn = require('child_process').spawn;

module.exports = function(url, callback) {

  if (config.skipValidation) {
    callback(true);
    return;
  }

  var git = spawn('git', ['ls-remote',  url], {
        stdio: 'ignore'
      });

  git.on('close', function(exitCode) {
      callback(exitCode === 0);
  });

};