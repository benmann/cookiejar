const amqp = require('amqp'),
      connection = amqp.createConnection({ host:"amqp://rabbitmq:5672"}, {reconnect:true});
const isGithubUrl = require('is-github-url'),
      bowerAnalyzer = require('./bower-analyzer.js'),
      npmAnalyzer = require('./npm-analyzer.js'),
      composerAnalyzer = require('./composer-analyzer.js');

connection.on('ready', function () {
  connection.queue('package_q', { autoDelete: false, durable: true }, function(q){
      q.bind('#');
      q.subscribe({ ack: true, prefetchCount: 1 }, function (package) {

        package.isOnGitHub = false;
        if(package.url && isGithubUrl(package.url)){
          package.isOnGitHub = true
        }

        // if(package.type = "npm"){
        //   npmAnalyzer.analyze(package).then(done => {
        //     console.log("yo done");
        //     // q.shift();
        //   });
        // }

        if(package.type = "bower"){
          bowerAnalyzer.analyze(package).then(done => {
            console.log(done);
            q.shift();
          });
        }

        // if(package.type = "composer"){
        //   composerAnalyzer.analyze(package);
        // }



      });
  });
});