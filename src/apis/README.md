# APIS Documentation

## elastic_interface

Πραγματοποιεί την σύνδεση με την elastic βάση, και παρέχει μεθόδους για αλληλεπίδραση μαζί της. Συγκεκριμένα παρέχονται 4 μέθοδοι (insert, update, delete, search).


### insert

Η μέθοδος insert παίρνει τρία ορίσματα. Το ευρετήριο στο οποίο θα τοποθετηθεί το νέο έγγραφο, το έγγραφο που θέλουμε να τοποθετήσουμε και ένα optional callback μετά την επιτυχή ή αποτυχημένη εισαγωγή. Ένα παράδειγμα εισαγωγής event στην elastic φαίνεται στο ακόλουθο παράδειγμα.

```
/* POST create event page */
router.post('/', function(req, res, next) {
    var event = req.body;
    console.log(event);
    geocoding(event.address, function(loc) {
        event.location = {
            lat: loc.lat,
            lon: loc.lng
        };
        event.tickets = parseInt(event.tickets);
        event.price = parseFloat(event.price);
        event.start_time = parseInt(event.start_time);
        event.end_time = parseInt(event.end_time);
        elastic.insert('events', event, function (err, resp, status) {
            if (err) {
                console.log(err);
            }
            else {
                res.send("ok");
            }
        });
    });
    console.log(req.body);
});
```

### update

H μέθοδος update παίρνει τέσσερα ορίσματα. Το ευρετήριο στο οποίο θα κάνει την αλλαγή, το id του εγγράφου που θέλουμε να κάνουμε update, την νέα τιμή του εγγραφού και τέλος ένα optional callback, το οποίο θα εκτελεστεί μετά την ολοκληρώση ή αποτυχία του update.

### delete

Αντίστοιχα δουλεύει και η delete η οποία παίρνει ως όρισμα το ευρετήριο στο οποίο θα κάνει την διαγραφή, το id του στοιχείου που θα διαγράψει, και ένα optional collback, που εκτελείται μετά την ολοκλήρωση ή την αποτυχία του delete.

Και οι δύο προηγούμενες μέθοδοι ακολουθούν τη λογική του insert. Για ευκολία αναφοράς, ακολουθούν τα prototypes των μεθόδων update και delete

```
function update(index, id, obj, f);
function delete(index, id, f);
```

### search

Η συμαντικότερη μέθοδος του elastic_interface είναι η search. Η search παίρνει τρία ορίσματα. Το πρώτο είναι το ευρετήριο στο οποίο θα γίνει η αναζήτηση. Το δεύτερο είναι ένα object που περιέχει τα φίλτρα της αναζήτησης και ένα callback στο οποίο θα δοθούν τα αποτελέσματα της αναζήτησης.

Όλα τα φίλτρα στο object των φίλτρων είναι προαιρετικά. Αν θέλουμε να πάρουμε όλα τα έγγραφα του ευρετηρίου, απλά δίνουμε το κενό object ({}) στη θέση των φίλτρων.

Τα φίλτρα που ορίζονται είναι τα εξής:
1. ελεύθερο κείμενο στο πεδίο free_text
2. αριθμός διαθέσιμων εισητιρίων στο πεδίο tickets
3. μέγιστη τιμή στο πεδίο price
4. μέγιστη ώρα έναρξης στο πεδίο max_time
5. διεύθυνση στο πεδίο address
6. Απόσταση απο διεύθυνση σε χιλιόμετρα στο πεδίο distance.

Σημείωση: Το φίλτρο της απόστασης δεν έχει κάποιο νόημα χωρίς διεύθυνση. Σε περίπτωση που οριστεί απόσταση αλλά όχι διεύθυνση το φίλτρο αυτό αγνοήται.

Παράδειγμα αναζήτησης

```
/* GET create event page. */
router.get('/', function(req, res, next) {
    var filters = req.query;
    console.log(filters);
    elastic.search('events', filters, (hits) => {
        console.log(hits[0]);
        res.render('search', {events: hits});
    });
});
```

τα αποτελέσματα είναι αντικείμενα της μορφής
```
{ _index: 'events',
  _type: 'general',
  _id: '2m4LpWABDOCIgeZFBz6J',
  _score: 1,
  _source:
   { eid: '4',
     oid: '3',
     name: 'test 3',
     description: 'test 3',
     address: 'Ηρώων πολυτεχνείου 9, Ζωγράφου, Athens',
     start_time: 1514597266,
     end_time: 1514597267,
     tickets: 120,
     price: 15,
     location: { lat: 37.9785796, lon: 23.7704801 } } }
```

Άρα τα δεδομένα που έχουμε εισάγει με insert βρίσκονται στο πεδίο _source. Το _id του αντικειμένου είναι αυτό που θα χρησιμοποιήσουμε για αλλαγές ή διαγραφή του αντικειμένου από το ευρετήριο.


## geocoding

H συνάρτηση geocoding επικοινωνεί με το maps api της google για την μετατροπή διεύθυνσης σε συντεταγμένες. Παίρνει σαν όρισμα την διεύθυνση για την οποία ζητάμε τις συντεταγμένες και ένα callback, το οποίο καλείται μετά την επίλυση της διεύθυνσης. Το callback παίρνει ως όρισμα τις συντεταγμένες της πρώτης δυνατής επίλυσης. Άρα όσο ποιο ακριβές είναι το κείμενο, τόσο ποιο πιθανό είναι να λάβουμε πίσω τις σωστές (αναμενόμενες) συντεταγμένες.

Το όρισμα που παίρνει το callback είναι τις μορφής

```
loc = {
    lat: ....,
    lng: .....
}
```

Παράδειγμα χρήσης της συνάρτησης geocoding

```
geocoding(event.address, function(loc) {
        event.location = {
            lat: loc.lat,
            lon: loc.lng
        };

        console.log(event.location);
}
```

## pdf_generator

Δίνει την δυνατότητα δημιουργίας και αποστολής pdf, διαφόρων τύπων. Για να γίνει χρήση του pdf_generator, κάνουμε require το pdf_generator. Επιστρέφεται ένα object που περιέχει δύο μεθόδους, save_pdf και send_pdf. Η πρώτη χρησιμοποιείται για τη δημιουργία και αποθήκευση ενός pdf στο τοπικό σύστημα αρχείων. Η δεύτερη χρησιμοποιείται για τη δημιουργία και αποστολή ενός pdf, ως απάντηση σε ένα http request. Αυτή τη στιγμή υποστηρίζεται ένας τύπος pdf, ticket.

### Παράδειγμα χρήσης 

Η μέθοδος save_pdf, παίρνει ως όρισμα ένα object με διάφορες παραμέτρους για τη δημιουργία του pdf.

```
var pdf = require('../apis/pdf_generator');


options = {
    filename: "public/files/untitled.pdf", 
    type: 'ticket', 
    title:'Redhood',
    date_and_time: 'Δευτέρα 13/05/2018 16:30',
    ticket_id: 04464053,
    number_of_tickets: 3,
    address: 'Αριστοτέλους 23, Πυλαία, Θεσσαλονίκη',
    event_img_src: 'public/files/redhood.jpg'
}

pdf.save_pdf(options);

```

Το object options πρέπει να περιέχει τουλάχιστον ένα filename, και τον τύπο του pdf. Τα υπόλοιπα πεδία εξαρτώνται από τύπο του pdf που θέλουμε να παράξουμε. Στο παράδειγμα θέλουμε να φτιάξουμε ένα pdf με όνομα untitled.pdf που βρίσκεται στον κατάλογο public/files και είναι τύπου ticket. 

Ο τύπος ticket χρειάζεται ακόμα το όνομα του event που μπαίνει στο πεδίο title, την ημερομηνία διεξαγωγής του event, το id του εισιτηρίου, το πλήθος των θέσεων που σχετίζονται με το συγκεκριμένο εισιτήριο, την διεύθυνση του event, και μία φωτογραφία του event.

Αντίστοιχα για να απαντήσουμε σε ένα http request με ένα pdf, κάνουμε χρήση της μεθόδου send_pdf.

```
var pdf = require('../apis/pdf_generator');


options = {
    filename: "untitled.pdf", 
    type: 'ticket', 
    title:'Redhood',
    date_and_time: 'Δευτέρα 13/05/2018 16:30',
    ticket_id: 04464053,
    number_of_tickets: 3,
    address: 'Αριστοτέλους 23, Πυλαία, Θεσσαλονίκη',
    event_img_src: 'public/files/redhood.jpg'
}

pdf.send_pdf(res, options);
```

Η κλήση στη send_pdf, είναι αντίστοιχη με αυτή στη save_pdf. Η διαφορά είναι ότι τώρα δίνουμε και το αντικείμενο res ως παράμετρο. Το πεδίο filename στην περίπτωση αυτή είναι το προτεινόμενο όνομα αρχείου, όταν ο χρήστης αποθηκεύσει το pdf.


## passport

Το άρθο [εδώ](https://medium.com/@nohkachi/local-authentication-with-express-4-x-and-passport-js-745eba47076d) είναι αρκετά καλό για να καταλάβει κανείς τον τρόπο με τον οποίο παίζει το authentication.

Γενικά με το passport αλληλεπιδρούν μόνο τα routes του register και login. Όλοι τα άλλα routes δεν χρειάζεται να γνωρίζουν την ύπαρξη του passport. Το authentication γίνεται από το passport και τα υπόλοιπα routes χρησιμοποιούν πληροφορία που αποθηκεύει το passport μέσα στο req, για να αποφασίσουν τι θα κάνουν.

Μια τυπική χρήση του passport μαζί με κάποια στρατιγική μοιάζει κάπως έτσι

```
passport.authenticate('local-signup-user', function(err, user, info) {
    if (err) {
        return next(err); // will generate a 500 error
    }
    if (!user) {
        return res.status(409).render('register', {errMsg: info.errMsg});
    }
    req.login(user, function(err){
        if(err){
            console.error(err);
            return next(err);
        }
        return res.redirect('/');
    });
})(req, res, next);
```

## authentication

Περιέχει μεθόδους χρήσιμες για το passport αλλά και για όλα τα routes. Οι βασικές μέθοδοι του authentication είναι οι 

1. isLoggedIn
2. isUserParent
3. isUserOrganizer
4. isUserAdmin

Οι μέθοδοι αυτές χρησιμοποιούνται από τα routes για να αποφασίσουν τι πρέπει να κάνουν. Αν για παράδειγμα ένα route θέλει να επιτρέψει την είσοδο μόνο σε συνδεδεμένους χρήστες, τότε μπορεί να χρησιμοποιήσει την isLoggedIn ως εξής:

```
var auth = require('../apis/authentication');

router.get('/', auth.isLoggedIn, function(req, res) {
    return res.redirect('/ticket');
});
```

Αν ο χρήστης δεν είναι συνδεδομένος, τότε η πρόσβαση στο αντίστοιχο route θα οδηγήσει σε redirect στο login page.

Αντίστοιχα οι μέθοδοι isUserParent, isUserOrganizer, isUserAdmin μπαίνουν στη θέση του isLoggedIn για να επιτρέψουν πρόσβαση μόνο στους γονείς, διοργανοτές, και διαχειριστές αντίστοιχα. Σε περίπτωση που ο χρήστης δεν είναι συνδεδομένος ή δεν είναι του σωστού τύπου, τότε το αντίστοιχο route κάνει render τη σελίδα no_page, που ενημερώνει τον χρήστη πως η σελίδα που αναζητεί δεν υπάρχει.