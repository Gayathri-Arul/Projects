var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , FacebookStrategy = require('passport-facebook').Strategy
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
  , logger = require('morgan')
  , session = require('express-session')
  , bodyParser = require("body-parser")
  , cookieParser = require("cookie-parser")
  , methodOverride = require('method-override');

var FACEBOOK_APP_ID = "802761783162599"
var FACEBOOK_APP_SECRET = "8837bc9897a1830759e1899c1c7bc1fa";

var GOOGLE_CLIENT_ID = "547363468516-b2gnamoo1s4a6o6rhtsrg3i0osj54m4l.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "rQqwuN4AZkktfRekc-ll-Io3";

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {

    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {

    process.nextTick(function () {
      return done(null, profile);
    });
  }
));


var app = express();

  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(logger());
  app.use(cookieParser());
  app.use(bodyParser());
  app.use(methodOverride());
  app.use(session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res){
  res.render('index', { title: 'Angularjs Tasks', user: req.user });
});

app.get('/first', function(req, res){
	  res.render('first', { title: 'List of tasks', user: req.user });
	});


app.get('/filter', function(req, res){
	  res.render('filter', {user: req.user });
	});

app.get('/cookies', function(req, res){
	  res.render('cookies', {user: req.user });
	});
app.get('/namedir', function(req, res){
	  res.render('namedir', {user: req.user });
	});

app.get('/modeldir', function(req, res){
	  res.render('modeldir', {user: req.user });
	});

app.get('/local', function(req, res){
	  res.render('local', {user: req.user });
	});


app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){
  });
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/auth/google',
		  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }),
		  function(req, res){
		  });

		app.get('/auth/google/callback', 
		  passport.authenticate('google', { failureRedirect: '/login' }),
		  function(req, res) {
		    res.redirect('/');
		  });


app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(3000);
console.log("listening");

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

