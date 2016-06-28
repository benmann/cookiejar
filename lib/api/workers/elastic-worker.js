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
      type: "package",
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
          isPublic:     {type: "boolean", "default": config.isPublic},
          readme:       {type: "string"},
          license:      {type: "string"},
          metadata: {
            avatar_url: {type: "string"},
            html_url: {type: "string"},
            description: {type: "string"},
            created_at: {type: "string"},
            updated_at: {type: "string"},
            pushed_at: {type: "string"},
            homepage: {type: "string"},
            stargazers_count: {type: "string"},
            watchers_count: {type: "string"},
            language: {type: "string"},
            forks_count: {type: "string"},
            open_issues_count: {type: "string"},
            forks_count: {type: "string"},
            subscribers_count: {type: "string"},
            maintainers: {type: "string"},
            url: {type: "string"},
            type: {type: "string"},
            versions: {type: "string"},
            dependencies: {type: "string"},
            keywords: {type: "string"},
            license: {type: "string"},
            jsonDescription: {type: "string"},
            version: {type: "string"}
          }
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
      type: "package",
      body: {
        id: document.id || shortid.generate,
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


/* =============================================
* elasticsearch: remove document by package name
* this always needs to occur when the primary DB
* makes a deletion
* =========================================== */
exports.removeDocument = function(packName) {

  return elasticClient.search({
    index: "packages",
    type: "package",
    size: 1,
    body: {
      query: {
        "term" : {
          "name" : packName
        }
      }
    }
  }).then(function(searchresult) {
      return elasticClient.delete({
        index: indexName,
        type: "package",
        id: searchresult.hits.hits[0]._id
      }, function(err, res){
        if(err){
          console.log(err);
        }
        return {};
    });
});

}


/* =============================================
* elasticsearch: update document by package name
* this always needs to occur when the primary DB
* makes an update
* =========================================== */
exports.updateDocument = function(packName, data) {

  return elasticClient.search({
    index: "packages",
    type: "package",
    size: 1,
    body: {
      query: {
        "term" : {
          "name" : packName
        }
      }
    }
  }).then(function(searchresult) {
      return elasticClient.update({
        index: indexName,
        type: "package",
        id: searchresult.hits.hits[0]._id,
        body: {
          doc: {
            "metadata": {
              avatar_url: data.avatar_url,
              html_url: data.html_url,
              description: data.description,
              created_at: data.created_at,
              updated_at: data.updated_at,
              pushed_at: data.pushed_at,
              homepage: data.homepage,
              stargazers_count: data.stargazers_count,
              watchers_count: data.watchers_count,
              language: data.language,
              forks_count: data.forks_count,
              open_issues_count: data.open_issues_count,
              forks_count: data.forks_count,
              subscribers_count: data.subscribers_count,
              maintainers: data.maintainers,
              url: data.url,
              type: data.type,
              versions: data.versions,
              dependencies: data.dependencies,
              keywords: data.keywords,
              license: data.license,
              jsonDescription: data.jsonDescription,
              version: data.versiont
            }
          }
        }
      }, function(err, res){
        if(err){
          console.log(err);
        }
        return {};
    });
});

}