# HappyKidz δραστηριότητες για τα παιδιά σας

## Routes

 |      Route       |      Method       |     Page      |
 |     --------     |     --------      |   --------    |
 |         /        |       GET         |    landing    |
 |       /search?q=\<name1\>:\<value1\>&\<name2\>\<value2\>&...          | GET |  search events   |
 |  /events/:id     |       GET         | verified event page    |
 |  /event_create   |       POST        | new event route |
 |  /event_create   |       GET         | new event form |
 |      /login      |       GET         |    login      |
 | /login/organizer |       POST        | authentication route |
 | /login/parent    |       POST        | authentication route |
 | /register        |       GET        |   register page   |
 | /organizer       |    POST       |  organizer register route |
 | /parent          |     POST      | parent register route  |
 | /parent/:id      |       GET         | user profile page |
 | /provider/:id    |       GET         | org. profile page |
 |      /register   |       GET         |    register   |
 | /events/:id      |       GET         | Event Page    |
| /admin            |       GET         | admin dashboard|
|/admin/provider/:id|       GET         | admin provider verification page|
|/admin/events/:id|       GET         | admin event verification page|
 |  /events/:id     |       PUT         | verification route    |
 |  /events/:id     |       DELETE         | delete route    |
 | /membership      |       GET         | Αγορά membership |
 | /payment         |       GET         | Σελίδα πληρωμής  |
 | /payment/success |       GET         | Σελίδα επιτυχούς πληρωμής  |
 | /payment/fail    |       GET         | Σελίδα αποτυχημένης πληρωμής  |


## HTML -> ejs
 1. Δημιουργία ejs αρχείου στον φάκελο views και αντιγραφή του html σε αυτό.
 2. Το στατικό περιεχόμενο στον φάκελο public (images, css, js).
 3. Στο αρχείο app.js δημιουργία route που σερβίρει το ejs
 4. Σε όποιο σημείο χρειάζονται πληροφορίες από το backend περνάμε ένα fake object που κατασκευάζουμε εμείς.


 πχ.

```javascript
app.get('/exampleroute', function(req, res){
    res.render('path/example_ejs', {
        name1: value1,
        name2: value2
    });
};
```

## File uploads

Για να μπορεί ένα route να διαχειριστή εισερχόμενες φόρμες με αρχεία, θα πρέπει το αντίστοιχο app.use να μπει κάτω από το app.use που μιλάει για formidable.

Παράδειγμα διαχείρησης φόρμας με post που περιέχει αρχείο.

```
router.post('/', function (req, res, next) {
    var files = req.files;
    var fields = req.fields;
    if (fields.id.length == 0)
        fields.id = '1';
    var newdir = path.join(__dirname, '../public/files/',  fields.id);
    if (!fs.existsSync(newdir)){
        fs.mkdirSync(newdir);
    }
    var count=0;
    for (i in files) {
        var newpath = path.join(newdir, count.toString());
        count++;
        fs.rename(files[i].path, newpath, function (err) {
            if (err) throw err;
        });
    }
    res.render('file_upload');
});
```

Η αντίστοιχη φόρμα που περιέχει αρχείο πρέπει να έχει ένα attribute enctype="multipart/form-data"

```
<form action="/file_upload" method="POST" enctype="multipart/form-data" >
```