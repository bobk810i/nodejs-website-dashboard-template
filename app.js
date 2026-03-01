const express = require('express');
const helmet = require('helmet');
const logger = require('./modules/logger.js');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;

const {authUser} = require('./modules/authentication.js');

// Necessary setup
const app = express();
require('dotenv').config(); // .env file enable
app.set('view engine', 'ejs'); // view engine setup
app.use(express.urlencoded({extended: false})); // Parse POST requests to JSON
app.use(express.json()); // Parse POST requests to JSON
app.use(session({
    secret: process.env.SECRET,
    resave: false ,
    saveUninitialized: true ,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy (authUser));

passport.serializeUser((userObj, done)=>{
    done(null, userObj);
});
passport.deserializeUser((userObj, done)=>{
    done(null, userObj);
});

// Security middleware
app.use(helmet.contentSecurityPolicy({
    directives:{
        "script-src": [
            "'self'", 
            "'unsafe-inline'",
            "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js",
            "https://cdn.jsdelivr.net",
        ],
        "script-src-attr": ["'self'", "'unsafe-inline'"],
        "img-src": [
            "'self'"
        ],
        "style-src": [
            "'self'", 
            "'unsafe-inline'",
            "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
            "https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css",
            "https://cdn.jsdelivr.net"
        ],
        "font-src": [
            "https://cdn.jsdelivr.net/npm/bootstrap-icons/font/fonts/bootstrap-icons.woff?dd67030699838ea613ee6dbda90effa6", 
            "https://cdn.jsdelivr.net/npm/bootstrap-icons/font/fonts/bootstrap-icons.woff2?dd67030699838ea613ee6dbda90effa6",
            "https://cdn.jsdelivr.net"
        ],
        "default-src": ["'self'"],
        "upgrade-insecure-requests": null,
        "connectSrc": ["'self'"],
        "objectSrc": ["'none'"]
    },
        useDefaults: true
}));
app.use(helmet.dnsPrefetchControl());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());


// Routes
const dashboardRouter = require('./routes/dashboard.js');
app.use('/dashboard', dashboardRouter);

const indexRouter = require('./routes/index.js');
app.use('/', indexRouter);

// Public folders
app.use(express.static(__dirname + '/public'));

// Default route
app.use((req, res, next) => { 
    res.status(404).render('404');
}) 

app.listen(process.env.PORT, () => {
    console.log(`Server running on port: ${process.env.PORT}`);
  })