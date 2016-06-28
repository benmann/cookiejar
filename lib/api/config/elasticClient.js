var config = require('./config'),
    elasticsearch = require('elasticsearch'),
    elastic = elasticsearch.Client({
      host: 'localhost:9200'
    });

module.exports = elastic;