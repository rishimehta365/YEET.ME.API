global.__base = __dirname;

const express = require('express'),
path = require('path'),
bodyParser = require('body-parser'),
session = require('express-session'),
cors = require('cors'),
errorHandler = require('errorhandler'),
mongoose = require('mongoose'),
responseTime= require('response-time'),
passport = require('passport');



mongoose.promise = global.Promise;

const isProduction = process.env.NODE_ENV === 'production',

app = express();
server = require('http').Server(app);
favicon = require('serve-favicon');
app.use(favicon(path.join(__dirname, 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(session({secret: 'secret', cookie: { maxAge: 60000, secure: true }, resave: false, saveUninitialized: false}));
app.use(responseTime());
app.use(passport.initialize());
app.use(passport.session());

if(!isProduction){
    app.use(errorHandler());
}

mongoose.connect("mongodb://durropit:durropit123@ds157136.mlab.com:57136/durropit", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('debug', true);

require('./models/customer');
require('./models/vendor');
require('./models/product');
require('./models/order');
require('./models/society');
require('./config/passport'); 
app.use(require('./routes'));

if(!isProduction){
    app.use((err, req, res, next) => {
        err.statusCode = err.statusCode || 500;
        err.status = err.status || 'error';
    
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    });
}

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
});

server.listen(3000);
