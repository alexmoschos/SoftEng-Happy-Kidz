var express = require('express');
var router = express.Router();
var url = require('url');

router.get('/', function(req, res, next) {
    obj = [
        {
          title : "Alex Kalom",
          date : "14/12/1999",
          time : "14:49",
          address : "Iroon Polutexneiou 1 Athens",
          providerName : "Kostis Sagonas",
          startingPrice : "42",
          finalPrice : "24",
          phone : "6982532427086",
          agegroups : "16-21",
          images : [
              "https://i.ndtvimg.com/i/2016-11/sleeping_620x350_51479727691.jpg"
          ],
          geolon : 131.044,
          geolat : -25.363
        },
        {
          title : "Alex Moschos",
          date : "14/12/1999",
          time : "14:49",
          address : "Iroon Polutexneiou 2 Athens",
          providerName : "Kostis Sagonas",
          startingPrice : "42",
          finalPrice : "24",
          phone : "698253242708",
          agegroups : "16-21",
          images : [
              "https://i.ndtvimg.com/i/2016-11/sleeping_620x350_51479727691.jpg"
          ],
          geolon : 131.044,
          geolat : -24.363
        },
        {
          title : "Alex Kalom",
          date : "14/12/1999",
          time : "14:49",
          address : "Iroon Polutexneiou 3 Athens",
          providerName : "Kostis Sagonas",
          startingPrice : "42",
          finalPrice : "24",
          phone : "6982532427086",
          agegroups : "16-21",
          images : [
              "https://i.ndtvimg.com/i/2016-11/sleeping_620x350_51479727691.jpg"
          ],
          geolon : 130.044,
          geolat : -25.363
        },
        {
          title : "Alex Moschos",
          date : "14/12/1999",
          time : "14:49",
          address : "Iroon Polutexneiou 4 Athens",
          providerName : "Kostis Sagonas",
          startingPrice : "42",
          finalPrice : "24",
          phone : "698253242708",
          agegroups : "16-21",
          images : [
              "https://i.ndtvimg.com/i/2016-11/sleeping_620x350_51479727691.jpg"
          ],
          geolon : 132.044,
          geolat : -25.363
        },
        {
          title : "Alex Kalom",
          date : "14/12/1999",
          time : "14:49",
          address : "Iroon Polutexneiou 5 Athens",
          providerName : "Kostis Sagonas",
          startingPrice : "42",
          finalPrice : "24",
          phone : "6982532427086",
          agegroups : "16-21",
          images : [
              "https://i.ndtvimg.com/i/2016-11/sleeping_620x350_51479727691.jpg"
          ],
          geolon : 131.044,
          geolat : -26.363
        },
        {
          title : "Alex Moschos",
          date : "14/12/1999",
          time : "14:49",
          address : "Iroon Polutexneiou 6 Athens",
          providerName : "Kostis Sagonas",
          startingPrice : "42",
          finalPrice : "24",
          phone : "698253242708",
          agegroups : "16-21",
          images : [
              "https://i.ndtvimg.com/i/2016-11/sleeping_620x350_51479727691.jpg"
          ],
          geolon : 131.044,
          geolat : -27.363
        }
    ];
    var q = "value=" + req.query.q;
    if (req.query.q == null)
        q = "";
    var location = "value=" + req.query.location;
    if (req.query.location == null)
        location = "";
    var ageGroup = "" + req.query.AgeGroup;
    if (req.query.AgeGroup == null)
        ageGroup = "one";

    var startPrice = "value=" + req.query.startPrice;
    if (req.query.startPrice == null)
        startPrice = "";

    var endPrice = "value=" + req.query.q;
    if (req.query.endPrice == null)
        endPrice = "";

    var startDate = "value=" + req.query.startDate;
    if (req.query.startDate == null)
        startDate = "";

    var endDate = "value=" + req.query.endDate;
    if (req.query.endDate == null)
        endDate = "";

    var startDate = "value=" + req.query.startDate;
    if (req.query.endDate == null)
        endDate = "";
    var page = req.query.page;
    if (req.query.page == null)
        page = 0;
    console.log(ageGroup);
    info = {
        obj : obj,
        activity : q,
        location : location,
        ageGroup : ageGroup,
        startPrice : startPrice,
        endPrice : endPrice,
        startDate : startDate,
        endDate : endDate,
        page : page
    };
    // console.log(info);
    res.render('search_results', info);
});

module.exports = router;
