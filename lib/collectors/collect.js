const amqp = require("amqp"),
      got = require("got"),
      fs = require("fs"),
      jsonfile = require("jsonfile");

const connection = amqp.createConnection({ host:"amqp://rabbitmq:5672"}, {reconnect:true}),
      bowerRemoteJSONpath = "https://bower.herokuapp.com/packages",
      bowerLocalJSONpath = "./data/bower.json";

  got(bowerRemoteJSONpath).then(response => {
    fs.writeFile(bowerLocalJSONpath, response.body, function (err) {
      if (err) return console.log(err);
    });
  })
  .then(enqueue => {
     connection.queue('package_q', { autoDelete: false, durable: true }, function(q){
      q.bind('#');
      q.on('queueBindOk', function() {

        jsonfile.readFile(bowerLocalJSONpath, function(err, packages) {
          packages.forEach(function(package, index) {
            var urlArray = package.url.split("/");
            var preparedPackage = {
                  packName: package.name,
                  packUrl: package.url,
                  repository: urlArray[urlArray.length - 2] +"/"+urlArray[urlArray.length - 1].substring(0, urlArray[urlArray.length - 1].length-4),
                  packType: "bower"
                };

            connection.publish('package_q', preparedPackage);
            console.log("published: "+package.name);
          });
        });

      });
    });
  })
  .catch(error => {
    console.log(error.response.body);
  });