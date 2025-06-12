require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
app.set('view engine', 'hbs')
const port = 5000

const mongoose = require('mongoose');
mongoose.connect('PUT_YOUR_URL_OF_MONGODB_CONNECTION_HERE', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open',() => {
    console.log("Connect to MongoDB");
})

const User = require('./models/User')
const session = require('express-session');
const MongoStore = require('connect-mongo');
app.use(session({
    secret: 'abcd1234',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongoUrl: 'PUT_YOUR_URL_OF_MONGODB_CONNECTION_HERE' }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(cors());

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const authRoutes = require('./routes/authRoutes');
const dashboard = require('./routes/dashboard');
const addMovie = require('./routes/addMovie');
const updateMovieRoute = require('./routes/updateMovie');
const myList = require('./routes/mylist');
const watchedMovies = require('./routes/watchedMovie');
const deleteMovie = require('./routes/deleteMovie');
const getMovies = require('./routes/getMovies');

const addShows = require('./routes/addShows');
const updateShows = require('./routes/updateShows');
const showsMylist = require('./routes/showsMylist');
const watchedShows = require('./routes/watchedShows');
const deleteShows = require('./routes/deleteShow');
const getShows = require('./routes/getShows');
const checkcon = require('./routes/checkcon');

app.use('/', authRoutes)
app.use('/', dashboard)
app.use('/', addMovie)
app.use('/', updateMovieRoute)
app.use('/', myList)
app.use('/', watchedMovies)
app.use('/', deleteMovie)
app.use('/', getMovies)

app.use('/', addShows)
app.use('/', updateShows)
app.use('/', showsMylist)
app.use('/', watchedShows)
app.use('/', deleteShows)
app.use('/', getShows)
app.use('/', checkcon)



app.listen(port, () => {
    console.log(`API is running on port ${port}`)
})