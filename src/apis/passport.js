var passport = require('passport');
var db = require('../models/db');
var auth = require('./authentication');
var LocalStrategy = require('passport-local').Strategy;


function validatePassword(pas1, pas2) {
    return pas1 === pas2;
}

/**
*Configuration and Settings
*/
passport.serializeUser(function(user, done) {
    console.log(user);
    switch (user.type) {
        case 'parent': 
            done(null, {id: user.user.parentId, type: user.type});
            break;
        case 'organizer': 
            done(null, {id: user.user.organizerId, type: user.type});
        default: 
            console.log('error serializeUser');
    }
});
  
passport.deserializeUser(function(obj, done) {
    auth.findUserById(obj.id, function (user) {
        return done(null, {user: user, type: obj.type});
    }, console.log);
});

/**
 *Strategies
*/
//---------------------------Local Strategy-------------------------------------

//---------------------------Signup for parent----------------------------------
passport.use('local-signup-user', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
},
function(req, email, password, done) {
    process.nextTick(function() {
        auth.findUserByEmail(email, function(user) {
            if(user) {
                console.log('user already exists');
                return done(null, false, {errMsg: 'email already exists'});
            }
            else {
                var newUser = {
                    name : req.body.firstName + " " + req.body.lastName,
                    email : email,
                    password : password,
                    wallet: 0,
                    mailNotifications: true
                }
                db.Parent.create(newUser).then(user => {
                    console.log('New user successfully created...',user.name);
                    console.log('email',email);
                    console.log(user);
                    return done(null, {user: user, type:'parent'});
                }).catch(err => {
                    console.log(err);
                });
            }
        }, console.log);
    });
}));

//---------------------------Signup for provider--------------------------------

passport.use('local-signup-provider', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
},
function(req, email, password, done) {
    process.nextTick(function() {
        auth.findUserByEmail(email, function(user) {
            if(user) {
                console.log('user already exists');
                return done(null, false, {errMsg: 'email already exists'});
            }
            else {
                var newUser = {
                    name : req.body.legalBusinessName,
                    email : email,
                    password : password,
                    description: "",
                    phone: req.body.legalBusinessPhone,
                    webpage: "", 
                    avgRating: 0, 
                    avatar: "",
                    isVerified: false,
                    documents: ""
                }
                db.Organizer.create(newUser).then(user => {
                    console.log('New user successfully created...',user.name);
                    console.log('email',email);
                    console.log(user);
                    return done(null, {user: user, type:'organizer'});
                }).catch(err => {
                    console.log(err);
                });
            }
        }, console.log);
    });
}));

//---------------------------local login----------------------------------------
passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        auth.findUserByEmail(email, function (user) {
          if (!user) {
            return done(null, false, {errMsg: 'User does not exist, please' +
            ' <a class="errMsg" href="/mysignup">signup</a>'});
          }
          if (!validatePassword(user.user.password, password)) {
            console.log('invalid password');
            return done(null, false, {errMsg: 'Invalid password try again'});
          }
          return done(null, user);
        }, console.log);
    })
);
/**
*Export Module
*/
module.exports = passport;