### Installing on a Mac
1) `brew update && brew install rethinkdb` or [from source](https://www.rethinkdb.com/docs/install/osx/)   
2) `brew update && brew install elasticsearch` or [download](https://www.elastic.co/downloads/elasticsearch)   
3) Installing logstash: [download](https://www.elastic.co/downloads/logstash) and extract logstash (eg: ~/logstash/)   
4) From within the logstash directory, follow the instructions of the [input plugin](https://github.com/rethinkdb/logstash-input-rethinkdb)   
  --> `$ bin/plugin install logstash-input-rethinkdb`

--

All prerequisites should be installed now.
Let's start all the services:
   
(if you installed via `brew`)   
1) `$ rethinkdb`   
2) `$ elasticsearch`   
3) run logstash with included config. This is located under `_logstash` in this repo. Make sure the path ot the template is correct. This depends on where your config file is located!
##### DO NOT CREATE THE TABLE `Package` MANUALLY! Thinky will ensure the primary key is on `name`.
```
~/logstash/bin/logstash -e '
input {rethinkdb
   {host => "localhost"
    port => 28015
    auth_key => ""
    watch_dbs => ["cookiejar"]
    watch_tables => ["cookiejar.Package"]
    backfill => true
    }}
output {
  elasticsearch {
    hosts => ["localhost:9200"]
    index => "packages"
    document_type => "package"
    template => "_logstash/logstash.conf"
    template_overwrite => true
  }
  stdout { codec => json_lines }
}'
```
4) populate databases by going to `localhost:3000/init`
   
You should now see ~45k packages being written to RethinkDB and being replicated to elasticsearch.
 
