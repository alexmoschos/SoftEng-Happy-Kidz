var db = require('../models/db');

var Parent = db.Parent;
var Organizer = db.Organizer;
var Admin = db.Admin;

var Tables = [Parent, Organizer, Admin];
var Types = ['parent', 'organizer', 'admin'];


function whereClause(type, idx, obj) {
    switch (type) {
        case 'email':
            return {where: {email: obj}};
        case 'id': 
            return {where: JSON.parse('{"' + Tables[idx].primaryKeyAttribute + '":' + obj + '}')};
        default: 
            return {};
    }
}

function lookUpTables(idx, type, val, succ, fail) {
    if (idx == Tables.length) return succ(null);
    Tables[idx].findOne(whereClause(type, idx, val)).then(
        function (user) {
            if (user) 
                return succ({user: user, type: Types[idx]});
            lookUpTables(idx+1, type, val, succ, fail);
        }
    ).catch(err => {fail(err);});
}

function findUserByEmail(email, succ, fail) {
    lookUpTables(0, 'email', email, succ, fail);
}

function findUserOfTypeById(id, type, succ, fail) {
    var index = Types.indexOf(type);
    lookUpTables(index, 'id', id, function (user) {
        if (user.type === type) return succ(user);
        return succ(null);
    }, fail);
}


function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    return next();
}

function isUserParent(req, res, next) {
    if (req.isAuthenticated() && req.user.type === 'parent')
        return next();
    return res.render('no_page');
}

function isUserOrganizer(req, res, next) {
    if (req.isAuthenticated() && req.user.type === 'organizer')
        return next();
    return res.render('no_page');
}

function isUserAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.type === 'admin')
        return next();
    return res.render('no_page');
}


var auth = {
    findUserByEmail: findUserByEmail,
    findUserOfTypeById: findUserOfTypeById,
    isLoggedIn: isLoggedIn, 
    isUserParent: isUserParent,
    isUserOrganizer: isUserOrganizer,
    isUserAdmin: isUserAdmin
};

module.exports = auth;