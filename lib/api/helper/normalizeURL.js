var config = require('../config/config'),
    skipNormalization = config.skipNormalization,
    SshURL = require('ssh-url'),
    URL = require('url');

module.exports = function(suppliedURL) {

  if (skipNormalization) {
    return suppliedURL;
  }

  var url = suppliedURL,
      parsedURL = URL.parse(suppliedURL);

  if (!parsedURL.protocol) {
    parsedURL = SshURL.parse(url);
  }

  if (parsedURL.hostname.match(/((www\.)|^)github.com$/)) {
    var pathname = parsedURL.pathname;
        pathname = pathname.replace(/\/?$/,'');
    var ext = pathname.match(/\.git$/) ? '' : '.git';

    url = 'https://github.com' + pathname + ext;
  }

  return url;
};