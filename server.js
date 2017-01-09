'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var pug = require('pug');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var flash = require('connect-flash');

var app = express();

app.use(favicon(__dirname + '/public/img/favicon.ico'));

require('dotenv').load({silent: true});
require('./app/config/passport')(passport);

app.set('views', './public');
app.set('view engine', 'pug');

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// app.use(express.cookieParser('keyboard cat'));
app.use(flash());

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json 
app.use(bodyParser.json())

routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
