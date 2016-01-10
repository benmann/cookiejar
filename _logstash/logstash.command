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