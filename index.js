const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const expressLayouts = require('express-ejs-layouts');

const port = 8000;
const app = express();

// Database and Passport config
const db = require('./config/mongoose');
const passportLocal = require('./config/passport-local-Strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static('./assets'));

// EJS Layouts
app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// View engine setup
app.set('view engine', 'ejs');
app.set('views', './views');

// Session middleware
app.use(session({
    name: 'Spotify-clone',
    secret: 'my secret key',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 14, // 14 days
        httpOnly: true // 100 minutes
    },
    store:MongoStore.create({
        mongoUrl:'mongodb://localhost:27017/spotify_clone',
        ttl: 14 * 24 * 60 * 60 // = 14 days in seconds
    })
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// Routes
app.use('/', require('./routes'));

// Server listener
app.listen(port, function(err) {
    if (err) {
        console.log("Error in listening on port:", err);
        return;
    }
    console.log("Express server is running on port", port);
});
