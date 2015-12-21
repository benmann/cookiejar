var config = require('../config/config');

/* =============================================
* GET general registry info
* =========================================== */
exports.getRegistryInfo = function(callback) {
  var registryInfo = {
      version: config.version,
      name: config.name,
      description: config.description
    }
    callback(null, registryInfo);
};

