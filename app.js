var express = require('express'),
    path = require('path'),
    falcorExpress = require('falcor-express'),
    Router = require('falcor-router'),
    bodyParser = require('body-parser'),
    q = require("q");

var config = require('./config/config.js'),
    cors = require('./config/cors.js'),
    router = require('./router'),
    init = require('./router/init'),
    npmWorker = require('./workers/npm-worker.js'),
    app = express();

app.use(cors);
app.use(express.static(__dirname + '/'));

app.use(bodyParser.urlencoded({extended: true}));
app.use('/model.json', falcorExpress.dataSourceRoute(function(req, res) {
  return new router();
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/init', init);
app.use('/npm', npmWorker.fetchFromNpm);

app.listen(config.port);
console.log(
  'cookiejar running on port ' + config.port + '\n' +
  'rethinkDB running on ' + config.thinkHost + ":" +config.thinkPort + " using DB: " +config.thinkDB + '.'
);

module.exports = app;
