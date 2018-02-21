var db = require('../models/db');

var Parent = db.Parent;
var Organizer = db.Organizer;
var Admin = db.Admin;

var Tables = [Parent, Organizer, Admin];
var Types = ['parent', 'organizer', 'admin'];


function whereClause(type, idx, obj) {
    switch (type) {
        case 'email':
            return { where: { email: obj } };
        case 'id':
            return { where: JSON.parse('{"' + Tables[idx].primaryKeyAttribute + '":' + obj + '}') };
        default:
            return {};
    }
}

function lookUpTables(idx, type, val, succ, fail) {
    if (idx == Tables.length) return succ(null);
    Tables[idx].findOne(whereClause(type, idx, val)).then(
        function (user) {
            if (user)
                return succ({ user: user, type: Types[idx] });
            lookUpTables(idx + 1, type, val, succ, fail);
        }
    ).catch(err => { fail(err); });
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
    return res.render('no_page',{user: req.user});
}

function isUserMemberParent(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.type === 'parent') {
            Membership.findById(req.user.user.parentId)
                .then((membership) => {
                    if (membership) {
                        return next();
                    } else {
                        // Parent without membership
                        res.redirect('/membership');
                    }
                });
        } else {
            // HTTP Code 403 - Not a parent
            res.send('Access Denied');
        }
    } else {
        // Not an authenticated user
        res.redirect('/login');
    }
}

function isUserParentId(req, res, next) {
    if (req.isAuthenticated()) {
        if ((req.user.type === 'parent') && (req.user.user.parentId === parseInt(req.params.parentId))) {
                return next();
        } else {
            // HTTP Code 403
            console.log(req.user.user.parentId);
            console.log(req.params.parentId);
            console.log(req.user.type);
            res.send('Access Denied');
        }
    } else {
        res.redirect('/login');
    }
}

function isUserParentIdAndBoughtTicket(req, res, next) {
    if (req.isAuthenticated()) {
        db.BoughtTickets.findOne({
            where: {
                parentId: req.params.parentId,
                eventId: req.params.eventId
            }
        })
        .then( tickets => {
            if ((req.user.type === 'parent') && (req.user.user.parentId === parseInt(req.params.parentId)) && tickets) {
                return next();
            } else {
                // HTTP Code 403
                console.log(req.user.user.parentId);
                console.log(req.params.parentId);
                console.log(req.user.type);
                res.send('Access Denied');
            }
        })
        .catch(err => { console.log(err); })
        
    } else {
        res.redirect('/login');
    }
}



function isUserOrganizer(req, res, next) {
    if (req.isAuthenticated() && req.user.type === 'organizer')
        return next();
    return res.render('no_page',{user: req.user});
}

function isUserOrganizerId(req, res, next) {
    if (req.isAuthenticated()) {
        if ((req.user.type === 'organizer') && (req.user.user.organizerId === req.params.id)) {
                return next();
        } else {
            // HTTP Code 403
            res.send('Access Denied');
        }
    } else {
        res.redirect('/login');
    }
}

function isUserAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.type === 'admin')
        return next();
    return res.render('no_page',{user: req.user});
}

// TODO: Implement HTTP 403 
function isUserVerifiedOrganizer(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.type === 'organizer') {
            Organizer.findById(req.user.user.organizerId)
                .then((organizer) => {
                    if (organizer.isVerified) {
                        return next();
                    } else {
                        // Not verified provider page
                        res.send('You are not verified yet');
                    }
                });
        } else {
            // HTTP Code 403
            res.send('Access Denied');
        }
    } else {
        res.redirect('/login');
    }
}

function isNotUserLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        res.send('user already logged in as ' + req.user.user.email);
    }
    else{
        return next();
    }
}



var auth = {
    findUserByEmail: findUserByEmail,
    findUserOfTypeById: findUserOfTypeById,
    isLoggedIn: isLoggedIn,
    isUserParent: isUserParent,
    isUserParentId: isUserParentId,
    isUserOrganizer: isUserOrganizer,
    isUserOrganizerId: isUserOrganizerId,
    isUserAdmin: isUserAdmin,
    isUserMemberParent: isUserMemberParent,
    isUserVerifiedOrganizer: isUserVerifiedOrganizer,
    isNotUserLoggedIn: isNotUserLoggedIn,
    isUserParentIdAndBoughtTicket: isUserParentIdAndBoughtTicket
};

module.exports = auth;