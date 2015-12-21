# 🍪 cookiejar
Unofficial Bower registry with rethinkDB and elasticsearch

cookiejar rebuilds the Bower registry by using rethink DB as main database and automatic replication to elasticsearch. Only relevant data is indexed and queries are only hydrated if needed.
Adding elasticsearch to the stack makes search and analytics easier and more reliable. Cookiejar is built modular and allows different workers to provide the actual data, while
providing an easy to use API, which clients can interact with.

### Requirements
rethink DB 2+
elasticsearch 2.1.0


### Installation
The route `/init` will populate your database with the included dataset in `/data`. You can always populate with newer data by fetching `$ curl http://bower.herokuapp.com/packages
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

