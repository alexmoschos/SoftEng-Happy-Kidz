## Τοποθεσίες Αρχείων

Το αρχείο που πρέπει να γίνει include σε κάθε ejs είναι το views/partials/navbar.
Γίνεται include με την εξής εντολή:

```javascript
<%- include /partials/navbar.ejs %>
```

Μέσα στο ejs που κάνετε include το partial πρέπει να έχετε περάσει το user object του session.
```javascript
// Route code
res.render('myejs', {user: req.user});
```

Το αρχείο το κάνετε include μετά το head. Στο head βάλτε επίσης το stylesheet του:
```html
<link rel="stylesheet" type="text/css" href="/stylesheets/navbar.css">
```


