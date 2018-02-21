// External Packages
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var methodOverride = require('method-override');
var validator = require('express-validator');
var passport = require('./apis/passport');
var flash = require('express-flash');

// Routes
var chart_data = require('./routes/chart_data');
var index = require('./routes/index');
var parent = require('./routes/parent');
var provider = require('./routes/provider');
var file_upload = require('./routes/file_upload');
var ticket_route = require('./routes/ticket');
var login = require('./routes/login');
var events = require('./routes/events');
var search_results = require('./routes/search_results');
var membership = require('./routes/membership');
var admin = require('./routes/admin');
var review = require('./routes/review');
var payment = require('./routes/payment');
var membership = require('./routes/membership');
var event_create = require('./routes/event_create');

var booked_seats = require('./routes/booked_seats');
var register = require('./routes/register');
var logout = require('./routes/logout');
var admin = require('./routes/admin');

var app = express();

// Static Resources
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Override http method for DELETE to work
app.use(methodOverride('_method'));

app.use(session({
    secret: "Shh, its a secret!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session({saveUninitialized: false}));

app.use(validator());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(flash());

// Configure each route to use corresponding file
app.use('/', index);
app.use('/login', login);
app.use('/parent', parent);

app.use('/chart_data', chart_data);
app.use('/booked_seats', booked_seats);

app.use('/ticket', ticket_route);
app.use('/events', events);
app.use('/search', search_results);
app.use('/review', review);

app.use('/provider', provider);
app.use('/register', register);
app.use('/logout', logout);
app.use('/payment', payment);

app.use('/membership', membership);

app.use('/admin', admin);

app.use(function(req, res, next) {
    var form = new formidable.IncomingForm({
        encoding: 'utf-8',
        uploadDir: path.join(__dirname, '/public/files'),
        multiples: true,
        keepExtensions: true
    });
    form.once('error', console.log);
    form.parse(req, function(err, fields, files) {
        Object.assign(req, { fields, files });
        next();
    });
});


app.use('/file_upload', file_upload);
app.use('/event_create', event_create);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
