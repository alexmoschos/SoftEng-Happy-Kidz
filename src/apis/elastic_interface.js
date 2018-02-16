// connect to elasticsearch server
var elasticsearch = require('elasticsearch');
var request = require('request');
var geocoding = require('./geocoding');

var client = elasticsearch.Client({
    host: 'localhost:9200'
});

// check if elasticsearch server is accessible
client.ping({
    requestTimeout:30000
}, function (error) {
    if (error) {
        console.log('elastic cluster is down!');
    } else {
        console.log('elastic cluster is up...\n');
        initialiaze_elastic();
    }
});

function initialiaze_elastic() {
    // if the events index does not exist 
    // we create it.
    client.indices.exists({index: 'events'}).then(function(res, err) {
        if (!res) {
            client.indices.create({
                index: 'events',
                body: {
                    "mappings": {
                        "general": {
                            "properties": {
                                "name": { 
                                    "type": "text",
                                    "fields": {
                                        "greek": { 
                                            "type":     "text",
                                            "analyzer": "greek"
                                        }
                                    }
                                },
                                "description": { 
                                    "type": "text",
                                    "fields": {
                                        "greek": { 
                                            "type":     "text",
                                            "analyzer": "greek"
                                        }
                                    }
                                },
                                "location" : {
                                    "type": "geo_point"
                                },
                                "price" : {
                                    "type": "float"
                                }
                            }
                        }
                    }
                }
            });
        }
    });
}



function createQuery(filters, callback) {
    var query = {
        bool: {
            must: [],
            filter: []
        }
    };
    
    if (filters.free_text && filters.free_text.length != 0) {
      query.bool.must.push({
            multi_match : {
                type: 'most_fields',
                query : filters.free_text,
                fields: ['name', 'name.greek', 'description', 'description.greek']
            }
      });
    }
  
    if (filters.tickets && filters.tickets.length != 0) {
        query.bool.filter.push({
            range: {tickets: {gte: parseInt(filters.tickets)}}
        });
    }
  
    if (filters.price && filters.price.length != 0) {
        query.bool.filter.push({
            range: {price: {lte: parseFloat(filters.price)}}
        });
    }
  
    if (filters.max_time && filters.max_time.length != 0) {
        query.bool.filter.push({
            range: {start_time: {lte: parseInt(filters.max_time)}}
        });
    }
  
    if (filters.address && filters.address.length != 0) {
        var dist = '10';
        if (filters.distance && filters.distance.length != 0)
            dist = filters.distance;
        

        geocoding(filters.address, function(loc) {
            query.bool.filter.push({
                geo_distance: {
                        distance: dist + 'km',
                        location: {
                            lat: loc.lat,
                            lon: loc.lng
                        }
                }
            });
            callback(query);
        });
    } else
        callback(query);
}


function insert_document(index, obj, f) {
    // if f is provided, it should have three parameteres
    // error, response, and status.
    var to_submit = {
        index: index,
        type: 'general',
        body: obj
    }
    if (f != undefined)
        client.index(to_submit, f);
    else 
        client.index(to_submit);
}

function update_document(index, id, obj, f) {
    var to_submit = {
        index: index, 
        type: 'general',
        id: id,
        body: {
            doc: obj
        }
    }
    if (f != undefined)
        client.update(to_submit, f);
    else 
        client.update(to_submit);
}

function delete_document(index, id, f) {
    var to_submit = {
        index: index,
        type: 'general',
        id: id
    }
    if (f != undefined) 
        client.delete(to_submit, f);
    else 
        client.delete(to_submit);
}


function search_document(index, filters, f) {
    createQuery(filters, function (query) {
        client.search({  
                index: index,
                body: {
                    query: query,
                }
            },function (error, response,status) {
                if (error){
                    console.log("search error: "+error)
                }
                else {
                        f(response.hits.hits);
                }
        });
    });
}


var api = {
    client: client, // this shoud be removed at the end.
    insert: insert_document,
    update: update_document,
    delete: delete_document,
    search: search_document
}

module.exports = api;