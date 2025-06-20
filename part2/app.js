const express = require('express');
const path = require('path');
require('dotenv').config();

const session = require('express-session'); // import session added

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// session setup to can track logged in users
app.use(session({
    secret: 'dog-walking-secret',   // keeps session data secure
    resave: false,                  // don't save if nothing changed
    saveUninitialized: true         // save new sessions (like after login)
  }));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;