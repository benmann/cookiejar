var express = require('express'),
    path = require('path'),
    falcorExpress = require('falcor-express'),
    Router = require('falcor-router'),
    bodyParser = require('body-parser'),
    q = require("q");

var config = require('./config/config.js'),
    cors = require('./config/cors.js'),
    router = require('./router'),
    app = express();

app.use(cors);
app.use(express.static(__dirname + '/'));
app.use('/model.json', falcorExpress.dataSourceRoute(function(req, res) {
  return new router();
}));


app.listen(config.port);
console.log(
  'cookiejar running on port ' + config.port + '\n' +
  'rethinkDB running on ' + config.thinkHost + ":" +config.thinkPort + " using DB: " +config.thinkDB + '.'
);

module.exports = app;