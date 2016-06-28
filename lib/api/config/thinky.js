var config = require('./config');
var thinky = require('thinky')({
  host: config.thinkHost,
  port: config.thinkPort,
  authKey: config.thinkAuthKey,
  db: config.thinkDB
});


module.exports = thinky;