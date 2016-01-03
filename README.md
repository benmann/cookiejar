# 🍪 cookiejar
> Unofficial Bower registry with RethinkDB and elasticsearch   

[![bitHound Overall Score](https://www.bithound.io/github/BenMann/cookiejar/badges/score.svg)](https://www.bithound.io/github/BenMann/cookiejar)   

cookiejar rebuilds the Bower registry by using RethinkDB as main database and automatic replication to elasticsearch. Only relevant data is indexed and all actions on Rethink are mirrored to elastic via logstash.
Adding elasticsearch to the stack makes search and analytics easier and more reliable. Cookiejar is built modular and allows different workers to provide the actual data, while
providing an easy to use API, which clients can interact with.

### Requirements
rethink DB 2.2.2   
logstash 2.1.1 + [input plugin](https://github.com/rethinkdb/logstash-input-rethinkdb)
elasticsearch 2.1.0   

### Using cookiejar
- run RethinkDB
- run elasticsearch
- run logstash (with included config)
- run /init to populate the DB
- use [cookiemonster](https://github.com/BenMann/cookiemonster) to query the database
- enjoy cookies 🍪

### Populating
The route `/init` will populate your databases with the included dataset in `/data`. You can always populate with newer data by fetching `$ curl http://bower.herokuapp.com/packages
` and using that JSON.

### Querying the registry :mag_right: 
Cookiejar uses Netflix' [Falcor](https://github.com/Netflix/falcor) to hide different routes behind one single endpoint. Every request to the database is then internally routed by Falcor and returns an on-the-fly generated JSON Graph.

To communicate with the registry, you can use the following queries:   

:o: `registryInfo`  
```
model.get("registryInfo").then(function(response) {
  document.write(response.json.registryInfo.version);
});
```

:o: `packages.length`   
```
model.get("packages.length").then(function(response) {
  document.write(response.json.packages.length);
});
```

:o: `packagesByName`  
```
model.get("packagesByName.bower").then(function(response) {
  var res = response.json.packagesByName.bower;
  for (pack in res) {
    document.write(res[pack].name+" - "+res[pack].url+"<br>");
  }       
});
```

:o: `packageById`   
```
model.get(["packageById", "4J_wSnMIbr8x", "url"]).then(function(response) {
  document.write(response.json.packageById["4J_wSnMIbr8x"].url);
});
```


:soon: `createPackage()` Creates package after checking validity (URL/name)   
:soon: `removePackage()`  Removes a package from the registry based on ID or name
   
--
[Here's a good start](https://www.bithound.io/github/BenMann/cookiejar/master/techdebt) if you'd like to contribute!
