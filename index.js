require('dotenv').config()
const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./auth');

const app = express();

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Google Authenticate
app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

// callback 
app.get( '/auth/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/google/failure'
  })
);

// send to customer page
app.get('/protected', isLoggedIn, (req, res) => {
  // res.send(`Hello ${req.user.displayName}`);
  res.redirect('http://localhost:8080/index.html#/customer');
});

// logout
app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('Goodbye!');
});

// authentication fail
app.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});

// running on port 5000
app.listen(5000, () => console.log('listening on port: 5000'));
