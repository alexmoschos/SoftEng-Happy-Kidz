const conf = require('../config.js');
const bcrypt = require('bcrypt');
const elastic = require('../apis/elastic_interface');
var faker = require('faker');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


//--------------------------Events---------------------------------
    
var eventobj =  [
    {
        organizerId: 1,
        title: 'Just DO IT!!',
        startTime: Math.floor(new Date('2018-02-28T17:30').getTime() / 1000 -7200),
        endTime: 0,
        description: '"Κοιτάξτε αυτό το μέρος! Ξέρετε, εδώ, υπάρχουν όλα τα μυστικά του κόσμου ". Σε ένα συνηθισμένο καφέ ενός σιδηροδρομικού σταθμού, ανάμεσα σε ταξιδιώτες που τρέχουν να προλάβουν τα τρένα τους, η Λώρα και η Στέφη, ενώ ακολουθούν τα βήματα μιας καλά προβαρισμένης ρουτίνας, συναντιούνται απρόσμενα με 7 γυναίκες ή μήπως με τις προβολές του εαυτού τους; Η ζωή, η αλλαγή, η προετοιμασία, το επόμενο βήμα. Tο όνειρο και η πραγματικότητα. Indian Summer. just DO IT !!',
        categoryName: 'Θέατρο/Κινηματογράφος',
        geoLon: 23.7085819,
        geoLat: 37.9810466,
        geoAddress: 'Ιερά Οδός 59, Αθήνα',
        ticketPrice: 15,
        discount: 50,
        ticketCount: 100,
        initialTicketCount: 100,
        minAge: 6,
        maxAge: 8,
        pictures: 2,
        clickNumber: 10,
        isVerified: true
    },
    {
        organizerId: 1,
        title: 'Η ΣΥΜΜΟΡΙΑ ΤΩΝ ΑΠΟΚΡΙΩΝ',
        startTime: Math.floor(new Date('2018-01-28T16:30').getTime() / 1000 -7200),
        endTime: 0,
        description: 'Οι Εταιρίες Θεάτρου "L&S" και "W.T.F-ACT" εν όψει των αποκριών, παρουσιάζουν στην παιδική τους σκηνή, στο Θέατρο Λύχνος Τέχνης και Πολιτισμού, τη θεματική διαδραστική παράσταση με τίτλο «Η ΣΥΜΜΟΡΙΑ ΤΩΝ ΑΠΟΚΡΙΩΝ»!Μικροί και μεγάλοι βάλτε τις αποκριάτικες στολές σας και ελάτε στο θέατρο γιατί. ένας αρλεκίνος, η βασίλισσα των αστεριών και ένας μικρός μάγος, φτιάχνουν τη δική τους συμμορία και σας περιμένουν! Παιχνίδια, τραγούδι και χορός, στήνονται μέσα σε ένα υπέροχο παιχνιδάδικο όπου τα παιδιά θα μάθουν την έννοια της φιλίας, της διαφορετικότητας, τη χαρά της προσφοράς και της δημιουργίας. Όλα αυτά τα καταφέρνουν με τη βοήθεια των παιδιών που γίνονται μέρος της παράστασης, και αναλαμβάνουν μαζί με τους ήρωες του έργου να δημιουργήσουν το μεγαλύτερο πάρτυ, με μοναδική προϋπόθεση να φορέσετε την αποκριάτικη στολή σας! Διαδραστικά παιχνίδια, γαϊτανάκι, σερπαντίνες και άλλα πολλά περιμένουν τους μικρούς μας θεατές, σε ένα μαγικό καρναβάλι, στη νέα μας αποκριάτικη παράσταση κάθε Κυριακή στις 11:00, στο Θέατρο Λύχνος στο Γκάζι. ',
        categoryName: 'Θέατρο/Κινηματογράφος',
        geoLon: 23.7730606,
        geoLat: 38.0430615,
        geoAddress: 'Βενέζη 6, Ηράκλειο, 14121, Αθήνα',
        ticketPrice: 20,
        discount: 30,
        ticketCount: 100,
        initialTicketCount: 100,
        minAge: 13,
        maxAge: 20,
        pictures: 1,
        clickNumber: 75,
        isVerified: true
    },
    {
        organizerId: 1,
        title: 'Το λυχνάρι του Αλαντίν',
        startTime: Math.floor(new Date('2018-03-05T19:30').getTime() / 1000 -7200),
        endTime: 0,
        description: 'Η παράσταση, μας μεταφέρει στην ονειρική Βαγδάτη. Η παραμυθένια ατμόσφαιρα μας ταξιδεύει στο παλάτι του Σουλτάνου, στην αγορά, στο σπίτι του Αλαντίν, στη μαγική σπηλιά...εκεί όπου ο Αλαντίν θα βρει το λυχνάρι και θα πραγματοποιήσει τις τρεις επιθυμίες του. Μέσα από κωμικές και συναισθηματικές καταστάσεις θα παντρευτεί την αγαπημένη του Γιασμίν, παρά τα εμπόδια που τους βάζει ο μάγος Τζαφάρ. Ο αγαθός Σουλτάνος, ο πονηρός Αμπού και το ανατρεπτικό Τζίνι είναι οι ήρωες που θα λατρέψουν τα παιδιά.',
        categoryName: 'Θέατρο/Κινηματογράφος',
        geoLon: 23.7730606,
        geoLat: 38.0430615,
        geoAddress: 'Ερμού 48, Αιγάλεο, 12244, Αθήνα',
        ticketPrice: 10,
        discount: 30,
        ticketCount: 100,
        initialTicketCount: 100,
        minAge: 3,
        maxAge: 5,
        pictures: 2,
        clickNumber: 15,
        isVerified: true
    },
    {
        organizerId: 1,
        title: 'Παιχνιδομαγέματα',
        startTime: Math.floor(new Date('2018-03-01T15:30').getTime() / 1000 -7200),
        endTime: 0,
        description: 'Μια διαδραστική «παράσταση - παιχνίδι», γεμάτη χρώματα, μουσικές και παραμυθένιες σκηνικές δράσεις, που παρουσιάζεται από τις 02 Νοεμβρίου και κάθε Κυριακή, στις 15:00, στο θέατρο Λύχνος Τέχνης & Πολιτισμού και απευθύνεται σε παιδιά απο προσχολική ηλικία μέχρι και έκτη δημοτικού. Τα παιδιά εμπλέκονται στα δρώμενα και ξετυλίγοντας μαζί με τη μικρή Λίνα Μαγισσουλίνα το κουβάρι της ιστορίας, αντιλαμβάνονται τις έννοιες της φιλίας και της αγάπης. Οι μικροί θεατές ανακαλύπτουν τους τρόπους για να προσεγγίσουν, αλλά και να κρατήσουν κοντά τους πραγματικούς φίλους, ενώ ταυτόχρονα αναπτύσσουν μέσω της φαντασίας τις επικοινωνιακές τους ικανότητες. Εμπλουτισμένη με «μαγευτικά σκηνικά» υψηλής αισθητικής, η παράσταση κερδίζει και παρασύρει μικρούς και μεγάλους από την πρώτη στιγμή!',
        categoryName: 'Θέατρο/Κινηματογράφος',
        geoLon: 23.7662746,
        geoLat: 37.987712,
        geoAddress: 'Πολυγύρου 14, 11527, Αθήνα',
        ticketPrice: 10,
        discount: 30,
        ticketCount: 75,
        initialTicketCount: 100,
        minAge: 3,
        maxAge: 5,
        pictures: 2,
        clickNumber: 30,
        isVerified: true
    },
    {
        organizerId: 1,
        title: 'H Κούκλα της Βιτρίνας',
        startTime: Math.floor(new Date('2018-03-25T15:30').getTime() / 1000 -7200),
        endTime: 0,
        description: 'Κατόπιν υψηλής απήχησης, η θεατρική ομάδα "W.T.F-ACT", παρουσιάζει για δεύτερη χρονιά την επιτυχημένη παράσταση "Η κούκλα της βιτρίνας". Άκρως ανανεωμένη, με νέους ρόλους, σε μία dark εκδοχή πλέον, οι W.T.F - ACT σας προκαλούν να ανακαλύψετε την Κούκλα, να αντιμετωπίσετε τον Θάνατο, να ταξιδέψετε στον μαγικό κόσμο του Κομπέρ και όλα αυτά σε μία ακροβασία γέλιου και θλίψης, με στοιχεία μαύρης κωμωδίας και τρόμου. Μία παράσταση γεμάτη συναισθήματα, σασπένς, τραγούδι και πολύ μυστήριο!',
        categoryName: 'Θέατρο/Κινηματογράφος',
        geoLon: 23.7281902,
        geoLat: 37.9500666,
        geoAddress: 'Πολυγύρου 14, 11527, Αθήνα',
        ticketPrice: 15,
        discount: 50,
        ticketCount: 100,
        initialTicketCount: 100,
        minAge: 13,
        maxAge: 20,
        pictures: 2,
        clickNumber: 0,
        isVerified: false
    },
    {
        organizerId: 2,
        title: 'Ολυμπιακός - ΑΕΚ',
        startTime: Math.floor(new Date('2018-03-20T15:30').getTime() / 1000 -7200),
        endTime: 0,
        description: 'Οι συνδρομητές των αθλητικών καναλιών της Nova, την Κυριακή 4 Φεβρουαρίου στις 19:30 θα έχουν την ευκαιρία να παρακολουθήσουν ζωντανά και αποκλειστικά στο Novasports1HD και στο Nova GO και ηχητικά στο Novasports.gr το μεγάλο ντέρμπι Ολυμπιακός – ΑΕΚ.',
        categoryName: 'Αθλητισμός',
        geoLon: 23.6620392,
        geoLat: 37.9482607,
        geoAddress: 'Καραολή και Δημιτρίου και Σοφιανοπούλου, 18547, Αθήνα',
        ticketPrice: 15,
        discount: 50,
        ticketCount: 40,
        initialTicketCount: 100,
        minAge: 13,
        maxAge: 20,
        pictures: 2,
        clickNumber: 150,
        isVerified: true
    },
    {
        organizerId: 2,
        title: 'Ολυμπιακός - ΠΑΟΚ',
        startTime: Math.floor(new Date('2018-03-17T15:30').getTime() / 1000 -7200),
        endTime: 0,
        description: 'Οι συνδρομητές των αθλητικών καναλιών της Nova, την Κυριακή 22 Οκτωβρίου στις 20:30 θα έχουν την ευκαιρία να παρακολουθήσουν ζωντανά και αποκλειστικά στο Novasports1HD, στο NovaGO και στο Novasports.gr, το μεγάλο ντέρμπι ανάμεσα στον Ολυμπιακό και στον ΠΑΟΚ που θα διεξαχθεί στο «Γ. Καραϊσκάκης» για την 8η αγωνιστική του ελληνικού πρωταθλήματος ποδοσφαίρου. ',
        categoryName: 'Αθλητισμός',
        geoLon: 22.9679638,
        geoLat: 40.6134585,
        geoAddress: 'Μικράς ασίας 6, 18547, Θεσσαλονίκη',
        ticketPrice: 15,
        discount: 50,
        ticketCount: 60,
        initialTicketCount: 100,
        minAge: 13,
        maxAge: 20,
        pictures: 1,
        clickNumber: 150,
        isVerified: true
    },
    {
        organizerId: 2,
        title: 'Κυριακή πρωί στο Μέγαρο: «Νίκος Γκάτσος, με τον ήλιο γείτονα»',
        startTime: Math.floor(new Date('2018-03-17T15:30').getTime() / 1000 -7200),
        endTime: 0,
        description: 'Ένα κυριακάτικο πρωινό αφιερωμένο στη γνωριμία των παιδιών με το ποιητικό τραγούδι και τους στίχους του Γκάτσου, αλλά και στη μύησή τους στη στιχουργική, δηλαδή στην καλλιέργεια του λόγου, της φαντασίας και του συναισθήματος εντός των ορίων που επιβάλλουν ο γλωσσικός ρυθμός ή η μουσική φόρμα.',
        categoryName: 'Μουσική',
        geoLon: 23.7521995,
        geoLat: 37.9808536,
        geoAddress: 'Λεοφόρος βασιλήσης Σοφίας, 11521, ΑΘήνα',
        ticketPrice: 15,
        discount: 50,
        ticketCount: 60,
        initialTicketCount: 100,
        minAge: 13,
        maxAge: 20,
        pictures: 2,
        clickNumber: 150,
        isVerified: true
    },
    {
        organizerId: 2,
        title: 'Βαγγέλης Μπουντούνης 100 κιθάρες',
        startTime: Math.floor(new Date('2018-03-17T15:30').getTime() / 1000 -7200),
        endTime: 0,
        description: 'ΚΙΘΑΡΕΣ: Έργα Μάνου Χατζιδάκι και Μίκη Θεοδωράκη',
        categoryName: 'Μουσική',
        geoLon: 23.7616977,
        geoLat: 37.9938309,
        geoAddress: 'Νικ. Γενηματά, Αμπελόκηποι, 11524, ΑΘήνα',
        ticketPrice: 15,
        discount: 50,
        ticketCount: 60,
        initialTicketCount: 100,
        minAge: 13,
        maxAge: 20,
        pictures: 1,
        clickNumber: 150,
        isVerified: true
    },
    {
        organizerId: 1,
        title: 'Ο Θησαυρός του Βιβλιοπόντικα',
        startTime: Math.floor(new Date('2018-03-17T15:30').getTime() / 1000 -7200),
        endTime: 0,
        description: 'Το Θέατρο του Βορρά και η Kolossaion Productions, ενώνουν φέτος το χειμώνα τις δυνάμεις τους και μας καλωσορίζουν στο πιο τρελό κυνήγι Θησαυρού! Το Θέατρο του Βορρά και η Kolossaion Productions, ενώνουν φέτος το χειμώνα τις δυνάμεις τους και μας καλωσορίζουν στο πιο τρελό κυνήγι Θησαυρού!',
        categoryName: 'Θέατρο/Κινηματογράφος',
        geoLon: 22.9464213,
        geoLat: 40.598179,
        geoAddress: 'Μαρτίου 25, 54646, Θεσσαλονίκη',
        ticketPrice: 15,
        discount: 50,
        ticketCount: 60,
        initialTicketCount: 100,
        minAge: 13,
        maxAge: 20,
        pictures: 1,
        clickNumber: 150,
        isVerified: true
    },
    {
        organizerId: 1,
        title: 'ΜΑΖΙ ΤΑ ΦΑΓΑΜΕ',
        startTime: Math.floor(new Date('2018-03-17T15:30').getTime() / 1000 -7200),
        endTime: 0,
        description: 'Ένας έντιμος και ευσυνείδητος δημόσιος υπάλληλος παραπλανέται από τη γυναίκα του ώστε εκείνη να λαμβάνει πλούσιες μίζες από τους προϊσταμένους του εν αγνοία του για να βελτιωθεί η οικονομική τους κατάσταση.',
        categoryName: 'Θέατρο/Κινηματογράφος',
        geoLon: 21.7261374,
        geoLat: 38.2391013,
        geoAddress: 'Akti Dimeon 17, Patra 262 22',
        ticketPrice: 15,
        discount: 50,
        ticketCount: 60,
        initialTicketCount: 100,
        minAge: 13,
        maxAge: 20,
        pictures: 1,
        clickNumber: 150,
        isVerified: true
    },
    {
        organizerId: 1,
        title: 'ΚΑΘΕ ΜΕΡΑ, ΜΙΑ ΑΛΛΗ ΜΕΡΑ',
        startTime: Math.floor(new Date('2018-03-17T15:30').getTime() / 1000 -7200),
        endTime: 0,
        description: 'Βασισμένο στο βραβευμένο από τους New York Times μπεστ-σέλερ του Ντέιβιντ Λέβιθαν, το «Κάθε Μέρα Μία Άλλη Μέρα» αφηγείται την ιστορία της Ριάνον, ενός 16χρονου κοριτσιού που ερωτεύεται μια μυστηριώδη ύπαρξη με το όνομα «Α», η οποία κατοικεί σε διαφορετικό σώμα κάθε μέρα, για εκείνη τη μέρα και μόνο. Αισθανόμενοι μια ακατανίκητη έλξη, ο «Α» και η Ριάνον συνεργάζονται κάθε μέρα για να βρουν ο ένας τον άλλον, χωρίς να γνωρίζουν ποιόν ή τί θα τους φέρει η επόμενη μέρα. Όσο περισσότερο ερωτεύονται, τόσο περισσότερο συνειδητοποιούν τις δυσκολίες του να αγαπάς κάποιον που αλλάζει μορφή κάθε 24 ώρες, κι έτσι η Ριάνον και ο «Α» έρχονται τελικά αντιμέτωποι με την πιο σκληρή απόφαση που έχουν πάρει ποτέ τους. Μια γλυκιά ιστορία αγάπης που ξεπερνά την εξωτερική εμφάνιση και τους περιορισμούς που αυτή φέρνει, μια ιστορία αγάπης για το πώς είναι να αγαπάς κάποιον μόνο και μόνο για το σημαντικότερο κομμάτι του: την ψυχή.',
        categoryName: 'Θέατρο/Κινηματογράφος',
        geoLon: 21.7607735,
        geoLat: 38.2279523,
        geoAddress: 'Leonidou 4, Patra 263 31',
        ticketPrice: 15,
        discount: 50,
        ticketCount: 60,
        initialTicketCount: 100,
        minAge: 13,
        maxAge: 20,
        pictures: 1,
        clickNumber: 150,
        isVerified: true
    },
    {
        organizerId: 1,
        title: 'BLACK PANTHER',
        startTime: Math.floor(new Date('2018-03-17T15:30').getTime() / 1000 -7200),
        endTime: 0,
        description: 'Ο βασιλιάς Τ’Τσάλα ανακηρύσσεται βασιλιάς της Γουακάντα και, ως Black Panther, καλείται να προστατεύσει το βασίλειό του από τον Κιλμόνγκερ, ο οποίος αμφισβητεί την εξουσία του.',
        categoryName: 'Θέατρο/Κινηματογράφος',
        geoLon: 21.7450393,
        geoLat: 38.2389174,
        geoAddress: 'Paleon Patron Germanou 210 Patra 263 31',
        ticketPrice: 15,
        discount: 50,
        ticketCount: 60,
        initialTicketCount: 100,
        minAge: 13,
        maxAge: 20,
        pictures: 1,
        clickNumber: 150,
        isVerified: true
    },

    
    
    
    
];

function initializeDB(db, done) {

//--------------------------Categories---------------------------------
    // for each supported category make sure, we have it in the categories table
    conf.supportedCategories.forEach(function (category, idx) {
        db.Categories.findOne({ where: { categoryName: category } }).then(res => {
            if (!res) {
                // this category has to be added.
                db.Categories.create({ categoryName: category }).catch(err => { console.log(err); });
            }
        }).catch(err => { console.log(err); });
    });

//--------------------------Providers---------------------------------

    var providerobj = [
        {
            name: 'Θέατρο Λύχνος',
            email: 'theman@otenet.gr',
            password: bcrypt.hashSync('123456', 10),
            description: '',
            phone: '2110121686',
            webpage: 'www.theaterlyxnos.gr',
            avgRating: 1,
            avatar: '',
            isVerified: true,
            documents: ''
        },
        {
            name: 'footballclub55',
            email: 'velegkevents@velegkas.com',
            password: bcrypt.hashSync('123456', 10),
            description: '',
            phone: '2106109213',
            webpage: 'www.footballclub55.gr',
            avgRating: 1,
            avatar: '',
            isVerified: true,
            documents: ''
        },
        {
            name: 'Μέγαρο μουσικής',
            email: 'megaron@otenet.gr',
            password: bcrypt.hashSync('123456', 10),
            description: '',
            phone: '2107282000',
            webpage: 'www.megaron.gr',
            avgRating: 1,
            avatar: '',
            isVerified: false,
            documents: ''
        },
    ];

//--------------------------Parents---------------------------------

    var parentobj = [
        {
            name : 'Γιώργης',
            email : 'george@example.com',
            password : bcrypt.hashSync('123456',10),
            wallet: 0,
            mailNotifications : true
        },
        {
            name : 'Κώστας',
            email : 'kostas@example.com',
            password : bcrypt.hashSync('123456',10),
            wallet: 500,
            mailNotifications : true
        },
        {
            name : 'Γιάννης',
            email : 'john@example.com',
            password : bcrypt.hashSync('123456',10),
            wallet: 0,
            mailNotifications : false
        },
    ];



    
    var reviewobj = [];
    reviewobj.push({
        parentId: 1,
        eventId: 2,
        text: 'Καταπληκτική παράσταση! Την συστύνω ανεπιφύλακτα!!!',
        rating: 4,
        date: Date.now()
    });

    var membershipobj = [
        {
            parentId: 1,
            startDate: Math.floor(Date.now() / 1000),
            expiryDate: Math.floor(Date.now() / 1000 + 600),
            membershipTier: 1,
            maxTicketsPerEvent: 100
        }
    ];

    var subscriptionobj = [
        {
            parentId: 1,
            organizerId: 1
        },
        {
            parentId: 1,
            organizerId: 2
        },
        {
            parentId: 3,
            organizerId: 2
        }
    ];

    var ticketobj = [
        {
            eventId: 2,
            parentId: 1,
            transactionId: 10,
            startTime: eventobj[1].startTime,
            endTime: eventobj[1].endTime,
            price: eventobj[1].ticketPrice
        }
    ];
    
    db.Parent.bulkCreate(parentobj)
        .then((succ) => db.Organizer.bulkCreate(providerobj))
        .then((succ) => db.Admin.bulkCreate(
            [{
                username: 'admin',
                password: bcrypt.hashSync('admin', 10),
                email: 'admin@admin.com'
            },
            {
                username: 'dev',
                password: bcrypt.hashSync('password', 10),
                email: 'dev@admin.com'
            }
            ]))
        .then((succ) => db.Event.bulkCreate(eventobj))
        .then((succ) => db.Review.bulkCreate(reviewobj))
        .then((succ) => db.Membership.bulkCreate(membershipobj))
        .then((succ) => db.Subscription.bulkCreate(subscriptionobj))
        .then((succ) => db.BoughtTickets.bulkCreate(ticketobj))
        .then(() => {done();})
        .catch((err) => console.log(err));

}

function intializeElastic(db, done) {
    db.Event.findAll().then(hits => {
        hits.forEach(function (event) {
            if (event.isVerified) {
                var newEvent = {};

                newEvent.organizerId = event.organizerId;

                newEvent.title = event.title;
                newEvent.startTime = event.startTime;
                newEvent.endTime = event.endTime; // this field should probably go
                newEvent.description = event.description;
                newEvent.categoryName = event.categoryName;
                newEvent.geoAddress = event.geoAddress;
                newEvent.ticketPrice = event.ticketPrice;
                newEvent.ticketCount = event.ticketCount;
                newEvent.initialTicketCount = event.initialTicketCount;
                newEvent.minAge = event.minAge;
                newEvent.maxAge = event.maxAge;
                newEvent.discount = event.discount;
                newEvent.pictures = event.pictures;
                newEvent.geoLocation = {
                    lat: parseFloat(event.geoLat),
                    lon: parseFloat(event.geoLon)
                };

                newEvent.eventId = event.eventId.toString();

                db.Organizer.findOne({ where: { organizerId: event.organizerId } }).then((provider) => {
                    newEvent.providerName = provider.name;
                    newEvent.providerPhone = provider.phone;

                    elastic.insert('events', newEvent);
                });
            }
        });
        var myVar = setInterval(function(){ done(); clearInterval(myVar); }, 5000);
    });
}



module.exports = { initializeSqlDB: initializeDB, initializeElasticDB: intializeElastic, events: eventobj };