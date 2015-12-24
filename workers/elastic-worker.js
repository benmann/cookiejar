var config = require('../config/config.js')
  elasticsearch = require('elasticsearch'),
  elasticClient = require('../config/elasticClient.js'),
  shortid = require('shortid');


var indexName = "packages";


/* =============================================
* elasticsearch: initialize mapping
* =========================================== */
exports.initMapping = function() {
  return elasticClient.indices.putMapping({
      index: indexName,
      type: "pkg",
      body: {
        properties: {
          id:           {type: "string", "default": shortid.generate},
          name:         {type: "string"},
          type:         {type: "string", "default": "pkg"},
          owner:        {type: "string"},
          description:  {type: "string"},
          keywords:     {type: ["string"]},
          url:          {type: "string"},
          created_at:   {type: "date", "default": Date.now},
          hits:         {type: "number"},
          stars:        {type: "number"},
          isPublic:     {type: "boolean", "default": config.isPublic}
        }
      }
  });
}



/* =============================================
* elasticsearch: delete index (packages)
* =========================================== */
exports.deleteIndex = function() {
  return elasticClient.indices.delete({
    index: indexName
  });
}


/* =============================================
* elasticsearch: initialize index (packages)
* =========================================== */
exports.initIndex = function() {
  return elasticClient.indices.create({
    index: indexName
  });
}


/* =============================================
* elasticsearch: check if index (packages) exists
* =========================================== */
exports.indexExists = function() {
  return elasticClient.indices.exists({
    index: indexName
  });
}


/* =============================================
* elasticsearch: add document to index (packages)
* Those are our literal Bower packages
* =========================================== */
exports.addDocument = function(document) {
  return elasticClient.index({
      index: indexName,
      type: "pkg",
      body: {
        id: shortid.generate,
        name: document.name,
        type: document.type,
        owner: document.owner,
        description: document.description,
        keywords: document.keywords,
        url: document.url,
        created_at: Date.now,
        hits: document.hits,
        stars: document.stars,
        isPublic: document.isPublic || config.isPublic
      }
  });
}
