require('dotenv').config();

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
// connect-mongodb-session is a session store for MongoDB
const MongoDBStore = require('connect-mongodb-session')(session);
const { csrfSync } = require('csrf-sync');
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
// create a new MongoDBStore instance
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

const { csrfSynchronisedProtection, generateToken } = csrfSync();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true); //cb - callback function to indicate success or failure
  } else {
    cb(null, false);
  }
};

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));

// multer middleware to handle file uploads
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'),
);

// serves static files from the public folder at the root URL
app.use(express.static(path.join(__dirname, 'public')));
// serves files from the images folder under the /images path
app.use('/images', express.static(path.join(__dirname, 'images')));

// session middleware
app.use(
  session({
    secret: 'my secret',
    //  the session will not be saved to the database if it has not been modified
    resave: false,
    // the session will not be saved to the database if it has not been initialized
    saveUninitialized: false,
    store: store,
  }),
);

app.use(csrfSynchronisedProtection);

app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = generateToken(req);
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      //next() should be used to throw error in async code(catch)
      next(new Error(err)); // trigger the error-handling middleware in app.js
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

//error-handling middleware
app.use((error, req, res, next) => {
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
