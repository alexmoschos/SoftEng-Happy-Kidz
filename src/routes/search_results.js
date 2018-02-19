var express = require('express');
var router = express.Router();
var url = require('url');
var elastic = require('../apis/elastic_interface');
router.get('/', function(req, res, next) {
    // TODO: Add image links, AgeGroups, ProviderName and ID, Provider Phone,
    // Maybe delete startingPrice field from ejs.
    // Make sure to render a helpful text when no search results are found.

    var endDate = new Date(req.query.endDate).getTime() /1000 + 24 * 60 * 60;
    if (isNaN(endDate))
        endDate = undefined;

    filters = {
        free_text : req.query.q,
        price : req.query.endPrice,
        distance : req.query.radius,
        tickets : 1,
        address : req.query.location,
        page : req.query.page,
        max_time: endDate,
        age_group: req.query.AgeGroup
    }

    var page = req.query.page;
    if (req.query.page == null)
        page = 0;



    elastic.search('events',filters, (hits) => {
        obj = [];
        hits.forEach((element) => {
            var agegroups = "";
            switch(element._source.minAge) {
                case 3:
                    agegroups = "3-5";
                    break;
                case 6:
                    agegroups = "6-8";
                    break;
                case 9:
                    agegroups = "9-12";
                    break;
                default: 
                    agegroups = ">12"
            };

            obj.push ({
                title : element._source.title,
                date : new Date(element._source.startTime * 1000).toLocaleDateString(),
                time : new Date(element._source.startTime * 1000).toLocaleTimeString(),
                address : element._source.geoAddress,
                providerName : element._source.providerName,
                finalPrice : element._source.ticketPrice,
                phone : element._source.providerPhone,
                agegroups : agegroups,
                images : [
                    "files/events/" + element._source.eventId + "/0"
                ],
                geolon : element._source.geoLocation.lon,
                geolat : element._source.geoLocation.lat,
                eventId: element._source.eventId,
                providerId: element._source.organizerId
            });
        });

        info = {
            obj : obj,
            activity : req.query.q,
            location : req.query.location,
            ageGroup : req.query.AgeGroup,
            // startPrice : startPrice,
            radius : req.query.radius,
            endPrice : req.query.endPrice,
            //startDate : startDate,
            endDate : req.query.endDate,
            page : page,
    
        };
        // console.log(info);
        res.render('search_results', info);

    });
});

module.exports = router;
