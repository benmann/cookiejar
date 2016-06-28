var config = require('../config/config'),
    spawn = require('child-process-promise').spawn,
    Package = require('../models/package.js'),
    q = require("q"),
    deferred = q.defer();

var thinky = require('thinky')(),
    Errors = thinky.Errors;

/*
* check if package url is valid
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


/*
* check if package names conforms with the spec
* @param {string} name
* @return {obj} contains erorrs that occured
*
*  regex to validate packages names according to the spec - https://github.com/bower/bower.json-spec#name
*  - Lowercase, a-z, can contain digits, 0-9, can contain dash or dot but not start/end with them.
*  - Consecutive dashes or dots not allowed.
*  - 50 characters or less.
*
*/
function validateName(name) {
  var isValid = true,
      errors = [],
      length;

  if (!name.match(/^.{1,50}$/)) {
      errors.push('be between 1 and 50 characters');
  }
  // @BenMann: I enforced lowercase letters again!
  if (!name.match(/^[a-z0-9._-]*$/)) {
      errors.push('only contain lower case a through z, 0 through 9, dots, dashes, and underscores');
  }
  if (!!name.match(/[._-]{2,}/)) {
      errors.push('not have consecutive dashes, dots, or underscores');
  }
  if (!name.match(/^[^._-].*[^._-]$/)) {
      errors.push('not start or end with dashes, dots, or underscores');
  }

  length = errors.length;

  if (length) {
    if (length > 1) {
      errors[length - 1] = 'and must ' + errors[length - 1];
    }
    isValid = {
      error: 'Package names must ' + errors.join(', ') + '.'
    };
  }
  
  return isValid;
};


/*
* check if package name already exists
* @param {string} name
* @return {bool}
*/
function packageNameExists(name) {
  return Package.get(name).run().then(function(pkg) {
    return q.fcall(function () {
      return true;
    });
  }).catch(Errors.DocumentNotFound, function(err) {
    return q.fcall(function () {
      return false;
    });
  });
};


module.exports = {
  validateUrl: validateUrl,
  validateName: validateName,
  packageNameExists: packageNameExists
};
