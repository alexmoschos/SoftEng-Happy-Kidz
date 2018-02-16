#!/bin/bash
elasticSearchRepo="docker.elastic.co/elasticsearch/elasticsearch-oss:6.1.1"
postgresqlRepo="postgres:9.5.10"

# Check if Node.js exists in the system
if [ $(dpkg-query -W -f='${Status}' nano 2>/dev/null | grep -c "ok installed") -eq 0 ];
then
	echo "Node.js is not installed. Installing Node.js ..."
	curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
	apt-get install -y nodejs
fi
# Install Node.js dependencies
npm install

# Check if docker exists in the system
if [ $(dpkg-query -W -f='${Status}' nano 2>/dev/null | grep -c "ok installed") -eq 0 ];
then
	echo "Docker is not installed. Installing Docker ..."
	apt-get update
	apt-get install apt-transport-https ca-certificates curl software-properties-common
	curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
	add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
	apt-get update
	apt-get install docker-ce
fi

# Install Docker Images

# Pull ElasticSearch Image (6.1.1 OSS)
docker pull $elasticSearchRepo
# Pull PostgreSQL Image (9.5.10)
docker pull $postgresqlRepo

# Start ElasticSearch
docker container run \
--name elasticsearch \
-p 9200:9200 \
-p 9300:9300 \
-d \
$elasticSearchRepo

# Start PostgreSQL
docker container run \
--name postgres \
-p 5432:5432 \
-e POSTGRES_USER=dev \
-e POSTGRES_PASSWORD=password \
-e POSTGRES_DB=devdb \
-d \
$postgresqlRepo

