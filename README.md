# 🍪 cookiejar
> Unofficial Bower registry with rethinkDB and elasticsearch   

[![bitHound Overall Score](https://www.bithound.io/github/BenMann/cookiejar/badges/score.svg)](https://www.bithound.io/github/BenMann/cookiejar)   

cookiejar rebuilds the Bower registry by using RethinkDB as main database and automatic replication to elasticsearch. Only relevant data is indexed and all actions on Rethink are mirrored to elastic via logstash.
Adding elasticsearch to the stack makes search and analytics easier and more reliable. Cookiejar is built modular and allows different workers to provide the actual data, while
providing an easy to use API, which clients can interact with.

### Requirements
rethink DB 2.2.2   
logstash 2.1.1   
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

### Functions
`getAllPackages()`
returns 50k packages, which are currently all packages available.   
`searchForPackages()`
gets a list of packages that loosely match the entered name   
`getPackageByName()`
returns a single package that fits the query exactly (or none)   
`getPackageByID()`
rather for internal use, fetches a single package by _id   
`createPackage()` Creates package after checking validity (URL/name)   
==> All created packages are autmomatically replicated into elasticsearch.
   
You'd like to contribute? [Here's a good start!](https://www.bithound.io/github/BenMann/cookiejar/master/techdebt)
